'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

/* =========================================================
   DESIGN: Sequence-inspired dark hero + Parker cream body
   Fonts: Instrument Serif (display) + Inter (body) + JetBrains Mono (data)
   Hero: deep #080C10 with grain texture + glowing accent orbs
   Body: warm cream #F9F7F4
   Accent: electric violet #5B4CF5 + amber #E8840A
   Integrations: floating orbit animation (Lattice-style)
   Features: tabbed product UI (Parker-style)
   NO em dashes, NO AI text boxes, NO gradient text
   ========================================================= */

const D = '#080C10'
const D2 = '#0F1419'
const D3 = '#161D26'
const CREAM = '#F9F7F4'
const CREAM2 = '#F0EDE8'
const CREAM3 = '#E8E3DB'
const VI = '#5B4CF5'    /* violet */
const VI2 = '#4338CA'
const VIL = 'rgba(91,76,245,0.15)'
const AM = '#E8840A'    /* amber */
const GR = '#16A34A'    /* green */
const INK = '#0D1117'
const MID = '#6B7280'
const BORDER_D = 'rgba(255,255,255,0.08)'
const BORDER_L = 'rgba(13,17,23,0.10)'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/* ── Fonts injected in component ── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
`

/* ── Live countdown ── */
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

/* ── Supabase lead capture ── */
async function saveLead(email: string, company = '') {
  if (!SB_URL || !SB_KEY) return
  await fetch(`${SB_URL}/rest/v1/calculator_leads`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ email, company_name: company, created_at: new Date().toISOString() }),
  }).catch(() => {})
}

/* ── INTEGRATIONS DATA ── */
const INTEGRATIONS = [
  { name: 'Qonto', ab: 'Q', bg: '#1B2FA0', cat: 'Banque PSD2' },
  { name: 'Bridge', ab: 'Br', bg: '#0B3D6B', cat: 'Open Banking' },
  { name: 'Pennylane', ab: 'PL', bg: '#2563EB', cat: 'Comptabilite' },
  { name: 'Docoon', ab: 'PA', bg: '#7C3AED', cat: 'DGFiP' },
  { name: 'Chorus Pro', ab: 'Ch', bg: '#166534', cat: 'Secteur public' },
  { name: 'Doctolib', ab: 'Dt', bg: '#B91C1C', cat: 'Agenda' },
  { name: 'Microsoft', ab: 'MS', bg: '#1B3A8A', cat: 'OAuth', ms: true },
  { name: 'Google', ab: 'G', bg: '#1F2937', cat: 'OAuth', gg: true },
  { name: 'Stripe', ab: 'St', bg: '#4F46E5', cat: 'Paiements' },
  { name: 'GoCardless', ab: 'Gc', bg: '#065F46', cat: 'SEPA' },
  { name: 'Sage 100', ab: 'Sg', bg: '#166534', cat: 'ERP' },
  { name: 'Cegid', ab: 'Cd', bg: '#92400E', cat: 'ERP' },
  { name: 'n8n', ab: 'n8', bg: '#854D0E', cat: 'Automation' },
  { name: 'Salesforce', ab: 'Sf', bg: '#0C4A6E', cat: 'CRM' },
]

function MsIcon() {
  return <svg width="16" height="16" viewBox="0 0 21 21"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
}
function GgIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
}

