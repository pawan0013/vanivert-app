'use client'

const BG = '#FAFAF8', BG2 = '#F3F2EE', CARD = '#FFFFFF', INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)', VI = '#6366F1', GR = '#10B981'
const MUTED = 'rgba(13,13,15,0.50)', SUBTLE = 'rgba(13,13,15,0.32)'
const SERIF = 'Georgia, serif'

function VLogo() {
  return <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill={VI}/><path d="M9 16.5L14 21.5L23 10.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default function Equipe() {
  return (
    <div style={{ minHeight: '100dvh', background: BG, fontFamily: 'system-ui,-apple-system,sans-serif', color: INK }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}@media(max-width:640px){.team-grid{grid-template-columns:1fr!important}.trust-grid{grid-template-columns:1fr 1fr!important}}`}</style>

      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}`, background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}><VLogo /><span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 17, color: INK }}>vanivert</span></a>
        <a href="/demo" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 980, background: INK }}>Reserver une demo</a>
      </nav>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '72px 32px 56px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>L&apos;EQUIPE</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(26px, 4vw, 42px)', color: INK, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.025em' }}>
          Deux ingenieurs. Un seul objectif.
        </h1>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          Enlever la paperasse des epaules des independants et commercants, en commencant par la Bretagne.
        </p>
      </section>

      {/* Founder cards */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px 72px' }}>
        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Co-founder - CTO */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '32px 28px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${VI}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>⚙️</div>
            <div style={{ fontSize: 11, color: VI, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>CO-FONDATEUR & CTO</div>
            <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, color: INK, marginBottom: 10 }}>Infrastructure & IA</h2>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, marginBottom: 16 }}>
              Ingenieur forme dans l&apos;equivalent indien des Grandes Ecoles d&apos;Ingenieurs. Anciennement dans des fonds de capital-risque parisiens de premier plan. Concoit l&apos;architecture IA et l&apos;infrastructure de Vanivert.
            </p>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: VI, fontWeight: 600, textDecoration: 'none' }}>LinkedIn →</a>
          </div>

          {/* Pawan */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '32px 28px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${GR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>🧭</div>
            <div style={{ fontSize: 11, color: GR, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>CO-FONDATEUR & CEO</div>
            <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, color: INK, marginBottom: 10 }}>Produit & Terrain</h2>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, marginBottom: 16 }}>
              EDHEC Business School (Grande Ecole). Ancien officier de marine chez BP (British Petroleum), operations critiques dans 15 pays. Base a Lannion. Conduit le produit et le terrain en Bretagne.
            </p>
            <a href="https://linkedin.com/in/pawan-kumar-iiitg" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: GR, fontWeight: 600, textDecoration: 'none' }}>LinkedIn →</a>
          </div>

        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '48px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>POURQUOI NOUS FAIRE CONFIANCE</p>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { icon: '🇪🇺', label: 'Donnees 100% UE', sub: 'Hebergement Irlande & Allemagne' },
              { icon: '📍', label: 'Bases en Bretagne', sub: 'Lannion, Cotes-d\'Armor' },
              { icon: '🎓', label: 'EDHEC & Grandes Ecoles', sub: 'Formation d\'excellence' },
              { icon: '⏱', label: 'Reponse sous 24h', sub: 'Toujours joignables' },
            ].map(t => (
              <div key={t.label} style={{ textAlign: 'center', padding: '16px 12px', background: CARD, borderRadius: 12, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 560, margin: '0 auto', padding: '72px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px, 3vw, 32px)', color: INK, marginBottom: 12 }}>
          Venez nous voir en demo.
        </h2>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 28, lineHeight: 1.7 }}>
          20 minutes sur votre situation reelle. Pas un pitch. Un audit.
        </p>
        <a href="/demo" style={{ padding: '13px 28px', borderRadius: 980, background: INK, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Reserver une demo</a>
        <p style={{ fontSize: 12, color: SUBTLE, marginTop: 12, fontStyle: 'italic' }}>Sans engagement. Reponse sous 24h ouvrees.</p>
      </section>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px 32px', textAlign: 'center', background: BG2 }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: MUTED, marginBottom: 10 }}>
          <a href="/" style={{ color: MUTED, textDecoration: 'none' }}>Accueil</a>
          <a href="/audit" style={{ color: MUTED, textDecoration: 'none' }}>Audit & Conformite</a>
          <a href="/organisations" style={{ color: MUTED, textDecoration: 'none' }}>Solutions metier</a>
          <a href="/blog" style={{ color: MUTED, textDecoration: 'none' }}>Blog</a>
        </div>
        <p style={{ fontSize: 12, color: SUBTLE }}>© 2026 Vanivert. Lannion, Bretagne. Hebergement 100% UE.</p>
      </footer>
    </div>
  )
}
