'use client'
import { useState } from 'react'
import { score, Software } from '@/lib/scoring'
import { supabase } from '@/lib/supabase'

const STEPS = ['Votre entreprise', 'Votre situation', 'Votre résultat']
const GRADE_COLOR: Record<string, string> = { A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', F: '#ef4444' }
const GRADE_LABEL: Record<string, string> = { A: 'Conforme', B: 'Acceptable', C: 'Action requise', D: 'Risque élevé', F: 'URGENT' }

export default function Calculateur() {
  const [step, setStep] = useState(1)
  const [siret, setSiret] = useState('')
  const [company, setCompany] = useState<{ name: string; city: string; naf_code: string } | null>(null)
  const [checking, setChecking] = useState(false)
  const [invoices, setInvoices] = useState(20)
  const [software, setSoftware] = useState<Software>('excel')
  const [hasPDP, setHasPDP] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [result, setResult] = useState<{ exposure: number; grade: string } | null>(null)

  async function checkSiret() {
    if (siret.length !== 14) return
    setChecking(true)
    const r = await fetch(`/api/sirene?siret=${siret}`)
    const d = await r.json()
    if (d.valid) { setCompany(d); setStep(2) }
    else { setCompany(null); alert('SIRET invalide ou introuvable.') }
    setChecking(false)
  }

  async function calculate() {
    const r = score(invoices, software, hasPDP)
    setResult(r)
    setStep(3)
    await supabase.from('calculator_leads').insert({
      siret, company_name: company?.name, city: company?.city,
      naf_code: company?.naf_code, monthly_invoices: invoices,
      current_software: software, has_pdp: hasPDP,
      grade: r.grade, exposure_euros: r.exposure
    })
  }

  async function submitEmail() {
    await supabase.from('calculator_leads').update({ email }).eq('siret', siret)
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FB', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 800, color: '#0A090A', textDecoration: 'none', letterSpacing: '-0.04em' }}>vanivert</a>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? '#1F49B0' : step === i + 1 ? '#1F49B0' : '#E5E5EA', color: step >= i + 1 ? '#fff' : '#86868B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                {i < 2 && <div style={{ width: 32, height: 1, background: step > i + 1 ? '#1F49B0' : '#E5E5EA' }} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#86868B', marginTop: 8, fontFamily: 'monospace', letterSpacing: '0.06em' }}>ÉTAPE {step} — {STEPS[step - 1].toUpperCase()}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #F0F0F5' }}>
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A090A', marginBottom: 8, letterSpacing: '-0.03em' }}>Calculez votre risque</h1>
              <p style={{ fontSize: 14, color: '#86868B', marginBottom: 28, lineHeight: 1.6 }}>La réforme DGFiP impose la facturation électronique à partir du 1er septembre 2026. Découvrez votre exposition en 2 minutes.</p>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6E6E73', display: 'block', marginBottom: 6 }}>Numéro SIRET (14 chiffres)</label>
              <input
                value={siret} onChange={e => setSiret(e.target.value.replace(/\D/g, '').slice(0, 14))}
                placeholder="Ex: 83014132100034"
                onKeyDown={e => e.key === 'Enter' && checkSiret()}
                style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${siret.length === 14 ? '#1F49B0' : '#E5E5EA'}`, borderRadius: 12, fontSize: 15, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
              />
              {company && <div style={{ marginTop: 10, padding: '10px 14px', background: '#F0F5FF', borderRadius: 10, fontSize: 13, color: '#1F49B0', fontWeight: 600 }}>✓ {company.name} — {company.city}</div>}
              <button onClick={checkSiret} disabled={siret.length !== 14 || checking} style={{ marginTop: 20, width: '100%', background: siret.length === 14 ? '#1F49B0' : '#E5E5EA', color: siret.length === 14 ? '#fff' : '#86868B', border: 'none', borderRadius: 980, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: siret.length === 14 ? 'pointer' : 'default' }}>
                {checking ? 'Vérification...' : 'Continuer →'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0A090A', marginBottom: 24, letterSpacing: '-0.02em' }}>Votre situation actuelle</h2>
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6E6E73', display: 'block', marginBottom: 8 }}>Factures émises par mois: <strong style={{ color: '#1F49B0' }}>{invoices}</strong></label>
                <input type="range" min={1} max={200} value={invoices} onChange={e => setInvoices(+e.target.value)} style={{ width: '100%', accentColor: '#1F49B0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#86868B', marginTop: 4 }}><span>1</span><span>200+</span></div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6E6E73', display: 'block', marginBottom: 8 }}>Logiciel de facturation actuel</label>
                <select value={software} onChange={e => setSoftware(e.target.value as Software)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E5E5EA', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none' }}>
                  <option value="excel">Excel ou papier</option>
                  <option value="sage">Sage</option>
                  <option value="cegid">Cegid</option>
                  <option value="pennylane">Pennylane</option>
                  <option value="tiime">Tiime</option>
                  <option value="autre">Autre logiciel</option>
                </select>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6E6E73', display: 'block', marginBottom: 10 }}>Avez-vous déjà une plateforme agréée (PA/PDP)?</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Non', 'Oui'].map((v, i) => (
                    <button key={v} onClick={() => setHasPDP(i === 1)} style={{ flex: 1, padding: '11px 0', border: `1.5px solid ${hasPDP === (i === 1) ? '#1F49B0' : '#E5E5EA'}`, borderRadius: 12, background: hasPDP === (i === 1) ? '#F0F5FF' : '#fff', color: hasPDP === (i === 1) ? '#1F49B0' : '#6E6E73', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{v}</button>
                  ))}
                </div>
              </div>
              <button onClick={calculate} style={{ width: '100%', background: '#1F49B0', color: '#fff', border: 'none', borderRadius: 980, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Calculer mon risque →</button>
            </div>
          )}

          {step === 3 && result && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: GRADE_COLOR[result.grade], margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 800, color: '#fff', boxShadow: `0 8px 32px ${GRADE_COLOR[result.grade]}55` }}>{result.grade}</div>
              <div style={{ display: 'inline-block', background: `${GRADE_COLOR[result.grade]}18`, color: GRADE_COLOR[result.grade], padding: '4px 14px', borderRadius: 980, fontSize: 12, fontWeight: 700, marginBottom: 20 }}>{GRADE_LABEL[result.grade]}</div>
              <p style={{ fontSize: 14, color: '#6E6E73', marginBottom: 8 }}>Votre exposition maximale annuelle</p>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#0A090A', letterSpacing: '-0.04em', marginBottom: 28 }}>{result.exposure.toLocaleString('fr-FR')} €</div>
              <div style={{ background: '#F7F9FB', borderRadius: 14, padding: 20, textAlign: 'left', marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#6E6E73', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommandations</p>
                {result.grade === 'A' && <><p style={{ fontSize: 13, color: '#22c55e', marginBottom: 8 }}>✓ Votre configuration est déjà conforme.</p><p style={{ fontSize: 13, color: '#6E6E73' }}>Continuez à surveiller les mises à jour DGFiP avec notre Radar Réglementaire.</p></>}
                {result.grade !== 'A' && <>
                  <p style={{ fontSize: 13, color: '#0A090A', marginBottom: 8 }}>→ Connectez votre logiciel à une plateforme agréée certifiée DGFiP avant le 1er septembre.</p>
                  <p style={{ fontSize: 13, color: '#0A090A', marginBottom: 8 }}>→ Validez vos formats de factures contre le standard CIUS-FR.</p>
                  <p style={{ fontSize: 13, color: '#0A090A' }}>→ Mettez en place un pipeline de transmission automatique pour éviter toute pénalité.</p>
                </>}
              </div>
              {!sent ? (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#6E6E73', marginBottom: 10 }}>Recevez votre rapport complet par email</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr" type="email" style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #E5E5EA', borderRadius: 12, fontSize: 14, outline: 'none' }} />
                    <button onClick={submitEmail} disabled={!email.includes('@')} style={{ background: '#1F49B0', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>→</button>
                  </div>
                </div>
              ) : <p style={{ fontSize: 13, color: '#22c55e', marginBottom: 16 }}>✓ Rapport envoyé — nous vous répondons sous 24h.</p>}
              <a href="mailto:contact@vanivert.fr?subject=Audit conformité - SIRET %2" style={{ display: 'block', width: '100%', background: '#0A090A', color: '#fff', borderRadius: 980, padding: '14px 0', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxSizing: 'border-box' }}>Parler à un expert — 15 min gratuit</a>
              <p style={{ fontSize: 12, color: '#AEAEB2', marginTop: 16 }}>Sans engagement. Sans pression commerciale.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
