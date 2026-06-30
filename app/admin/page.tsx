'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BG = '#FAFAF8'
const BG2 = '#F3F2EE'
const CARD = '#FFFFFF'
const CARD2 = '#F3F2EE'
const BORDER = 'rgba(13,13,15,0.08)'
const BORDER2 = 'rgba(13,13,15,0.14)'
const VI = '#6366F1'
const VI2 = '#4F46E5'
const VIG = 'rgba(99,102,241,0.12)'
const GR = '#10B981'
const RED = '#EF4444'
const EM = '#F59E0B'
const TEXT = 'rgba(13,13,15,0.88)'
const MUTED = 'rgba(13,13,15,0.50)'
const SUBTLE = 'rgba(13,13,15,0.32)'
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const CMS_KEY = 'vanivert_cms_v3'

/* ── Full CMS default (mirrors page.tsx DEFAULT_CMS) ── */
const DEFAULT_CMS = {
  // Hero
  hero_eyebrow: 'Disponible maintenant',
  hero_h1: 'Vos factures. Votre tresorerie.',
  hero_h1_r0: 'Sans la paperasse.',
  hero_h1_r1: 'Sans les relances manuelles.',
  hero_h1_r2: 'Avant le 1er septembre.',
  hero_h1_r3: 'Avec une vraie conformite DGFiP.',
  hero_sub: "Vanivert s'occupe de tout : e-facturation DGFiP, tableau de bord financier en temps reel, et prise d'appels automatique. Vous, vous gerez votre metier.",
  hero_cta1: 'Commencer gratuitement',
  hero_cta2: 'Voir une demonstration',
  trust_tagline: 'Des PME bretonnes nous font confiance',
  // Section 1 - E-facturation
  s1_label: 'E-facturation DGFiP 2026',
  s1_h2: 'Le 1er septembre, les PDF ne passent plus.',
  s1_body: "Vos fournisseurs s'y attendent, la DGFiP l'exige. On gere l'enrolement dans l'annuaire centralise, la generation Factur-X et la validation CIUS-FR. Vous, vous n'avez rien a faire.",
  s1_badge: 'Inclus dans tous les plans',
  // Section 2 - CFO
  s2_label: 'Smart CFO',
  s2_h2: 'Votre tresorerie, sans Excel.',
  s2_body: "Bridge API connecte vos comptes bancaires. FinGPT predit vos entrees et sorties. grcx surveille la reglementation pour vous. Le tout sur des serveurs europeens, hors de portee des GAFAM.",
  s2_badge: 'A partir de 1 200 EUR/mois',
  // Section 3 - Voix
  s3_label: 'Reception vocale 24h/24',
  s3_h2: "Vous etes sous l'evier. Il appelle. On repond.",
  s3_body: "Artisan, praticien, hotel : chaque appel manque est un client perdu. Notre IA repond en francais naturel, prend les rendez-vous dans Doctolib, et vous envoie un compte rendu par email.",
  s3_badge: 'A partir de 19 EUR/mois',
  // Modules
  m0_title: 'E-facturation', m0_sub: 'Factur-X automatique.',
  m1_title: 'Smart CFO', m1_sub: 'Tresorerie en temps reel.',
  m2_title: 'Reception vocale', m2_sub: "Prise d'appels 24h/24.",
  m3_title: 'Conformite DGFiP', m3_sub: 'Annuaire centralise.',
  m4_title: 'Alertes reglementaires', m4_sub: 'grcx surveille pour vous.',
  m5_title: 'Integrations ERP', m5_sub: 'Sage, Cegid, SAP.',
  m6_title: 'Tableau de bord', m6_sub: 'Toutes vos donnees.',
  m7_title: 'Facturation usage', m7_sub: 'Lago, par minute.',
  // Pricing
  pricing_h2: 'Un seul abonnement. Tout dedans.',
  pricing_sub: 'Pas de modules optionnels. Pas de surprises en fin de mois.',
  p1_name: 'Voix Starter', p1_price: '19', p1_annual: '16', p1_desc: 'Pour artisans et independants',
  p1_i0: 'Numero +33 dedie', p1_i1: 'IA vocale 24h/24 en francais', p1_i2: 'Agenda Doctolib ou Google Calendar', p1_i3: '200 minutes par mois', p1_i4: 'Conforme RGPD, hebergement EU',
  p2_name: 'Voix Business', p2_price: '29', p2_annual: '24', p2_desc: 'Pour les PME de 5 a 50 salaries',
  p2_i0: 'Tout Voix Starter', p2_i1: '500 minutes par mois', p2_i2: 'Integrations Sage et Cegid', p2_i3: 'Rapport mensuel automatique', p2_i4: 'Support sous 4 heures',
  p3_name: 'Conformite + CFO', p3_price: '1 200', p3_annual: '1 000', p3_desc: 'E-facturation et pilotage financier',
  p3_i0: 'Enrolement annuaire DGFiP gere', p3_i1: 'Generation Factur-X automatique', p3_i2: 'Tableau de bord PSD2 bancaire', p3_i3: 'Alertes reglementaires grcx', p3_i4: 'Responsable de compte dedie',
  // Combos
  c1_name: 'Voix + Conformite', c1_price: '1 190', c1_desc: 'E-facturation et reception',
  c2_name: 'Business + Conformite', c2_price: '1 199', c2_desc: 'PME complete tout inclus',
  c3_name: 'Tout Vanivert', c3_price: '1 209', c3_desc: 'Les 3 modules au meilleur tarif',
  // Blog section
  blog_h2: "Lire avant de s'y prendre trop tard.",
  // Contact
  contact_h2: 'On vous rappelle. Promis.',
  contact_sub: 'Pas un bot. Un fondateur qui connait vos contraintes.',
  // Footer
  footer_tagline: "On s'occupe de la conformite. Vous, de votre metier.",
  // Company
  company_name: 'Vanivert',
  company_email: 'contact@vanivert.fr',
  company_phone: '+33 7 45 64 45 41',
  company_siret: "SIRET en cours d'enregistrement",
  company_address: "Lannion, Cotes d'Armor, Bretagne",
  company_tva: 'TVA non applicable - Art. 293B du CGI',
  // Legal
  cgv_intro: "Les presentes conditions generales de vente regissent les relations contractuelles entre Vanivert et ses clients.",
  cgv_price_text: "Les tarifs sont indiques en euros hors taxes. La TVA applicable est celle en vigueur au jour de la facturation.",
  privacy_dpo: 'contact@vanivert.fr',
  privacy_retention: '3 ans apres la fin du contrat',
  // Social
  social_linkedin: 'https://linkedin.com/company/vanivert',
  social_twitter: '',
  // Calculateur
  calc_h1: 'Mon risque e-facturation DGFiP',
  calc_sub: "Entrez votre SIRET. En 2 minutes, vous savez exactement ou vous en etes.",
  // Demo page
  demo_h1: '30 jours gratuits. Sans carte.',
  demo_sub: "Testez tout. Si ca ne vous convient pas, vous ne payez rien.",
}

