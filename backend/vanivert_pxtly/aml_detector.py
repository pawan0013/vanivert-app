"""
Vanivert AML Detector
Adapted from Pxtly's AML scoring engine (Apache 2.0 licence)

Simplified for French SME transaction sizes and regulatory context.
Thresholds aligned with French AML law (Code Monétaire et Financier).

Usage:
    from vanivert_pxtly.aml_detector import AMLDetector, AMLResult

    detector = AMLDetector()
    result = detector.score(
        client_id="abc123",
        amount=50000.0,
        counterparty="PROLANN SAS",
        transaction_type="invoice_payment",
        is_cross_border=False,
    )
    if result.blocked:
        raise ValueError(result.blocked_reason)
    if result.sar_required:
        alert_compliance_team(result)
"""

from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Optional

logger = logging.getLogger("vanivert.aml")

# ── French AML thresholds (CMF Art. L561-15) ─────────────────────────────
# Standard cash threshold: 1 000 EUR
# Occasional transaction threshold: 15 000 EUR
# High-value professional: 10 000 EUR (Article R561-16)
THRESHOLD_WATCH  = 10_000.0   # Trigger enhanced monitoring
THRESHOLD_HIGH   = 50_000.0   # High-risk flag
THRESHOLD_SAR    = 100_000.0  # Suspicious Activity Report required
MAX_AML_SCORE    = 0.75       # Block transaction above this score


class RiskCategory(str, Enum):
    FAIBLE   = "FAIBLE"    # < 0.30
    MOYEN    = "MOYEN"     # 0.30 – 0.59
    ELEVE    = "ELEVE"     # 0.60 – 0.74
    CRITIQUE = "CRITIQUE"  # ≥ 0.75


@dataclass(slots=True)
class AMLResult:
    score: float
    risk_category: RiskCategory
    blocked: bool
    blocked_reason: Optional[str]
    indicators: list[str]
    sar_required: bool
    recommended_action: str
    transaction_id: Optional[str] = None


@dataclass
class TransactionHistory:
    """Lightweight in-memory transaction tracker per client."""
    client_id: str
    transactions: list[dict] = field(default_factory=list)

    def add(self, amount: float, counterparty: str, ts: datetime) -> None:
        self.transactions.append({
            "amount": amount,
            "counterparty": counterparty,
            "ts": ts,
        })
        # Keep only last 90 days
        cutoff = datetime.now(timezone.utc) - timedelta(days=90)
        self.transactions = [t for t in self.transactions if t["ts"] > cutoff]

    def recent_volume(self, days: int = 30) -> float:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return sum(t["amount"] for t in self.transactions if t["ts"] > cutoff)

    def transaction_count(self, days: int = 30) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return sum(1 for t in self.transactions if t["ts"] > cutoff)

    def unique_counterparties(self, days: int = 30) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return len({t["counterparty"] for t in self.transactions if t["ts"] > cutoff})


# In-memory transaction history (replace with Supabase in production)
_histories: dict[str, TransactionHistory] = {}


def _get_history(client_id: str) -> TransactionHistory:
    if client_id not in _histories:
        _histories[client_id] = TransactionHistory(client_id=client_id)
    return _histories[client_id]


