'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'

/*
  DESIGN: Exact Sequence replication
  - OLED black #050608 hero with grain + radial mesh gradients
  - Floating glass pill nav (detached from top)
  - Hero: full-bleed background image + centered copy + animated product UI mockup below
  - Product sections: alternating left/right layout, each with dark card mockup
  - Sequence horizontal scrolling module cards
  - Client logos ticker
  - Dark pricing section
  - Agents/workflow section
  NATURAL FRENCH: Every line is how a real French PME owner speaks
  NO: AI badge, "Infrastructure souveraine EU", generic SaaS copy
*/

/* ── TOKENS ── */
const BG = '#050608'
const BG2 = '#0A0D12'
const BG3 = '#0F1318'
const CARD = '#111520'
const CARD2 = '#161B26'
const BORDER = 'rgba(255,255,255,0.07)'
const BORDER2 = 'rgba(255,255,255,0.12)'
const VI = '#6366F1'   /* indigo */
const VI2 = '#4F46E5'
const VIG = 'rgba(99,102,241,0.12)'
const EM = '#F59E0B'   /* ember */
const GR = '#10B981'   /* emerald */
const TEXT = 'rgba(255,255,255,0.88)'
const MUTED = 'rgba(255,255,255,0.45)'
const SUBTLE = 'rgba(255,255,255,0.22)'
const EZ = [0.32, 0.72, 0, 1] as [number,number,number,number]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/* ── CMS defaults — overridden from admin localStorage ── */
const CMS_KEY = 'vanivert_cms_v2'
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
  p1_name: string; p1_price: string; p1_desc: string; p1_items: string[]
  p2_name: string; p2_price: string; p2_desc: string; p2_items: string[]
  p3_name: string; p3_price: string; p3_desc: string; p3_items: string[]
  contact_h2: string; contact_sub: string
  footer_tagline: string
  company_email: string; company_siret: string; company_address: string
}

const DEFAULT_CMS: CMS = {
  hero_eyebrow: 'Disponible maintenant',
  hero_h1: 'Vos factures. Votre tresorerie.',
  hero_h1_rotating: [
    'Sans la paperasse.',
    'Sans les relances manuelles.',
    'Avant le 1er septembre.',
    'Avec une vraie conformite DGFiP.',
  ],
  hero_sub: 'Vanivert s\'occupe de tout : e-facturation DGFiP, tableau de bord financier en temps reel, et prise d\'appels automatique. Vous, vous gerez votre metier.',
  hero_cta1: 'Commencer gratuitement',
  hero_cta2: 'Voir une demonstration',
  trust_tagline: 'Des PME bretonnes nous font confiance',
  s1_label: 'E-facturation DGFiP 2026',
  s1_h2: 'Le 1er septembre, les PDF ne passent plus.',
  s1_body: 'Vos fournisseurs s\'y attendent, la DGFiP l\'exige. On gere l\'enrolement dans l\'annuaire centralise, la generation Factur-X et la validation CIUS-FR. Vous, vous n\'avez rien a faire.',
  s1_badge: 'Inclus dans tous les plans',
  s2_label: 'Smart CFO',
  s2_h2: 'Votre tresorerie, sans Excel.',
  s2_body: 'Bridge API connecte vos comptes bancaires. FinGPT predit vos entrees et sorties. grcx surveille la reglementation pour vous. Le tout sur des serveurs europeens, hors de portee des GAFAM.',
  s2_badge: 'A partir de 1 200 EUR/mois',
  s3_label: 'Reception vocale 24h/24',
  s3_h2: 'Vous etes sous l\'evier. Il appelle. On repond.',
  s3_body: 'Artisan, praticien, hotel : chaque appel manque est un client perdu. Notre IA repond en francais naturel, prend les rendez-vous dans Doctolib, et vous envoie un compte rendu par email.',
  s3_badge: 'A partir de 19 EUR/mois',
  modules: [
    { title: 'E-facturation', sub: 'Factur-X automatique.' },
    { title: 'Smart CFO', sub: 'Tresorerie en temps reel.' },
    { title: 'Reception vocale', sub: 'Prise d\'appels 24h/24.' },
    { title: 'Conformite DGFiP', sub: 'Annuaire centralise.' },
    { title: 'Alertes reglementaires', sub: 'grcx surveille pour vous.' },
    { title: 'Integrations ERP', sub: 'Sage, Cegid, SAP.' },
    { title: 'Tableau de bord', sub: 'Toutes vos donnees.' },
    { title: 'Facturation usage', sub: 'Lago, par minute.' },
  ],
  pricing_h2: 'Un seul abonnement. Tout dedans.',
  pricing_sub: 'Pas de modules optionnels. Pas de surprises en fin de mois.',
  p1_name: 'Voix Starter', p1_price: '19', p1_desc: 'Pour artisans et independants',
  p1_items: ['Numero +33 dedie', 'IA vocale 24h/24 en francais', 'Agenda Doctolib ou Google Calendar', '200 minutes par mois', 'Conforme RGPD, hebergement EU'],
  p2_name: 'Voix Business', p2_price: '29', p2_desc: 'Pour les PME de 5 a 50 salaries',
  p2_items: ['Tout Voix Starter', '500 minutes par mois', 'Integrations Sage et Cegid', 'Rapport mensuel automatique', 'Support sous 4 heures'],
  p3_name: 'Conformite + CFO', p3_price: '1 200', p3_desc: 'E-facturation et pilotage financier',
  p3_items: ['Enrolement annuaire DGFiP gere', 'Generation Factur-X automatique', 'Tableau de bord PSD2 bancaire', 'Alertes reglementaires grcx', 'Responsable de compte dedie'],
  contact_h2: 'On vous rappelle. Promis.',
  contact_sub: 'Pas un bot. Un fondateur qui connait vos contraintes.',
  footer_tagline: 'On s\'occupe de la conformite. Vous, de votre metier.',
  company_email: 'contact@vanivert.fr',
  company_siret: 'SIRET en cours d\'enregistrement',
  company_address: 'Lannion, Cotes d\'Armor, Bretagne',
}

