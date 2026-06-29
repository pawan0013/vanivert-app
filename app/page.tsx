'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────
   DESIGN DIRECTION:
   Scene: A French CFO reads this at 9am, at their
   desk, on a bright screen, before a board meeting.
   They need precision and trust, not flash.

   Palette: Deep forest ink (#0F1A14) + chalk (#F5F3EE)
   + institutional blue (#1A4480) + urgent amber (#C9640A)
   Typography: Fraunces (display, editorial weight) +
   IBM Plex Mono (data, labels) + System UI (body)
   Strategy: Committed — the forest ink carries 60%
   of the surface. Anti-reflex: not navy+gold, not
   dark+neon, not cream+terracotta.
   Signature: The regulatory countdown clock in the hero
   ticks in real time — actual seconds until Sept 1 2026.
───────────────────────────────────────────────── */

const INK    = '#0F1A14'
const CHALK  = '#F5F3EE'
const CHALK2 = '#EAE8E2'
const BLUE   = '#1A4480'
const BLUE2  = '#12316A'
const AMBER  = '#C9640A'
const AMBER2 = '#A0500A'
const GREEN  = '#1C6B3E'
const MIST   = '#8B9E94'
const MIST2  = '#6B7D73'
const BORDER = 'rgba(15,26,20,0.10)'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/* ── Live countdown to Sept 1 2026 ── */
function useCountdown() {
  const target = new Date('2026-09-01T00:00:00+02:00').getTime()
  const [t, setT] = useState(target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setT(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const s = Math.max(0, Math.floor(t / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

/* ── Lead capture ── */
async function saveLead(data: { email: string; siret?: string; company?: string }) {
  if (!SB_URL || !SB_KEY) return
  await fetch(`${SB_URL}/rest/v1/calculator_leads`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ email: data.email, siret: data.siret || '', company_name: data.company || '', created_at: new Date().toISOString() }),
  }).catch(() => {})
}

/* ── Type ── */
function Typed({ strings, speed = 60 }: { strings: string[]; speed?: number }) {
  const [si, setSi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  const s = strings[si]
  useEffect(() => {
    const id = setTimeout(() => {
      if (!del) {
        if (ci < s.length) setCi(c => c + 1)
        else { setTimeout(() => setDel(true), 1800) }
      } else {
        if (ci > 0) setCi(c => c - 1)
        else { setDel(false); setSi(i => (i + 1) % strings.length) }
      }
    }, del ? speed / 2 : speed)
    return () => clearTimeout(id)
  }, [ci, del, s, speed, strings.length])
  return <span>{s.slice(0, ci)}<span style={{ borderRight: '2px solid currentColor', animation: 'blink 1s step-end infinite' }}>&nbsp;</span></span>
}

/* ── INTEGRATIONS (14 logos) ── */
const LOGOS = [
  { name: 'Qonto', ab: 'Q', bg: '#1B2C7A', cat: 'Banque PSD2' },
  { name: 'Bridge API', ab: 'Br', bg: '#0B3D6B', cat: 'Open Banking' },
  { name: 'Pennylane', ab: 'PL', bg: '#1A3DA8', cat: 'Comptabilite' },
  { name: 'Docoon PA', ab: 'D', bg: '#4A1A8A', cat: 'E-facturation' },
  { name: 'Chorus Pro', ab: 'Ch', bg: '#0F4A28', cat: 'Secteur public' },
  { name: 'Doctolib', ab: 'Dt', bg: '#0B3D6B', cat: 'Agenda' },
  { name: 'Microsoft 365', ab: 'MS', bg: '#1B3A6B', svgType: 'microsoft', cat: 'OAuth' },
  { name: 'Google', ab: 'G', bg: '#2C2C2C', svgType: 'google', cat: 'OAuth' },
  { name: 'Stripe', ab: 'St', bg: '#2A1A8A', cat: 'Paiements' },
  { name: 'GoCardless', ab: 'Gc', bg: '#0B4A3D', cat: 'SEPA' },
  { name: 'Sage 100', ab: 'Sg', bg: '#0F4A1A', cat: 'ERP' },
  { name: 'Cegid XRP', ab: 'Cd', bg: '#6B2A0B', cat: 'ERP' },
  { name: 'n8n', ab: 'n8', bg: '#7A3A0A', cat: 'Automation' },
  { name: 'Salesforce', ab: 'Sf', bg: '#0B3A5A', cat: 'CRM' },
]

function MSIcon({ s = 16 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 21 21"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
}
function GIcon({ s = 16 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
}

function LogoReel() {
  const tripled = [...LOGOS, ...LOGOS, ...LOGOS]
  return (
    <div style={{ overflow: 'hidden', position: 'relative', padding: '4px 0' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${CHALK}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${CHALK}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 10, animation: 'reel 40s linear infinite', width: 'max-content' }}>
        {tripled.map((logo, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, background: CHALK2, border: `1px solid ${BORDER}`, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: logo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {logo.svgType === 'microsoft' ? <MSIcon s={14} /> : logo.svgType === 'google' ? <GIcon s={14} /> : <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'IBM Plex Mono, monospace' }}>{logo.ab}</span>}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: INK, fontFamily: 'system-ui, sans-serif' }}>{logo.name}</div>
              <div style={{ fontSize: 10, color: MIST, fontFamily: 'IBM Plex Mono, monospace' }}>{logo.cat}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── COUNTDOWN BLOCK ── */
function CountdownClock() {
  const { days, hours, mins, secs } = useCountdown()
  const pads = (n: number) => String(n).padStart(2, '0')
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: AMBER, borderRadius: 12, padding: '14px 24px', fontFamily: 'IBM Plex Mono, monospace' }}>
      {[['jours', days], ['h', hours], ['min', mins], ['sec', secs]].map(([label, val], i) => (
        <span key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px', borderRight: i < 3 ? `1px solid rgba(255,255,255,0.25)` : undefined }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{pads(val as number)}</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{label}</span>
        </span>
      ))}
      <span style={{ marginLeft: 16, fontSize: 12, color: 'rgba(255,255,255,0.85)', maxWidth: 120, lineHeight: 1.4, fontFamily: 'system-ui, sans-serif' }}>avant la deadline DGFiP e-facturation</span>
    </div>
  )
}

/* ── NAV ── */
function Nav({ lang, setLang }: { lang: 'fr' | 'en'; setLang: (l: 'fr' | 'en') => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mOpen, setMOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = lang === 'fr'
    ? [['Smart CFO', '#cfo'], ['Conformite', '#conformite'], ['Reception vocale', '#voice'], ['Tarifs', '#tarifs'], ['Blog', '/blog'], ['Contact', '#contact']]
    : [['Smart CFO', '#cfo'], ['Compliance', '#conformite'], ['Voice', '#voice'], ['Pricing', '#tarifs'], ['Blog', '/blog'], ['Contact', '#contact']]
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s', background: scrolled ? `${CHALK}F2` : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE, boxShadow: `0 0 0 2px ${BLUE}44` }} />
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 20, color: INK, letterSpacing: '-0.03em' }}>vanivert</span>
        </a>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="desktop-nav">
          {links.map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 13, fontWeight: 500, color: MIST2, textDecoration: 'none', padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = INK)}
              onMouseLeave={e => (e.currentTarget.style.color = MIST2)}>
              {label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, padding: '5px 10px', borderRadius: 7, border: `1px solid ${BORDER}`, background: 'transparent', color: MIST2, cursor: 'pointer', letterSpacing: '0.06em' }}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <a href="/dashboard" style={{ fontSize: 12, fontWeight: 600, color: MIST2, textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER}`, borderRadius: 8 }}>Dashboard</a>
          <a href="/login" style={{ fontSize: 12, fontWeight: 600, color: MIST2, textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER}`, borderRadius: 8 }}>
            {lang === 'fr' ? 'Connexion' : 'Sign in'}
          </a>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 20px', borderRadius: 9, background: BLUE, boxShadow: `0 2px 8px ${BLUE}44` }}>
            {lang === 'fr' ? 'Essai gratuit' : 'Free trial'}
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ── HERO ── */
function Hero({ lang }: { lang: 'fr' | 'en' }) {
  const t = lang === 'fr' ? {
    eyebrow: 'Infrastructure financiere souveraine',
    h1a: 'Le 1er septembre 2026,',
    h1b: ['la facture papier disparait.', "l'annuaire DGFiP est obligatoire.", 'les PME non conformes paient.'],
    sub: 'Smart CFO + conformite e-facturation + reception vocale IA. Tout inclus. Heberge en Europe.',
    cta1: 'Calculer mon risque', cta2: 'Voir le dashboard',
    facture: 'FACTURE', client: 'Client', montant: 'Montant HT', tva: 'TVA 20%', total: 'Total TTC', conforme: 'Conforme DGFiP',
    prevision: 'PREVISION J+30', prevVal: '+8 200 €',
  } : {
    eyebrow: 'Sovereign financial infrastructure',
    h1a: 'September 1st, 2026:',
    h1b: ['paper invoices disappear.', 'DGFiP directory is mandatory.', 'non-compliant SMEs pay fines.'],
    sub: 'Smart CFO + DGFiP e-invoicing compliance + AI voice reception. All included. Hosted in Europe.',
    cta1: 'Calculate my risk', cta2: 'See dashboard',
    facture: 'INVOICE', client: 'Client', montant: 'Amount ex. VAT', tva: 'VAT 20%', total: 'Total incl. VAT', conforme: 'DGFiP Compliant',
    prevision: 'D+30 FORECAST', prevVal: '+8,200 EUR',
  }
  return (
    <section style={{ minHeight: '100dvh', background: INK, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 32px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,243,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,238,0.03) 1px, transparent 1px)`, backgroundSize: '64px 64px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 980, border: `1px solid rgba(245,243,238,0.15)`, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(245,243,238,0.6)', letterSpacing: '0.08em' }}>{t.eyebrow.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 52px)', color: CHALK, lineHeight: 1.08, marginBottom: 20, marginTop: 0, letterSpacing: '-0.03em' }}>
            {t.h1a}<br />
            <span style={{ color: AMBER }}><Typed strings={t.h1b} /></span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(245,243,238,0.6)', lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>{t.sub}</p>
          <div style={{ marginBottom: 40 }}>
            <CountdownClock />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, background: BLUE, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 4px 20px ${BLUE}55` }}>
              {t.cta1} &rarr;
            </a>
            <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, border: `1px solid rgba(245,243,238,0.2)`, color: 'rgba(245,243,238,0.8)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              {t.cta2}
            </a>
          </div>
        </motion.div>
        {/* Invoice mockup */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative' }}>
          <div style={{ background: CHALK, borderRadius: 18, padding: '28px 32px', boxShadow: `0 40px 80px rgba(0,0,0,0.5)`, fontFamily: 'IBM Plex Mono, monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 9, color: MIST, letterSpacing: '0.12em', marginBottom: 4 }}>{t.facture}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>#2026-0847</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 980, background: '#DCFCE7', border: '1px solid #86EFAC' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', letterSpacing: '0.06em' }}>{t.conforme}</span>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              {[[t.client, 'PROLANN SAS'], [t.montant, '4 200,00 €'], [t.tva, '840,00 €'], [t.total, '5 040,00 €']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
                  <span style={{ color: MIST2 }}>{k}</span>
                  <span style={{ fontWeight: k === t.total ? 700 : 400, color: INK }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#EFF6FF', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: BLUE, fontFamily: 'system-ui, sans-serif' }}>
              Transmis via Docoon PDP n°0001 - SIRET valide SIRENE INSEE
            </div>
          </div>
          {/* Forecast badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
            style={{ position: 'absolute', bottom: -20, left: -20, background: GREEN, borderRadius: 12, padding: '12px 16px', fontFamily: 'IBM Plex Mono, monospace', boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: 3 }}>{t.prevision}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{t.prevVal}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── SOCIAL PROOF BAR ── */
function TrustBar({ lang }: { lang: 'fr' | 'en' }) {
  const items = lang === 'fr'
    ? ['Heberge sur Hetzner Frankfurt', 'Conforme RGPD Art. 28', 'PA Docoon DGFiP n°0001', 'Donnees jamais hors UE', 'Chiffrement AES-256', 'ISO 27001 en cours']
    : ['Hosted on Hetzner Frankfurt', 'GDPR Art. 28 compliant', 'PA Docoon DGFiP n°0001', 'Data never leaves EU', 'AES-256 encryption', 'ISO 27001 in progress']
  return (
    <section style={{ background: CHALK2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '16px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'reel 30s linear infinite', width: 'max-content' }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace', color: MIST2, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── FEATURES ── */
function Features({ lang }: { lang: 'fr' | 'en' }) {
  const t = lang === 'fr' ? {
    label: 'POURQUOI VANIVERT',
    h2: 'Trois problemes que vos concurrents ignorent encore.',
    features: [
      { n: '01', title: 'E-facturation DGFiP 2026', body: 'Enrolement annuaire centralise, generation Factur-X, validation CIUS-FR, connexion Docoon PA n°0001. Nous gerons tout avant la deadline du 1er septembre.', stat: '2-4 semaines', statLabel: 'delai d\'enrolement annuaire' },
      { n: '02', title: 'Smart CFO souverain', body: 'Tresorerie en temps reel via Bridge PSD2, previsions J+30/60/90 avec FinGPT, conformite CIUS-FR automatique. Herberge sur Hetzner Frankfurt. Aucune donnee en dehors de l\'UE.', stat: '99.8%', statLabel: 'uptime 30 derniers jours' },
      { n: '03', title: 'Reception vocale IA 24h/24', body: 'faster-whisper + Mistral 7B + XTTS-v2. Repond en francais naturel, reserve dans Doctolib, informe l\'appelant. Latence P95 inferieure a 1 200 ms.', stat: '<1 200 ms', statLabel: 'latence P95 STT+LLM+TTS' },
    ]
  } : {
    label: 'WHY VANIVERT',
    h2: 'Three problems your competitors still ignore.',
    features: [
      { n: '01', title: 'DGFiP e-invoicing 2026', body: 'Central directory enrollment, Factur-X generation, CIUS-FR validation, Docoon PA n°0001 connection. We handle everything before the September 1st deadline.', stat: '2-4 weeks', statLabel: 'directory enrollment delay' },
      { n: '02', title: 'Sovereign Smart CFO', body: 'Real-time treasury via Bridge PSD2, D+30/60/90 forecasts with FinGPT, automatic CIUS-FR compliance. Hosted on Hetzner Frankfurt. No data outside the EU.', stat: '99.8%', statLabel: 'uptime last 30 days' },
      { n: '03', title: '24/7 AI voice reception', body: 'faster-whisper + Mistral 7B + XTTS-v2. Answers in natural French, books in Doctolib, informs the caller. P95 latency below 1,200 ms.', stat: '<1,200 ms', statLabel: 'P95 latency STT+LLM+TTS' },
    ]
  }
  return (
    <section id="cfo" style={{ background: CHALK, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: MIST, marginBottom: 12 }}>{t.label}</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(26px, 3vw, 40px)', color: INK, lineHeight: 1.15, marginBottom: 0, marginTop: 0, maxWidth: 540, letterSpacing: '-0.025em' }}>{t.h2}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {t.features.map((f, i) => (
            <motion.div key={f.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '36px 32px', background: i % 2 === 1 ? CHALK2 : CHALK, borderRadius: 0, border: `1px solid ${BORDER}`, position: 'relative' }}>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 48, fontWeight: 900, color: `${BLUE}14`, lineHeight: 1, marginBottom: 20, letterSpacing: '-0.04em' }}>{f.n}</div>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 20, color: INK, marginBottom: 14, marginTop: 0, lineHeight: 1.25, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: MIST2, lineHeight: 1.75, marginBottom: 24, marginTop: 0 }}>{f.body}</p>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 22, color: BLUE, letterSpacing: '-0.02em' }}>{f.stat}</div>
                <div style={{ fontSize: 11, color: MIST, fontFamily: 'IBM Plex Mono, monospace', marginTop: 4, letterSpacing: '0.04em' }}>{f.statLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── INTEGRATIONS SECTION ── */
function IntegrationsSection({ lang }: { lang: 'fr' | 'en' }) {
  const t = lang === 'fr'
    ? { label: 'INTEGRATIONS', h2: '14 connexions actives. Aucune configuration.', sub: 'Vanivert s\'integre directement avec votre stack existant.' }
    : { label: 'INTEGRATIONS', h2: '14 active connections. Zero configuration.', sub: 'Vanivert plugs directly into your existing stack.' }
  return (
    <section id="integrations" style={{ background: INK, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', marginBottom: 40 }}>
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: 'rgba(245,243,238,0.35)', marginBottom: 12 }}>{t.label}</div>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', color: CHALK, marginBottom: 8, marginTop: 0, letterSpacing: '-0.025em' }}>{t.h2}</h2>
        <p style={{ fontSize: 14, color: 'rgba(245,243,238,0.5)', maxWidth: 480 }}>{t.sub}</p>
      </div>
      <LogoReel />
    </section>
  )
}

/* ── VOICE SECTION ── */
function VoiceSection({ lang }: { lang: 'fr' | 'en' }) {
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const script = lang === 'fr'
    ? ['Bonjour, Cabinet Dr. Martin.', 'Bonjour, je voudrais un rendez-vous.', 'Bien sur. Lundi 14h ou mardi 10h ?', 'Lundi 14h parfait merci.', 'C\'est confirme. A lundi !']
    : ['Hello, Dr. Martin\'s practice.', 'Hi, I\'d like to book an appointment.', 'Of course. Monday 2pm or Tuesday 10am?', 'Monday 2pm please, thank you.', 'Confirmed. See you Monday!']
  const speakers = [false, true, false, true, false]
  const t = lang === 'fr'
    ? { label: 'RECEPTION VOCALE IA', h2: 'Votre assistante repond. Toujours.', sub: 'Pendant vos interventions, vos soins, votre service. Chaque appel est traite.', play: 'Ecouter une demonstration', stop: 'Arreter', stat1: '67%', stat1l: 'taux de conversion', stat2: '<1 200ms', stat2l: 'latence P95', stat3: '24h/24', stat3l: '7j/7' }
    : { label: 'AI VOICE RECEPTION', h2: 'Your assistant answers. Always.', sub: 'During your interventions, consultations, service. Every call is handled.', play: 'Listen to a demo', stop: 'Stop', stat1: '67%', stat1l: 'conversion rate', stat2: '<1,200ms', stat2l: 'P95 latency', stat3: '24h/7', stat3l: '7 days a week' }

  function toggle() {
    if (playing) { setPlaying(false); setProgress(0); setStep(0); return }
    setPlaying(true); setProgress(0); setStep(0)
    let p = 0
    const id = setInterval(() => {
      p++; setProgress(p)
      setStep(Math.min(Math.floor(p / 20), script.length - 1))
      if (p >= 100) { clearInterval(id); setPlaying(false); setProgress(0); setStep(0) }
    }, 50)
  }

  return (
    <section id="voice" style={{ background: CHALK, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: MIST, marginBottom: 12 }}>{t.label}</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 38px)', color: INK, marginBottom: 14, marginTop: 0, lineHeight: 1.15, letterSpacing: '-0.025em' }}>{t.h2}</h2>
          <p style={{ fontSize: 15, color: MIST2, lineHeight: 1.75, marginBottom: 32 }}>{t.sub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
            {[[t.stat1, t.stat1l], [t.stat2, t.stat2l], [t.stat3, t.stat3l]].map(([v, l]) => (
              <div key={l} style={{ padding: '16px', background: CHALK2, borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 20, color: BLUE, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 11, color: MIST, fontFamily: 'IBM Plex Mono, monospace' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 9, background: playing ? AMBER : BLUE, color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
              {playing ? '■' : '▶'} {playing ? t.stop : t.play}
            </button>
            {playing && (
              <div style={{ flex: 1, height: 4, background: CHALK2, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: AMBER, borderRadius: 2, transition: 'width 0.05s linear' }} />
              </div>
            )}
          </div>
        </div>
        {/* Demo dialogue */}
        <div style={{ background: INK, borderRadius: 20, padding: '28px 24px', boxShadow: `0 24px 64px rgba(15,26,20,0.2)` }}>
          <div style={{ fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em', color: 'rgba(245,243,238,0.3)', marginBottom: 16 }}>CONVERSATION EN DIRECT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
            {(playing ? script.slice(0, step + 1) : script).map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: speakers[i] ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', justifyContent: speakers[i] ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, background: speakers[i] ? 'rgba(245,243,238,0.08)' : BLUE, fontSize: 13, color: speakers[i] ? 'rgba(245,243,238,0.7)' : '#fff', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                  {!speakers[i] && <div style={{ fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(255,255,255,0.5)', marginBottom: 4, letterSpacing: '0.06em' }}>ASSISTANTE IA</div>}
                  {line}
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(245,243,238,0.08)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['faster-whisper', 'STT'], ['Mistral 7B', 'LLM'], ['XTTS-v2', 'TTS'], ['Hetzner DE', 'Infra']].map(([n, l]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(245,243,238,0.8)', fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 9, color: 'rgba(245,243,238,0.3)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PRICING ── */
function Pricing({ lang }: { lang: 'fr' | 'en' }) {
  const t = lang === 'fr' ? {
    label: 'TARIFS', h2: 'Simple. Tout inclus.', sub: 'Aucun module supplementaire. Aucune surprise.',
    mo: '/mois HT', year: 'Annuel', perYear: '/mois (annuel)',
    plans: [
      { name: 'Voice Starter', price: 19, annual: 16, desc: 'Reception vocale IA 24h/24', items: ['Numero +33 dedié', 'IA vocale française', 'Agenda Doctolib / Google Cal', '200 min incluses/mois', 'RGPD conforme', 'Support email'] },
      { name: 'Voice Business', price: 29, annual: 24, desc: 'Pour les PME 5-50 employes', items: ['Tout Voice Starter', '500 min incluses/mois', 'Integrations ERP (Sage, Cegid)', 'Reporting mensuel', 'Support prioritaire'], highlight: true },
      { name: 'Conformite DGFiP', price: 1200, annual: 1000, desc: 'E-facturation + Smart CFO', items: ['Enrolement annuaire centralise', 'Generation Factur-X automatique', 'Smart CFO + PSD2 bancaire', 'Alertes reglementaires grcx', 'Dedicated account manager'] },
    ],
    cta: 'Demarrer', ctaHighlight: 'Essai gratuit 30 jours', free: 'Aucune CB requise',
  } : {
    label: 'PRICING', h2: 'Simple. All-inclusive.', sub: 'No extra modules. No surprises.',
    mo: '/month excl. VAT', year: 'Annual', perYear: '/month (annual)',
    plans: [
      { name: 'Voice Starter', price: 19, annual: 16, desc: '24/7 AI voice reception', items: ['Dedicated +33 number', 'French AI voice', 'Doctolib / Google Calendar', '200 min included/month', 'GDPR compliant', 'Email support'] },
      { name: 'Voice Business', price: 29, annual: 24, desc: 'For SMEs 5-50 employees', items: ['Everything in Voice Starter', '500 min included/month', 'ERP integrations (Sage, Cegid)', 'Monthly reporting', 'Priority support'], highlight: true },
      { name: 'DGFiP Compliance', price: 1200, annual: 1000, desc: 'E-invoicing + Smart CFO', items: ['Central directory enrollment', 'Automatic Factur-X generation', 'Smart CFO + PSD2 banking', 'grcx regulatory alerts', 'Dedicated account manager'] },
    ],
    cta: 'Get started', ctaHighlight: '30-day free trial', free: 'No credit card required',
  }
  return (
    <section id="tarifs" style={{ background: INK, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: 'rgba(245,243,238,0.35)', marginBottom: 12 }}>{t.label}</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(26px, 3vw, 40px)', color: CHALK, marginBottom: 8, marginTop: 0, letterSpacing: '-0.025em' }}>{t.h2}</h2>
          <p style={{ fontSize: 15, color: 'rgba(245,243,238,0.5)' }}>{t.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {t.plans.map((plan) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ padding: '32px 28px', borderRadius: 16, background: plan.highlight ? BLUE : 'rgba(245,243,238,0.05)', border: `1px solid ${plan.highlight ? 'transparent' : 'rgba(245,243,238,0.10)'}`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: AMBER, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 14px', borderRadius: 980, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>RECOMMANDE</div>}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 18, color: plan.highlight ? '#fff' : CHALK, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'rgba(245,243,238,0.45)', fontFamily: 'IBM Plex Mono, monospace' }}>{plan.desc}</div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 36, color: plan.highlight ? '#fff' : CHALK, letterSpacing: '-0.03em' }}>{plan.price.toLocaleString('fr-FR')} €</span>
                <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(245,243,238,0.4)', marginLeft: 6, fontFamily: 'IBM Plex Mono, monospace' }}>{t.mo}</span>
              </div>
              <div style={{ flex: 1, marginBottom: 24 }}>
                {plan.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: plan.highlight ? '#86EFAC' : GREEN, flexShrink: 0, fontSize: 13, fontWeight: 700 }}>ok</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.8)' : 'rgba(245,243,238,0.6)', lineHeight: 1.4, fontFamily: 'system-ui, sans-serif' }}>{item}</span>
                  </div>
                ))}
              </div>
              <a href="/demo" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 9, background: plan.highlight ? '#fff' : 'rgba(245,243,238,0.08)', color: plan.highlight ? BLUE : CHALK, fontWeight: 700, fontSize: 13, textDecoration: 'none', border: plan.highlight ? 'none' : `1px solid rgba(245,243,238,0.15)`, transition: 'all 0.2s' }}>
                {plan.highlight ? t.ctaHighlight : t.cta} &rarr;
              </a>
              {plan.highlight && <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 8, fontFamily: 'IBM Plex Mono, monospace' }}>{t.free}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── COMPLIANCE SECTION ── */
function ComplianceSection({ lang }: { lang: 'fr' | 'en' }) {
  const { days } = useCountdown()
  const t = lang === 'fr' ? {
    label: 'CONFORMITE DGFIP', h2: `${days} jours pour vous conformer. Nous l'avons fait pour des dizaines de PME bretonnes.`,
    items: [
      { id: 'FR-EFACT-001', label: 'Enrolement annuaire centralise DGFiP', note: 'Inclus - 2 a 4 semaines', done: true },
      { id: 'FR-EFACT-002', label: 'Connexion Plateforme Agreee (Docoon n°0001)', note: 'Inclus - activation immediate', done: true },
      { id: 'FR-CIUS-001', label: 'Validation SIRET via API SIRENE INSEE', note: 'Automatique sur chaque facture', done: true },
      { id: 'FR-EFACT-003', label: 'Statuts cycle de vie (Deposee / Encaissee)', note: 'Retournes en temps reel vers votre ERP', done: true },
      { id: 'FR-EFACT-004', label: 'Format Factur-X (PDF/A-3 + CII XML)', note: 'Genere depuis vos donnees actuelles', done: true },
      { id: 'FR-RGPD-001', label: 'DPA sous-traitants conforme RGPD Art. 28', note: 'Signe avec Supabase IE + Hetzner DE', done: true },
    ],
    cta: 'Verifier ma conformite maintenant'
  } : {
    label: 'DGFIP COMPLIANCE', h2: `${days} days to comply. We've done it for dozens of French SMEs.`,
    items: [
      { id: 'FR-EFACT-001', label: 'DGFiP central directory enrollment', note: 'Included - 2 to 4 weeks', done: true },
      { id: 'FR-EFACT-002', label: 'Certified Platform connection (Docoon n°0001)', note: 'Included - immediate activation', done: true },
      { id: 'FR-CIUS-001', label: 'SIRET validation via INSEE SIRENE API', note: 'Automatic on every invoice', done: true },
      { id: 'FR-EFACT-003', label: 'Lifecycle statuses (Deposee / Encaissee)', note: 'Returned in real-time to your ERP', done: true },
      { id: 'FR-EFACT-004', label: 'Factur-X format (PDF/A-3 + CII XML)', note: 'Generated from your current data', done: true },
      { id: 'FR-RGPD-001', label: 'GDPR Art. 28 DPA with all sub-processors', note: 'Signed with Supabase IE + Hetzner DE', done: true },
    ],
    cta: 'Check my compliance now'
  }
  return (
    <section id="conformite" style={{ background: CHALK2, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: MIST, marginBottom: 12 }}>{t.label}</div>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(22px, 2.5vw, 34px)', color: INK, maxWidth: 600, lineHeight: 1.2, marginBottom: 0, marginTop: 0, letterSpacing: '-0.025em' }}>{t.h2}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 40 }}>
          {t.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: CHALK, borderRadius: 10, border: `1px solid ${BORDER}`, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#DCFCE7', border: '1.5px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#16A34A', fontWeight: 700, flexShrink: 0 }}>ok</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 3, fontFamily: 'system-ui, sans-serif' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: MIST, fontFamily: 'IBM Plex Mono, monospace' }}>{item.note}</div>
              </div>
            </div>
          ))}
        </div>
        <a href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, background: AMBER, color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: `0 4px 16px ${AMBER}44` }}>
          {t.cta} &rarr;
        </a>
      </div>
    </section>
  )
}

/* ── CONTACT SECTION ── */
function Contact({ lang }: { lang: 'fr' | 'en' }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = lang === 'fr'
    ? { label: 'CONTACT', h2: 'Parlez a un humain.', sub: 'Pas un chatbot. Un fondateur qui a deploye cette stack sur 200+ interviews terrain.', emailPlaceholder: 'vous@entreprise.fr', companyPlaceholder: 'Nom de votre entreprise', cta: 'Etre contacte sous 24h', sent: 'Recu. On vous rappelle sous 24h.', direct: 'Ou directement :' }
    : { label: 'CONTACT', h2: 'Talk to a human.', sub: 'Not a chatbot. A founder who deployed this stack across 200+ field interviews.', emailPlaceholder: 'you@company.com', companyPlaceholder: 'Your company name', cta: 'Get a call back within 24h', sent: 'Got it. We\'ll call you back within 24h.', direct: 'Or directly:' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await saveLead({ email, company })
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
    setLoading(false)
  }

  return (
    <section id="contact" style={{ background: INK, padding: '100px 32px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', color: 'rgba(245,243,238,0.35)', marginBottom: 12 }}>{t.label}</div>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, fontSize: 'clamp(28px, 3vw, 44px)', color: CHALK, marginBottom: 12, marginTop: 0, letterSpacing: '-0.03em' }}>{t.h2}</h2>
        <p style={{ fontSize: 15, color: 'rgba(245,243,238,0.5)', lineHeight: 1.7, marginBottom: 40 }}>{t.sub}</p>
        {sent ? (
          <div style={{ padding: '20px 28px', borderRadius: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14 }}>
            {t.sent}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPlaceholder}
              style={{ padding: '14px 18px', borderRadius: 10, border: `1.5px solid rgba(245,243,238,0.12)`, background: 'rgba(245,243,238,0.05)', color: CHALK, fontSize: 14, fontFamily: 'system-ui, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = 'rgba(245,243,238,0.12)')} />
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder={t.companyPlaceholder}
              style={{ padding: '14px 18px', borderRadius: 10, border: `1.5px solid rgba(245,243,238,0.12)`, background: 'rgba(245,243,238,0.05)', color: CHALK, fontSize: 14, fontFamily: 'system-ui, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = BLUE)} onBlur={e => (e.target.style.borderColor = 'rgba(245,243,238,0.12)')} />
            <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: 10, background: AMBER, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'system-ui, sans-serif' }}>
              {loading ? '...' : t.cta}
            </button>
          </form>
        )}
        <div style={{ marginTop: 32, fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>
          {t.direct} <a href="mailto:contact@vanivert.fr" style={{ color: 'rgba(245,243,238,0.7)', textDecoration: 'none', fontFamily: 'IBM Plex Mono, monospace' }}>contact@vanivert.fr</a>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
function Footer({ lang }: { lang: 'fr' | 'en' }) {
  const cols = lang === 'fr' ? [
    { h: 'Produit', links: [['Smart CFO', '#cfo'], ['Conformite', '#conformite'], ['Reception vocale', '#voice'], ['Tarifs', '#tarifs'], ['Dashboard', '/dashboard']] },
    { h: 'Ressources', links: [['Blog', '/blog'], ['Calculateur', '/calculateur'], ['Contact', '#contact'], ['Documentation', '/blog']] },
    { h: 'Legal', links: [['Mentions legales', '/legal/mentions-legales'], ['CGV', '/legal/cgv'], ['Confidentialite', '/legal/confidentialite']] },
  ] : [
    { h: 'Product', links: [['Smart CFO', '#cfo'], ['Compliance', '#conformite'], ['Voice', '#voice'], ['Pricing', '#tarifs'], ['Dashboard', '/dashboard']] },
    { h: 'Resources', links: [['Blog', '/blog'], ['Calculator', '/calculateur'], ['Contact', '#contact'], ['Documentation', '/blog']] },
    { h: 'Legal', links: [['Legal Notice', '/legal/mentions-legales'], ['Terms', '/legal/cgv'], ['Privacy', '/legal/confidentialite']] },
  ]
  return (
    <footer style={{ background: `${INK}F8`, borderTop: `1px solid rgba(245,243,238,0.08)`, padding: '56px 32px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: BLUE }} />
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 18, color: CHALK, letterSpacing: '-0.03em' }}>vanivert</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)', lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
              {lang === 'fr' ? 'Infrastructure financiere souveraine pour les PME francaises. 100% heberge en Europe.' : 'Sovereign financial infrastructure for French SMEs. 100% hosted in Europe.'}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['RGPD', 'Hetzner DE', 'Supabase IE', 'grcx', 'Pxtly'].map(tag => (
                <span key={tag} style={{ fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', padding: '3px 8px', borderRadius: 5, background: 'rgba(245,243,238,0.05)', border: `1px solid rgba(245,243,238,0.10)`, color: 'rgba(245,243,238,0.35)' }}>{tag}</span>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em', color: 'rgba(245,243,238,0.3)', marginBottom: 16 }}>{col.h.toUpperCase()}</div>
              {col.links.map(([label, href]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'rgba(245,243,238,0.45)', textDecoration: 'none', marginBottom: 10, fontFamily: 'system-ui, sans-serif', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = CHALK)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,238,0.45)')}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid rgba(245,243,238,0.08)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(245,243,238,0.25)' }}>
            2026 Vanivert. SIRET en cours.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['contact@vanivert.fr', 'mailto:contact@vanivert.fr'], ['vanivert.fr', 'https://vanivert.fr']].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: 'rgba(245,243,238,0.35)', textDecoration: 'none' }}>{l}</a>
            ))}
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400&family=IBM+Plex+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      <Nav lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <TrustBar lang={lang} />
      <Features lang={lang} />
      <IntegrationsSection lang={lang} />
      <VoiceSection lang={lang} />
      <ComplianceSection lang={lang} />
      <Pricing lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
      {/* WhatsApp */}
      <a href="https://wa.me/33745644541" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, width: 52, height: 52, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', textDecoration: 'none', fontSize: 24 }}>
        💬
      </a>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes reel { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        *{box-sizing:border-box; margin:0; padding:0}
        html{scroll-behavior:smooth}
        input::placeholder{color:rgba(245,243,238,0.25)}
        body{background:${CHALK}}
        @media(max-width:768px){
          .desktop-nav{display:none!important}
        }
      `}</style>
    </>
  )
}
