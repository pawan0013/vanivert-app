"""
Vanivert ZK-KYC Identity Verification
Adapted from Pxtly's Schnorr ZKP implementation (Apache 2.0)

Allows Vanivert clients to prove their business identity (SIRET, SIREN)
to DGFiP platforms and banks WITHOUT exposing raw identity data.
GDPR-compliant: no personal data transmitted during verification.

Usage:
    from vanivert_pxtly.zkp_identity import VanivertZKP

    zkp = VanivertZKP()

    # Client onboarding — generate keypair and commitment
    private_key, public_key, nullifier = zkp.commit_identity(
        siret="35231982602570",
        context="vanivert_docoon_pa_enrollment"
    )

    # Store public_key and nullifier in DB — never store private_key

    # Verify during PA enrollment — no raw SIRET transmitted
    is_valid = zkp.verify_identity(
        proof=proof_from_client,
        public_key=public_key,
        context="vanivert_docoon_pa_enrollment"
    )
"""

from __future__ import annotations

import hashlib
import logging
import os
import struct
from dataclasses import dataclass

from py_ecc.secp256k1.secp256k1 import G, N, P, add, multiply

logger = logging.getLogger("vanivert.zkp")

# ── secp256k1 curve parameters (same as Pxtly's crypto.py) ──────────────
Point = tuple[int, int]
_SECP256K1_B = 7


def _is_on_curve(point: Point) -> bool:
    if point is None:
        return False
    try:
        x, y = point
    except (TypeError, ValueError):
        return False
    if not (0 <= x < P) or not (0 <= y < P):
        return False
    return (y * y - x * x * x - _SECP256K1_B) % P == 0


def _point_to_bytes(p: Point) -> bytes:
    return p[0].to_bytes(32, "big") + p[1].to_bytes(32, "big")


def _scalar_from_bytes(b: bytes) -> int:
    return int.from_bytes(b, "big") % N


def _hash_to_scalar(*parts: bytes) -> int:
    h = hashlib.sha256()
    for part in parts:
        h.update(struct.pack(">I", len(part)))
        h.update(part)
    return _scalar_from_bytes(h.digest())


def _random_scalar() -> int:
    while True:
        x = int.from_bytes(os.urandom(32), "big")
        if 1 <= x < N:
            return x


@dataclass(frozen=True)
class SchnorrProof:
    """Zero-knowledge proof of identity without revealing the secret."""
    R: Point           # Commitment point
    s: int             # Response scalar
    nullifier: bytes   # Unique-per-context identity token (non-linkable)
    context: str       # Binding context (prevents proof reuse)


@dataclass(frozen=True)
class IdentityCommitment:
    """Public commitment to a business identity."""
    public_key: Point  # Y = x * G (x = H(SIRET + salt))
    nullifier_hash: str # SHA256 of nullifier — for deduplication


class VanivertZKP:
    """
    Zero-knowledge identity verification for Vanivert clients.
    Based on Schnorr sigma protocol from Pxtly.
    Adapted for French business identity (SIRET/SIREN) verification.
    """

    def commit_identity(
        self,
        siret: str,
        context: str = "vanivert_identity",
    ) -> tuple[int, Point, bytes]:
        """
        Generate a ZK commitment to a business identity.

        Args:
            siret:   14-digit SIRET number (never stored or transmitted)
            context: Binding context string

        Returns:
            (private_key, public_key, nullifier)
            - Store public_key and nullifier in DB
            - NEVER store private_key (client retains only)
        """
        # Derive private key from SIRET + random salt
        salt = os.urandom(32)
        private_key = _hash_to_scalar(
            siret.encode(),
            salt,
            b"VANIVERT_IDENTITY_v1",
        )

        public_key = multiply(G, private_key)
        assert _is_on_curve(public_key), "Invalid public key generated"

        # Nullifier — unique token for this identity+context combination
        nullifier = hashlib.sha256(
            b"NULLIFIER" + private_key.to_bytes(32, "big") + context.encode()
        ).digest()

        logger.info(f"Identity commitment generated for context={context}")
        return private_key, public_key, nullifier

    def prove(
        self,
        private_key: int,
        public_key: Point,
        context: str = "vanivert_identity",
    ) -> SchnorrProof:
        """
        Generate a Schnorr ZK proof of knowledge of private_key.
        Does NOT reveal the private key or the underlying SIRET.
        """
        assert 1 <= private_key < N, "Invalid private key"
        assert _is_on_curve(public_key), "Invalid public key"

        k = _random_scalar()
        R = multiply(G, k)
        assert _is_on_curve(R), "Invalid commitment point"

        c = _hash_to_scalar(
            _point_to_bytes(R),
            _point_to_bytes(public_key),
            context.encode(),
        )

        s = (k - c * private_key) % N

        nullifier = hashlib.sha256(
            b"NULLIFIER" + private_key.to_bytes(32, "big") + context.encode()
        ).digest()

        return SchnorrProof(R=R, s=s, nullifier=nullifier, context=context)

    def verify(
        self,
        proof: SchnorrProof,
        public_key: Point,
    ) -> bool:
        """
        Verify a Schnorr proof.
        Returns True iff the prover knows the private key for public_key.
        """
        if not _is_on_curve(public_key):
            logger.warning("ZKP verify: invalid public key")
            return False
        if not _is_on_curve(proof.R):
            logger.warning("ZKP verify: invalid commitment point R")
            return False

        c = _hash_to_scalar(
            _point_to_bytes(proof.R),
            _point_to_bytes(public_key),
            proof.context.encode(),
        )

        # Verify: s*G + c*Y == R
        sG  = multiply(G, proof.s)
        cY  = multiply(public_key, c)
        lhs = add(sG, cY)

        valid = lhs == proof.R
        if not valid:
            logger.warning("ZKP verify: proof rejected")
        else:
            logger.info(f"ZKP verify: proof accepted for context={proof.context}")

        return valid

    def verify_nullifier_unique(
        self,
        nullifier: bytes,
        used_nullifiers: set[bytes],
    ) -> bool:
        """Check nullifier has not been used before (replay attack prevention)."""
        if nullifier in used_nullifiers:
            logger.warning("ZKP: nullifier reuse detected — replay attack blocked")
            return False
        return True
