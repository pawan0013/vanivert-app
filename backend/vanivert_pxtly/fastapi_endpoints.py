"""
Vanivert Pxtly FastAPI endpoints
Document intelligence + AML + ZKP endpoints for the Vanivert backend.
Mount these on the main FastAPI app in app/main.py.

Usage in main.py:
    from vanivert_pxtly.fastapi_endpoints import router as pxtly_router
    app.include_router(pxtly_router, prefix="/api/v1/intelligence")
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, Field

from .document_intelligence import DocumentIntelligence
from .aml_detector import AMLDetector

logger = logging.getLogger("vanivert.pxtly.api")
router = APIRouter(tags=["intelligence"])
aml = AMLDetector()


# ── Auth dependency (replace with real Supabase JWT verification) ─────────
async def get_client_id(x_client_id: str = Header(...)) -> str:
    if not x_client_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing X-Client-Id")
    return x_client_id


# ── Document Intelligence endpoints ──────────────────────────────────────

class AddDocumentRequest(BaseModel):
    doc_id: str = Field(..., description="Unique document identifier")
    text: str   = Field(..., description="Document text content")
    metadata: Optional[dict] = Field(default=None)


class AddInvoiceRequest(BaseModel):
    invoice_id: str
    client_name: str
    amount_ht: float
    amount_ttc: float
    date_issued: str  # ISO 8601
    date_due: str     # ISO 8601
    status: str       # "paid", "pending", "overdue", "cancelled"
    description: str = ""


class QueryRequest(BaseModel):
    question: str = Field(..., description="Natural language question in French or English")
    n_results: int = Field(default=5, ge=1, le=20)
    doc_type: Optional[str] = Field(default=None, description="Filter: invoice, contract, bank_statement")


@router.post("/documents")
async def add_document(
    req: AddDocumentRequest,
    client_id: str = Depends(get_client_id),
):
    """Add or update a document in the client's vector store."""
    di = DocumentIntelligence(client_id=client_id)
    di.add_document(req.doc_id, req.text, req.metadata)
    return {"status": "indexed", "doc_id": req.doc_id}


@router.post("/invoices")
async def add_invoice(
    req: AddInvoiceRequest,
    client_id: str = Depends(get_client_id),
):
    """Index an invoice into the vector store for NL querying."""
    di = DocumentIntelligence(client_id=client_id)
    di.add_invoice(
        invoice_id=req.invoice_id,
        client_name=req.client_name,
        amount_ht=req.amount_ht,
        amount_ttc=req.amount_ttc,
        date_issued=req.date_issued,
        date_due=req.date_due,
        status=req.status,
        description=req.description,
    )
    return {"status": "indexed", "invoice_id": req.invoice_id}


@router.post("/query")
async def query_documents(
    req: QueryRequest,
    client_id: str = Depends(get_client_id),
):
    """
    Natural language query across client's financial documents.
    Example: "Quelles factures sont impayées depuis plus de 60 jours?"
    """
    di = DocumentIntelligence(client_id=client_id)
    results = di.query(req.question, n_results=req.n_results, doc_type=req.doc_type)
    return {
        "question": req.question,
        "results": results,
        "count": len(results),
    }


@router.get("/stats")
async def get_stats(client_id: str = Depends(get_client_id)):
    """Get vector store statistics for this client."""
    di = DocumentIntelligence(client_id=client_id)
    return di.stats()


@router.delete("/documents/{doc_id}")
async def delete_document(
    doc_id: str,
    client_id: str = Depends(get_client_id),
):
    """Delete a document (GDPR right to erasure)."""
    di = DocumentIntelligence(client_id=client_id)
    di.delete_document(doc_id)
    return {"status": "deleted", "doc_id": doc_id}


# ── AML Detection endpoints ───────────────────────────────────────────────

class AMLScoreRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount in EUR")
    counterparty: str = Field(..., description="Name of counterparty")
    transaction_type: str = Field(default="invoice_payment")
    is_cross_border: bool = Field(default=False)
    transaction_id: Optional[str] = Field(default=None)


@router.post("/aml/score")
async def score_transaction(
    req: AMLScoreRequest,
    client_id: str = Depends(get_client_id),
):
    """
    Score a transaction for AML risk.
    Returns score, category, block flag, and recommended action.
    Aligned with French CMF AML obligations (TRACFIN).
    """
    result = aml.score(
        client_id=client_id,
        amount=req.amount,
        counterparty=req.counterparty,
        transaction_type=req.transaction_type,
        is_cross_border=req.is_cross_border,
        transaction_id=req.transaction_id,
    )

    if result.blocked:
        logger.warning(
            f"AML BLOCK: client={client_id} amount={req.amount} "
            f"score={result.score} reason={result.blocked_reason}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "transaction_blocked",
                "reason": result.blocked_reason,
                "score": result.score,
                "category": result.risk_category.value,
                "indicators": result.indicators,
            }
        )

    return {
        "score": result.score,
        "risk_category": result.risk_category.value,
        "blocked": result.blocked,
        "sar_required": result.sar_required,
        "indicators": result.indicators,
        "recommended_action": result.recommended_action,
        "transaction_id": result.transaction_id,
    }