class AMLDetector:
    """
    AML scoring engine for Vanivert SME transactions.
    Adapted from Pxtly's AMLScorer — simplified, no Fabric dependency.
    Aligns with French CMF AML obligations (Directive 2015/849 transposed).
    """

    def score(
        self,
        client_id: str,
        amount: float,
        counterparty: str,
        transaction_type: str = "invoice_payment",
        is_cross_border: bool = False,
        transaction_id: Optional[str] = None,
    ) -> AMLResult:
        """
        Score a transaction for AML risk.

        Args:
            client_id:        Vanivert client identifier
            amount:           Transaction amount in EUR
            counterparty:     Name of the paying/receiving party
            transaction_type: "invoice_payment", "bank_transfer", "cash", etc.
            is_cross_border:  True if counterparty is outside France
            transaction_id:   Optional reference for audit trail

        Returns:
            AMLResult with score, category, block flag, and recommended action
        """
        history = _get_history(client_id)
        indicators: list[str] = []
        raw_score = 0.0

        # ── Amount-based risk ──────────────────────────────────────────────
        if amount >= THRESHOLD_SAR:
            raw_score += 0.45
            indicators.append(f"Montant ≥ {THRESHOLD_SAR:,.0f} EUR (seuil déclaration TRACFIN)")
        elif amount >= THRESHOLD_HIGH:
            raw_score += 0.30
            indicators.append(f"Montant ≥ {THRESHOLD_HIGH:,.0f} EUR (surveillance renforcée)")
        elif amount >= THRESHOLD_WATCH:
            raw_score += 0.15
            indicators.append(f"Montant ≥ {THRESHOLD_WATCH:,.0f} EUR")

        # ── Round-number detection (common fraud signal) ───────────────────
        if amount % 1000 == 0 and amount >= 5000:
            raw_score += 0.08
            indicators.append("Montant rond (signal de fractionnement potentiel)")

        # ── Cross-border risk ──────────────────────────────────────────────
        if is_cross_border:
            raw_score += 0.15
            indicators.append("Transaction transfrontalière (risque juridictionnel)")

        # ── Velocity checks ────────────────────────────────────────────────
        monthly_volume = history.recent_volume(days=30)
        monthly_count  = history.transaction_count(days=30)

        if monthly_volume > 500_000:
            raw_score += 0.20
            indicators.append(f"Volume mensuel élevé : {monthly_volume:,.0f} EUR")
        elif monthly_volume > 200_000:
            raw_score += 0.10
            indicators.append(f"Volume mensuel modéré : {monthly_volume:,.0f} EUR")

        # ── Smurfing detection (many small transactions) ───────────────────
        avg_tx = monthly_volume / monthly_count if monthly_count > 0 else 0
        if monthly_count > 10 and avg_tx < 9_000:
            raw_score += 0.12
            indicators.append(
                f"Structuration possible : {monthly_count} transactions, "
                f"moyenne {avg_tx:,.0f} EUR"
            )

        # ── Counterparty diversity ─────────────────────────────────────────
        unique_cp = history.unique_counterparties(days=30)
        if unique_cp > 20:
            raw_score += 0.08
            indicators.append(f"Nombre élevé de contreparties : {unique_cp}")

        # ── Cash transaction penalty ───────────────────────────────────────
        if transaction_type == "cash" and amount > 1000:
            raw_score += 0.25
            indicators.append("Transaction en espèces > 1 000 EUR (CMF R561-16)")

        # ── Clamp and classify ─────────────────────────────────────────────
        if not math.isfinite(raw_score):
            raw_score = 1.0
        final_score = round(max(0.0, min(1.0, raw_score)), 4)

        if final_score < 0.30:
            category = RiskCategory.FAIBLE
        elif final_score < 0.60:
            category = RiskCategory.MOYEN
        elif final_score < MAX_AML_SCORE:
            category = RiskCategory.ELEVE
        else:
            category = RiskCategory.CRITIQUE

        blocked      = final_score >= MAX_AML_SCORE
        sar_required = final_score > 0.65 or amount >= THRESHOLD_SAR

        blocked_reason = (
            f"Score AML ({final_score:.4f}) dépasse le seuil de blocage ({MAX_AML_SCORE}). "
            f"Indicateurs : {'; '.join(indicators[:2])}"
            if blocked else None
        )

        if sar_required:
            action = (
                "Déclaration de soupçon TRACFIN requise dans les 30 jours. "
                "Contacter le responsable conformité."
            )
        elif category == RiskCategory.ELEVE:
            action = "Surveillance renforcée — conserver les justificatifs de cette transaction."
        elif category == RiskCategory.MOYEN:
            action = "Vérification de routine — valider l'identité du donneur d'ordre."
        else:
            action = "Transaction conforme — aucune action requise."

        # Update history (only if not blocked)
        if not blocked:
            history.add(amount, counterparty, datetime.now(timezone.utc))

        result = AMLResult(
            score=final_score,
            risk_category=category,
            blocked=blocked,
            blocked_reason=blocked_reason,
            indicators=indicators,
            sar_required=sar_required,
            recommended_action=action,
            transaction_id=transaction_id,
        )

        level = "CRITIQUE" if blocked else ("ELEVE" if sar_required else "OK")
        logger.info(
            f"AML [{level}] client={client_id} amount={amount:.2f} "
            f"score={final_score} category={category.value}"
        )

        return result
