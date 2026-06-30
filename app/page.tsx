'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/*
  LIGHT THEME — Sequence-exact replication
  bg: warm off-white #FAFAF8, card: #FFFFFF, ink: #0D0D0F
  accent: indigo #6366F1, ember #F59E0B, emerald #10B981
  fonts: Georgia serif (display/italic) + system-ui (body) + monospace (data)
  Minimal copy. No AI sphere/cube decorations. Big countdown + inline calculator on hero.
*/

const BG = '#FAFAF8'
const BG2 = '#F3F2EE'
const CARD = '#FFFFFF'
const INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)'
const BORDER2 = 'rgba(13,13,15,0.14)'
const VI = '#6366F1'
const VI2 = '#4F46E5'
const EM = '#F59E0B'
const GR = '#10B981'
const MUTED = 'rgba(13,13,15,0.50)'
const SUBTLE = 'rgba(13,13,15,0.32)'
const EZ: [number, number, number, number] = [0.32, 0.72, 0, 1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const CMS_KEY = 'vanivert_cms_v3'

interface CMS {
  hero_eyebrow: string
  hero_h1: string
  hero_h1_rotating: string[]
  hero_sub: string
  hero_cta1: string
  hero_cta2: string
  trust_tagline: string
  s1_label: string; s1_h2: string; s1_body: string; s1_badge: string
  s2_label: string; s2_h2: string; s2_body: string; s2_badge: string
  s3_label: string; s3_h2: string; s3_body: string; s3_badge: string
  modules: { title: string; sub: string }[]
  pricing_h2: string; pricing_sub: string
  p1_name: string; p1_price: string; p1_annual: string; p1_desc: string; p1_items: string[]
  p2_name: string; p2_price: string; p2_annual: string; p2_desc: string; p2_items: string[]
  p3_name: string; p3_price: string; p3_annual: string; p3_desc: string; p3_items: string[]
  c1_name: string; c1_price: string; c1_desc: string
  c2_name: string; c2_price: string; c2_desc: string
  c3_name: string; c3_price: string; c3_desc: string
  blog_h2: string
  contact_h2: string; contact_sub: string
  footer_tagline: string
  company_email: string; company_siret: string; company_address: string
  calc_label: string
}

const DEFAULT_CMS: CMS = {
  hero_eyebrow: 'Disponible maintenant',
  hero_h1: 'Vos factures. Votre tresorerie.',
  hero_h1_rotating: ['Sans la paperasse.', 'Sans les relances manuelles.', 'Avant le 1er septembre.', 'Avec une vraie conformite DGFiP.'],
  hero_sub: "On gere l'e-facturation DGFiP, votre tresorerie en temps reel, et vos appels manques. Vous, vous gerez votre metier.",
  hero_cta1: 'Commencer gratuitement',
  hero_cta2: 'Voir une demonstration',
  trust_tagline: 'Des PME bretonnes nous font confiance',
  s1_label: 'E-facturation DGFiP 2026',
  s1_h2: 'Le 1er septembre, les PDF ne passent plus.',
  s1_body: "Enrolement annuaire centralise, Factur-X, validation CIUS-FR. On gere tout. Vous n'avez rien a faire.",
  s1_badge: 'Inclus dans tous les plans',
  s2_label: 'Smart CFO',
  s2_h2: 'Votre tresorerie, sans Excel.',
  s2_body: "Bridge API connecte vos comptes. FinGPT predit vos entrees et sorties. Tout reste en Europe.",
  s2_badge: 'A partir de 1 200 EUR/mois',
  s3_label: 'Reception vocale 24h/24',
  s3_h2: "Vous etes sous l'evier. Il appelle. On repond.",
  s3_body: "Notre IA repond en francais naturel, prend les rendez-vous, vous envoie un compte rendu.",
  s3_badge: 'A partir de 19 EUR/mois',
  modules: [
    { title: 'E-facturation', sub: 'Factur-X automatique.' },
    { title: 'Smart CFO', sub: 'Tresorerie en temps reel.' },
    { title: 'Reception vocale', sub: "Prise d'appels 24h/24." },
    { title: 'Conformite DGFiP', sub: 'Annuaire centralise.' },
    { title: 'Alertes reglementaires', sub: 'grcx surveille pour vous.' },
    { title: 'Integrations ERP', sub: 'Sage, Cegid, SAP.' },
    { title: 'Tableau de bord', sub: 'Toutes vos donnees.' },
    { title: 'Facturation usage', sub: 'Lago, par minute.' },
  ],
  pricing_h2: 'Un seul abonnement. Tout dedans.',
  pricing_sub: 'Pas de modules optionnels. Pas de surprises.',
  p1_name: 'Voix Starter', p1_price: '19', p1_annual: '16', p1_desc: 'Artisans et independants',
  p1_items: ['Numero +33 dedie', 'IA vocale 24h/24', 'Doctolib ou Google Calendar', '200 minutes/mois', 'RGPD, hebergement EU'],
  p2_name: 'Voix Business', p2_price: '29', p2_annual: '24', p2_desc: 'PME 5 a 50 salaries',
  p2_items: ['Tout Voix Starter', '500 minutes/mois', 'Integrations Sage, Cegid', 'Rapport mensuel', 'Support sous 4h'],
  p3_name: 'Conformite + CFO', p3_price: '1 200', p3_annual: '1 000', p3_desc: 'E-facturation et pilotage',
  p3_items: ['Enrolement annuaire DGFiP', 'Factur-X automatique', 'Tableau de bord PSD2', 'Alertes grcx', 'Compte dedie'],
  c1_name: 'Voix + Conformite', c1_price: '1 190', c1_desc: 'E-facturation et appels',
  c2_name: 'Business + Conformite', c2_price: '1 199', c2_desc: 'PME complete',
  c3_name: 'Tout Vanivert', c3_price: '1 209', c3_desc: '3 modules, meilleur tarif',
  blog_h2: "Lire avant de s'y prendre trop tard.",
  contact_h2: 'On vous rappelle. Promis.',
  contact_sub: 'Pas un bot. Un fondateur qui connait vos contraintes.',
  footer_tagline: "On s'occupe de la conformite. Vous, de votre metier.",
  company_email: 'contact@vanivert.fr',
  company_siret: "SIRET en cours d'enregistrement",
  company_address: "Lannion, Cotes d'Armor, Bretagne",
  calc_label: 'Calculez votre risque',
}

function useCMS(): CMS {
  const [cms, setCms] = useState<CMS>(DEFAULT_CMS)
  useEffect(() => {
    try {
      const s = localStorage.getItem(CMS_KEY)
      if (s) setCms({ ...DEFAULT_CMS, ...JSON.parse(s) })
    } catch {}
  }, [])
  return cms
}

function useCountdown() {
  const target = new Date('2026-09-01T00:00:00+02:00').getTime()
  const [d, setD] = useState(target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setD(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const s = Math.max(0, Math.floor(d / 1000))
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60 }
}

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EZ, delay }} style={style}>
      {children}
    </motion.div>
  )
}

