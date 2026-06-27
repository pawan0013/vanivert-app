"""
Vanivert Document Intelligence
Adapted from Pxtly's ChromaDB vector store (Apache 2.0)

Provides:
  - Index French invoices, contracts, bank statements into ChromaDB
  - Natural language queries: "Quel client me doit de l'argent depuis +60 jours?"
  - Semantic search across 5 years of financial documents

Usage:
    from vanivert_pxtly.document_intelligence import DocumentIntelligence

    di = DocumentIntelligence(client_id="abc123")
    di.add_document("inv-001", "Facture PROLANN SAS — 4200 EUR HT — 15 mars 2026", {"type": "invoice"})
    results = di.query("Quelles factures sont impayées depuis plus de 30 jours?")
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings

logger = logging.getLogger("vanivert.document_intelligence")

CHROMA_BASE = Path(os.environ.get("CHROMA_PATH", "./data/chromadb"))


class DocumentIntelligence:
    """
    Per-client ChromaDB vector store for financial document intelligence.
    Adapted from Pxtly's vector_store.py — simplified for SME invoices.
    Isolation: each client_id gets its own ChromaDB collection.
    """

    COLLECTION_PREFIX = "vanivert_client_"

    def __init__(self, client_id: str) -> None:
        self.client_id = client_id
        self._collection_name = f"{self.COLLECTION_PREFIX}{client_id.replace('-', '_')}"
        self._client: chromadb.ClientAPI | None = None
        self._collection: chromadb.Collection | None = None

    def _get_collection(self) -> chromadb.Collection:
        if self._collection is not None:
            return self._collection

        data_path = CHROMA_BASE / self.client_id
        data_path.mkdir(parents=True, exist_ok=True)

        self._client = chromadb.PersistentClient(
            path=str(data_path),
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=self._collection_name,
            metadata={"hnsw:space": "cosine", "client_id": self.client_id},
        )
        return self._collection

    def add_document(
        self,
        doc_id: str,
        text: str,
        metadata: dict | None = None,
    ) -> None:
        """
        Add or update a financial document in this client's vector store.

        Args:
            doc_id:   Unique identifier (e.g. invoice number, contract ref)
            text:     Plain text content (invoice details, contract terms, etc.)
            metadata: Optional dict — type, date, amount, counterparty, status
        """
        collection = self._get_collection()
        meta = metadata or {}
        meta["client_id"] = self.client_id

        existing = collection.get(ids=[doc_id], include=[])
        if existing["ids"]:
            collection.update(ids=[doc_id], documents=[text], metadatas=[meta])
            logger.debug(f"Updated document {doc_id} for client {self.client_id}")
        else:
            collection.add(ids=[doc_id], documents=[text], metadatas=[meta])
            logger.debug(f"Added document {doc_id} for client {self.client_id}")

    def add_invoice(
        self,
        invoice_id: str,
        client_name: str,
        amount_ht: float,
        amount_ttc: float,
        date_issued: str,
        date_due: str,
        status: str,
        description: str = "",
    ) -> None:
        """Convenience method to index an invoice with structured metadata."""
        text = (
            f"Facture {invoice_id} — Client: {client_name} — "
            f"Montant HT: {amount_ht:.2f} EUR — Montant TTC: {amount_ttc:.2f} EUR — "
            f"Émise le: {date_issued} — Échéance: {date_due} — "
            f"Statut: {status} — Description: {description}"
        )
        self.add_document(
            doc_id=f"invoice_{invoice_id}",
            text=text,
            metadata={
                "type": "invoice",
                "invoice_id": invoice_id,
                "client_name": client_name,
                "amount_ht": amount_ht,
                "amount_ttc": amount_ttc,
                "date_issued": date_issued,
                "date_due": date_due,
                "status": status,
            },
        )

    def query(
        self,
        question: str,
        n_results: int = 5,
        doc_type: str | None = None,
    ) -> list[dict]:
        """
        Natural language semantic search across this client's documents.

        Examples:
            query("Quelles factures sont impayées depuis plus de 30 jours?")
            query("Quel est mon chiffre d'affaires ce trimestre?")
            query("Quels clients ont des retards de paiement?")

        Returns:
            List of {text, metadata, relevance_score} sorted by relevance
        """
        collection = self._get_collection()

        if collection.count() == 0:
            logger.info(f"No documents indexed for client {self.client_id}")
            return []

        where_filter = {"type": doc_type} if doc_type else None

        try:
            results = collection.query(
                query_texts=[question],
                n_results=min(n_results, collection.count()),
                include=["documents", "metadatas", "distances"],
                where=where_filter,
            )
        except Exception as e:
            logger.error(f"ChromaDB query failed for client {self.client_id}: {e}")
            return []

        chunks = []
        for i, doc in enumerate(results["documents"][0]):
            distance = results["distances"][0][i]
            relevance = round(1.0 - distance, 3)
            if relevance < 0.25:  # Filter low-relevance results
                continue
            chunks.append({
                "text": doc,
                "metadata": results["metadatas"][0][i],
                "relevance": relevance,
            })

        return sorted(chunks, key=lambda x: x["relevance"], reverse=True)

    def delete_document(self, doc_id: str) -> None:
        """Delete a document from the vector store (GDPR right to erasure)."""
        collection = self._get_collection()
        collection.delete(ids=[doc_id])
        logger.info(f"Deleted document {doc_id} for client {self.client_id}")

    def delete_all(self) -> None:
        """Delete ALL documents for this client (account closure / GDPR)."""
        if self._client and self._collection:
            self._client.delete_collection(self._collection_name)
            self._collection = None
            logger.info(f"Deleted all documents for client {self.client_id}")

    def stats(self) -> dict:
        """Return collection statistics."""
        collection = self._get_collection()
        return {
            "client_id": self.client_id,
            "collection_name": self._collection_name,
            "document_count": collection.count(),
        }
