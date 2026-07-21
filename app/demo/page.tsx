'use client'
import { useState } from 'react'

const BG = '#FAFAF8', CARD = '#FFFFFF', INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)', BORDER2 = 'rgba(13,13,15,0.14)'
const VI = '#6366F1', GR = '#10B981', EM = '#F59E0B', MUTED = 'rgba(13,13,15,0.50)', SUBTLE = 'rgba(13,13,15,0.32)'

export default function Demo() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', sector: '', motif: '' })
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, fontFamily: 'system-ui,-apple-system,sans-serif', color: INK }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}@media(max-width:768px){.demo-grid{grid-template-columns:1fr!important}}`}</style>

      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}`, background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill={VI}/><path d="M9 16.5L14 21.5L23 10.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, color: INK }}>vanivert</span>
        </a>
        <a href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}>Deja client? Connexion →</a>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 32px' }}>
        <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

          {/* Left: context */}
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 980, background: `${GR}10`, border: `1px solid ${GR}30`, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: GR, animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 11, color: GR, fontWeight: 600 }}>Disponible maintenant</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(26px, 3vw, 38px)', color: INK, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.025em' }}>
              20 minutes pour voir ce que ca change pour votre entreprise.
            </h1>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 28 }}>
              On regarde VOTRE situation reelle - vos factures, vos obligations DGFiP, votre secteur. Vous repartez avec un plan d&apos;action concret, que vous travailliez avec nous ou non.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                ['Audit de conformite DGFiP', 'Disponible maintenant', GR],
                ['IA Vocale en francais', 'Disponible maintenant', GR],
                ['Tresorerie & ERP complet', 'Prochainement - inscrivez-vous', VI],
              ].map(([label, status, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: CARD, border: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 11, color, fontWeight: 600 }}>{status}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 18px', borderRadius: 12, background: `rgba(239,68,68,0.06)`, border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, marginBottom: 4 }}>⚠ 1er septembre 2026 - J-54</p>
              <p style={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.5 }}>Jusqu&apos;a 15 000 EUR d&apos;amende par an pour non-conformite. Les creneaux d&apos;aout partent en premier.</p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {sent ? (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${GR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={GR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: INK, marginBottom: 10 }}>C&apos;est note.</h2>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, marginBottom: 20 }}>Vous recevrez une proposition de creneau sous 24h ouvrees. Si vous avez un creneau urgent, envoyez-nous un message WhatsApp directement.</p>
                <a href="/" style={{ fontSize: 13, color: VI, fontWeight: 600, textDecoration: 'none' }}>← Retour a l&apos;accueil</a>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: INK, marginBottom: 4 }}>Reserver ma demo</h2>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Sans engagement. Reponse sous 24h ouvrees.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Prenom *</label>
                    <input required placeholder="Marie" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Telephone *</label>
                    <input required placeholder="+33 6 XX XX XX XX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Email professionnel *</label>
                  <input required type="email" placeholder="marie@monentreprise.fr" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Entreprise *</label>
                  <input required placeholder="Boulangerie Martin" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Secteur</label>
                  <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }}>
                    <option value="">Selectionnez votre secteur</option>
                    <option value="commerce">Commerce / Supermarche</option>
                    <option value="artisan">Artisan / Services</option>
                    <option value="immobilier">Immobilier</option>
                    <option value="sante">Sante / Bien-etre</option>
                    <option value="restaurant">Restaurant / Cafe</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: INK, display: 'block', marginBottom: 5 }}>Ce qui vous amene (optionnel)</label>
                  <select value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, color: INK, background: BG, outline: 'none', fontFamily: 'inherit' }}>
                    <option value="">Selectionnez</option>
                    <option value="audit">Audit de conformite DGFiP</option>
                    <option value="voix">IA Vocale</option>
                    <option value="plateforme">Plateforme complete (liste d&apos;attente)</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <button type="submit" style={{ padding: '13px 28px', borderRadius: 980, background: INK, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 4 }}>
                  Reserver ma demo →
                </button>
                <p style={{ fontSize: 11, color: SUBTLE, textAlign: 'center', fontStyle: 'italic' }}>Sans engagement. Le risque, c&apos;est de ne pas savoir.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