type CMS = typeof DEFAULT_CMS

const SECTIONS = [
  { id: 'hero', label: 'Page d\'accueil - Hero', icon: '◈' },
  { id: 'modules', label: 'Modules produit', icon: '⊞' },
  { id: 's1', label: 'Section E-facturation', icon: '◧' },
  { id: 's2', label: 'Section Smart CFO', icon: '◧' },
  { id: 's3', label: 'Section Reception vocale', icon: '◧' },
  { id: 'pricing', label: 'Tarifs', icon: '◉' },
  { id: 'combos', label: 'Packs combines', icon: '⊡' },
  { id: 'blog', label: 'Section Blog', icon: '◫' },
  { id: 'contact', label: 'Contact', icon: '◬' },
  { id: 'footer', label: 'Pied de page', icon: '▣' },
  { id: 'company', label: 'Informations societe', icon: '◎' },
  { id: 'legal', label: 'Textes legaux', icon: '⊛' },
  { id: 'pages', label: 'Autres pages', icon: '◱' },
  { id: 'leads', label: 'Leads & inscriptions', icon: '◐' },
  { id: 'alerts', label: 'Alertes reglementaires', icon: '◬' },
]

/* ── Supabase ── */
async function sbFetch(table: string, filter = '') {
  if (!SB_URL || !SB_KEY) return []
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}?order=created_at.desc&limit=50${filter}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    if (!r.ok) return []
    return r.json()
  } catch { return [] }
}

