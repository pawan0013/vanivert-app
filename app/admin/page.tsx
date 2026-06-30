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
  // Integrations section (homepage)
  integrations_label: 'Integrations',
  integrations_h2: 'Connecte a tout ce que vous utilisez deja.',
  integrations_sub: "Pas de double saisie, pas de fichiers a exporter a la main. Vanivert se branche directement sur votre banque, votre comptabilite, votre agenda et vos outils de paiement.",
  agent_label: 'Agent Vanivert',
}

type CMS = typeof DEFAULT_CMS

const SECTIONS = [
  { id: 'hero', label: 'Page d\'accueil - Hero', icon: '◈' },
  { id: 'modules', label: 'Modules produit', icon: '⊞' },
  { id: 's1', label: 'Section E-facturation', icon: '◧' },
  { id: 's2', label: 'Section Smart CFO', icon: '◧' },
  { id: 's3', label: 'Section Reception vocale', icon: '◧' },
  { id: 'integrations', label: 'Logos integrations', icon: '⊕' },
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

/* ── Integration logo previews (mirrors the registry in page.tsx / dashboard-page.tsx) ── */
function QontoPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.6" fill="none"/><line x1="16.5" y1="16.5" x2="20.5" y2="20.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>}
function BridgePreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 16C5 16 8 8 12 8C16 8 19 16 19 16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
function PennylanePreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9.5" cy="12" r="5.5" fill="#7CF29C"/><circle cx="14.5" cy="12" r="5.5" fill="#1B4D5C" fillOpacity="0.9"/></svg>}
function DocoonPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9.5" cy="12" r="4" stroke="#fff" strokeWidth="2" fill="none"/><circle cx="15" cy="12" r="4" stroke="#fff" strokeWidth="2" fill="none"/></svg>}
function ChorusProPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="13" width="3" height="3" rx="0.5" fill="#fff" opacity="0.55"/><rect x="9" y="9" width="3" height="3" rx="0.5" fill="#fff" opacity="0.75"/><rect x="9" y="14" width="4" height="4" rx="0.5" fill="#fff"/><rect x="14" y="10" width="3" height="3" rx="0.5" fill="#fff" opacity="0.65"/></svg>}
function DoctolibPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 17C6 17 7 7 11 7C14 7 14 11 11 12C8.5 12.8 7.5 15 9.5 16.5C11.5 18 14.5 16.5 15 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="17.5" cy="9" r="1" fill="#fff"/></svg>}
function StripePreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M16.5 9.2C16.5 7.7 15.2 7 13.3 7C10.8 7 9.3 8.3 9.3 10.1C9.3 13.3 14.3 12.5 14.3 14.2C14.3 14.9 13.6 15.3 12.5 15.3C11.1 15.3 9.6 14.7 8.5 13.9V16.6C9.5 17.2 11 17.7 12.5 17.7C15.1 17.7 16.8 16.4 16.8 14.4C16.8 10.9 11.7 11.8 11.7 10.2C11.7 9.6 12.3 9.3 13.2 9.3C14.4 9.3 15.7 9.7 16.5 10.2V9.2Z" fill="#fff"/></svg>}
function GoCardlessPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15.5 9C14.7 8 13.4 7.3 12 7.3C9.4 7.3 7.3 9.4 7.3 12C7.3 14.6 9.4 16.7 12 16.7C14.2 16.7 16 15.2 16.5 13.2H12.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
function SagePreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 9.5C7 7.5 9 7 10 8C11 9 9.5 10.5 8 11.5C6.5 12.5 5.5 14 6.5 15.5C7.5 17 9.5 16.5 9.5 14.5C9.5 12.5 11.5 11 13.5 11C15.5 11 17 12.5 17 14.5C17 16.5 15.5 17.5 14 16.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>}
function CegidPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 9C13.5 8 11 8 9.5 9.5C8 11 8 13 9.5 14.5C11 16 13.5 16 15 15" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none"/><circle cx="17.5" cy="7.5" r="1.3" fill="#fff"/></svg>}
function N8nPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="15" r="1.6" stroke="#fff" strokeWidth="1.6" fill="none"/><circle cx="12" cy="15" r="1.6" stroke="#fff" strokeWidth="1.6" fill="none"/><circle cx="17.5" cy="9" r="1.6" stroke="#fff" strokeWidth="1.6" fill="none"/><circle cx="17.5" cy="15" r="1.6" fill="#fff"/><path d="M8.1 15H10.4M13.6 15H15.9M16.6 13.5L14.5 11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>}
function SalesforcePreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9.8 8.5C10.5 7.7 11.5 7.2 12.6 7.2C14.1 7.2 15.4 8.1 15.9 9.4C16.3 9.2 16.7 9.1 17.2 9.1C18.7 9.1 20 10.4 20 12C20 13.6 18.7 14.9 17.2 14.9H8C6.3 14.9 5 13.6 5 11.9C5 10.3 6.2 9.1 7.7 9C8 8.7 8.5 8.5 9 8.5C9.3 8.5 9.6 8.5 9.8 8.5Z" fill="#fff"/></svg>}
function MsPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 21 21"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>}
function GgPreview({s=18}:{s?:number}){return <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}

const INTEGRATION_PREVIEWS: Record<string, (p:{s?:number}) => React.ReactElement> = {
  qonto: QontoPreview, bridge: BridgePreview, pennylane: PennylanePreview, docoon: DocoonPreview,
  chorus_pro: ChorusProPreview, doctolib: DoctolibPreview, stripe: StripePreview, gocardless: GoCardlessPreview,
  sage: SagePreview, cegid: CegidPreview, n8n: N8nPreview, salesforce: SalesforcePreview,
  microsoft: MsPreview, google: GgPreview,
}