/* ── Orbit integration animation ── */
function OrbitIntegrations() {
  const center = INTEGRATIONS.slice(0, 8)
  const outer = INTEGRATIONS.slice(8)
  return (
    <div style={{ position: 'relative', width: 440, height: 440, flexShrink: 0 }}>
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '30%', left: '30%', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${VI}30 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${AM}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
      {/* Orbit rings */}
      {[140, 190].map(r => (
        <div key={r} style={{ position: 'absolute', top: '50%', left: '50%', width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', animation: `spin${r} ${r === 140 ? 20 : 28}s linear infinite` }} />
      ))}
      {/* Center logo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #5B4CF5, #4338CA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${VI}66`, zIndex: 10 }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 22, color: '#fff', fontStyle: 'italic' }}>v</span>
      </div>
      {/* Inner orbit logos */}
      {center.map((int, i) => {
        const angle = (i / center.length) * 2 * Math.PI
        const r = 140
        const x = Math.cos(angle) * r + 220 - 22
        const y = Math.sin(angle) * r + 220 - 22
        return (
          <motion.div key={int.name}
            style={{ position: 'absolute', left: x, top: y, width: 44, height: 44, borderRadius: 12, background: int.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', cursor: 'default', zIndex: 5 }}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            title={int.name}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: -i * 2.5 }}
          >
            <motion.div animate={{ rotate: [0, -360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: -i * 2.5 }}>
              {int.ms ? <MsIcon /> : int.gg ? <GgIcon /> : (
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11, color: '#fff' }}>{int.ab}</span>
              )}
            </motion.div>
          </motion.div>
        )
      })}
      {/* Outer orbit logos */}
      {outer.map((int, i) => {
        const angle = (i / outer.length) * 2 * Math.PI - Math.PI / outer.length
        const r = 190
        const x = Math.cos(angle) * r + 220 - 22
        const y = Math.sin(angle) * r + 220 - 22
        return (
          <motion.div key={int.name}
            style={{ position: 'absolute', left: x, top: y, width: 44, height: 44, borderRadius: 12, background: int.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', cursor: 'default', zIndex: 4 }}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            title={int.name}
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: -i * 3.5 }}
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: -i * 3.5 }}>
              {int.ms ? <MsIcon /> : int.gg ? <GgIcon /> : (
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11, color: '#fff' }}>{int.ab}</span>
              )}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── NAV ── */
function Nav({ lang, setLang }: { lang: string; setLang: (l: 'fr' | 'en') => void }) {
  const [sc, setSc] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const h = () => setSc(window.scrollY > 32)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = lang === 'fr'
    ? [['Smart CFO', '#cfo'], ['Conformite', '#conformite'], ['Voix', '#voix'], ['Tarifs', '#tarifs'], ['Blog', '/blog']]
    : [['Smart CFO', '#cfo'], ['Compliance', '#conformite'], ['Voice', '#voix'], ['Pricing', '#tarifs'], ['Blog', '/blog']]
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', background: sc ? 'rgba(8,12,16,0.92)' : 'transparent', backdropFilter: sc ? 'blur(16px)' : 'none', borderBottom: sc ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent', transition: 'all 0.3s' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${VI}, ${VI2})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, color: '#fff', fontStyle: 'italic' }}>v</span>
        </div>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 19, color: '#fff', letterSpacing: '-0.01em' }}>vanivert</span>
      </a>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="nav-links">
        {links.map(([label, href]) => (
          <a key={label} href={href} style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
            {label}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '0.06em' }}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <a href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '6px 14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{lang === 'fr' ? 'Connexion' : 'Sign in'}</a>
        <a href="/demo" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, background: VI, boxShadow: `0 2px 12px ${VI}55`, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = VI2 }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = VI }}>
          {lang === 'fr' ? 'Essai gratuit' : 'Free trial'}
        </a>
      </div>
    </nav>
  )
}