/* ── Field components ── */
function Field({ label, value, onChange, type = 'text', rows }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number
}) {
  const [focus, setFocus] = useState(false)
  const base = { width: '100%', padding: '10px 12px', border: `1px solid ${focus ? 'rgba(99,102,241,0.5)' : BORDER}`, borderRadius: 9, background: 'rgba(13,13,15,0.03)', color: TEXT, fontSize: 13, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s', resize: 'vertical' as const }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui', display: 'block', marginBottom: 5 }}>{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={{ ...base }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ ...base }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      )}
    </div>
  )
}

function SectionTitle({ label }: { label: string }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.12em', color: SUBTLE, textTransform: 'uppercase' as const, fontFamily: 'system-ui', marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>{label}</div>
}

function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick}
      style={{ padding: '10px 24px', borderRadius: 980, background: saved ? GR : VI, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 600, fontSize: 13, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}>
      {saved ? 'ok Sauvegarde !' : 'Sauvegarder'}
    </button>
  )
}

/* ── SECTION EDITORS ── */
function HeroEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="Hero - Page d'accueil" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Badge d'entete" value={cms.hero_eyebrow} onChange={v => set('hero_eyebrow', v)} />
        <Field label="Accroche principale (ligne 1)" value={cms.hero_h1} onChange={v => set('hero_h1', v)} />
      </div>
      <SectionTitle label="Phrases alternees (ligne 2 du titre)" />
      {(['hero_h1_r0', 'hero_h1_r1', 'hero_h1_r2', 'hero_h1_r3'] as const).map((k, i) => (
        <Field key={k} label={`Phrase ${i + 1}`} value={cms[k]} onChange={v => set(k, v)} />
      ))}
      <Field label="Paragraphe sous le titre" value={cms.hero_sub} onChange={v => set('hero_sub', v)} rows={3} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Bouton principal" value={cms.hero_cta1} onChange={v => set('hero_cta1', v)} />
        <Field label="Bouton secondaire" value={cms.hero_cta2} onChange={v => set('hero_cta2', v)} />
      </div>
      <Field label="Texte logos clients" value={cms.trust_tagline} onChange={v => set('trust_tagline', v)} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function ModulesEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  const keys: [keyof CMS, keyof CMS][] = [['m0_title', 'm0_sub'], ['m1_title', 'm1_sub'], ['m2_title', 'm2_sub'], ['m3_title', 'm3_sub'], ['m4_title', 'm4_sub'], ['m5_title', 'm5_sub'], ['m6_title', 'm6_sub'], ['m7_title', 'm7_sub']]
  return (
    <div>
      <SectionTitle label="Modules produit (pilules sur la page d'accueil)" />
      {keys.map(([kt, ks], i) => (
        <div key={kt} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
          <Field label={`Module ${i + 1} - Titre`} value={cms[kt] as string} onChange={v => set(kt, v)} />
          <Field label={`Module ${i + 1} - Sous-titre`} value={cms[ks] as string} onChange={v => set(ks, v)} />
        </div>
      ))}
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function SectionEditor({ n, cms, set, save, saved }: { n: 1 | 2 | 3; cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  const labels: Record<number, string> = { 1: 'E-facturation DGFiP', 2: 'Smart CFO', 3: 'Reception vocale' }
  const prefix = `s${n}_` as 's1_' | 's2_' | 's3_'
  return (
    <div>
      <SectionTitle label={`Section produit - ${labels[n]}`} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Etiquette (petite, en haut)" value={cms[`${prefix}label` as keyof CMS] as string} onChange={v => set(`${prefix}label` as keyof CMS, v)} />
        <Field label="Badge prix/inclusion" value={cms[`${prefix}badge` as keyof CMS] as string} onChange={v => set(`${prefix}badge` as keyof CMS, v)} />
      </div>
      <Field label="Titre principal" value={cms[`${prefix}h2` as keyof CMS] as string} onChange={v => set(`${prefix}h2` as keyof CMS, v)} />
      <Field label="Corps du texte" value={cms[`${prefix}body` as keyof CMS] as string} onChange={v => set(`${prefix}body` as keyof CMS, v)} rows={4} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function PricingEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="En-tete de la section tarifs" />
      <Field label="Titre" value={cms.pricing_h2} onChange={v => set('pricing_h2', v)} />
      <Field label="Sous-titre" value={cms.pricing_sub} onChange={v => set('pricing_sub', v)} />
      {([1, 2, 3] as const).map(n => {
        const p = `p${n}_` as 'p1_' | 'p2_' | 'p3_'
        return (
          <div key={n}>
            <SectionTitle label={`Plan ${n} - ${cms[`${p}name` as keyof CMS]}`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              <Field label="Nom du plan" value={cms[`${p}name` as keyof CMS] as string} onChange={v => set(`${p}name` as keyof CMS, v)} />
              <Field label="Prix mensuel (EUR)" value={cms[`${p}price` as keyof CMS] as string} onChange={v => set(`${p}price` as keyof CMS, v)} />
              <Field label="Prix annuel (EUR)" value={cms[`${p}annual` as keyof CMS] as string} onChange={v => set(`${p}annual` as keyof CMS, v)} />
              <Field label="Description courte" value={cms[`${p}desc` as keyof CMS] as string} onChange={v => set(`${p}desc` as keyof CMS, v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([0, 1, 2, 3, 4] as const).map(i => (
                <Field key={i} label={`Fonctionnalite ${i + 1}`} value={cms[`${p}i${i}` as keyof CMS] as string} onChange={v => set(`${p}i${i}` as keyof CMS, v)} />
              ))}
            </div>
          </div>
        )
      })}
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function CombosEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="Packs combines (sous les plans individuels)" />
      {([1, 2, 3] as const).map(n => (
        <div key={n}>
          <SectionTitle label={`Pack ${n}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <Field label="Nom" value={cms[`c${n}_name` as keyof CMS] as string} onChange={v => set(`c${n}_name` as keyof CMS, v)} />
            <Field label="Prix (EUR/mois)" value={cms[`c${n}_price` as keyof CMS] as string} onChange={v => set(`c${n}_price` as keyof CMS, v)} />
            <Field label="Description" value={cms[`c${n}_desc` as keyof CMS] as string} onChange={v => set(`c${n}_desc` as keyof CMS, v)} />
          </div>
        </div>
      ))}
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function ContactEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="Section contact" />
      <Field label="Titre" value={cms.contact_h2} onChange={v => set('contact_h2', v)} />
      <Field label="Sous-titre" value={cms.contact_sub} onChange={v => set('contact_sub', v)} rows={2} />
      <SectionTitle label="Pied de page" />
      <Field label="Accroche footer" value={cms.footer_tagline} onChange={v => set('footer_tagline', v)} />
      <Field label="Titre section blog" value={cms.blog_h2} onChange={v => set('blog_h2', v)} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function CompanyEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="Identite de la societe" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Nom commercial" value={cms.company_name} onChange={v => set('company_name', v)} />
        <Field label="Email de contact" value={cms.company_email} onChange={v => set('company_email', v)} />
        <Field label="Telephone" value={cms.company_phone} onChange={v => set('company_phone', v)} />
        <Field label="SIRET" value={cms.company_siret} onChange={v => set('company_siret', v)} />
        <Field label="Numero TVA" value={cms.company_tva} onChange={v => set('company_tva', v)} />
        <Field label="LinkedIn" value={cms.social_linkedin} onChange={v => set('social_linkedin', v)} />
      </div>
      <Field label="Adresse complete" value={cms.company_address} onChange={v => set('company_address', v)} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function LegalEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="CGV - Conditions generales de vente" />
      <Field label="Introduction CGV" value={cms.cgv_intro} onChange={v => set('cgv_intro', v)} rows={3} />
      <Field label="Texte tarification" value={cms.cgv_price_text} onChange={v => set('cgv_price_text', v)} rows={2} />
      <SectionTitle label="Politique de confidentialite" />
      <Field label="Contact DPO" value={cms.privacy_dpo} onChange={v => set('privacy_dpo', v)} />
      <Field label="Duree conservation des donnees" value={cms.privacy_retention} onChange={v => set('privacy_retention', v)} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function PagesEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  return (
    <div>
      <SectionTitle label="Page calculateur" />
      <Field label="Titre H1" value={cms.calc_h1} onChange={v => set('calc_h1', v)} />
      <Field label="Sous-titre" value={cms.calc_sub} onChange={v => set('calc_sub', v)} rows={2} />
      <SectionTitle label="Page demo / inscription" />
      <Field label="Titre H1" value={cms.demo_h1} onChange={v => set('demo_h1', v)} />
      <Field label="Sous-titre" value={cms.demo_sub} onChange={v => set('demo_sub', v)} rows={2} />
      <SaveBtn onClick={save} saved={saved} />
    </div>
  )
}

function LeadsViewer() {
  const [leads, setLeads] = useState<{ id: string; email: string; company_name?: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    sbFetch('calculator_leads').then(d => { setLeads(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])
  function exportCSV() {
    const rows = ['Email,Entreprise,Date', ...leads.map(l => `${l.email},${l.company_name || ''},${l.created_at?.split('T')[0]}`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }))
    a.download = `leads-vanivert-${Date.now()}.csv`
    a.click()
  }
  return (
    <div>
      <SectionTitle label="Leads et inscriptions (Supabase live)" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{leads.length} leads enregistres</span>
        <button onClick={exportCSV} style={{ padding: '7px 16px', borderRadius: 980, background: VIG, border: `1px solid rgba(99,102,241,0.3)`, color: 'rgba(165,163,255,0.9)', fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Exporter CSV
        </button>
      </div>
      {loading ? <div style={{ color: SUBTLE, fontSize: 13, fontFamily: 'system-ui' }}>Chargement...</div> : leads.length === 0 ? (
        <div style={{ color: SUBTLE, fontSize: 13, fontFamily: 'system-ui' }}>Aucun lead pour l'instant.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {leads.map(l => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 9, background: 'rgba(13,13,15,0.025)', border: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontSize: 13, color: TEXT, fontFamily: 'system-ui' }}>{l.email}</div>
                {l.company_name && <div style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui', marginTop: 2 }}>{l.company_name}</div>}
              </div>
              <div style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui' }}>{l.created_at?.split('T')[0]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AlertsViewer() {
  const [alerts, setAlerts] = useState<{ id: string; jurisdiction: string; severity: string; summary: string; created_at: string; source_url?: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    sbFetch('regulatory_alerts').then(d => { setAlerts(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])
  const sColor: Record<string, string> = { critical: RED, high: EM, medium: VI, low: GR, info: SUBTLE }
  return (
    <div>
      <SectionTitle label="Alertes reglementaires (grcx - Supabase live)" />
      {loading ? <div style={{ color: SUBTLE, fontSize: 13, fontFamily: 'system-ui' }}>Chargement...</div> : alerts.length === 0 ? (
        <div style={{ color: SUBTLE, fontSize: 13, fontFamily: 'system-ui' }}>Aucune alerte enregistree.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ padding: '12px 14px', borderRadius: 9, background: 'rgba(13,13,15,0.025)', border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${sColor[a.severity] || SUBTLE}18`, color: sColor[a.severity] || SUBTLE, fontFamily: 'system-ui', letterSpacing: '0.06em', flexShrink: 0, textTransform: 'uppercase' as const }}>{a.severity}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: TEXT, fontFamily: 'system-ui', lineHeight: 1.5 }}>{a.summary}</div>
                  <div style={{ fontSize: 10, color: SUBTLE, fontFamily: 'system-ui', marginTop: 4 }}>{a.jurisdiction} - {a.created_at?.split('T')[0]}</div>
                </div>
                {a.source_url && <a href={a.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: MUTED, textDecoration: 'none', fontFamily: 'system-ui', flexShrink: 0 }}>Source</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── ADMIN LOGIN ── */
function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error_description || 'Acces refuse')
      const role = d.user?.app_metadata?.role || d.user?.user_metadata?.role
      if (role !== 'vanivert_admin') throw new Error('Acces administrateur requis')
      localStorage.setItem('vanivert_admin_token', d.access_token)
      onAuth()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: '40%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EZ }}
        style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ background: 'rgba(13,13,15,0.025)', border: `1px solid ${BORDER}`, borderRadius: 22, padding: 8, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ background: CARD, borderRadius: 16, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#fff' }}>v</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, color: TEXT }}>Administration</div>
                <div style={{ fontSize: 11, color: SUBTLE }}>Acces restreint</div>
              </div>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Email admin', type: 'email', value: email, set: setEmail, ph: 'contact@vanivert.fr' }, { label: 'Mot de passe', type: 'password', value: pw, set: setPw, ph: '...' }].map(f => (
                <div key={f.ph}>
                  <label style={{ fontSize: 11, color: SUBTLE, display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} required
                    style={{ width: '100%', padding: '11px 13px', border: `1px solid ${BORDER}`, borderRadius: 9, background: 'rgba(13,13,15,0.03)', color: TEXT, fontSize: 13, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' as const }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = BORDER)} />
                </div>
              ))}
              {error && <div style={{ fontSize: 12, color: RED, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ padding: '12px', borderRadius: 980, background: '#fff', color: BG, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? '...' : 'Acceder'}
              </button>
            </form>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <a href="/login" style={{ fontSize: 12, color: SUBTLE, textDecoration: 'none' }}>Connexion client</a>
        </div>
      </motion.div>
    </div>
  )
}

/* ── MAIN ADMIN ── */
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [cms, setCms] = useState<CMS>(DEFAULT_CMS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('vanivert_admin_token')
    if (token) setAuthed(true)
    try {
      const stored = localStorage.getItem(CMS_KEY)
      if (stored) setCms(prev => ({ ...prev, ...JSON.parse(stored) }))
    } catch {}
  }, [])

  function set(k: keyof CMS, v: string) {
    setCms(prev => ({ ...prev, [k]: v }))
    setSaved(false)
  }

  function save() {
    try {
      localStorage.setItem(CMS_KEY, JSON.stringify(cms))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
  }

  function resetAll() {
    if (!confirm('Tout reinitialiser aux valeurs par defaut ?')) return
    localStorage.removeItem(CMS_KEY)
    setCms(DEFAULT_CMS)
    setSaved(false)
  }

  function logout() {
    localStorage.removeItem('vanivert_admin_token')
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />

  const editorProps = { cms, set, save, saved }

  const sectionContent: Record<string, React.ReactNode> = {
    hero: <HeroEditor {...editorProps} />,
    modules: <ModulesEditor {...editorProps} />,
    s1: <SectionEditor n={1} {...editorProps} />,
    s2: <SectionEditor n={2} {...editorProps} />,
    s3: <SectionEditor n={3} {...editorProps} />,
    pricing: <PricingEditor {...editorProps} />,
    combos: <CombosEditor {...editorProps} />,
    contact: <ContactEditor {...editorProps} />,
    footer: <ContactEditor {...editorProps} />,
    company: <CompanyEditor {...editorProps} />,
    legal: <LegalEditor {...editorProps} />,
    pages: <PagesEditor {...editorProps} />,
    leads: <LeadsViewer />,
    alerts: <AlertsViewer />,
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', fontFamily: 'system-ui' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: BG2, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100dvh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px 14px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>v</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>vanivert</div>
              <div style={{ fontSize: 9, color: SUBTLE, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Administration</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '8px' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 12, fontWeight: activeSection === s.id ? 600 : 400, background: activeSection === s.id ? VIG : 'transparent', color: activeSection === s.id ? 'rgba(165,163,255,0.9)' : MUTED, textAlign: 'left' as const, marginBottom: 2, borderLeft: `2px solid ${activeSection === s.id ? VI : 'transparent'}`, transition: 'all 0.15s' }}>
              <span style={{ opacity: activeSection === s.id ? 1 : 0.4 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 6, flexDirection: 'column' as const }}>
          <a href="/" target="_blank" style={{ fontSize: 11, color: SUBTLE, textDecoration: 'none', padding: '6px 10px', borderRadius: 7, border: `1px solid ${BORDER}`, textAlign: 'center' as const }}>
            Voir le site
          </a>
          <button onClick={resetAll} style={{ fontSize: 11, color: EM, background: 'transparent', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontFamily: 'system-ui' }}>
            Reinitialiser tout
          </button>
          <button onClick={logout} style={{ fontSize: 11, color: SUBTLE, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontFamily: 'system-ui' }}>
            Se deconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: TEXT, marginBottom: 4, marginTop: 0 }}>
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h1>
              <p style={{ fontSize: 12, color: SUBTLE }}>
                Les modifications sont appliquees instantanement sur le site.
              </p>
            </div>
            <SaveBtn onClick={save} saved={saved} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {sectionContent[activeSection] || <div style={{ color: SUBTLE, fontSize: 13 }}>Section en cours de developpement.</div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}input::placeholder,textarea::placeholder{color:rgba(13,13,15,0.3)}textarea{color:rgba(13,13,15,0.88)}`}</style>
    </div>
  )
}