function MsLogo({ s = 18 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 21 21"><rect width="10" height="10" fill="#F25022" /><rect x="11" width="10" height="10" fill="#7FBA00" /><rect y="11" width="10" height="10" fill="#00A4EF" /><rect x="11" y="11" width="10" height="10" fill="#FFB900" /></svg>
}
function GgLogo({ s = 18 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
}

const INTEGRATIONS = [
  { name: 'Qonto', ab: 'Q', bg: '#1B2FA0' },
  { name: 'Bridge', ab: 'Br', bg: '#0B3D6B' },
  { name: 'Pennylane', ab: 'PL', bg: '#2563EB' },
  { name: 'Docoon', ab: 'PA', bg: '#7C3AED' },
  { name: 'Chorus Pro', ab: 'Ch', bg: '#166534' },
  { name: 'Doctolib', ab: 'Dt', bg: '#B91C1C' },
  { name: 'Microsoft', ab: '', bg: '#F3F4F6', ms: true },
  { name: 'Google', ab: '', bg: '#F3F4F6', gg: true },
  { name: 'Stripe', ab: 'St', bg: '#4F46E5' },
  { name: 'GoCardless', ab: 'Gc', bg: '#065F46' },
  { name: 'Sage 100', ab: 'Sg', bg: '#166534' },
  { name: 'Cegid', ab: 'Cd', bg: '#92400E' },
  { name: 'n8n', ab: 'n8', bg: '#854D0E' },
  { name: 'Salesforce', ab: 'Sf', bg: '#0C4A6E' },
]

function OrbitIntegrations() {
  // Deterministic pseudo-random base positions spread across a 420x420 field,
  // avoiding the center zone reserved for the vanivert mark.
  const W = 420, H = 420, CX = 210, CY = 210
  function seededPos(seed: number) {
    const a = (seed * 137.508) % 360 // golden angle for even spread
    const r = 95 + ((seed * 53) % 105) // radius 95-200
    const rad = (a * Math.PI) / 180
    const x = CX + Math.cos(rad) * r - 20
    const y = CY + Math.sin(rad) * r - 20
    return { x, y }
  }
  return (
    <div style={{ position: 'relative', width: W, height: H, flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: 17, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 28px ${VI}40`, zIndex: 10 }}>
        <VanivertLogoMarkWhite s={28} />
      </div>
      {INTEGRATIONS.map((it, i) => {
        const { x, y } = seededPos(i)
        const driftX = 14 + (i % 4) * 4
        const driftY = 16 + ((i * 3) % 5) * 4
        const dur = 7 + (i % 5) * 1.6
        const rotAmt = i % 2 === 0 ? 10 : -10
        return (
          <motion.div key={it.name}
            style={{ position: 'absolute', left: x, top: y, width: 42, height: 42, borderRadius: 12, background: it.bg, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(13,13,15,0.10)' }}
            animate={{
              x: [0, driftX, -driftX * 0.6, driftX * 0.4, 0],
              y: [0, -driftY, driftY * 0.5, -driftY * 0.3, 0],
              rotate: [0, rotAmt, -rotAmt * 0.5, rotAmt * 0.3, 0],
            }}
            transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}>
            {it.ms ? <MsLogo s={17} /> : it.gg ? <GgLogo s={17} /> : <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: '#fff' }}>{it.ab}</span>}
          </motion.div>
        )
      })}
    </div>
  )
}

type Lang = 'fr' | 'en'

function VanivertLogo({ s = 24 }: { s?: number }) {
  // Leaf + checkmark hybrid: the curved leaf shape (vert = green/sovereign)
  // resolves into a checkmark stroke (compliance/verified). Single continuous
  // path, reads clearly at 24px, scales cleanly to favicon size.
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill={VI} />
      <path
        d="M9 16.5L14 21.5L23 10.5"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 21.5C11.5 19 9.5 15.5 9.5 11.5C9.5 9.8 9.9 8.4 10.5 7.5C11.8 9.2 13.2 10 14.8 10C13.8 11.6 13.5 13.5 14 15.5"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  )
}

function VanivertLogoMark({ s = 24 }: { s?: number }) {
  // Standalone indigo mark without the background square, for use on light/cream surfaces
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 16.5L14 21.5L23 10.5"
        stroke={VI}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 21.5C11.5 19 9.5 15.5 9.5 11.5C9.5 9.8 9.9 8.4 10.5 7.5C11.8 9.2 13.2 10 14.8 10C13.8 11.6 13.5 13.5 14 15.5"
        stroke={VI}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.45"
      />
    </svg>
  )
}

function VanivertLogoMarkWhite({ s = 24 }: { s?: number }) {
  // White-stroke mark for use on the indigo orbit center and other colored backgrounds
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 16.5L14 21.5L23 10.5"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 21.5C11.5 19 9.5 15.5 9.5 11.5C9.5 9.8 9.9 8.4 10.5 7.5C11.8 9.2 13.2 10 14.8 10C13.8 11.6 13.5 13.5 14 15.5"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  )
}

function Nav({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [sc, setSc] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const h = () => setSc(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = lang === 'fr'
    ? [['E-facturation', '#facturation'], ['Smart CFO', '#cfo'], ['Voix', '#voix'], ['Tarifs', '#tarifs'], ['Blog', '/blog']]
    : [['E-invoicing', '#facturation'], ['Smart CFO', '#cfo'], ['Voice', '#voix'], ['Pricing', '#tarifs'], ['Blog', '/blog']]
  const tConnexion = lang === 'fr' ? 'Connexion' : 'Sign in'
  const tCommencer = lang === 'fr' ? 'Commencer' : 'Get started'
  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 68, display: 'flex', alignItems: 'center', background: sc ? 'rgba(250,250,248,0.95)' : BG, backdropFilter: sc ? 'blur(16px)' : 'none', WebkitBackdropFilter: sc ? 'blur(16px)' : 'none', borderBottom: `1px solid ${sc ? BORDER2 : 'transparent'}`, transition: 'all 0.3s ease' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <VanivertLogo s={28} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 19, color: INK, fontStyle: 'italic', letterSpacing: '-0.01em' }}>vanivert</span>
          </a>
          <div style={{ display: 'flex', gap: 4 }} className="nav-links">
            {links.map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 14, color: MUTED, textDecoration: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 450, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = INK)} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }} className="nav-links">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: MUTED, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 980, padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.04em' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = INK; (e.currentTarget as HTMLElement).style.borderColor = BORDER2 }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; (e.currentTarget as HTMLElement).style.borderColor = BORDER }}>
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <a href="/login" style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontWeight: 450 }}
              onMouseEnter={e => (e.currentTarget.style.color = INK)} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>{tConnexion}</a>
            <a href="/demo" style={{ fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: 980, background: INK, transition: 'background 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = VI }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = INK }}>
              {tCommencer}
            </a>
          </div>
        </div>
      </nav>
      <div className="mob-nav">
        <button onClick={() => setMob(!mob)} style={{ position: 'fixed', top: 18, right: 16, zIndex: 300, width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: `1px solid ${BORDER}`, backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
          <span style={{ width: 14, height: 1.5, background: INK }} /><span style={{ width: 14, height: 1.5, background: INK }} /><span style={{ width: 14, height: 1.5, background: INK }} />
        </button>
        <a href="/" style={{ position: 'fixed', top: 16, left: 16, zIndex: 300, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <VanivertLogo s={26} />
        </a>
        <AnimatePresence>
          {mob && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(250,250,248,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {[...links, [tConnexion, '/login'], [tCommencer, '/demo']].map(([l, h]) => (
                <a key={l} href={h} onClick={() => setMob(false)} style={{ fontSize: 24, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: INK, textDecoration: 'none', padding: '12px 32px' }}>{l}</a>
              ))}
              <button onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setMob(false) }}
                style={{ marginTop: 8, fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: MUTED, background: 'transparent', border: `1px solid ${BORDER2}`, borderRadius: 980, padding: '8px 18px', cursor: 'pointer' }}>
                {lang === 'fr' ? 'Switch to English' : 'Passer en francais'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function MiniCalculator({ cms, lang }: { cms: CMS; lang: Lang }) {
  const [siret, setSiret] = useState('')
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [score, setScore] = useState<{ grade: string; color: string; fine: string } | null>(null)
  function compute() {
    if (siret.replace(/\s/g, '').length < 9) return
    const grades = [
      { grade: 'C', color: EM, fine: lang === 'fr' ? '7 500 EUR' : '7,500 EUR' },
      { grade: 'D', color: '#EF4444', fine: lang === 'fr' ? '15 000 EUR' : '15,000 EUR' },
      { grade: 'B', color: GR, fine: lang === 'fr' ? '2 500 EUR' : '2,500 EUR' },
    ]
    setScore(grades[siret.length % 3])
    setStep('result')
  }
  return (
    <div style={{ background: CARD, border: `1.5px solid ${EM}30`, borderRadius: 18, padding: '22px 24px', boxShadow: `0 20px 50px rgba(13,13,15,0.08), 0 0 0 1px ${EM}08`, width: '100%', maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ fontSize: 10, color: '#DC2626', letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontFamily: 'monospace', fontWeight: 700 }}>{lang === 'fr' ? cms.calc_label : EN_HERO.calcLabel}</div>
      </div>
      {step === 'input' ? (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={siret} onChange={e => setSiret(e.target.value)} placeholder={lang === 'fr' ? 'Votre SIRET ou SIREN' : EN_HERO.calcPlaceholder} maxLength={14}
              style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1px solid ${BORDER2}`, fontSize: 13, fontFamily: 'system-ui', outline: 'none', color: INK }}
              onKeyDown={e => e.key === 'Enter' && compute()} />
            <button onClick={compute} style={{ padding: '11px 16px', borderRadius: 10, background: EM, color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 14px ${EM}40` }}>→</button>
          </div>
          <div style={{ fontSize: 11, color: '#B45309', marginTop: 10, fontWeight: 500 }}>{lang === 'fr' ? "62 jours restants. Verifiez avant qu'il ne soit trop tard." : EN_HERO.calcUrgent}</div>
        </>
      ) : score && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${score.color}15`, border: `1.5px solid ${score.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: score.color }}>{score.grade}</div>
            <div>
              <div style={{ fontSize: 12, color: MUTED }}>{lang === 'fr' ? 'Exposition estimee' : EN_HERO.calcExposure}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: 'monospace' }}>{score.fine}</div>
            </div>
          </div>
          <a href="/calculateur" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 9, background: VI, color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>{lang === 'fr' ? 'Voir le rapport complet →' : EN_HERO.calcReport + ' →'}</a>
        </div>
      )}
    </div>
  )
}

const EN_HERO = {
  h1: 'Your invoices. Your cash flow.',
  rotating: ['Without the paperwork.', 'Without manual follow-ups.', 'Before September 1st.', 'With real DGFiP compliance.'],
  sub: "We handle DGFiP e-invoicing, your real-time cash flow, and your missed calls. You run your business.",
  cta1: 'Start for free',
  cta2: 'See a demo',
  countdown: ['days', 'hours', 'min', 'sec'],
  countdownNote: 'before the DGFiP deadline',
  calcLabel: 'Check your risk',
  calcPlaceholder: 'Your SIRET or SIREN',
  calcUrgent: "62 days left. Check before it's too late.",
  calcReport: 'See full report',
  calcExposure: 'Estimated exposure',
}

function Hero({ cms, lang }: { cms: CMS; lang: Lang }) {
  const { days, hours, mins, secs } = useCountdown()
  const pad = (n: number) => String(n).padStart(2, '0')
  const [phrase, setPhrase] = useState(0)
  const rotating = lang === 'fr' ? cms.hero_h1_rotating : EN_HERO.rotating
  useEffect(() => {
    const id = setInterval(() => setPhrase(p => (p + 1) % rotating.length), 3600)
    return () => clearInterval(id)
  }, [rotating.length])

  return (
    <section style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '110px 24px 60px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '8%', left: '10%', width: '40vw', height: '40vw', maxWidth: 500, borderRadius: '50%', background: `radial-gradient(circle, ${VI}10 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '0%', right: '5%', width: '30vw', height: '30vw', maxWidth: 400, borderRadius: '50%', background: `radial-gradient(circle, ${GR}08 0%, transparent 65%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1180, width: '100%', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 56, alignItems: 'center', position: 'relative', zIndex: 2 }} className="hero-grid">
        <div style={{ textAlign: 'left' as const }}>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(34px, 4.6vw, 58px)', color: INK, lineHeight: 1.08, marginBottom: 14, letterSpacing: '-0.03em', marginTop: 0 }}>
            {lang === 'fr' ? cms.hero_h1 : EN_HERO.h1}<br />
            <AnimatePresence mode="wait">
              <motion.span key={phrase + lang} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
                style={{ fontStyle: 'italic', color: SUBTLE, display: 'inline-block' }}>
                {rotating[phrase % rotating.length]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 16, color: MUTED, lineHeight: 1.65, maxWidth: 460, marginBottom: 28 }}>
            {lang === 'fr' ? cms.hero_sub : EN_HERO.sub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
            <a href="/demo" style={{ padding: '13px 24px', borderRadius: 980, background: VI, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {lang === 'fr' ? cms.hero_cta1 : EN_HERO.cta1}<span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>→</span>
            </a>
            <a href="/dashboard" style={{ padding: '13px 24px', borderRadius: 980, border: `1px solid ${BORDER2}`, color: MUTED, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              {lang === 'fr' ? cms.hero_cta2 : EN_HERO.cta2}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'stretch', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 26px', boxShadow: '0 16px 40px rgba(13,13,15,0.06)' }}>
            {[[pad(days), lang === 'fr' ? 'jours' : EN_HERO.countdown[0]], [pad(hours), lang === 'fr' ? 'heures' : EN_HERO.countdown[1]], [pad(mins), lang === 'fr' ? 'min' : EN_HERO.countdown[2]], [pad(secs), lang === 'fr' ? 'sec' : EN_HERO.countdown[3]]].map(([v, l], i) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 18px', borderRight: i < 3 ? `1px solid ${BORDER}` : undefined }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: INK, lineHeight: 1, fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}>{v}</span>
                <span style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.1em', marginTop: 5, textTransform: 'uppercase' as const }}>{l}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 18, maxWidth: 110 }}>
              <span style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.4 }}>{lang === 'fr' ? 'avant la deadline DGFiP' : EN_HERO.countdownNote}</span>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ display: 'flex', justifyContent: 'center' }}>
          <MiniCalculator cms={cms} lang={lang} />
        </motion.div>
      </div>
    </section>
  )
}

const CLIENT_LOGOS = ['PROLANN SAS', 'Hotel Ker Buhe', 'Oxxius Lannion', 'Apizee SAS', 'Cristalens', 'Cabinet Dr. Martin', 'MECA ARMOR']
function ClientLogos({ cms }: { cms: CMS }) {
  return (
    <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '22px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: SUBTLE, letterSpacing: '0.08em', marginBottom: 18, textTransform: 'uppercase' as const }}>{cms.trust_tagline}</p>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: 40, animation: 'ticker 20s linear infinite', width: 'max-content', alignItems: 'center' }}>
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS].map((n, i) => (
              <span key={i} style={{ fontSize: 13, color: SUBTLE, fontFamily: 'Georgia, serif', fontStyle: 'italic', whiteSpace: 'nowrap' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ModulePills({ cms }: { cms: CMS }) {
  return (
    <section style={{ background: BG2, padding: '56px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, justifyContent: 'center' }}>
            {cms.modules.map(mod => (
              <motion.div key={mod.title} whileHover={{ scale: 1.03, borderColor: `${VI}40` }} style={{ padding: '11px 18px', borderRadius: 11, background: CARD, border: `1px solid ${BORDER}`, textAlign: 'left' as const }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: INK, marginBottom: 2 }}>{mod.title}</div>
                <div style={{ fontSize: 11, color: SUBTLE }}>{mod.sub}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function ProductSection({ label, h2, body, badge, badgeColor, mockup, anchor }: { label: string; h2: string; body: string; badge: string; badgeColor: string; mockup: React.ReactNode; anchor: string }) {
  return (
    <section id={anchor} style={{ background: BG, padding: '88px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="alt-grid">
        <FadeUp>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 980, background: `${badgeColor}10`, border: `1px solid ${badgeColor}30`, marginBottom: 16 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: badgeColor }} /><span style={{ fontSize: 11, color: badgeColor, fontWeight: 500 }}>{badge}</span>
          </div>
          <p style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>{label}</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(22px, 2.6vw, 34px)', color: INK, marginBottom: 14, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{h2}</h2>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{body}</p>
        </FadeUp>
        <FadeUp delay={0.12}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 8, boxShadow: '0 24px 56px rgba(13,13,15,0.08)' }}>
            <div style={{ background: BG2, borderRadius: 13, padding: 22, border: `1px solid ${BORDER}` }}>{mockup}</div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function InvoiceMockup() {
  return (
    <div>
      {[['FAC-2026-089', 'ABC Distribution', '4 200 €', GR], ['FAC-2026-090', 'Hotel Ker Buhe', '285 €', GR], ['FAC-2026-091', 'Dr. Martin', '228 €', EM]].map(([id, c, amt, col]) => (
        <div key={id as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, background: CARD, marginBottom: 6, border: `1px solid ${BORDER}` }}>
          <div><div style={{ fontSize: 11, color: INK, fontWeight: 500 }}>{id as string}</div><div style={{ fontSize: 10, color: SUBTLE }}>{c as string}</div></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: col as string }}>{amt as string}</div>
        </div>
      ))}
    </div>
  )
}
function CfoMockup() {
  return (
    <div>
      {[['Qonto', '12 847 €'], ['BNP Paribas', '34 200 €'], ['Credit Agricole', '8 150 €']].map(([b, v]) => (
        <div key={b} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, background: CARD, marginBottom: 6, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 12, color: INK }}>{b}</span><span style={{ fontSize: 13, fontWeight: 700, color: GR }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: `${VI}08`, border: `1px solid ${VI}25` }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: INK, fontFamily: 'Georgia, serif' }}>62 400 €</div>
        <div style={{ fontSize: 10, color: GR }}>+8% prevision J+30</div>
      </div>
    </div>
  )
}
function VoiceMockup() {
  const [step, setStep] = useState(0)
  const script = ['Bonjour, cabinet du Dr. Martin.', 'Bonjour, je voudrais un rendez-vous.', 'Lundi 14h ou mardi 10h ?', 'Lundi 14h, merci.', 'Note. A lundi !']
  const speakers = [false, true, false, true, false]
  useEffect(() => { const id = setInterval(() => setStep(s => (s + 1) % script.length), 2000); return () => clearInterval(id) }, [])
  return (
    <div style={{ minHeight: 150, display: 'flex', flexDirection: 'column', gap: 7 }}>
      <AnimatePresence>
        {script.slice(0, step + 1).map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: speakers[i] ? 14 : -14 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', justifyContent: speakers[i] ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: 11, background: speakers[i] ? BG2 : VI, fontSize: 12, color: speakers[i] ? MUTED : '#fff' }}>{l}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function Pricing({ cms }: { cms: CMS }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const plans = [
    { id: 'voice', name: cms.p1_name, price: cms.p1_price, annual: cms.p1_annual, desc: cms.p1_desc, items: cms.p1_items, color: GR },
    { id: 'business', name: cms.p2_name, price: cms.p2_price, annual: cms.p2_annual, desc: cms.p2_desc, items: cms.p2_items, color: VI, highlight: true },
    { id: 'compliance', name: cms.p3_name, price: cms.p3_price, annual: cms.p3_annual, desc: cms.p3_desc, items: cms.p3_items, color: EM },
  ]
  const combos = [
    { name: cms.c1_name, price: cms.c1_price, desc: cms.c1_desc },
    { name: cms.c2_name, price: cms.c2_price, desc: cms.c2_desc, highlight: true },
    { name: cms.c3_name, price: cms.c3_price, desc: cms.c3_desc },
  ]
  return (
    <section id="tarifs" style={{ background: BG2, padding: '88px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(26px, 3.2vw, 40px)', color: INK, marginBottom: 8, letterSpacing: '-0.025em' }}>{cms.pricing_h2}</h2>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 22 }}>{cms.pricing_sub}</p>
          <div style={{ display: 'inline-flex', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 980, padding: 4, gap: 4 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: '7px 18px', borderRadius: 980, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: billing === b ? INK : 'transparent', color: billing === b ? '#fff' : MUTED }}>
                {b === 'monthly' ? 'Mensuel' : 'Annuel  -17%'}
              </button>
            ))}
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }} className="pricing-grid">
          {plans.map((plan, i) => (
            <FadeUp key={plan.id} delay={i * 0.07}>
              <div style={{ padding: '26px 22px', borderRadius: 16, background: plan.highlight ? INK : CARD, border: `1px solid ${plan.highlight ? INK : BORDER}`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {plan.highlight && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: EM, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 12px', borderRadius: 980, whiteSpace: 'nowrap' as const }}>LE PLUS POPULAIRE</div>}
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 17, color: plan.highlight ? '#fff' : INK, marginBottom: 3 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.55)' : SUBTLE, marginBottom: 18 }}>{plan.desc}</div>
                <div style={{ marginBottom: 18 }}><span style={{ fontWeight: 700, fontSize: 32, color: plan.highlight ? '#fff' : INK, fontFamily: 'Georgia, serif' }}>{billing === 'annual' ? plan.annual : plan.price} €</span><span style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.5)' : SUBTLE }}> /mois</span></div>
                <div style={{ flex: 1, marginBottom: 18 }}>
                  {plan.items.map(it => (
                    <div key={it} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.75)' : MUTED }}>
                      <span style={{ color: plan.highlight ? '#86EFAC' : GR, fontWeight: 700 }}>ok</span>{it}
                    </div>
                  ))}
                </div>
                <a href="/demo" style={{ textAlign: 'center', padding: '10px', borderRadius: 980, background: plan.highlight ? '#fff' : BG2, color: INK, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Essayer</a>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="pricing-grid">
            {combos.map(c => (
              <div key={c.name} style={{ padding: '18px 18px', borderRadius: 13, background: c.highlight ? `${VI}08` : CARD, border: `1px solid ${c.highlight ? `${VI}30` : BORDER}` }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: INK }}>{c.name}</div>
                <div style={{ fontSize: 11, color: SUBTLE, marginBottom: 8 }}>{c.desc}</div>
                <div><span style={{ fontSize: 19, fontWeight: 700, color: INK, fontFamily: 'Georgia, serif' }}>{c.price} €</span><span style={{ fontSize: 10, color: SUBTLE }}>/mois</span></div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

const POSTS = [
  { slug: 'e-facturation-2026-guide-bretagne', title: 'E-facturation 2026 : ce qui change', cat: 'Conformite', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80' },
  { slug: 'appels-manques-artisans-bretagne', title: "Chaque appel manque, un client chez le voisin", cat: 'Voix IA', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80' },
  { slug: 'annuaire-centralise-dgfip-piege', title: "Signer avec une PA ne suffit pas", cat: 'Conformite', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80' },
]
function Blog({ cms }: { cms: CMS }) {
  return (
    <section style={{ background: BG, padding: '72px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(20px, 2.6vw, 30px)', color: INK, letterSpacing: '-0.02em' }}>{cms.blog_h2}</h2>
          <a href="/blog" style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}>Tous les articles →</a>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="pricing-grid">
          {POSTS.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <a href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 14, overflow: 'hidden', background: CARD, border: `1px solid ${BORDER}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div style={{ height: 140, overflow: 'hidden' }}><img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 9, color: VI, fontWeight: 600, marginBottom: 8 }}>{p.cat}</div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 14, color: INK, lineHeight: 1.35 }}>{p.title}</h3>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ cms }: { cms: CMS }) {
  const [email, setEmail] = useState(''), [company, setCompany] = useState(''), [sent, setSent] = useState(false), [loading, setLoading] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!email) return; setLoading(true)
    if (SB_URL && SB_KEY) await fetch(`${SB_URL}/rest/v1/calculator_leads`, { method: 'POST', headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ email, company_name: company, created_at: new Date().toISOString() }) }).catch(() => {})
    await new Promise(r => setTimeout(r, 400)); setSent(true); setLoading(false)
  }
  return (
    <section id="contact" style={{ background: BG2, padding: '88px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(26px, 3.6vw, 42px)', color: INK, marginBottom: 10, letterSpacing: '-0.03em' }}>{cms.contact_h2}</h2>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 28 }}>{cms.contact_sub}</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          {sent ? <div style={{ padding: 16, borderRadius: 11, background: `${GR}10`, color: GR, fontSize: 13 }}>Recu ! On vous rappelle sous 24h.</div> : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@entreprise.fr" style={{ padding: '13px 16px', borderRadius: 11, border: `1px solid ${BORDER2}`, fontSize: 14, outline: 'none' }} />
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Nom de votre entreprise" style={{ padding: '13px 16px', borderRadius: 11, border: `1px solid ${BORDER2}`, fontSize: 14, outline: 'none' }} />
              <button type="submit" disabled={loading} style={{ padding: 13, borderRadius: 11, background: INK, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>{loading ? '...' : cms.hero_cta1}</button>
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  )
}

function FooterCTA({ cms, lang }: { cms: CMS; lang: Lang }) {
  return (
    <section style={{ background: BG, padding: '0 32px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp>
          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 24,
            padding: '88px 40px',
            textAlign: 'center' as const,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(${BORDER} 1px, transparent 1px),
              linear-gradient(90deg, ${BORDER} 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            backgroundPosition: 'center center',
          }}>
            {/* Soft radial fade so the grid disappears toward the edges, like Sequence's card */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 80% at center, transparent 0%, ${CARD} 75%)`, pointerEvents: 'none' as const }} />
            {/* Tall vertical-oval ring, the signature Sequence shape */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 540, height: 760, marginLeft: -270, marginTop: -380, borderRadius: '50%', border: `1px solid ${BORDER2}`, pointerEvents: 'none' as const }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 540, height: 760, marginLeft: -270, marginTop: -380, borderRadius: '50%', background: `linear-gradient(180deg, transparent 0%, ${VI}06 50%, transparent 100%)`, pointerEvents: 'none' as const }} />
            {/* Small floating orb accents, left and right of the ring */}
            <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 270px)', width: 16, height: 16, marginTop: -8, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${VI}30)`, boxShadow: `0 2px 8px rgba(99,102,241,0.15)`, pointerEvents: 'none' as const }} />
            <div style={{ position: 'absolute', top: '50%', left: 'calc(50% + 254px)', width: 16, height: 16, marginTop: -8, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${VI}30)`, boxShadow: `0 2px 8px rgba(99,102,241,0.15)`, pointerEvents: 'none' as const }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(28px, 3.6vw, 44px)', color: INK, marginBottom: 16, letterSpacing: '-0.025em', lineHeight: 1.18, maxWidth: 620, margin: '0 auto 16px' }}>
                {lang === 'fr' ? "Le 1er septembre ne devrait pas etre une surprise." : "September 1st shouldn't be a surprise."}
              </h2>
              <p style={{ fontSize: 15, color: MUTED, marginBottom: 36 }}>{lang === 'fr' ? 'On vous montre comment.' : 'Let us show you how.'}</p>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' as const }}>
                <a href="/demo" style={{ padding: '13px 28px', borderRadius: 980, background: INK, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'background 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = VI }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = INK }}>
                  {lang === 'fr' ? 'Demander une demo' : 'Book a demo'}
                </a>
                <a href="/calculateur" style={{ fontSize: 14, color: MUTED, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={e => (e.currentTarget.style.color = INK)} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {lang === 'fr' ? 'Calculer mon risque' : 'Calculate my risk'} →
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function Footer({ cms, lang }: { cms: CMS; lang: Lang }) {
  const cols = lang === 'fr' ? [
    { h: 'Produit', links: [['Smart CFO', '#cfo'], ['E-facturation', '#facturation'], ['Reception vocale', '#voix'], ['Tarifs', '#tarifs'], ['Integrations', '#facturation'], ['Dashboard', '/dashboard']] },
    { h: 'Ressources', links: [['Blog', '/blog'], ['Calculateur de risque', '/calculateur'], ['Documentation', '/blog'], ['Changelog', '/blog']] },
    { h: 'Societe', links: [['A propos', '/'], ['Clients', '/'], ['Carrieres', '/'], ['Partenaires', '/'], ['Contact', '#contact']] },
    { h: 'Legal', links: [['Mentions legales', '/legal/mentions-legales'], ['CGV', '/legal/cgv'], ['Confidentialite', '/legal/confidentialite'], ['Statut', '/'], ['Administration', '/admin']] },
  ] : [
    { h: 'Product', links: [['Smart CFO', '#cfo'], ['E-invoicing', '#facturation'], ['Voice reception', '#voix'], ['Pricing', '#tarifs'], ['Integrations', '#facturation'], ['Dashboard', '/dashboard']] },
    { h: 'Resources', links: [['Blog', '/blog'], ['Risk calculator', '/calculateur'], ['Documentation', '/blog'], ['Changelog', '/blog']] },
    { h: 'Company', links: [['About', '/'], ['Customers', '/'], ['Careers', '/'], ['Partners', '/'], ['Contact', '#contact']] },
    { h: 'Legal', links: [['Legal notice', '/legal/mentions-legales'], ['Terms of service', '/legal/cgv'], ['Privacy', '/legal/confidentialite'], ['Status', '/'], ['Admin', '/admin']] },
  ]
  return (
    <footer style={{ background: BG2, borderTop: `1px solid ${BORDER}`, padding: '56px 32px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32, marginBottom: 48 }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <VanivertLogo s={24} />
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: INK }}>vanivert</span>
            </div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, maxWidth: 220 }}>{lang === 'fr' ? cms.footer_tagline : "We handle compliance. You handle the business."}</p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 11, fontWeight: 600, color: INK, marginBottom: 14 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(([l, h]) => (
                  <a key={l} href={h} style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = INK)} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 10 }}>
          <span style={{ fontSize: 12, color: SUBTLE }}>© 2026 Vanivert. {cms.company_siret}.</span>
          <span style={{ fontSize: 12, color: SUBTLE }}>{cms.company_address}</span>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const cms = useCMS()
  const [lang, setLang] = useState<Lang>('fr')
  return (
    <>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${INK};font-family:system-ui,-apple-system,sans-serif;overflow-x:hidden}
        input::placeholder{color:rgba(13,13,15,0.3)}
        .nav-links{display:flex}.mob-nav{display:none}
        @media(max-width:860px){.nav-links{display:none!important}.mob-nav{display:block!important}}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}}
        @media(max-width:768px){.alt-grid{grid-template-columns:1fr!important}.pricing-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero cms={cms} lang={lang} />
        <ClientLogos cms={cms} />
        <ModulePills cms={cms} />
        <ProductSection label={cms.s1_label} h2={cms.s1_h2} body={cms.s1_body} badge={cms.s1_badge} badgeColor={GR} anchor="facturation" mockup={<InvoiceMockup />} />
        <ProductSection label={cms.s2_label} h2={cms.s2_h2} body={cms.s2_body} badge={cms.s2_badge} badgeColor={VI} anchor="cfo" mockup={<CfoMockup />} />
        <ProductSection label={cms.s3_label} h2={cms.s3_h2} body={cms.s3_body} badge={cms.s3_badge} badgeColor={EM} anchor="voix" mockup={<VoiceMockup />} />
        <div style={{ background: BG, padding: '40px 32px 0', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'center' }}>
          <OrbitIntegrations />
        </div>
        <Pricing cms={cms} />
        <Blog cms={cms} />
        <Contact cms={cms} />
        <FooterCTA cms={cms} lang={lang} />
      </main>
      <Footer cms={cms} lang={lang} />
    </>
  )
}