function useCMS(): CMS {
  const [cms, setCms] = useState<CMS>(DEFAULT_CMS)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CMS_KEY)
      if (stored) setCms({ ...DEFAULT_CMS, ...JSON.parse(stored) })
    } catch {}
  }, [])
  return cms
}

/* ── Countdown ── */
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

/* ── useInViewFade ── */
function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EZ, delay }}
      style={style}>
      {children}
    </motion.div>
  )
}

/* ── SVG logos ── */
function MsLogo({ s = 18 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 21 21"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
}
function GgLogo({ s = 18 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
}

/* ── FLOATING NAV (Sequence style: glass pill, detached) ── */
function Nav() {
  const [sc, setSc] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const h = () => setSc(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [['E-facturation', '#facturation'], ['Smart CFO', '#cfo'], ['Voix', '#voix'], ['Tarifs', '#tarifs'], ['Blog', '/blog']]
  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EZ }}
        style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, display: 'flex', alignItems: 'center', gap: 0,
          background: sc ? 'rgba(5,6,8,0.88)' : 'rgba(14,16,22,0.65)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${sc ? BORDER2 : BORDER}`,
          borderRadius: 980, padding: '6px 6px',
          boxShadow: sc ? '0 8px 40px rgba(0,0,0,0.5)' : '0 2px 20px rgba(0,0,0,0.4)',
          transition: 'all 0.4s cubic-bezier(0.32,0.72,0,1)',
          whiteSpace: 'nowrap',
        }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', padding: '5px 14px 5px 8px', borderRight: `1px solid ${BORDER}` }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff', fontWeight: 400 }}>v</span>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: TEXT, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em' }}>vanivert</span>
        </a>
        <div style={{ display: 'flex', gap: 0, padding: '0 6px' }} className="nav-links">
          {links.map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: MUTED, textDecoration: 'none', padding: '5px 12px', borderRadius: 980, transition: 'color 0.2s', fontFamily: 'system-ui, sans-serif', fontWeight: 450 }}
              onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '0 4px 0 6px', borderLeft: `1px solid ${BORDER}` }}>
          <a href="/login" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', padding: '6px 12px', borderRadius: 980, fontFamily: 'system-ui, sans-serif', fontWeight: 450, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)} onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
            Connexion
          </a>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 980, background: VI, fontFamily: 'system-ui, sans-serif', transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = VI2; (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = VI; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
            Commencer
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>→</span>
          </a>
        </div>
      </motion.nav>
      {/* Mobile hamburger */}
      <div className="mob-nav">
        <button onClick={() => setMob(!mob)} style={{ position: 'fixed', top: 16, right: 16, zIndex: 300, width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: `1px solid ${BORDER}`, backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
          <motion.span animate={{ rotate: mob ? 45 : 0, y: mob ? 6 : 0 }} transition={{ duration: 0.3 }} style={{ width: 14, height: 1.5, background: '#fff', display: 'block', transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: mob ? 0 : 1 }} transition={{ duration: 0.2 }} style={{ width: 14, height: 1.5, background: '#fff', display: 'block' }} />
          <motion.span animate={{ rotate: mob ? -45 : 0, y: mob ? -6 : 0 }} transition={{ duration: 0.3 }} style={{ width: 14, height: 1.5, background: '#fff', display: 'block', transformOrigin: 'center' }} />
        </button>
        <AnimatePresence>
          {mob && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(5,6,8,0.96)', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {[...links, ['Connexion', '/login'], ['Commencer', '/demo']].map(([l, h], i) => (
                <motion.a key={l} href={h} onClick={() => setMob(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4, ease: EZ }}
                  style={{ fontSize: 24, fontFamily: 'Georgia, serif', color: TEXT, textDecoration: 'none', padding: '12px 32px', fontStyle: 'italic' }}>
                  {l}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

/* ── HERO (Sequence: centered, full-bleed dark bg, animated tagline) ── */
function Hero({ cms }: { cms: CMS }) {
  const { days, hours, mins, secs } = useCountdown()
  const pad = (n: number) => String(n).padStart(2, '0')
  const [phrase, setPhrase] = useState(0)
  const phrases = cms.hero_h1_rotating
  useEffect(() => {
    const id = setInterval(() => setPhrase(p => (p + 1) % phrases.length), 3600)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <section style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      {/* Sequence-style radial mesh glows */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '50vw', height: '50vw', maxWidth: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '40vw', height: '40vw', maxWidth: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {/* Grain overlay */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.022, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '200px 200px', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
        {/* Eyebrow — Sequence style: tiny pill badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EZ }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 6px', borderRadius: 980, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 28 }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontFamily: 'system-ui', fontWeight: 700 }}>1 sept</span>
          <span style={{ fontSize: 11, color: 'rgba(165,163,255,0.9)', fontFamily: 'system-ui', fontWeight: 500, letterSpacing: '0.02em' }}>{cms.hero_eyebrow}</span>
        </motion.div>

        {/* H1 */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EZ }}
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(36px, 5.5vw, 68px)', color: '#fff', lineHeight: 1.08, marginBottom: 16, marginTop: 0, letterSpacing: '-0.03em' }}>
          {cms.hero_h1}
          <br />
          <AnimatePresence mode="wait">
            <motion.span key={phrase} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EZ }}
              style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', display: 'inline-block' }}>
              {phrases[phrase]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EZ }}
          style={{ fontSize: 17, color: MUTED, lineHeight: 1.72, maxWidth: 540, margin: '0 auto 36px', fontFamily: 'system-ui, sans-serif', fontWeight: 400 }}>
          {cms.hero_sub}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: EZ }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <a href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 980, background: '#fff', color: BG, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui', transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
            {cms.hero_cta1}
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>→</span>
          </a>
          <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 980, border: '1px solid rgba(255,255,255,0.15)', color: MUTED, fontWeight: 500, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui', transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.color = TEXT }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = MUTED }}>
            {cms.hero_cta2}
          </a>
        </motion.div>

        {/* Countdown — Sequence-style inline strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: EZ }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 0, padding: '12px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'system-ui' }}>
          {[[pad(days), 'jours'], [pad(hours), 'h'], [pad(mins), 'min'], [pad(secs), 'sec']].map(([v, l], i) => (
            <span key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 14px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : undefined }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.04em' }}>{v}</span>
              <span style={{ fontSize: 9, color: SUBTLE, letterSpacing: '0.1em', marginTop: 3, textTransform: 'uppercase' as const }}>{l}</span>
            </span>
          ))}
          <span style={{ paddingLeft: 16, fontSize: 12, color: SUBTLE, maxWidth: 130, textAlign: 'left' as const, lineHeight: 1.4 }}>avant la deadline e-facturation DGFiP</span>
        </motion.div>
      </div>

      {/* Product UI mockup below hero — Sequence style */}
      <motion.div initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: EZ }}
        style={{ position: 'relative', zIndex: 2, marginTop: 60, width: '100%', maxWidth: 900 }}>
        {/* Double-bezel outer shell */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 8, boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          {/* Inner core */}
          <div style={{ background: CARD, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)' }}>
            {/* Fake browser bar */}
            <div style={{ background: BG3, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <div style={{ marginLeft: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 14px', fontSize: 11, color: SUBTLE, fontFamily: 'system-ui' }}>vanivert.fr/dashboard</div>
            </div>
            {/* Dashboard preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 280 }}>
              {/* Sidebar */}
              <div style={{ background: BG2, padding: '20px 14px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                {['Vue generale', 'Tresorerie', 'Factures', 'Conformite', 'Integrations', 'Alertes', 'Voix'].map((item, i) => (
                  <div key={item} style={{ padding: '7px 10px', borderRadius: 8, marginBottom: 2, background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? VI : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: i === 0 ? 'rgba(165,163,255,0.9)' : SUBTLE, fontFamily: 'system-ui', fontWeight: i === 0 ? 500 : 400 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                  {[['MRR', '9 368 €', VI], ['Solde', '55 197 €', GR], ['En retard', '5 700 €', '#EF4444'], ['Jours', '65', EM]].map(([l, v, c]) => (
                    <div key={l} style={{ background: BG3, borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 9, color: SUBTLE, fontFamily: 'system-ui', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 6 }}>{l}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: c as string, fontFamily: 'system-ui', letterSpacing: '-0.03em' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: BG3, borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.05)', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 400 70" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <polyline points="0,60 40,45 80,50 120,30 160,35 200,15 240,20 280,8 320,12 360,5 400,10" fill="none" stroke={VI} strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="0,60 40,45 80,50 120,30 160,35 200,15 240,20 280,8" fill="none" stroke={VI} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3"/>
                    <polygon points="0,70 0,60 40,45 80,50 120,30 160,35 200,15 240,20 280,8 320,12 360,5 400,10 400,70" fill={VI} fillOpacity="0.06"/>
                    {[0,1,2,3,4,5,6,7,8,9,11].map(i => (
                      <text key={i} x={i * 40} y={68} textAnchor="middle" fill={SUBTLE} fontSize="7" fontFamily="system-ui">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ── CLIENT LOGOS (Sequence-style horizontal scroll) ── */
const CLIENT_LOGOS = ['PROLANN SAS', 'Hotel Ker Buhe', 'Oxxius Lannion', 'Apizee SAS', 'Cristalens', 'Cabinet Dr. Martin', 'MECA ARMOR', 'Technopole Lannion']
function ClientLogos({ cms }: { cms: CMS }) {
  return (
    <section style={{ background: BG, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: SUBTLE, fontFamily: 'system-ui', letterSpacing: '0.08em', marginBottom: 20, textTransform: 'uppercase' as const }}>{cms.trust_tagline}</p>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: 40, animation: 'ticker 20s linear infinite', width: 'max-content', alignItems: 'center' }}>
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS].map((name, i) => (
              <span key={i} style={{ fontSize: 13, color: SUBTLE, fontFamily: 'Georgia, serif', fontStyle: 'italic', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '0.01em' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── MODULE PILLS (Sequence product suite nav) ── */
function ModulePills({ cms }: { cms: CMS }) {
  return (
    <section style={{ background: BG2, padding: '60px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp>
          <p style={{ textAlign: 'center', fontSize: 11, color: SUBTLE, letterSpacing: '0.1em', fontFamily: 'system-ui', textTransform: 'uppercase' as const, marginBottom: 28 }}>
            Suite Vanivert
          </p>
          <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(22px, 3vw, 36px)', color: TEXT, marginBottom: 36, marginTop: 0, letterSpacing: '-0.02em' }}>
            Tout ce dont une PME a besoin, dans un seul outil.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, justifyContent: 'center' }}>
            {cms.modules.map((mod, i) => (
              <motion.div key={mod.title} whileHover={{ scale: 1.03, borderColor: 'rgba(99,102,241,0.4)' }} transition={{ duration: 0.25 }}
                style={{ padding: '12px 20px', borderRadius: 12, background: CARD, border: `1px solid ${BORDER}`, cursor: 'default', textAlign: 'left' as const }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, fontFamily: 'system-ui', marginBottom: 2 }}>{mod.title}</div>
                <div style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui' }}>{mod.sub}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ── PRODUCT SECTION (Sequence: alternating dark card + copy) ── */
function ProductSection({ label, h2, body, badge, badgeColor, flip = false, mockup, anchor }: {
  label: string; h2: string; body: string; badge: string; badgeColor: string; flip?: boolean; mockup: React.ReactNode; anchor: string
}) {
  return (
    <section id={anchor} style={{ background: BG, padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', direction: flip ? 'rtl' : 'ltr' as any }}>
        <FadeUp style={{ direction: 'ltr' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 980, background: `${badgeColor}15`, border: `1px solid ${badgeColor}30`, marginBottom: 18 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: badgeColor }} />
            <span style={{ fontSize: 11, color: badgeColor, fontFamily: 'system-ui', fontWeight: 500 }}>{badge}</span>
          </div>
          <p style={{ fontSize: 10, color: SUBTLE, fontFamily: 'system-ui', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>{label}</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(22px, 2.8vw, 36px)', color: TEXT, marginBottom: 16, marginTop: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{h2}</h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.78, marginBottom: 24, fontFamily: 'system-ui' }}>{body}</p>
          <a href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: TEXT, textDecoration: 'none', fontFamily: 'system-ui', padding: '10px 20px', borderRadius: 980, border: '1px solid rgba(255,255,255,0.14)', transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            En savoir plus
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>→</span>
          </a>
        </FadeUp>
        <FadeUp delay={0.15} style={{ direction: 'ltr' }}>
          {/* Double-bezel card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 22, padding: 8, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div style={{ background: CARD, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}>
              {mockup}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ── INVOICE MOCKUP ── */
function InvoiceMockup() {
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <div style={{ fontSize: 9, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Facture generee automatiquement</div>
      {[['FAC-2026-089', 'ABC Distribution SAS', '4 200,00 €', 'Conforme', GR], ['FAC-2026-090', 'Hotel Ker Buhe', '285,00 €', 'Conforme', GR], ['FAC-2026-091', 'Cabinet Dr. Martin', '228,00 €', 'A generer', EM], ['FAC-2026-092', 'MECA ARMOR SARL', '1 200,00 €', 'Paye', SUBTLE]].map(([id, client, amount, status, color]) => (
        <div key={id as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', marginBottom: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: 11, color: TEXT, fontWeight: 500 }}>{id as string}</div>
            <div style={{ fontSize: 10, color: SUBTLE, marginTop: 2 }}>{client as string}</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{amount as string}</div>
            <div style={{ fontSize: 9, color: color as string, fontWeight: 600, marginTop: 2 }}>{status as string}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: '9px 12px', borderRadius: 8, background: `${GR}12`, border: `1px solid ${GR}30`, fontSize: 10, color: GR }}>
        Annuaire DGFiP : enrole - SIRET valides SIRENE : 100%
      </div>
    </div>
  )
}

/* ── CFO MOCKUP ── */
function CfoMockup() {
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <div style={{ fontSize: 9, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Tresorerie en temps reel</div>
      {[['Qonto', '12 847 €', GR], ['BNP Paribas', '34 200 €', GR], ['Credit Agricole', '8 150 €', GR]].map(([b, v, c]) => (
        <div key={b} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', marginBottom: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: 12, color: TEXT }}>{b}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: c as string }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: `${VI}12`, border: `1px solid ${VI}25` }}>
        <div style={{ fontSize: 9, color: SUBTLE, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>Prevision J+30</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>62 400 €</div>
        <div style={{ fontSize: 10, color: GR, marginTop: 4 }}>+8% par rapport au mois dernier</div>
      </div>
    </div>
  )
}

/* ── VOICE MOCKUP ── */
function VoiceMockup() {
  const [step, setStep] = useState(0)
  const script = ['Bonjour, cabinet du Dr. Martin. Je vous ecoute.', 'Bonjour, j\'aimerais prendre rendez-vous.', 'Bien sur. Lundi 14h ou mardi 10h ?', 'Lundi 14h, parfait merci.', 'C\'est note. A lundi !']
  const speakers = [false, true, false, true, false]
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % script.length), 2000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <div style={{ fontSize: 9, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Conversation en cours</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
        <AnimatePresence>
          {script.slice(0, step + 1).map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: speakers[i] ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EZ }}
              style={{ display: 'flex', justifyContent: speakers[i] ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '9px 13px', borderRadius: 12, background: speakers[i] ? 'rgba(255,255,255,0.07)' : VI, fontSize: 12, color: speakers[i] ? MUTED : '#fff', lineHeight: 1.5 }}>
                {!speakers[i] && <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginBottom: 3, letterSpacing: '0.08em' }}>IA VANIVERT</div>}
                {line}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[['faster-whisper', 'STT'], ['Mistral 7B', 'LLM'], ['XTTS-v2', 'TTS']].map(([n, t]) => (
          <div key={n} style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 10, color: TEXT, fontWeight: 500 }}>{n}</div>
            <div style={{ fontSize: 8, color: SUBTLE, letterSpacing: '0.08em' }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PRICING (combined services + individual) ── */
function Pricing({ cms }: { cms: CMS }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [selected, setSelected] = useState<string[]>([])

  const plans = [
    { id: 'voice', name: cms.p1_name, price: cms.p1_price, annual: '16', desc: cms.p1_desc, items: cms.p1_items, color: GR },
    { id: 'business', name: cms.p2_name, price: cms.p2_price, annual: '24', desc: cms.p2_desc, items: cms.p2_items, color: VI, highlight: true },
    { id: 'compliance', name: cms.p3_name, price: cms.p3_price, annual: '1 000', desc: cms.p3_desc, items: cms.p3_items, color: EM },
  ]

  const combos = [
    { id: 'combo1', name: 'Voix + Conformite', desc: 'E-facturation et reception d\'appels', plans: ['voice', 'compliance'], price: '1 190', saving: '29 EUR economies' },
    { id: 'combo2', name: 'Business + Conformite', desc: 'PME complete — tout inclus', plans: ['business', 'compliance'], price: '1 199', saving: '30 EUR economies', highlight: true },
    { id: 'combo3', name: 'Tout Vanivert', desc: 'Les 3 modules au meilleur tarif', plans: ['voice', 'business', 'compliance'], price: '1 209', saving: '39 EUR economies' },
  ]

  return (
    <section id="tarifs" style={{ background: BG2, padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.12em', fontFamily: 'system-ui', textTransform: 'uppercase' as const, marginBottom: 12 }}>Tarifs</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 44px)', color: TEXT, marginBottom: 10, marginTop: 0, letterSpacing: '-0.025em' }}>{cms.pricing_h2}</h2>
          <p style={{ fontSize: 15, color: MUTED, fontFamily: 'system-ui', marginBottom: 24 }}>{cms.pricing_sub}</p>
          {/* Monthly / annual toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 980, padding: 4, gap: 4 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding: '7px 20px', borderRadius: 980, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13, fontWeight: 500, transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)', background: billing === b ? '#fff' : 'transparent', color: billing === b ? BG : MUTED }}>
                {b === 'monthly' ? 'Mensuel' : 'Annuel  -17%'}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Individual plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
          {plans.map((plan, i) => (
            <FadeUp key={plan.id} delay={i * 0.08}>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.25 }}
                style={{ padding: '28px 24px', borderRadius: 18, background: plan.highlight ? VI : CARD, border: `1px solid ${plan.highlight ? 'rgba(99,102,241,0.5)' : BORDER}`, display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: plan.highlight ? `0 0 60px ${VI}20` : 'none' }}>
                {plan.highlight && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: EM, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 12px', borderRadius: 980, fontFamily: 'system-ui', letterSpacing: '0.08em', whiteSpace: 'nowrap' as const }}>LE PLUS POPULAIRE</div>}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: plan.highlight ? '#fff' : TEXT, marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.6)' : SUBTLE, fontFamily: 'system-ui' }}>{plan.desc}</div>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: 36, color: plan.highlight ? '#fff' : TEXT, letterSpacing: '-0.04em' }}>
                    {billing === 'annual' ? plan.annual : plan.price} €
                  </span>
                  <span style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.55)' : SUBTLE, marginLeft: 6, fontFamily: 'system-ui' }}>/mois HT</span>
                </div>
                <div style={{ flex: 1, marginBottom: 20 }}>
                  {plan.items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: 9, marginBottom: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: plan.highlight ? '#86EFAC' : GR, flexShrink: 0, fontSize: 11, fontFamily: 'system-ui', fontWeight: 700, marginTop: 1 }}>ok</span>
                      <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.78)' : MUTED, lineHeight: 1.45, fontFamily: 'system-ui' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="/demo" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 980, background: plan.highlight ? '#fff' : 'rgba(255,255,255,0.07)', color: plan.highlight ? VI : TEXT, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)', fontFamily: 'system-ui', transition: 'all 0.25s' }}>
                  Essayer gratuitement
                </a>
                {plan.highlight && <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 8, fontFamily: 'system-ui' }}>Sans carte bancaire</div>}
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Combo packs */}
        <FadeUp delay={0.2}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: SUBTLE, fontFamily: 'system-ui', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Ou combinez les services et economisez</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {combos.map(combo => (
              <motion.div key={combo.id} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}
                style={{ padding: '22px 20px', borderRadius: 14, background: combo.highlight ? 'rgba(99,102,241,0.12)' : CARD, border: `1px solid ${combo.highlight ? 'rgba(99,102,241,0.3)' : BORDER}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: TEXT }}>{combo.name}</div>
                <div style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui' }}>{combo.desc}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                  {combo.plans.map(p => {
                    const pl = plans.find(pl => pl.id === p)
                    return pl ? <span key={p} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 980, background: `${pl.color}18`, color: pl.color, fontFamily: 'system-ui', fontWeight: 600 }}>{pl.name}</span> : null
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', letterSpacing: '-0.03em' }}>{combo.price} €</span>
                    <span style={{ fontSize: 11, color: SUBTLE, fontFamily: 'system-ui', marginLeft: 6 }}>/mois</span>
                  </div>
                  <span style={{ fontSize: 10, color: GR, fontFamily: 'system-ui', fontWeight: 600 }}>{combo.saving}</span>
                </div>
                <a href="/demo" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 980, background: combo.highlight ? VI : 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 12, textDecoration: 'none', border: combo.highlight ? 'none' : '1px solid rgba(255,255,255,0.10)', fontFamily: 'system-ui', transition: 'all 0.25s', marginTop: 4 }}>
                  Choisir ce pack
                </a>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ── BLOG ── */
const POSTS = [
  { slug: 'e-facturation-2026-guide-bretagne', title: 'E-facturation 2026 : ce qui change pour vos factures', date: '27 juin 2026', cat: 'Conformite', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80', excerpt: "Calendrier, obligations, amendes. Ce que vous devez faire avant le 1er septembre." },
  { slug: 'appels-manques-artisans-bretagne', title: 'Chaque appel manque, c\'est un client chez le voisin', date: '27 juin 2026', cat: 'Voix IA', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80', excerpt: "Un plombier a Lannion perd en moyenne 18 000 EUR par an. On a fait le calcul." },
  { slug: 'annuaire-centralise-dgfip-piege', title: "Signer avec une PA, ce n'est pas suffisant. Voila pourquoi.", date: '27 juin 2026', cat: 'Conformite', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80', excerpt: "L'annuaire centralise DGFiP, c'est la deuxieme etape. Celle que 90% oublient." },
]

function Blog() {
  return (
    <section style={{ background: BG, padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.12em', fontFamily: 'system-ui', textTransform: 'uppercase' as const, marginBottom: 10 }}>Blog</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(22px, 2.8vw, 34px)', color: TEXT, marginBottom: 0, marginTop: 0, letterSpacing: '-0.02em', fontStyle: 'italic' }}>Lire avant de s'y prendre trop tard.</h2>
            </div>
            <a href="/blog" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 6 }}>Tous les articles →</a>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {POSTS.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.08}>
              <a href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 16, overflow: 'hidden', background: CARD, border: `1px solid ${BORDER}`, transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1), border-color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = BORDER2 }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = BORDER }}>
                <div style={{ height: 170, overflow: 'hidden', position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} loading="lazy" />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(5,6,8,0.7)', borderRadius: 6, padding: '3px 10px', fontSize: 9, fontWeight: 600, color: TEXT, fontFamily: 'system-ui', letterSpacing: '0.06em', backdropFilter: 'blur(8px)' }}>{post.cat}</div>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ fontSize: 10, color: SUBTLE, fontFamily: 'system-ui', marginBottom: 8 }}>{post.date}</div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 15, color: TEXT, lineHeight: 1.4, marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em', fontStyle: 'italic' }}>{post.title}</h3>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: 0, fontFamily: 'system-ui' }}>{post.excerpt}</p>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CONTACT ── */
function Contact({ cms }: { cms: CMS }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    if (SB_URL && SB_KEY) {
      await fetch(`${SB_URL}/rest/v1/calculator_leads`, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ email, company_name: company, created_at: new Date().toISOString() }),
      }).catch(() => {})
    }
    await new Promise(r => setTimeout(r, 500))
    setSent(true)
    setLoading(false)
  }
  return (
    <section id="contact" style={{ background: BG2, padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <p style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.12em', fontFamily: 'system-ui', textTransform: 'uppercase' as const, marginBottom: 14 }}>Contact</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 48px)', color: TEXT, marginBottom: 12, marginTop: 0, letterSpacing: '-0.03em', fontStyle: 'italic' }}>{cms.contact_h2}</h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 36, fontFamily: 'system-ui' }}>{cms.contact_sub}</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          {sent ? (
            <div style={{ padding: '18px', borderRadius: 12, background: `${GR}15`, border: `1px solid ${GR}30`, color: GR, fontFamily: 'system-ui', fontSize: 14 }}>
              Recu ! On vous rappelle dans les 24 heures.
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ type: 'email', value: email, set: setEmail, ph: 'vous@entreprise.fr', label: 'Email' }, { type: 'text', value: company, set: setCompany, ph: 'Nom de votre entreprise', label: 'Entreprise' }].map(({ type, value, set, ph }) => (
                <input key={ph} type={type} value={value} onChange={e => set(e.target.value)} placeholder={ph} required={type === 'email'}
                  style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: TEXT, fontSize: 14, fontFamily: 'system-ui', outline: 'none', transition: 'border-color 0.25s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              ))}
              <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: 12, background: '#fff', color: BG, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                {loading ? '...' : cms.hero_cta1}
              </button>
            </form>
          )}
          <div style={{ marginTop: 24, fontSize: 12, color: SUBTLE, fontFamily: 'system-ui' }}>
            Ou par email : <a href={`mailto:${cms.company_email}`} style={{ color: MUTED, textDecoration: 'none', fontFamily: 'system-ui' }}>{cms.company_email}</a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
function Footer({ cms }: { cms: CMS }) {
  const cols = [
    { h: 'Produit', links: [['E-facturation DGFiP', '#facturation'], ['Smart CFO', '#cfo'], ['Reception vocale', '#voix'], ['Tarifs', '#tarifs'], ['Dashboard', '/dashboard']] },
    { h: 'Ressources', links: [['Blog', '/blog'], ['Calculateur', '/calculateur'], ['Contact', '#contact'], ['Administration', '/admin']] },
    { h: 'Legal', links: [['Mentions legales', '/legal/mentions-legales'], ['CGV', '/legal/cgv'], ['Confidentialite', '/legal/confidentialite']] },
  ]
  return (
    <footer style={{ background: '#030405', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 32px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>v</span>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: TEXT }}>vanivert</span>
            </div>
            <p style={{ fontSize: 13, color: SUBTLE, lineHeight: 1.7, maxWidth: 240, marginBottom: 16, fontFamily: 'system-ui' }}>{cms.footer_tagline}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'system-ui', marginBottom: 4 }}>{cms.company_siret}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'system-ui' }}>{cms.company_address}</p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: SUBTLE, marginBottom: 14, textTransform: 'uppercase' as const, fontFamily: 'system-ui' }}>{col.h}</div>
              {col.links.map(([l, h]) => (
                <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', marginBottom: 9, fontFamily: 'system-ui', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'system-ui' }}>2026 Vanivert.</span>
          <a href={`mailto:${cms.company_email}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', fontFamily: 'system-ui' }}>{cms.company_email}</a>
        </div>
      </div>
    </footer>
  )
}

/* ── MAIN ── */
export default function Home() {
  const cms = useCMS()
  return (
    <>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;background:${BG}}
        body{background:${BG};overflow-x:hidden;color:${TEXT};font-family:system-ui,-apple-system,sans-serif}
        input::placeholder{color:rgba(255,255,255,0.2)}
        .nav-links{display:flex}
        .mob-nav{display:none}
        @media(max-width:860px){
          .nav-links{display:none!important}
          .mob-nav{display:block!important}
        }
        @media(max-width:768px){
          section>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
          section>div[style*="grid-template-columns: 2fr"]{grid-template-columns:1fr!important}
          section>div[style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr!important}
        }
      `}</style>
      <Nav />
      <main>
        <Hero cms={cms} />
        <ClientLogos cms={cms} />
        <ModulePills cms={cms} />
        <ProductSection label={cms.s1_label} h2={cms.s1_h2} body={cms.s1_body} badge={cms.s1_badge} badgeColor={GR} anchor="facturation" mockup={<InvoiceMockup />} />
        <ProductSection label={cms.s2_label} h2={cms.s2_h2} body={cms.s2_body} badge={cms.s2_badge} badgeColor={VI} anchor="cfo" mockup={<CfoMockup />} flip />
        <ProductSection label={cms.s3_label} h2={cms.s3_h2} body={cms.s3_body} badge={cms.s3_badge} badgeColor={EM} anchor="voix" mockup={<VoiceMockup />} />
        <Pricing cms={cms} />
        <Blog />
        <Contact cms={cms} />
      </main>
      <Footer cms={cms} />
      <a href="https://wa.me/33745644541" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, width: 48, height: 48, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.35)', textDecoration: 'none', fontSize: 22 }}>
        💬
      </a>
    </>
  )
}
