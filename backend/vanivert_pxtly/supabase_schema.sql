-- Supabase schema for Pxtly-derived features
-- Run in Supabase SQL Editor

-- Regulatory alerts from grcx
CREATE TABLE IF NOT EXISTS regulatory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  summary TEXT NOT NULL,
  source_url TEXT,
  event_type TEXT NOT NULL,
  detail JSONB DEFAULT '{}',
  entry_hash TEXT UNIQUE, -- from grcx audit log
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON regulatory_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_jurisdiction ON regulatory_alerts(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON regulatory_alerts(created_at DESC);

-- AML events log
CREATE TABLE IF NOT EXISTS aml_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  transaction_id TEXT,
  amount DECIMAL(15,2) NOT NULL,
  counterparty TEXT NOT NULL,
  score DECIMAL(6,4) NOT NULL,
  risk_category TEXT NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT FALSE,
  sar_required BOOLEAN NOT NULL DEFAULT FALSE,
  indicators JSONB DEFAULT '[]',
  recommended_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: clients can only see their own AML events
ALTER TABLE aml_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_own_aml" ON aml_events
  FOR ALL USING (client_id = auth.uid()::UUID);

-- ZKP identity commitments
CREATE TABLE IF NOT EXISTS zkp_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  public_key_x TEXT NOT NULL,   -- secp256k1 public key X coordinate (hex)
  public_key_y TEXT NOT NULL,   -- secp256k1 public key Y coordinate (hex)
  nullifier_hash TEXT NOT NULL UNIQUE, -- SHA256 of nullifier (for deduplication)
  context TEXT NOT NULL DEFAULT 'vanivert_identity',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE zkp_commitments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_own_zkp" ON zkp_commitments
  FOR ALL USING (client_id = auth.uid()::UUID);