interface IntegrationItem { key: string; name: string; bg: string; enabled: boolean }

const INTEGRATIONS_CMS_KEY = 'vanivert_integrations_v1'

const INTEGRATIONS_DEFAULT: IntegrationItem[] = [
  { key: 'qonto', name: 'Qonto', bg: '#000000', enabled: true },
  { key: 'bridge', name: 'Bridge', bg: '#1A1A1A', enabled: true },
  { key: 'pennylane', name: 'Pennylane', bg: '#1F3A4D', enabled: true },
  { key: 'docoon', name: 'Docoon', bg: '#1A1A1A', enabled: true },
  { key: 'chorus_pro', name: 'Chorus Pro', bg: '#3D4FA8', enabled: true },
  { key: 'doctolib', name: 'Doctolib', bg: '#0F2A4A', enabled: true },
  { key: 'microsoft', name: 'Microsoft', bg: '#F3F4F6', enabled: true },
  { key: 'google', name: 'Google', bg: '#F3F4F6', enabled: true },
  { key: 'stripe', name: 'Stripe', bg: '#635BFF', enabled: true },
  { key: 'gocardless', name: 'GoCardless', bg: '#0A0A0A', enabled: true },
  { key: 'sage', name: 'Sage', bg: '#000000', enabled: true },
  { key: 'cegid', name: 'Cegid', bg: '#2D5BFF', enabled: true },
  { key: 'n8n', name: 'n8n', bg: '#EA4B71', enabled: true },
  { key: 'salesforce', name: 'Salesforce', bg: '#00A1E0', enabled: true },
]

function IntegrationsEditor({ cms, set, save, saved }: { cms: CMS; set: (k: keyof CMS, v: string) => void; save: () => void; saved: boolean }) {
  const [list, setList] = useState<IntegrationItem[]>(INTEGRATIONS_DEFAULT)
  const [logosSaved, setLogosSaved] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(INTEGRATIONS_CMS_KEY)
      if (s) {
        const stored = JSON.parse(s) as IntegrationItem[]
        setList(INTEGRATIONS_DEFAULT.map(d => stored.find(x => x.key === d.key) || d))
      }
    } catch {}
  }, [])

  function update(key: string, patch: Partial<IntegrationItem>) {
    setList(prev => prev.map(it => it.key === key ? { ...it, ...patch } : it))
    setLogosSaved(false)
  }

  function saveLogos() {
    try {
      localStorage.setItem(INTEGRATIONS_CMS_KEY, JSON.stringify(list))
      setLogosSaved(true)
      setTimeout(() => setLogosSaved(false), 3000)
    } catch {}
  }

  function resetAll() {
    if (!confirm('Reinitialiser tous les logos aux valeurs par defaut ?')) return
    localStorage.removeItem(INTEGRATIONS_CMS_KEY)
    setList(INTEGRATIONS_DEFAULT)
    setLogosSaved(false)
  }

  return (
    <div>
      <SectionTitle label="Animation document - sous le hero (contrat -> agent -> facture)" />
      <Field label="Nom affiche sous le logo (carte centrale)" value={cms.agent_label} onChange={v => set('agent_label', v)} />
      <SectionTitle label="Texte de la section integrations" />
      <Field label="Etiquette" value={cms.integrations_label} onChange={v => set('integrations_label', v)} />
      <Field label="Titre" value={cms.integrations_h2} onChange={v => set('integrations_h2', v)} />
      <Field label="Sous-titre" value={cms.integrations_sub} onChange={v => set('integrations_sub', v)} rows={2} />
      <SaveBtn onClick={save} saved={saved} />

      <SectionTitle label="Logos integrations - orbite page d'accueil + tableau de bord" />
      <p style={{ fontSize: 12, color: SUBTLE, marginBottom: 18, lineHeight: 1.6 }}>
        Activez ou desactivez chaque logo, modifiez le nom affiche, ou changez la couleur de fond.
        Les modifications s&apos;appliquent a l&apos;animation de la page d&apos;accueil et a la liste
        d&apos;integrations du tableau de bord.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map(it => {
          const Preview = INTEGRATION_PREVIEWS[it.key]
          return (
            <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: it.enabled ? 'rgba(99,102,241,0.04)' : 'rgba(13,13,15,0.02)', border: `1px solid ${it.enabled ? 'rgba(99,102,241,0.15)' : BORDER}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${BORDER}`, opacity: it.enabled ? 1 : 0.4 }}>
                {Preview && <Preview s={17} />}
              </div>
              <input value={it.name} onChange={e => update(it.key, { name: e.target.value })}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: `1px solid ${BORDER}`, background: 'rgba(13,13,15,0.03)', color: TEXT, fontSize: 13, fontFamily: 'system-ui', outline: 'none' }} />
              <input type="color" value={/^#[0-9A-Fa-f]{6}$/.test(it.bg) ? it.bg : '#000000'} onChange={e => update(it.key, { bg: e.target.value })}
                title="Couleur de fond" style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${BORDER}`, cursor: 'pointer', padding: 0, background: 'transparent' }} />
              <button onClick={() => update(it.key, { enabled: !it.enabled })}
                style={{ width: 40, height: 22, borderRadius: 980, border: 'none', cursor: 'pointer', background: it.enabled ? GR : 'rgba(13,13,15,0.15)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <span style={{ position: 'absolute', top: 2, left: it.enabled ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <SaveBtn onClick={saveLogos} saved={logosSaved} />
        <button onClick={resetAll} style={{ padding: '10px 20px', borderRadius: 980, background: 'transparent', color: SUBTLE, border: `1px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13 }}>
          Reinitialiser
        </button>
      </div>
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
    integrations: <IntegrationsEditor {...editorProps} />,
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
