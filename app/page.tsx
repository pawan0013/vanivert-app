'use client'
import dynamic from 'next/dynamic'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

const FluidBackground = dynamic(() => import('./FluidBackground'), { ssr: false })

// ── Fixed wave heights (no Math.random — prevents hydration mismatch) ──
const WAVE_HEIGHTS = [12,28,20,36,16,40,24,32,18,38,22,30,14,34,26,42,20,28,16,36,24,32,18,40,22,30,14,28]

// ── Animation variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
}
const slideLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
}
const slideRight = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
}

// ── Waveform (fixed heights — no hydration error) ────────────────
function Waveform({ dark = false }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 210 48" className="w-full h-12" fill="none">
      {WAVE_HEIGHTS.map((h, i) => (
        <rect
          key={i}
          x={i * 7.5 + 1}
          y={(48 - h) / 2}
          width={3.5}
          rx={2}
          height={h}
          fill={dark ? 'rgba(255,255,255,0.6)' : '#1F49B0'}
          opacity={0.7}
          style={{
            animation: `wave-bar 1.1s ease-in-out ${(i * 0.055).toFixed(3)}s infinite alternate`,
            transformOrigin: 'center',
          }}
        />
      ))}
      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.25); opacity: 0.25; }
          to   { transform: scaleY(1); opacity: 0.9; }
        }
      `}</style>
    </svg>
  )
}

// ── Countdown ────────────────────────────────────────────────────
function Countdown({ dark = false }: { dark?: boolean }) {
  const [days, setDays] = useState(71)
  useEffect(() => {
    const calc = () => setDays(Math.max(0, Math.ceil(
      (new Date('2026-09-01T00:00:00+02:00').getTime() - Date.now()) / 86400000
    )))
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [])
  return <span style={{ color: dark ? '#93c5fd' : '#1F49B0' }} className="font-mono font-bold">{days}</span>
}

// ── Dashboard card ───────────────────────────────────────────────
function DashboardCard() {
  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-white/50 border-b border-white/30">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] font-mono tracking-widest text-gray-400 uppercase">Vanivert — Smart CFO</span>
      </div>
      <div className="p-5 grid grid-cols-2 gap-3">
        {[
          { label: 'Conformité DGFiP', value: '100%', color: '#22c55e', bg: '#f0fdf4' },
          { label: 'Score Trésorerie', value: 'A+', color: '#1F49B0', bg: '#eff6ff' },
          { label: 'Factures payées', value: '94%', color: '#0A090A', bg: '#f9fafb' },
          { label: 'Prévision J+30', value: '+8 200 €', color: '#22c55e', bg: '#f0fdf4' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl p-3" style={{ background: m.bg }}>
            <div className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">{m.label}</div>
            <div className="text-lg font-bold" style={{ color: m.color, fontFamily: 'Inter' }}>{m.value}</div>
          </div>
        ))}
        <div className="col-span-2 rounded-2xl bg-gray-50 p-3">
          <div className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2">Trésorerie temps réel</div>
          <svg viewBox="0 0 320 56" className="w-full h-10" fill="none">
            <defs>
              <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F49B0" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1F49B0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 44 C50 40 85 32 120 24 C150 18 170 22 195 14 C215 8 245 5 275 4 C292 3 305 4 320 3"
              stroke="#1F49B0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M0 44 C50 40 85 32 120 24 C150 18 170 22 195 14 C215 8 245 5 275 4 C292 3 305 4 320 3 L320 56 L0 56 Z"
              fill="url(#cg2)" />
            <circle cx="195" cy="14" r="4" fill="#1F49B0" />
            <line x1="195" y1="14" x2="195" y2="56" stroke="#1F49B0" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.25" />
            <text x="195" y="10" fill="#1F49B0" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="600">Aujourd'hui</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Integrations ─────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: 'Pennylane', l: 'P', color: '#0052CC', bg: '#EEF5FF' },
  { name: 'Qonto', l: 'Q', color: '#1A237E', bg: '#E8EAF6' },
  { name: 'Tiime', l: 'T', color: '#F57C00', bg: '#FFF3E0' },
  { name: 'Sage', l: 'S', color: '#2E7D32', bg: '#E8F5E9' },
  { name: 'Stripe', l: 'S', color: '#4527A0', bg: '#EDE7F6' },
  { name: 'GoCardless', l: 'G', color: '#00695C', bg: '#E0F2F1' },
  { name: 'Doctolib', l: 'D', color: '#0277BD', bg: '#E3F2FD' },
  { name: 'Google Cal', l: 'G', color: '#C62828', bg: '#FFEBEE' },
  { name: 'Cegid', l: 'C', color: '#E65100', bg: '#FFF3E0' },
  { name: 'Docoon', l: 'D', color: '#6A1B9A', bg: '#F3E5F5' },
  { name: 'Chorus Pro', l: 'C', color: '#1B5E20', bg: '#E8F5E9' },
  { name: 'Bridge', l: 'B', color: '#01579B', bg: '#E1F5FE' },
  { name: 'grcx', l: 'G', color: '#1F49B0', bg: '#EEF3FF' },
  { name: 'Pxtly', l: 'P', color: '#4A148C', bg: '#F3E5F5' },
  { name: 'Mistral AI', l: 'M', color: '#0A090A', bg: '#F5F5F5' },
  { name: 'Hetzner', l: 'H', color: '#D50000', bg: '#FFEBEE' },
  { name: 'Supabase', l: 'S', color: '#3ECF8E', bg: '#E8FDF5' },
  { name: 'n8n', l: 'n', color: '#E67E22', bg: '#FFF3E0' },
]

// ── Nav ──────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className={`mx-auto max-w-6xl flex items-center justify-between transition-all duration-500
          ${scrolled ? 'bg-white/80 backdrop-blur-2xl border border-white/50 shadow-lg rounded-full mx-6 px-6 py-3' : 'px-8'}`}>
          <a href="/" className="flex items-center gap-2 font-extrabold text-[19px] tracking-[-0.04em] text-[#0A090A]">
            <span className="w-2 h-2 rounded-full bg-[#1F49B0]" style={{ boxShadow: '0 0 8px rgba(31,73,176,0.5)' }} />
            vanivert
          </a>
          <ul className="hidden md:flex gap-7 list-none items-center">
            {[['Smart CFO','#cfo'],['Conformité','#conformite'],['IA Vocale','#voice'],['Tarifs','#tarifs'],['Intégrations','#integrations'],['Contact','#contact']].map(([l, h]) => (
              <li key={l}><a href={h} className="text-[13px] text-gray-500 hover:text-[#0A090A] font-medium transition-colors">{l}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="/calculateur" className="bg-[#1F49B0] text-white text-[13px] font-bold rounded-full px-5 py-2.5 hover:bg-[#163A8C] transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-px">
              Calculer mon risque
            </a>
            <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <svg width="20" height="14" viewBox="0 0 20 14" fill="#0A090A">
                <rect width="20" height="1.5" rx="1"/><rect y="6" width="20" height="1.5" rx="1"/><rect y="12" width="20" height="1.5" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8">
            <button className="absolute top-6 right-6 text-3xl text-gray-300 font-light" onClick={() => setMenuOpen(false)}>×</button>
            {[['Smart CFO','#cfo'],['Conformité','#conformite'],['IA Vocale','#voice'],['Tarifs','#tarifs'],['Contact','#contact']].map(([l,h]) => (
              <a key={l} href={h} onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-[#0A090A] tracking-tight">{l}</a>
            ))}
            <a href="/calculateur" className="bg-[#1F49B0] text-white font-bold rounded-full px-8 py-3.5 mt-2">Calculer mon risque</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function Home() {
  const [annual, setAnnual] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 90 })

  return (
    <div style={{ background: '#F7F9FB', color: '#0A090A', fontFamily: 'Inter, sans-serif' }}>
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#1F49B0] z-[500] origin-left" style={{ scaleX }} />

      {/* 3D background — stays subtle behind white content */}
      <FluidBackground />

      <Nav />

      {/* ══════════════════════════════════════════════════════════
          HERO — white card over fluid background
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
        {/* Strong white radial so text is readable */}
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(247,249,251,0.92) 30%, rgba(247,249,251,0.6) 70%, transparent 100%)' }} />

        {/* Floating invoice card */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: [0, -12, 0], rotate: [-1, 1.5, -1] }}
          transition={{ opacity: { duration: 0.8, delay: 1.2 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-[15%] right-[7%] w-[200px] hidden xl:block z-[2]"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 16, padding: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          <div className="text-[9px] font-mono text-gray-400 tracking-widest uppercase mb-3">Facture #2026-0847</div>
          {[['Client','PROLANN SAS'],['Montant HT','4 200 €'],['TVA 20%','840 €'],['Total TTC','5 040 €']].map(([k,v]) => (
            <div key={k} className="flex justify-between text-[11px] py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-gray-400">{k}</span>
              <span className="font-bold text-[#0A090A]">{v}</span>
            </div>
          ))}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1 text-[9px] font-bold text-green-700">
            ✓ Conforme DGFiP
          </div>
        </motion.div>

        {/* Floating CFO stat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 1.6 }, y: { duration: 6, delay: 1, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute bottom-[22%] left-[6%] hidden xl:block z-[2]"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 14, padding: '14px 20px', boxShadow: '0 16px 48px rgba(0,0,0,0.07)' }}>
          <div className="text-[9px] font-mono text-gray-400 tracking-widest uppercase mb-1">Prévision J+30</div>
          <div className="text-xl font-bold text-green-600" style={{ fontFamily: 'Inter' }}>+8 200 €</div>
        </motion.div>

        {/* Hero content */}
        <motion.div className="relative z-[3] text-center max-w-3xl mx-auto"
          initial="hidden" animate="visible" variants={stagger}>

          <motion.span variants={fadeUp}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-gray-500 mb-8"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 999, padding: '6px 16px' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F49B0] animate-pulse" />
            Intelligence financière souveraine
          </motion.span>

          <motion.h1 variants={fadeUp} custom={1}
            className="font-black leading-[1.03] tracking-[-0.04em] mb-6 text-[#0A090A]"
            style={{ fontFamily: 'Inter', fontSize: 'clamp(40px, 6vw, 80px)' }}>
            Le 1er septembre 2026,<br />
            <span style={{ color: '#1F49B0' }}>la facture papier</span><br />
            disparaît.
          </motion.h1>

          <motion.p variants={fadeUp} custom={2}
            className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-10">
            L'intelligence financière autonome pour les PME françaises. IA vocale, conformité e-facturation, Smart CFO. À partir de 9 €/mois.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/calculateur"
              className="bg-[#1F49B0] text-white font-bold rounded-full px-8 py-4 text-[15px] hover:bg-[#163A8C] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/60 transition-all duration-300">
              Activer mon infrastructure CFO
            </a>
            <a href="#cfo"
              className="font-semibold rounded-full px-8 py-4 text-[15px] transition-all hover:border-[#0A090A]"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(0,0,0,0.1)', color: '#0A090A' }}>
              Découvrir →
            </a>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="mt-14 flex items-center justify-center gap-2 font-mono text-[12px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Obligation de réception dans <Countdown /> jours
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — clean white cards
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 relative z-10" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.blockquote initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}
            className="text-center italic text-[#0A090A] mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px, 2.5vw, 26px)' }}>
            "54% des entrepreneurs français n'ont pas de logiciel de facturation. 50% ne seront pas prêts en septembre 2026."
            <cite className="block not-italic font-mono text-[11px] text-gray-400 mt-3 tracking-widest uppercase">OpinionWay / Tiime, mars 2026</cite>
          </motion.blockquote>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-4">
            {[
              { n: '15 000 €', l: 'Amende annuelle maximale pour non-conformité' },
              { n: <Countdown />, l: 'Jours avant l\'obligation de réception', urgent: true },
              { n: '50 €', l: 'Par facture non conforme transmise' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="text-center px-8 py-10 rounded-3xl hover:-translate-y-1 transition-transform duration-300"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                <div className={`font-black tracking-tight mb-3 ${s.urgent ? 'text-[#1F49B0]' : 'text-[#0A090A]'}`}
                  style={{ fontFamily: 'Inter', fontSize: 'clamp(36px, 5vw, 56px)' }}>{s.n}</div>
                <div className="text-sm text-gray-500 leading-snug">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SMART CFO — split layout with 3D parallax entrance
      ══════════════════════════════════════════════════════════ */}
      <section id="cfo" className="py-28 px-6 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">Smart CFO</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight leading-[1.06] mb-6 text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Votre directeur<br />financier. Toujours<br />disponible.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-500 leading-relaxed max-w-md mb-8">
              Connecté à vos outils existants. Analyse vos flux. Prédit vos besoins de trésorerie avant que vous ne les ressentiez.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="space-y-3 mb-10">
              {['Trésorerie en temps réel, connectée à votre banque', 'Prédictions cash-flow sur 30, 60, 90 jours', 'Alertes automatiques : retards, seuils, anomalies', 'Compatible Pennylane, Tiime, Sage, Qonto, Bridge API'].map(f => (
                <div key={f} className="flex items-start gap-3 text-[14px] text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1F49B0] mt-2 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </motion.div>
            <motion.span variants={fadeUp} custom={4} className="font-mono text-[13px] font-semibold text-[#1F49B0]">
              À partir de 29 €/mois
            </motion.span>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideLeft}>
            <DashboardCard />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          COMPLIANCE — light grey bg, animated timeline
      ══════════════════════════════════════════════════════════ */}
      <section id="conformite" className="py-28 px-6 relative z-10" style={{ background: '#F7F9FB' }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideRight}
            className="relative pl-8">
            <div className="absolute left-[5px] top-3 bottom-3 w-[1.5px]" style={{ background: 'linear-gradient(to bottom, #1F49B0, rgba(31,73,176,0.1))' }} />
            {[
              { date: 'Février 2026', title: 'Phase pilote ouverte', desc: 'Tests en production avec les plateformes agréées DGFiP', done: true },
              { date: '1er septembre 2026', title: 'Réception obligatoire — toutes les entreprises', desc: 'Toutes les entreprises doivent recevoir via une PA', done: true, urgent: true },
              { date: '1er septembre 2026', title: 'Émission : grandes entreprises et ETI', desc: 'Émission et e-reporting pour les +250 salariés', done: true },
              { date: '1er septembre 2027', title: 'Émission : PME et TPE', desc: 'Toutes les entreprises doivent émettre au format structuré', done: false },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-8">
                <div className={`absolute -left-8 top-2 w-3.5 h-3.5 rounded-full border-2 transition-all
                  ${item.done ? 'bg-[#1F49B0] border-[#1F49B0]' : 'bg-gray-200 border-gray-300'}`}
                  style={item.done ? { boxShadow: '0 0 0 5px rgba(31,73,176,0.12)' } : {}} />
                <div className="font-mono text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: item.urgent ? '#1F49B0' : '#86868B' }}>{item.date}</div>
                <div className={`font-bold text-[15px] mb-1 ${item.urgent ? 'text-[#1F49B0]' : 'text-[#0A090A]'}`}>{item.title}</div>
                <div className="text-[13px] text-gray-500">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">Conformité e-facturation</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight leading-[1.06] mb-6 text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Septembre 2026.<br />Votre entreprise<br />est-elle prête?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-500 leading-relaxed max-w-md mb-8">
              Vanivert connecte votre ERP à une plateforme agréée certifiée DGFiP. Vous ne changez rien à vos habitudes. On gère tout le pipeline technique.
            </motion.p>
            <motion.a variants={fadeUp} custom={3} href="/calculateur"
              className="inline-flex items-center gap-2 bg-[#0A090A] text-white font-bold rounded-full px-8 py-4 text-[15px] hover:bg-[#1F49B0] transition-all duration-300 hover:-translate-y-px hover:shadow-lg">
              Vérifier ma conformité →
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          VOICE AI — DARK section, full premium feel
      ══════════════════════════════════════════════════════════ */}
      <section id="voice" className="py-28 px-6 relative z-10 overflow-hidden" style={{ background: '#0A090A', color: '#fff' }}>
        {/* Subtle blue glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(31,73,176,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.span variants={fadeUp}
              className="font-mono text-[11px] tracking-[0.14em] uppercase mb-4 block"
              style={{ color: 'rgba(255,255,255,0.3)' }}>IA Vocale Souveraine</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight leading-[1.04] mb-5 text-white"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Ne perdez plus<br />un seul client.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2}
              className="text-xl leading-relaxed max-w-md mx-auto mb-12"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              Réceptionniste IA en français. Répond 24h/24. Prend les rendez-vous. Zéro donnée hors UE.
            </motion.p>

            {/* Phone mockup */}
            <motion.div variants={scaleIn} className="mx-auto mb-10" style={{
              width: 220, height: 420, background: '#111', borderRadius: 36,
              border: '2.5px solid #252525', position: 'relative', overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#111', borderRadius: '0 0 12px 12px', zIndex: 2 }} />
              <div style={{
                position: 'absolute', inset: 2, background: 'linear-gradient(160deg, #0d1117 0%, #0a1628 100%)',
                borderRadius: 34, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 10, padding: '36px 18px 24px'
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Appel entrant</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Inter' }}>Cabinet Dr. Martin</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>00:47</div>
                <div style={{ width: '100%', padding: '0 4px' }}><Waveform dark /></div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "Bonjour, cabinet du Dr. Martin.<br />Comment puis-je vous aider?"
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔇</div>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,59,48,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📞</div>
                </div>
              </div>
            </motion.div>

            {/* Waveform card */}
            <motion.div variants={fadeUp} custom={3} className="mx-auto max-w-sm mb-8"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px' }}>
              <Waveform dark />
              <div className="text-[11px] font-mono mt-3" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
                Whisper STT · Mistral 7B · XTTS-v2 · Hetzner Frankfurt
              </div>
            </motion.div>

            {/* Tech tags */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-2 justify-center mb-10">
              {['Whisper STT', 'Mistral 7B', 'XTTS-v2', 'Silero VAD', 'Hetzner DE', 'Zéro donnée hors UE'].map(t => (
                <span key={t} className="text-[11px] font-medium rounded-full px-4 py-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>{t}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={5}>
              <a href="tel:+33XXXXXXXXX"
                className="inline-flex items-center gap-2 font-bold rounded-full px-8 py-4 text-[15px] transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: '#1F49B0', color: '#fff', boxShadow: '0 8px 32px rgba(31,73,176,0.35)' }}>
                Écouter l'IA en direct
              </a>
              <div className="mt-4 font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                À partir de 9 €/mois + 0,08 €/min
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SOVEREIGNTY STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 px-6 relative z-10" style={{ background: '#fff', borderTop: '1px solid #F0F0F5', borderBottom: '1px solid #F0F0F5' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="italic text-[#0A090A] mb-8"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px, 2.5vw, 28px)' }}>
            "Vos données ne quittent jamais l'Europe."
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex flex-wrap items-center justify-center gap-8">
            {['Hetzner Frankfurt', 'Supabase Dublin', 'Mistral AI Paris', 'Conforme RGPD', 'Zéro API US'].map((s, i) => (
              <motion.div key={s} variants={fadeUp} custom={i}
                className="flex items-center gap-2 font-mono text-[11px] text-gray-500 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />{s}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════ */}
      <section id="tarifs" className="py-28 px-6 relative z-10" style={{ background: '#F7F9FB' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">Tarifs</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight mb-4 text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(32px, 4.5vw, 52px)' }}>
              Des prix qui respectent<br />votre budget.
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-semibold cursor-pointer ${!annual ? 'text-[#0A090A]' : 'text-gray-400'}`} onClick={() => setAnnual(false)}>Mensuel</span>
              <button onClick={() => setAnnual(v => !v)} aria-label="Basculer annuel/mensuel"
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-[#1F49B0]' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${annual ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className={`text-sm font-semibold cursor-pointer ${annual ? 'text-[#0A090A]' : 'text-gray-400'}`} onClick={() => setAnnual(true)}>
                Annuel {annual && <span className="ml-1 text-[#1F49B0] bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-full">-17%</span>}
              </span>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Starter', m: 9, a: 7, feats: ['Réceptionniste IA vocale 24h/24', '200 min incluses/mois', 'Doctolib ou Google Calendar', 'Tableau de bord basique', 'Support par email'], pop: false },
              { name: 'Business', m: 29, a: 24, feats: ['Tout Starter, plus :', 'Smart CFO trésorerie temps réel', 'Conformité e-facturation (PA)', '500 minutes vocales incluses', 'Connexion bancaire (Qonto, BNP)', 'Alertes et relances automatiques', 'Radar réglementaire (grcx)'], pop: true },
              { name: 'Premium', m: 99, a: 82, feats: ['Tout Business, plus :', 'BD automatisé 30 leads/mois', 'ERP complet (Sage, Cegid)', '1 500 minutes vocales incluses', 'Document Intelligence (Pxtly)', 'Onboarding dédié', 'Support prioritaire'], pop: false },
            ].map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} custom={i}
                className={`relative rounded-3xl p-8 transition-all duration-400
                  ${plan.pop ? 'bg-[#1F49B0] text-white shadow-2xl shadow-blue-200/40 -translate-y-3 scale-[1.02]' : 'bg-white text-[#0A090A]'}`}
                style={!plan.pop ? { border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' } : {}}>
                {plan.pop && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#1F49B0] text-[10px] font-black tracking-widest uppercase px-5 py-2 rounded-full shadow-lg">
                    Populaire
                  </div>
                )}
                <div className={`text-[11px] font-mono font-bold uppercase tracking-[0.1em] mb-4 ${plan.pop ? 'text-white/60' : 'text-gray-400'}`}>{plan.name}</div>
                <div className={`font-black leading-none mb-1 ${plan.pop ? 'text-white' : 'text-[#0A090A]'}`}
                  style={{ fontFamily: 'Inter', fontSize: 52 }}>
                  {annual ? plan.a : plan.m} €
                </div>
                <div className={`text-sm mb-7 ${plan.pop ? 'text-white/60' : 'text-gray-400'}`}>par mois HT</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.feats.map(f => (
                    <li key={f} className={`text-[13px] flex items-start gap-2.5 leading-snug ${plan.pop ? 'text-white/90' : 'text-gray-700'}`}>
                      <span className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${plan.pop ? 'bg-white' : 'bg-[#1F49B0]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`/signup?plan=${plan.name.toLowerCase()}`}
                  className={`block text-center font-bold text-[14px] rounded-full py-3.5 transition-all duration-300
                    ${plan.pop ? 'bg-white text-[#1F49B0] hover:bg-blue-50' : 'bg-[#0A090A] text-white hover:bg-[#1F49B0]'}`}>
                  Commencer
                </a>
              </motion.div>
            ))}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-sm text-gray-400 mt-8">
            Pas d'engagement. Résiliable à tout moment. <a href="#contact" className="text-[#0A090A] font-semibold hover:underline underline-offset-2">Besoin d'une offre sur mesure?</a>
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INTEGRATIONS — scroll-staggered grid
      ══════════════════════════════════════════════════════════ */}
      <section id="integrations" className="py-28 px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">18 intégrations natives</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Fonctionne avec<br />votre écosystème complet.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 mt-4 max-w-lg mx-auto">
              Comptabilité, banque, paiements, agenda, conformité, IA souveraine. Tout est connecté.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {INTEGRATIONS.map((int, i) => (
              <motion.div key={int.name} variants={fadeUp} custom={i * 0.04}
                className="rounded-2xl p-4 text-center cursor-default transition-all duration-300 hover:-translate-y-1.5 group"
                style={{ background: '#F7F9FB', border: '1px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid #E8E8ED'; (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid transparent'; (e.currentTarget as HTMLElement).style.background = '#F7F9FB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                  style={{ background: int.bg, color: int.color }}>{int.l}</div>
                <div className="text-[11px] font-semibold text-[#0A090A] leading-tight">{int.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          OPEN SOURCE POWER — new section
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative z-10" style={{ background: '#F7F9FB' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">Technologie</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(28px, 4vw, 44px)' }}>
              La puissance des meilleures<br />solutions open source.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 mt-4 max-w-lg mx-auto">
              Vanivert assemble les meilleurs composants souverains en une plateforme unifiée pour les PME françaises.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'grcx', role: 'Radar Réglementaire', desc: 'Surveille DGFiP, CNIL, AMF, ACPR en temps réel. Alerte dès qu\'une règle change. Piste d\'audit cryptographique.', tag: 'MIT License', color: '#1F49B0' },
              { name: 'Pxtly', role: 'Document Intelligence', desc: 'ZK-KYC, ChromaDB vector search, détection AML. Interrogez 5 ans de factures en langage naturel.', tag: 'Apache 2.0', color: '#4A148C' },
              { name: 'Vanivert Voice', role: 'IA Vocale Souveraine', desc: 'Whisper STT + Mistral 7B + XTTS-v2. 100% hébergé sur Hetzner Frankfurt. Zéro donnée hors Europe.', tag: 'Stack propriétaire EU', color: '#0A090A' },
            ].map((item, i) => (
              <motion.div key={item.name} variants={fadeUp} custom={i}
                className="rounded-3xl p-7 bg-white hover:-translate-y-1 transition-transform duration-300"
                style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="font-black text-[18px] tracking-tight" style={{ color: item.color, fontFamily: 'Inter' }}>{item.name}</div>
                  <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 tracking-wider">{item.tag}</span>
                </div>
                <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-mono mb-3">{item.role}</div>
                <div className="text-[14px] text-gray-600 leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-28 px-6 relative z-10 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-4 block">Contact</motion.span>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-black tracking-tight leading-[1.06] mb-6 text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(30px, 4vw, 50px)' }}>
              Parlons de votre<br />projet.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-500 leading-relaxed max-w-sm mb-8">
              Un appel de 15 minutes suffit. Sans engagement. Sans pression commerciale.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="space-y-4">
              <a href="mailto:contact@vanivert.fr" className="flex items-center gap-3 text-[15px] font-semibold text-[#0A090A] hover:text-[#1F49B0] transition-colors">
                <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-base flex-shrink-0">✉️</span>
                contact@vanivert.fr
              </a>
              <a href="https://wa.me/33XXXXXXXXX" className="flex items-center gap-3 text-[15px] font-semibold text-[#0A090A] hover:text-green-600 transition-colors">
                <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-base flex-shrink-0">💬</span>
                WhatsApp — réponse en moins d'1h
              </a>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="mt-10 p-5 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#1F49B0] font-bold mb-2">Bpifrance</div>
              <div className="text-[13px] text-gray-600 leading-relaxed">
                Éligible aux aides Bpifrance pour la transformation numérique des PME. Notre équipe vous accompagne dans les démarches.
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
            <div className="bg-white rounded-3xl p-8" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message envoyé! Nous vous répondons sous 24h.') }}>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-semibold text-gray-500 block mb-1.5">Prénom</label>
                    <input className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#1F49B0] bg-gray-50 transition-colors" style={{ borderColor: '#E8E8ED' }} placeholder="Jean" /></div>
                  <div><label className="text-xs font-semibold text-gray-500 block mb-1.5">Nom</label>
                    <input className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#1F49B0] bg-gray-50 transition-colors" style={{ borderColor: '#E8E8ED' }} placeholder="Dupont" /></div>
                </div>
                <div><label className="text-xs font-semibold text-gray-500 block mb-1.5">Email professionnel *</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#1F49B0] bg-gray-50 transition-colors" style={{ borderColor: '#E8E8ED' }} placeholder="jean@monentreprise.fr" /></div>
                <div><label className="text-xs font-semibold text-gray-500 block mb-1.5">Service</label>
                  <select className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#1F49B0] bg-gray-50" style={{ borderColor: '#E8E8ED' }}>
                    <option>Choisir...</option>
                    <option>IA Vocale</option><option>Smart CFO</option><option>Conformité e-facturation</option><option>Pack complet</option>
                  </select></div>
                <div><label className="text-xs font-semibold text-gray-500 block mb-1.5">Message</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#1F49B0] bg-gray-50 resize-none" style={{ borderColor: '#E8E8ED' }} /></div>
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" required id="rgpd" className="mt-0.5 accent-[#1F49B0]" />
                  <label htmlFor="rgpd" className="text-xs text-gray-500">J'accepte la <a href="/legal/confidentialite" className="underline hover:text-[#1F49B0]">politique de confidentialité</a></label>
                </div>
                <button type="submit" className="w-full bg-[#0A090A] text-white font-bold py-4 rounded-full text-[15px] hover:bg-[#1F49B0] transition-all duration-300">
                  Envoyer le message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative z-10" style={{ background: '#F7F9FB' }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp}
              className="font-black tracking-tight mb-5 text-[#0A090A]"
              style={{ fontFamily: 'Inter', fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
              Commencez gratuitement.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-gray-500 mb-10">
              Vérifiez votre conformité en 2 minutes. Aucune carte bancaire requise.
            </motion.p>
            <motion.a variants={fadeUp} custom={2} href="/calculateur"
              className="inline-flex items-center gap-2 bg-[#1F49B0] text-white font-bold rounded-full px-10 py-5 text-[16px] hover:bg-[#163A8C] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300">
              Calculer mon risque →
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 px-6 py-16" style={{ background: '#0A090A', color: 'rgba(255,255,255,0.4)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between gap-12 mb-12">
            <div className="max-w-xs">
              <div className="font-extrabold text-xl text-white tracking-[-0.04em] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1F49B0]" />vanivert
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Intelligence financière souveraine pour les PME françaises. 100% hébergé en Europe.
              </p>
            </div>
            <div className="flex flex-wrap gap-14">
              {[
                { h: 'Produit', links: ['Smart CFO', 'Conformité', 'IA Vocale', 'Tarifs', 'Intégrations'] },
                { h: 'Ressources', links: ['Blog', 'Calculateur', 'Documentation', 'Contact', 'Statut système'] },
                { h: 'Légal', links: ['Mentions légales', 'CGV', 'CGU', 'Confidentialité', 'DPA RGPD'] },
              ].map(col => (
                <div key={col.h}>
                  <h4 className="text-[10px] font-bold tracking-[0.14em] uppercase font-mono mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>{col.h}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map(l => (
                      <li key={l}><a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-8 flex flex-wrap justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>
              © 2026 Vanivert. Tous droits réservés. SIRET : en cours · contact@vanivert.fr · vanivert.fr · vanivert.eu
            </div>
            <div className="flex gap-2 flex-wrap">
              {['RGPD', 'EU Hosted', 'Hetzner DE', 'Supabase IE'].map(b => (
                <span key={b} className="font-mono text-[9px] px-2.5 py-1 rounded-md flex items-center gap-1.5"
                  style={{ color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="w-1 h-1 rounded-full bg-green-500" />{b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/33XXXXXXXXX" target="_blank" rel="noopener" aria-label="WhatsApp"
        className="fixed bottom-8 right-7 z-50 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
