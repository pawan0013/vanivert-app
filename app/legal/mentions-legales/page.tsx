import { SITE_CONFIG as S } from '@/lib/site.config'

export const metadata = { title: 'Mentions Legales - Vanivert', description: 'Mentions legales obligatoires du site vanivert.fr' }

const INK='#0C0E1A',BLUE='#2563EB',BG='#FFFFFF',BDR='rgba(12,14,26,0.07)'
const MUTED='rgba(12,14,26,0.52)',SUBTLE='rgba(12,14,26,0.32)'

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill={BLUE}/>
      <circle cx="16" cy="11" r="3" fill="white"/>
      <circle cx="10" cy="21" r="2.5" fill="white" opacity="0.7"/>
      <circle cx="22" cy="21" r="2.5" fill="white" opacity="0.7"/>
      <line x1="16" y1="14" x2="10" y2="19" stroke="white" strokeWidth="1.5" opacity="0.6"/>
      <line x1="16" y1="14" x2="22" y2="19" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: INK, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${BDR}` }}>{title}</h2>
      <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

export default function MentionsLegales() {
  return (
    <div style={{ minHeight: '100dvh', background: BG, fontFamily: 'system-ui, sans-serif', color: INK }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${BG}}`}</style>
      <nav style={{ padding: '16px 32px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <Logo/>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, color: INK }}>vanivert</span>
        </a>
        <a href="/" style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}>← Retour au site</a>
      </nav>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 32px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Document legal</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 36, color: INK, letterSpacing: '-0.025em' }}>Mentions legales</h1>
        </div>

        <Section title="Editeur du site">
          <p><strong style={{ color: INK }}>Vanivert</strong></p>
          <p>Forme juridique : Entrepreneur individuel (micro-entreprise)</p>
          <p>Representant legal : Adithya Latchoumanassamy</p>
          <p>Adresse : 1 Clos des Sylthes, 95800 Cergy, France</p>
          <p>SIRET : 93429900900019</p>
          <p>Code APE : 8559B</p>
          <p>Email : <a href="mailto:team@vanivert.eu" style={{ color: BLUE }}>team@vanivert.eu</a></p>
        </Section>

        <Section title="Hebergement">
          <p>Ce site est heberge par Vercel Inc., 340 Pine Street Suite 900, San Francisco CA 94104, USA.</p>
          <p style={{ marginTop: 8 }}>Les donnees sont stockees sur des serveurs en Union Europeenne (Supabase, Dublin, Irlande).</p>
        </Section>

        <Section title="Propriete intellectuelle">
          <p>L&apos;ensemble du contenu de ce site (textes, images, elements graphiques) est la propriete exclusive de Vanivert. Toute reproduction, meme partielle, est soumise a autorisation prealable.</p>
        </Section>

        <Section title="Donnees personnelles et RGPD">
          <p>Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes, vous disposez de droits d&apos;acces, de rectification et de suppression de vos donnees. Pour exercer ces droits, contactez : <a href="mailto:team@vanivert.eu" style={{ color: BLUE }}>team@vanivert.eu</a></p>
          <p style={{ marginTop: 8 }}>Voir notre <a href="/legal/confidentialite" style={{ color: BLUE }}>politique de confidentialite complete</a>.</p>
        </Section>

        <Section title="Cookies">
          <p>Ce site utilise uniquement des cookies fonctionnels necessaires au bon fonctionnement du service. Aucune donnee n&apos;est transmise a des tiers a des fins publicitaires.</p>
        </Section>

        <Section title="Loi applicable">
          <p>Les presentes mentions legales sont soumises au droit francais. En cas de litige, les tribunaux francais seront seuls competents.</p>
        </Section>

        <div style={{ marginTop: 48, padding: '20px 24px', borderRadius: 14, background: '#F8F9FF', border: `1px solid ${BLUE}15` }}>
          <p style={{ fontSize: 12, color: SUBTLE }}>Derniere mise a jour : juillet 2026</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${BDR}`, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 10 }}>
        <span style={{ fontSize: 12, color: SUBTLE }}>2026 Vanivert - SIRET 93429900900019</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Confidentialite','/legal/confidentialite'],['CGV','/legal/cgv'],['Accueil','/']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize: 12, color: SUBTLE, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