/* ── HERO ── */
function Hero({ lang }: { lang: string }) {
  const { days, hours, mins, secs } = useCountdown()
  const pad = (n: number) => String(n).padStart(2, '0')
  const [phrase, setPhrase] = useState(0)
  const phrases = lang === 'fr'
    ? ['vos factures PDF ne passent plus.', "l'annuaire DGFiP est obligatoire.", 'les PME non conformes paient 15 000 EUR.']
    : ['paper invoices stop working.', 'DGFiP directory enrollment is mandatory.', 'non-compliant SMEs pay 15,000 EUR.']
  useEffect(() => {
    const id = setInterval(() => setPhrase(p => (p + 1) % phrases.length), 3500)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <section style={{ minHeight: '100vh', background: D, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: 80 }}>
      {/* Noise grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '256px 256px', pointerEvents: 'none', zIndex: 0 }} />
      {/* Glow backdrop */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '80%', borderRadius: '50%', background: `radial-gradient(ellipse, ${VI}18 0%, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '40%', height: '60%', borderRadius: '50%', background: `radial-gradient(ellipse, ${AM}10 0%, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 480px', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          {/* Eyebrow pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 8px', borderRadius: 980, background: 'rgba(91,76,245,0.15)', border: `1px solid ${VI}40`, marginBottom: 28 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: VI, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#fff' }}>AI</span>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em' }}>
              {lang === 'fr' ? 'INFRASTRUCTURE FINANCIERE SOUVERAINE EU' : 'SOVEREIGN EU FINANCIAL INFRASTRUCTURE'}
            </span>
          </div>
          {/* Headline */}
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(36px, 4.5vw, 58px)', color: '#fff', lineHeight: 1.1, marginBottom: 16, marginTop: 0, letterSpacing: '-0.02em' }}>
            {lang === 'fr' ? 'Le 1er septembre,' : 'September 1st,'}
            <br />
            <AnimatePresence mode="wait">
              <motion.span key={phrase} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}
                style={{ color: AM, display: 'inline-block', fontStyle: 'italic' }}>
                {phrases[phrase]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 480, marginBottom: 36, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            {lang === 'fr'
              ? 'Smart CFO, conformite e-facturation DGFiP et reception vocale IA. Tout inclus. Heberge en Europe.'
              : 'Smart CFO, DGFiP e-invoicing compliance, and AI voice reception. All included. Hosted in Europe.'}
          </p>
          {/* Live countdown */}
          <div style={{ display: 'inline-flex', alignItems: 'stretch', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '16px 20px', gap: 0, marginBottom: 36, fontFamily: 'JetBrains Mono, monospace' }}>
            {[[pad(days), lang === 'fr' ? 'JOURS' : 'DAYS'], [pad(hours), 'HRS'], [pad(mins), 'MIN'], [pad(secs), 'SEC']].map(([v, l], i) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 14px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : undefined }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>{v}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginTop: 4 }}>{l}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, maxWidth: 120 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>
                {lang === 'fr' ? 'deadline DGFiP e-facturation' : 'DGFiP e-invoicing deadline'}
              </span>
            </div>
          </div>
          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 10, background: VI, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'Inter, sans-serif', boxShadow: `0 4px 20px ${VI}50`, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${VI}60` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${VI}50` }}>
              {lang === 'fr' ? 'Calculer mon risque' : 'Calculate my risk'} &rarr;
            </a>
            <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontSize: 14, textDecoration: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)' }}>
              {lang === 'fr' ? 'Voir le dashboard' : 'See dashboard'}
            </a>
          </div>
        </motion.div>
        {/* Orbit */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center' }} className="orbit-wrap">
          <OrbitIntegrations />
        </motion.div>
      </div>
      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to bottom, transparent, ${D})`, pointerEvents: 'none' }} />
    </section>
  )
}

/* ── SCROLLING TRUST TICKER ── */
function Ticker({ lang }: { lang: string }) {
  const items = lang === 'fr'
    ? ['Heberge Hetzner Frankfurt', 'RGPD Art. 28', 'PA Docoon DGFiP n°0001', 'Zero donnee hors UE', 'AES-256', 'ARCEP declare', 'Supabase EU-West', 'ISO 27001 en cours']
    : ['Hosted Hetzner Frankfurt', 'GDPR Art. 28', 'PA Docoon DGFiP n°0001', 'Zero data outside EU', 'AES-256', 'ARCEP declared', 'Supabase EU-West', 'ISO 27001 in progress']
  return (
    <div style={{ background: D2, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'ticker 25s linear infinite', width: 'max-content' }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: GR, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── FEATURES (tabbed like Parker) ── */
const FEATURES_DATA = {
  fr: [
    {
      id: 'facturation',
      tab: 'E-facturation DGFiP',
      headline: 'On gere votre conformite DGFiP de A a Z.',
      body: "Vous signez avec une plateforme agreee et pensez etre pret. Ce n'est pas suffisant. L'enrolement dans l'annuaire centralise DGFiP prend 2 a 4 semaines. Une PME qui s'y prend le 15 aout ne sera pas conforme au 1er septembre. Vanivert gere tout : l'enrolement, la generation Factur-X, la validation CIUS-FR, les statuts de cycle de vie.",
      stat: '2-4 semaines', statLabel: "delai annuaire DGFiP si vous faites seul",
      badge: 'Inclus dans tous les plans',
      badgeColor: GR,
      items: ['Enrolement annuaire centralise DGFiP', 'Connection Docoon PA n°0001', 'Generation Factur-X (PDF/A-3)', 'Validation SIRET via SIRENE INSEE', 'Statuts cycle de vie temps reel'],
    },
    {
      id: 'cfo',
      tab: 'Smart CFO',
      headline: 'Votre tresorerie, en temps reel, hebergee en France.',
      body: "Bridge API PSD2 synchronise vos comptes Qonto, BNP, Credit Agricole automatiquement. FinGPT calcule vos previsions J+30, J+60, J+90. grcx surveille DGFiP, CNIL, AMF, ACPR et ARCEP en continu. Toutes vos donnees restent sur des serveurs allemands. Jamais sur AWS ou Google Cloud.",
      stat: '99.8%', statLabel: 'uptime 30 derniers jours',
      badge: 'A partir de 1 200 EUR/mois',
      badgeColor: VI,
      items: ['Tresorerie PSD2 (Qonto, BNP, CA)', 'Previsions J+30 / J+60 / J+90 avec FinGPT', 'Alertes reglementaires grcx en temps reel', 'Conformite CIUS-FR automatique', 'Hebergement Hetzner Frankfurt exclusivement'],
    },
    {
      id: 'voix',
      tab: 'Reception vocale IA',
      headline: 'Vous ratez des appels. On les prend a votre place.',
      body: "Un hotel de 20 chambres a Perros-Guirec rate facilement 8 appels par jour en juillet. A 90 EUR la nuit, c'est 720 EUR perdus chaque jour. 50 400 EUR sur la saison. Notre IA vocale repond en francais naturel 24h/24, reserve directement dans Doctolib ou Google Calendar, et laisse un message structure quand necesaire.",
      stat: '<1 200ms', statLabel: 'latence P95 STT + LLM + TTS',
      badge: 'A partir de 19 EUR/mois',
      badgeColor: AM,
      items: ['Reponse en francais naturel 24h/24', 'Reservation directe dans Doctolib', 'faster-whisper v3 + Mistral 7B Instruct', 'XTTS-v2 synthese vocale naturelle', 'Conforme RGPD (consentement touche 1)'],
    },
  ],
  en: [
    {
      id: 'facturation',
      tab: 'DGFiP e-invoicing',
      headline: 'We handle your DGFiP compliance from A to Z.',
      body: "You sign with a certified platform and think you're ready. That's not enough. Enrollment in the DGFiP central directory takes 2 to 4 weeks. An SME that starts on August 15th won't be compliant by September 1st. Vanivert handles everything: enrollment, Factur-X generation, CIUS-FR validation, lifecycle statuses.",
      stat: '2-4 weeks', statLabel: 'DGFiP directory delay if you do it yourself',
      badge: 'Included in all plans',
      badgeColor: GR,
      items: ['DGFiP central directory enrollment', 'Docoon PA n°0001 connection', 'Factur-X generation (PDF/A-3)', 'SIRET validation via INSEE SIRENE', 'Real-time lifecycle statuses'],
    },
    {
      id: 'cfo',
      tab: 'Smart CFO',
      headline: 'Your treasury, real-time, hosted in Europe.',
      body: "Bridge API PSD2 auto-syncs your Qonto, BNP, Credit Agricole accounts. FinGPT computes D+30, D+60, D+90 forecasts. grcx monitors DGFiP, CNIL, AMF, ACPR and ARCEP continuously. All your data stays on German servers. Never on AWS or Google Cloud.",
      stat: '99.8%', statLabel: 'uptime last 30 days',
      badge: 'From 1,200 EUR/month',
      badgeColor: VI,
      items: ['PSD2 treasury (Qonto, BNP, CA)', 'D+30/60/90 forecasts with FinGPT', 'Real-time grcx regulatory alerts', 'Automatic CIUS-FR compliance', 'Hetzner Frankfurt hosting exclusively'],
    },
    {
      id: 'voix',
      tab: 'AI Voice Reception',
      headline: "You're missing calls. We take them for you.",
      body: "A 20-room hotel in Perros-Guirec easily misses 8 calls per day in July. At 90 EUR per night, that's 720 EUR lost every day. 50,400 EUR over the season. Our AI voice answers in natural French 24/7, books directly in Doctolib or Google Calendar, and leaves structured messages when needed.",
      stat: '<1,200ms', statLabel: 'P95 latency STT + LLM + TTS',
      badge: 'From 19 EUR/month',
      badgeColor: AM,
      items: ['24/7 natural French answers', 'Direct Doctolib booking', 'faster-whisper v3 + Mistral 7B Instruct', 'XTTS-v2 natural voice synthesis', 'GDPR compliant (key 1 consent)'],
    },
  ]
}

function Features({ lang }: { lang: string }) {
  const [active, setActive] = useState(0)
  const features = (FEATURES_DATA as Record<string, typeof FEATURES_DATA.fr>)[lang] || FEATURES_DATA.fr
  const f = features[active]
  return (
    <section id="cfo" style={{ background: CREAM, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', color: MID, marginBottom: 12, textTransform: 'uppercase' as const }}>
            {lang === 'fr' ? 'POURQUOI VANIVERT' : 'WHY VANIVERT'}
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(26px, 3vw, 40px)', color: INK, marginBottom: 0, marginTop: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {lang === 'fr' ? 'Trois problemes que vos concurrents ignorent encore.' : 'Three problems your competitors still ignore.'}
          </h2>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' as const }}>
          {features.map((feat, i) => (
            <button key={feat.id} onClick={() => setActive(i)}
              style={{ padding: '9px 22px', borderRadius: 980, border: `1px solid ${active === i ? VI : BORDER_L}`, background: active === i ? VI : 'transparent', color: active === i ? '#fff' : MID, fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}>
              {feat.tab}
            </button>
          ))}
        </div>
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 980, background: `${f.badgeColor}18`, border: `1px solid ${f.badgeColor}40`, marginBottom: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: f.badgeColor }} />
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: f.badgeColor, fontWeight: 600 }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(22px, 2.5vw, 32px)', color: INK, marginBottom: 14, marginTop: 0, lineHeight: 1.25, letterSpacing: '-0.02em' }}>{f.headline}</h3>
              <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.75, marginBottom: 28, fontFamily: 'Inter, sans-serif' }}>{f.body}</p>
              <div style={{ marginBottom: 28 }}>
                {f.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: `${f.badgeColor}18`, border: `1px solid ${f.badgeColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 9, color: f.badgeColor, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>ok</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <a href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: f.badgeColor, textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                {lang === 'fr' ? 'En savoir plus' : 'Learn more'} &rarr;
              </a>
            </div>
            {/* Product UI mockup */}
            <div style={{ background: D, borderRadius: 20, padding: '28px', boxShadow: '0 32px 64px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
                {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' as const }}>
                VANIVERT SMART CFO - {f.tab.toUpperCase()}
              </div>
              {active === 0 && (
                <div>
                  {[['FAC-2026-089', 'ABC Distribution', '4 200 EUR', 'Conforme', GR], ['FAC-2026-090', 'Hotel Ker Buhe', '285 EUR', 'Conforme', GR], ['FAC-2026-091', 'Dr. Martin', '228 EUR', 'A generer', AM], ['FAC-2026-092', 'MECA ARMOR', '1 200 EUR', 'Paye', 'rgba(255,255,255,0.3)']].map(([id, client, amount, status, color]) => (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{id}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>{client}</div>
                      </div>
                      <div style={{ textAlign: 'right' as const }}>
                        <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#fff', fontWeight: 700 }}>{amount}</div>
                        <div style={{ fontSize: 9, color: color as string, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{status as string}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: `${GR}15`, border: `1px solid ${GR}30`, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: GR }}>
                    SIRET valides SIRENE: 100% - Annuaire DGFiP: Enrole
                  </div>
                </div>
              )}
              {active === 1 && (
                <div>
                  {[['Qonto', '12 847 EUR', GR], ['BNP Paribas', '34 200 EUR', GR], ['Credit Agricole', '8 150 EUR', GR]].map(([name, bal, c]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>{name}</span>
                      <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: c as string }}>{bal}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: `${VI}15`, border: `1px solid ${VI}30` }}>
                    <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>PREVISION J+30</div>
                    <div style={{ fontSize: 20, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#fff' }}>62 400 EUR</div>
                    <div style={{ fontSize: 10, color: GR, fontFamily: 'JetBrains Mono, monospace' }}>+8% vs mois precedent</div>
                  </div>
                </div>
              )}
              {active === 2 && (
                <div>
                  {[['+33 6 12 34 56 78', '4m 12s', 'RESERVE', GR], ['+33 1 43 67 89 01', '2m 48s', 'TRANSFERE', AM], ['+33 6 98 76 54 32', '1m 05s', 'MESSAGE', 'rgba(255,255,255,0.4)'], ['+33 4 91 23 45 67', '5m 33s', 'RESERVE', GR]].map(([num, dur, status, c]) => (
                    <div key={num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)' }}>{num}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>{dur}</div>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: c as string, padding: '2px 8px', borderRadius: 4, background: `${c as string}15` }}>{status as string}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: `${AM}15`, border: `1px solid ${AM}30`, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: AM }}>
                    Latence P95: &lt;1 200ms - faster-whisper v3 + Mistral 7B
                  </div>
                </div>
              )}
              <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: `${f.badgeColor}` }} />
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.25)', marginTop: 8, textAlign: 'center' as const }}>
                {f.stat} {f.statLabel}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ── COMPLIANCE SECTION ── */
function Compliance({ lang }: { lang: string }) {
  const { days } = useCountdown()
  const t = {
    fr: {
      label: 'CONFORMITE DGFIP 2026',
      headline: `${days} jours. La moitie des PME bretonnes n'a pas encore commence.`,
      sub: "L'enrolement dans l'annuaire centralise DGFiP prend 2 a 4 semaines. Une entreprise qui signe avec une plateforme agreee le 15 aout sera non-conforme au 1er septembre. Vanivert gere tout ca pour vous.",
      items: [['Enrolement annuaire centralise DGFiP', 'Inclus - 2 a 4 semaines de traitement'], ['Connexion Plateforme Agreee Docoon n°0001', 'Activation en 48h'], ['Generation Factur-X automatique', 'Depuis votre Sage, Cegid ou Excel'], ['Validation CIUS-FR sur chaque facture', 'SIRET, TVA, coherence mathematique'], ['DPA RGPD Art. 28 avec sous-traitants', 'Signe avec Supabase IE et Hetzner DE'], ['Alertes reglementaires grcx', 'DGFiP, CNIL, AMF, ACPR, ARCEP en temps reel']],
      cta: 'Verifier ma conformite maintenant',
    },
    en: {
      label: 'DGFIP COMPLIANCE 2026',
      headline: `${days} days. Half of French SMEs haven't started yet.`,
      sub: "DGFiP central directory enrollment takes 2 to 4 weeks to process. A company that signs with a certified platform on August 15th will be non-compliant on September 1st. Vanivert handles all of this for you.",
      items: [['DGFiP central directory enrollment', 'Included - 2 to 4 weeks processing'], ['Docoon PA n°0001 connection', 'Activation within 48h'], ['Automatic Factur-X generation', 'From your Sage, Cegid or Excel'], ['CIUS-FR validation on every invoice', 'SIRET, VAT, mathematical consistency'], ['GDPR Art. 28 DPA with sub-processors', 'Signed with Supabase IE and Hetzner DE'], ['grcx regulatory alerts', 'DGFiP, CNIL, AMF, ACPR, ARCEP in real-time']],
      cta: 'Check my compliance now',
    },
  }
  const c = (t as Record<string, typeof t.fr>)[lang] || t.fr
  return (
    <section id="conformite" style={{ background: D3, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' as const }}>{c.label}</div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(24px, 2.8vw, 36px)', color: '#fff', marginBottom: 14, marginTop: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{c.headline}</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 32, fontFamily: 'Inter, sans-serif' }}>{c.sub}</p>
            <a href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 10, background: AM, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'Inter, sans-serif', boxShadow: `0 4px 20px ${AM}40` }}>
              {c.cta} &rarr;
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.items.map(([label, note]) => (
              <div key={label} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${GR}20`, border: `1px solid ${GR}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 8, color: GR, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>ok</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PRICING ── */
function Pricing({ lang }: { lang: string }) {
  const plans = {
    fr: [
      { name: 'Voice Starter', price: '19', mo: '/mois HT', desc: 'Pour artisans et praticiens independants', color: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', items: ['Numero +33 dedie', 'IA vocale francaise 24h/24', 'Agenda Doctolib ou Google Calendar', '200 min incluses par mois', 'RGPD conforme - hebergement EU'] },
      { name: 'Voice Business', price: '29', mo: '/mois HT', desc: 'Pour les PME de 5 a 50 employes', color: VI, textColor: '#fff', highlight: true, items: ['Tout Voice Starter', '500 min incluses par mois', 'Integrations ERP (Sage, Cegid)', 'Rapport mensuel automatique', 'Support prioritaire sous 4h'] },
      { name: 'Conformite DGFiP', price: '1 200', mo: '/mois HT', desc: 'E-facturation et Smart CFO complets', color: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', items: ['Enrolement annuaire DGFiP gere', 'Factur-X generation automatique', 'Smart CFO + PSD2 bancaire', 'Alertes reglementaires grcx', 'Account manager dedie'] },
    ],
    en: [
      { name: 'Voice Starter', price: '19', mo: '/month excl. VAT', desc: 'For independent artisans and practitioners', color: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', items: ['Dedicated +33 number', '24/7 French AI voice', 'Doctolib or Google Calendar booking', '200 min included per month', 'GDPR compliant - EU hosting'] },
      { name: 'Voice Business', price: '29', mo: '/month excl. VAT', desc: 'For SMEs with 5 to 50 employees', color: VI, textColor: '#fff', highlight: true, items: ['Everything in Voice Starter', '500 min included per month', 'ERP integrations (Sage, Cegid)', 'Automatic monthly report', 'Priority support under 4h'] },
      { name: 'DGFiP Compliance', price: '1,200', mo: '/month excl. VAT', desc: 'Complete e-invoicing and Smart CFO', color: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', items: ['DGFiP directory enrollment managed', 'Automatic Factur-X generation', 'Smart CFO + PSD2 banking', 'grcx regulatory alerts', 'Dedicated account manager'] },
    ],
  }
  const ps = (plans as Record<string, typeof plans.fr>)[lang] || plans.fr
  const label = lang === 'fr' ? 'TARIFS' : 'PRICING'
  const h2 = lang === 'fr' ? 'Simple. Tout inclus.' : 'Simple. All-inclusive.'
  const sub = lang === 'fr' ? 'Aucun module supplementaire. Aucune mauvaise surprise.' : 'No extra modules. No bad surprises.'
  const rec = lang === 'fr' ? 'RECOMMANDE' : 'RECOMMENDED'
  const free = lang === 'fr' ? 'Aucune CB requise' : 'No credit card required'
  const ctaH = lang === 'fr' ? 'Essai gratuit 30 jours' : '30-day free trial'
  const cta = lang === 'fr' ? 'Commencer' : 'Get started'
  return (
    <section id="tarifs" style={{ background: D, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' as const }}>{label}</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 42px)', color: '#fff', marginBottom: 8, marginTop: 0, letterSpacing: '-0.02em' }}>{h2}</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>{sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {ps.map((plan) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ padding: '32px 28px', borderRadius: 18, background: plan.color, border: `1px solid ${plan.highlight ? `${VI}60` : 'rgba(255,255,255,0.08)'}`, position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: plan.highlight ? `0 0 60px ${VI}25` : 'none' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: AM, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 14px', borderRadius: 980, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', whiteSpace: 'nowrap' as const }}>
                  {rec}
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 20, color: plan.highlight ? '#fff' : 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>{plan.desc}</div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 38, color: plan.highlight ? '#fff' : 'rgba(255,255,255,0.85)', letterSpacing: '-0.04em' }}>{plan.price} EUR</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>{plan.mo}</span>
              </div>
              <div style={{ flex: 1, marginBottom: 24 }}>
                {plan.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: plan.highlight ? '#86EFAC' : GR, flexShrink: 0, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, marginTop: 1 }}>ok</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', lineHeight: 1.45, fontFamily: 'Inter, sans-serif' }}>{item}</span>
                  </div>
                ))}
              </div>
              <a href="/demo" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 9, background: plan.highlight ? '#fff' : 'rgba(255,255,255,0.08)', color: plan.highlight ? VI : 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 13, textDecoration: 'none', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>
                {plan.highlight ? ctaH : cta} &rarr;
              </a>
              {plan.highlight && <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>{free}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── BLOG SECTION ── */
const BLOG_POSTS = [
  { slug: 'e-facturation-2026-guide-bretagne', title: 'E-facturation 2026 : le guide complet pour les entreprises de Bretagne', date: '27 juin 2026', cat: 'Conformite', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80', excerpt: "Tout ce que les PME des Cotes d'Armor doivent savoir avant le 1er septembre 2026." },
  { slug: 'appels-manques-artisans-bretagne', title: 'Artisans : combien perdez-vous par an a cause des appels manques ?', date: '27 juin 2026', cat: 'IA Vocale', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80', excerpt: "Un plombier a Lannion qui rate 3 appels par jour perd en moyenne 18 000 EUR par an." },
  { slug: 'annuaire-centralise-dgfip-piege', title: "L'annuaire centralise DGFiP : le piege que 90% des PME ne voient pas venir", date: '27 juin 2026', cat: 'Conformite', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80', excerpt: "Signer avec une plateforme agreee ne suffit pas. L'enrolement prend 2 a 4 semaines." },
]

function BlogSection({ lang }: { lang: string }) {
  const label = lang === 'fr' ? 'BLOG' : 'BLOG'
  const h2 = lang === 'fr' ? 'Lire, comprendre, agir.' : 'Read, understand, act.'
  const more = lang === 'fr' ? 'Voir tous les articles' : 'See all articles'
  return (
    <section style={{ background: CREAM, padding: '80px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', color: MID, marginBottom: 10, textTransform: 'uppercase' as const }}>{label}</div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(24px, 2.5vw, 36px)', color: INK, marginBottom: 0, marginTop: 0, letterSpacing: '-0.02em' }}>{h2}</h2>
          </div>
          <a href="/blog" style={{ fontSize: 13, fontWeight: 500, color: MID, textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
            {more} &rarr;
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {BLOG_POSTS.map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 16, overflow: 'hidden', background: CREAM2, border: `1px solid ${BORDER_L}`, transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
              <div style={{ height: 180, overflow: 'hidden', background: CREAM3, position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 600, color: INK, fontFamily: 'JetBrains Mono, monospace' }}>{post.cat}</div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 10, color: MID, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{post.date}</div>
                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 16, color: INK, lineHeight: 1.35, marginBottom: 8, marginTop: 0, letterSpacing: '-0.01em' }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: MID, lineHeight: 1.6, margin: 0, fontFamily: 'Inter, sans-serif' }}>{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CONTACT ── */
function Contact({ lang }: { lang: string }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = {
    fr: { label: 'CONTACT', h2: 'On vous rappelle. Vrai.', sub: 'Pas un chatbot. Un fondateur qui a parle a 200+ PME bretonnes.', ep: 'vous@entreprise.fr', cp: 'Nom de votre entreprise', cta: 'Etre contacte sous 24h', ok: 'Recu ! On vous rappelle sous 24h.', direct: 'Ou directement :' },
    en: { label: 'CONTACT', h2: "We'll call you back. Really.", sub: 'Not a chatbot. A founder who talked to 200+ French SMEs.', ep: 'you@company.com', cp: 'Your company name', cta: 'Get a call back within 24h', ok: "Got it! We'll call you back within 24h.", direct: 'Or directly:' },
  }
  const c = (t as Record<string, typeof t.fr>)[lang] || t.fr
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await saveLead(email, company)
    await new Promise(r => setTimeout(r, 500))
    setSent(true)
    setLoading(false)
  }
  return (
    <section id="contact" style={{ background: D, padding: '100px 32px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' as const }}>{c.label}</div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 'clamp(30px, 3.5vw, 48px)', color: '#fff', marginBottom: 12, marginTop: 0, letterSpacing: '-0.03em', lineHeight: 1.15 }}>{c.h2}</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 40, fontFamily: 'Inter, sans-serif' }}>{c.sub}</p>
        {sent ? (
          <div style={{ padding: '20px', borderRadius: 12, background: `${GR}15`, border: `1px solid ${GR}30`, color: '#4ADE80', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{c.ok}</div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={c.ep}
              style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = VI)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder={c.cp}
              style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = VI)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
            <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: 10, background: AM, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {loading ? '...' : c.cta}
            </button>
          </form>
        )}
        <div style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
          {c.direct} <a href="mailto:contact@vanivert.fr" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>contact@vanivert.fr</a>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
function Footer({ lang }: { lang: string }) {
  const cols = lang === 'fr' ? [
    { h: 'Produit', links: [['Smart CFO', '#cfo'], ['Conformite', '#conformite'], ['Reception vocale', '#voix'], ['Tarifs', '#tarifs'], ['Dashboard', '/dashboard']] },
    { h: 'Ressources', links: [['Blog', '/blog'], ['Calculateur', '/calculateur'], ['Contact', '#contact'], ['Administration', '/admin']] },
    { h: 'Legal', links: [['Mentions legales', '/legal/mentions-legales'], ['CGV', '/legal/cgv'], ['Confidentialite', '/legal/confidentialite']] },
  ] : [
    { h: 'Product', links: [['Smart CFO', '#cfo'], ['Compliance', '#conformite'], ['Voice', '#voix'], ['Pricing', '#tarifs'], ['Dashboard', '/dashboard']] },
    { h: 'Resources', links: [['Blog', '/blog'], ['Calculator', '/calculateur'], ['Contact', '#contact'], ['Admin', '/admin']] },
    { h: 'Legal', links: [['Legal Notice', '/legal/mentions-legales'], ['Terms', '/legal/cgv'], ['Privacy', '/legal/confidentialite']] },
  ]
  return (
    <footer style={{ background: '#050709', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 32px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${VI}, ${VI2})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 14, color: '#fff', fontStyle: 'italic' }}>v</span>
              </div>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 17, color: '#fff', letterSpacing: '-0.01em' }}>vanivert</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 240, marginBottom: 18, fontFamily: 'Inter, sans-serif' }}>
              {lang === 'fr' ? 'Infrastructure financiere souveraine pour les PME francaises. 100% heberge en Europe.' : 'Sovereign financial infrastructure for French SMEs. 100% hosted in Europe.'}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {['RGPD', 'Hetzner DE', 'Supabase IE', 'grcx', 'Pxtly'].map(tag => (
                <span key={tag} style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', padding: '3px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>{tag}</span>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: 14, textTransform: 'uppercase' as const }}>{col.h}</div>
              {col.links.map(([label, href]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 9, fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.2)' }}>
            2026 Vanivert. SIRET en cours.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="mailto:contact@vanivert.fr" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>contact@vanivert.fr</a>
            <a href="/legal/mentions-legales" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Mentions legales</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── MAIN ── */
export default function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  return (
    <>
      <style>{FONTS}</style>
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Ticker lang={lang} />
        <Features lang={lang} />
        <Compliance lang={lang} />
        <Pricing lang={lang} />
        <BlogSection lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <a href="https://wa.me/33745644541" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, width: 48, height: 48, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,211,102,0.4)', textDecoration: 'none', fontSize: 22 }}>
        💬
      </a>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
        @keyframes spin140 { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes spin190 { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(-360deg)} }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        html { scroll-behavior: smooth }
        body { background: #080C10; overflow-x: hidden }
        input::placeholder { color: rgba(255,255,255,0.2) }
        .nav-links { display: flex }
        @media (max-width: 900px) {
          .nav-links { display: none !important }
          .orbit-wrap { display: none !important }
          section > div { grid-template-columns: 1fr !important }
          section { padding: 64px 20px !important }
        }
        @media (max-width: 640px) {
          h1 { font-size: 32px !important }
          h2 { font-size: 24px !important }
        }
      `}</style>
    </>
  )
}
