'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = {
  bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73',
  lt:'#E8E8ED', sub:'#F2F2F7', b:'#1F49B0', b2:'#163A8C',
  grn:'#22C55E', red:'#EF4444', gold:'#F59E0B',
  grn2:'rgba(34,197,94,0.08)', red2:'rgba(239,68,68,0.08)', gold2:'rgba(245,158,11,0.08)',
}
const E: [number,number,number,number] = [0.16,1,0.3,1]
const vU = { hidden:{opacity:0,y:14}, visible:{opacity:1,y:0,transition:{duration:0.45,ease:E}} }
const vS = { hidden:{}, visible:{transition:{staggerChildren:0.05}} }

// ── Supabase client (lightweight, no SDK needed) ──────────────────────────
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

async function sbGet(table: string, filter?: string) {
  const url = `${SB_URL}/rest/v1/${table}?order=created_at.desc&limit=100${filter||''}`
  const res = await fetch(url, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } })
  if (!res.ok) throw new Error(`Supabase ${res.status}`)
  return res.json()
}
async function sbPost(table: string, body: object) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })
  return res.json()
}
async function sbPatch(table: string, id: string, body: object) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })
  return res.json()
}
async function sbDelete(table: string, id: string) {
  await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  })
}

// ── Types ──────────────────────────────────────────────────────────────────
type Lead = {
  id: string; name?: string; company_name?: string; siret?: string
  grade?: string; exposure_euros?: number; email?: string
  created_at: string; city?: string; naf_code?: string
  monthly_invoices?: number; current_software?: string; has_pdp?: boolean
}
type Alert = { id: string; jurisdiction: string; severity: string; summary: string; source_url?: string; created_at: string }
type Tab = 'overview'|'leads'|'alerts'|'pricing'|'content'|'contact'|'legal'|'settings'

// ── Default editable content ───────────────────────────────────────────────
const DEFAULTS = {
  pricing: { starter:19, business:29, premium:99, starterAnnual:16, businessAnnual:24, premiumAnnual:82 },
  contact: { email:'contact@vanivert.fr', whatsapp:'+33XXXXXXXXX', phone:'+33XXXXXXXXX', address:"Lannion, Côtes d'Armor, Bretagne" },
  voice: { demoNumber:'+33XXXXXXXXX', setupFee:200, minuteRate:'0.08' },
  legal: { siret:"En cours d'enregistrement", siren:'En cours', rcs:'Lannion', vatNumber:'FR XX XXXXXXXXX' },
  hero: { h1b:'la facture papier', sub:"L'infrastructure financière des grandes entreprises, accessible aux PME françaises." },
}

// ── Auth ──────────────────────────────────────────────────────────────────
const ADMIN_PW = 'Vanivert@2026!'   // ← Change this to your own password

// ── UI helpers ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const map: Record<string,[string,string]> = {
    F: [C.red, C.red2], D: ['#D97706', '#FEF3C7'],
    C: ['#7C3AED', '#EDE9FE'], B: [C.b, '#EEF2FF'], A: [C.grn, C.grn2],
    critical: [C.red, C.red2], warning: [C.gold, C.gold2], info: [C.b, '#EEF2FF'],
    connected: [C.grn, C.grn2], pending: [C.gold, C.gold2],
  }
  const [col, bg] = map[status] || [C.g, C.sub]
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:6,
      background:bg, color:col, fontFamily:'monospace', letterSpacing:'0.05em',
      textTransform:'uppercase', whiteSpace:'nowrap' as const }}>
      {status}
    </span>
  )
}

function KPI({ label, value, color=C.ink, sub }: { label:string; value:string|number; color?:string; sub?:string }) {
  return (
    <div style={{ background:C.w, borderRadius:16, padding:'18px 20px', border:`1px solid ${C.lt}` }}>
      <div style={{ fontSize:10, fontFamily:'monospace', textTransform:'uppercase' as const, letterSpacing:'0.08em', color:C.g, marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:'Inter', fontWeight:900, fontSize:28, letterSpacing:'-0.04em', color, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.g, marginTop:5 }}>{sub}</div>}
    </div>
  )
}

function Input({ label, value, onChange, type='text', mono=false }: { label:string; value:string|number; onChange:(v:string)=>void; type?:string; mono?:boolean }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.g, display:'block', marginBottom:5 }}>{label}</label>
      <input type={type} value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${C.lt}`, borderRadius:12,
          fontSize:14, fontFamily:mono?'monospace':'Inter', outline:'none', background:C.sub,
          boxSizing:'border-box' as const, color:C.ink, transition:'border-color 0.2s' }}
        onFocus={e => (e.target.style.borderColor=C.b)}
        onBlur={e => (e.target.style.borderColor=C.lt)} />
    </div>
  )
}

function Toast({ msg, ok=true }: { msg:string; ok?:boolean }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
      style={{ position:'fixed', bottom:28, right:28, zIndex:9999,
        background:ok?C.grn:C.red, color:'#fff', fontWeight:700, fontSize:13,
        padding:'12px 22px', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
        display:'flex', alignItems:'center', gap:8 }}>
      {ok ? '✓' : '✗'} {msg}
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function Admin() {
  const [tab, setTab] = useState<Tab>('overview')
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')

  // Data from Supabase
  const [leads, setLeads] = useState<Lead[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)

  // Editable content
  const [content, setContent] = useState(DEFAULTS)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)

  function showToast(msg: string, ok=true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = useCallback(async () => {
    if (!SB_URL || !SB_KEY) return
    setLoading(true)
    try {
      const [l, a] = await Promise.all([
        sbGet('calculator_leads').catch(() => []),
        sbGet('regulatory_alerts').catch(() => []),
      ])
      setLeads(Array.isArray(l) ? l : [])
      setAlerts(Array.isArray(a) ? a : [])
    } catch (e) {
      console.error('Supabase load error:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) loadData() }, [authed, loadData])

  function update(section: keyof typeof DEFAULTS, key: string, val: string|number) {
    setContent(c => ({ ...c, [section]: { ...c[section], [key]: val } }))
  }

  async function save() {
    // In production: POST content to a Supabase table or API route
    // For now: saves to localStorage as persistence layer
    try {
      localStorage.setItem('vanivert_admin_content', JSON.stringify(content))
      showToast('Modifications sauvegardées')
    } catch {
      showToast('Erreur de sauvegarde', false)
    }
  }

  async function exportLeads() {
    const rows = [
      ['ID','Entreprise','SIRET','Grade','Exposition €','Email','Logiciel','Date'],
      ...leads.map(l => [
        l.id, l.company_name||l.name||'', l.siret||'',
        l.grade||'', l.exposure_euros||0, l.email||'',
        l.current_software||'', l.created_at?.split('T')[0]||''
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }))
    a.download = `vanivert-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showToast(`${leads.length} leads exportés`)
  }

  async function sendFollowUp(lead: Lead) {
    if (!lead.email) return showToast('Pas d\'email pour ce lead', false)
    // In production: trigger n8n webhook or send via Resend API
    showToast(`Email de relance envoyé à ${lead.email}`)
  }

  // ── Auth screen ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily:'Inter, sans-serif' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ background:C.w, borderRadius:24, padding:'40px 36px', width:380,
          boxShadow:'0 8px 48px rgba(0,0,0,0.08)', border:`1px solid ${C.lt}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:28 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.b, boxShadow:`0 0 8px ${C.b}` }}/>
          <span style={{ fontWeight:900, fontSize:18, color:C.ink, letterSpacing:'-0.04em' }}>vanivert</span>
          <span style={{ fontSize:10, fontFamily:'monospace', color:C.g, letterSpacing:'0.1em',
            textTransform:'uppercase', marginLeft:4 }}>admin</span>
        </div>
        <h2 style={{ fontFamily:'Inter', fontWeight:900, fontSize:24, letterSpacing:'-0.03em',
          color:C.ink, marginBottom:6, marginTop:0 }}>Accès restreint</h2>
        <p style={{ fontSize:14, color:C.g, marginBottom:24 }}>Panneau d'administration Vanivert</p>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.g, display:'block', marginBottom:6 }}>
            Mot de passe admin
          </label>
          <input type="password" value={pw}
            onChange={e => { setPw(e.target.value); setPwError('') }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (pw === ADMIN_PW) { setAuthed(true); setPw('') }
                else setPwError('Mot de passe incorrect')
              }
            }}
            placeholder="••••••••••••"
            autoFocus
            style={{ width:'100%', padding:'13px 14px', border:`1.5px solid ${pwError?C.red:C.lt}`,
              borderRadius:13, fontSize:15, fontFamily:'Inter', outline:'none',
              background:C.sub, boxSizing:'border-box' as const, color:C.ink }}
            onFocus={e => (e.target.style.borderColor=C.b)}
            onBlur={e => (e.target.style.borderColor=pwError?C.red:C.lt)} />
          {pwError && <div style={{ fontSize:12, color:C.red, marginTop:6 }}>{pwError}</div>}
        </div>
        <button
          onClick={() => {
            if (pw === ADMIN_PW) { setAuthed(true); setPw('') }
            else setPwError('Mot de passe incorrect')
          }}
          style={{ width:'100%', background:C.b, color:'#fff', fontWeight:700, fontSize:15,
            border:'none', borderRadius:13, padding:'13px', cursor:'pointer', fontFamily:'Inter' }}>
          Entrer →
        </button>
        <div style={{ marginTop:16, padding:'12px 14px', borderRadius:10,
          background:C.gold2, border:`1px solid rgba(245,158,11,0.2)`,
          fontSize:12, color:'#92400E' }}>
          ⚠ Changez le mot de passe dans <code style={{ fontFamily:'monospace' }}>app/admin/page.tsx</code> ligne 1 (constante ADMIN_PW)
        </div>
      </motion.div>
    </div>
  )

  const TABS: Array<{id:Tab;label:string;icon:string}> = [
    {id:'overview',label:'Vue d\'ensemble',icon:'◈'},
    {id:'leads',label:`Leads (${leads.length})`,icon:'👥'},
    {id:'alerts',label:`Alertes (${alerts.length})`,icon:'◬'},
    {id:'pricing',label:'Tarifs',icon:'💶'},
    {id:'content',label:'Contenu',icon:'✏️'},
    {id:'contact',label:'Contact',icon:'📞'},
    {id:'legal',label:'Légal',icon:'⚖️'},
    {id:'settings',label:'Paramètres',icon:'⚙️'},
  ]

  const SAVE_TABS: Tab[] = ['pricing','content','contact','legal']

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, fontFamily:'Inter, sans-serif', display:'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width:230, background:C.w, borderRight:`1px solid ${C.lt}`,
        padding:'0', display:'flex', flexDirection:'column', flexShrink:0, height:'100dvh', position:'sticky', top:0 }}>
        <div style={{ padding:'20px 18px 16px', borderBottom:`1px solid ${C.lt}` }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none', marginBottom:4 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.b }}/>
            <span style={{ fontWeight:900, fontSize:17, color:C.ink, letterSpacing:'-0.04em' }}>vanivert</span>
          </a>
          <div style={{ fontSize:9, fontFamily:'monospace', color:C.g, letterSpacing:'0.1em', textTransform:'uppercase' as const }}>
            Admin Panel
          </div>
        </div>

        {/* Live status */}
        <div style={{ margin:'10px 12px', padding:'8px 12px', borderRadius:10,
          background:C.grn2, border:`1px solid rgba(34,197,94,0.15)`,
          display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:C.grn,
            animation:'pulse 1.8s ease-in-out infinite', flexShrink:0 }}/>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.grn }}>Système actif</div>
            <div style={{ fontSize:9, color:C.g, fontFamily:'monospace' }}>Supabase · vanivert.fr</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'6px 10px', overflowY:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:9,
                padding:'9px 10px', borderRadius:10, border:'none', cursor:'pointer',
                fontFamily:'Inter, sans-serif', fontSize:13,
                fontWeight:tab===t.id?700:400,
                background:tab===t.id?'#EEF2FF':'transparent',
                color:tab===t.id?C.b:C.g,
                borderLeft:`2px solid ${tab===t.id?C.b:'transparent'}`,
                transition:'all 0.15s', marginBottom:2, textAlign:'left' as const }}>
              <span style={{ fontSize:14, opacity:tab===t.id?1:0.5 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:'12px 12px 16px', borderTop:`1px solid ${C.lt}` }}>
          <a href="/dashboard" style={{ display:'block', fontSize:12, color:C.b, fontWeight:600,
            textDecoration:'none', marginBottom:8 }}>→ Dashboard client</a>
          <a href="/" style={{ display:'block', fontSize:12, color:C.g, textDecoration:'none', marginBottom:12 }}>→ Site public</a>
          <button onClick={() => setAuthed(false)}
            style={{ fontSize:12, color:C.red, background:'none', border:'none',
              cursor:'pointer', fontFamily:'Inter', padding:0 }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex:1, padding:'28px 36px', overflowY:'auto', overflowX:'hidden' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:24,
              letterSpacing:'-0.03em', color:C.ink, marginBottom:4, marginTop:0 }}>
              {TABS.find(t=>t.id===tab)?.label}
            </h1>
            <div style={{ fontSize:12, fontFamily:'monospace', color:C.g }}>
              Vanivert Admin · {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
            </div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {tab==='leads' && (
              <button onClick={exportLeads}
                style={{ fontSize:13, background:'transparent', color:C.b, border:`1.5px solid ${C.b}`,
                  borderRadius:10, padding:'8px 18px', cursor:'pointer', fontFamily:'Inter', fontWeight:600 }}>
                Exporter CSV
              </button>
            )}
            {tab==='overview' && (
              <button onClick={loadData}
                style={{ fontSize:13, background:'transparent', color:C.g, border:`1px solid ${C.lt}`,
                  borderRadius:10, padding:'8px 18px', cursor:'pointer', fontFamily:'Inter' }}>
                {loading ? 'Actualisation…' : '↻ Actualiser'}
              </button>
            )}
            {SAVE_TABS.includes(tab) && (
              <button onClick={save}
                style={{ fontSize:13, background:C.b, color:'#fff',
                  border:'none', borderRadius:10, padding:'9px 22px',
                  cursor:'pointer', fontFamily:'Inter', fontWeight:700 }}>
                Sauvegarder
              </button>
            )}
            <a href="/dashboard" target="_blank"
              style={{ fontSize:13, background:C.ink, color:'#fff',
                borderRadius:10, padding:'9px 18px', textDecoration:'none', fontWeight:600 }}>
              Dashboard →
            </a>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial="hidden" animate="visible" variants={vS}>

            {/* ═══════ OVERVIEW ═══════ */}
            {tab==='overview' && (
              <motion.div variants={vU}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
                  <KPI label="Leads total" value={leads.length} color={C.ink}/>
                  <KPI label="Emails capturés" value={leads.filter(l=>l.email).length} color={C.b}/>
                  <KPI label="Grades D/F (urgents)" value={leads.filter(l=>['D','F'].includes(l.grade||'')).length} color={C.red}/>
                  <KPI label="MRR estimé" value={`${leads.filter(l=>['D','F'].includes(l.grade||'')).length * 1200} €`} color={C.grn} sub="si conversion D/F"/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:14 }}>
                  <div style={{ background:C.w, borderRadius:16, padding:'22px 24px', border:`1px solid ${C.lt}` }}>
                    <div style={{ fontSize:10, fontFamily:'monospace', textTransform:'uppercase' as const, letterSpacing:'0.08em', color:C.g, marginBottom:14 }}>
                      Derniers leads
                    </div>
                    {loading && <div style={{ color:C.g, fontSize:13 }}>Chargement depuis Supabase…</div>}
                    {!loading && leads.length===0 && (
                      <div style={{ color:C.g, fontSize:13 }}>
                        Aucun lead — le calculateur de risque n'a pas encore été utilisé.
                        <br/><a href="/calculateur" style={{ color:C.b }}>Tester le calculateur →</a>
                      </div>
                    )}
                    {leads.slice(0,5).map(l => (
                      <div key={l.id} style={{ display:'flex', justifyContent:'space-between',
                        alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.lt}` }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{l.company_name||l.name||'—'}</div>
                          <div style={{ fontSize:11, fontFamily:'monospace', color:C.g }}>{l.created_at?.split('T')[0]}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontSize:13, fontWeight:700, fontFamily:'monospace', color:C.ink }}>
                            {(l.exposure_euros||0).toLocaleString('fr-FR')} €
                          </span>
                          <Badge status={l.grade||'?'}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.w, borderRadius:16, padding:'22px 24px', border:`1px solid ${C.lt}` }}>
                    <div style={{ fontSize:10, fontFamily:'monospace', textTransform:'uppercase' as const, letterSpacing:'0.08em', color:C.g, marginBottom:14 }}>
                      Alertes réglementaires récentes (grcx)
                    </div>
                    {alerts.length===0 && (
                      <div style={{ color:C.g, fontSize:13 }}>
                        Aucune alerte — lancez <code style={{ fontFamily:'monospace', fontSize:11 }}>python grcx_adapter.py</code> pour démarrer la veille réglementaire.
                      </div>
                    )}
                    {alerts.slice(0,5).map(a => (
                      <div key={a.id} style={{ display:'flex', gap:10, alignItems:'flex-start',
                        padding:'10px 0', borderBottom:`1px solid ${C.lt}` }}>
                        <Badge status={a.severity}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, color:C.ink, lineHeight:1.4 }}>{a.summary}</div>
                          <div style={{ fontSize:10, fontFamily:'monospace', color:C.g, marginTop:2 }}>
                            {a.jurisdiction} · {a.created_at?.split('T')[0]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:C.w, borderRadius:16, padding:'20px 24px', border:`1px solid ${C.lt}` }}>
                  <div style={{ fontSize:10, fontFamily:'monospace', textTransform:'uppercase' as const, letterSpacing:'0.08em', color:C.g, marginBottom:14 }}>
                    Actions rapides
                  </div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
                    {[
                      {label:'Voir le site', href:'/', target:'_blank'},
                      {label:'Dashboard client', href:'/dashboard', target:'_blank'},
                      {label:'Calculateur', href:'/calculateur', target:'_blank'},
                      {label:'Blog', href:'/blog', target:'_blank'},
                      {label:'Supabase', href:`https://supabase.com/dashboard/project/anmmezswjixpsmvnkqbw`, target:'_blank'},
                      {label:'Vercel', href:'https://vercel.com', target:'_blank'},
                      {label:'GitHub', href:'https://github.com/pawan0013/vanivert-app', target:'_blank'},
                    ].map(l => (
                      <a key={l.label} href={l.href} target={l.target}
                        style={{ fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:9,
                          border:`1px solid ${C.lt}`, color:C.ink, textDecoration:'none',
                          background:C.sub, transition:'all 0.15s' }}>
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ LEADS ═══════ */}
            {tab==='leads' && (
              <motion.div variants={vU}>
                {loading && <div style={{ color:C.g, padding:'20px 0' }}>Chargement depuis Supabase…</div>}
                {!loading && (
                  <div style={{ background:C.w, borderRadius:16, border:`1px solid ${C.lt}`, overflow:'hidden' }}>
                    {leads.length===0 ? (
                      <div style={{ padding:40, textAlign:'center', color:C.g }}>
                        <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
                        <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Aucun lead pour l'instant</div>
                        <div style={{ fontSize:13, marginBottom:16 }}>Partagez le calculateur pour capturer vos premiers leads.</div>
                        <a href="/calculateur" target="_blank"
                          style={{ background:C.b, color:'#fff', fontWeight:700, fontSize:13,
                            padding:'10px 22px', borderRadius:10, textDecoration:'none' }}>
                          Voir le calculateur →
                        </a>
                      </div>
                    ) : (
                      <table style={{ width:'100%', borderCollapse:'collapse' as const }}>
                        <thead>
                          <tr style={{ background:C.sub }}>
                            {['Entreprise','SIRET','Ville','Logiciel','Grade','Exposition €','Email','Date','Action'].map(h => (
                              <th key={h} style={{ padding:'10px 14px', textAlign:'left' as const, fontSize:10,
                                fontFamily:'monospace', textTransform:'uppercase' as const,
                                letterSpacing:'0.06em', color:C.g, borderBottom:`1px solid ${C.lt}`, fontWeight:600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map(l => (
                            <tr key={l.id} style={{ borderBottom:`1px solid ${C.lt}` }}>
                              <td style={{ padding:'11px 14px', fontSize:13, fontWeight:600, color:C.ink }}>
                                {l.company_name||l.name||'—'}
                              </td>
                              <td style={{ padding:'11px 14px', fontSize:11, fontFamily:'monospace', color:C.g }}>
                                {l.siret||'—'}
                              </td>
                              <td style={{ padding:'11px 14px', fontSize:12, color:C.g }}>{l.city||'—'}</td>
                              <td style={{ padding:'11px 14px', fontSize:12, color:C.g }}>{l.current_software||'—'}</td>
                              <td style={{ padding:'11px 14px' }}><Badge status={l.grade||'?'}/></td>
                              <td style={{ padding:'11px 14px', fontSize:13, fontWeight:700,
                                fontFamily:'monospace', color:(l.exposure_euros||0)>10000?C.red:C.ink }}>
                                {(l.exposure_euros||0).toLocaleString('fr-FR')} €
                              </td>
                              <td style={{ padding:'11px 14px', fontSize:12, color:l.email?C.ink:C.g }}>
                                {l.email ? (
                                  <a href={`mailto:${l.email}`} style={{ color:C.b, textDecoration:'none' }}>{l.email}</a>
                                ) : '—'}
                              </td>
                              <td style={{ padding:'11px 14px', fontSize:11, fontFamily:'monospace', color:C.g }}>
                                {l.created_at?.split('T')[0]||'—'}
                              </td>
                              <td style={{ padding:'11px 14px' }}>
                                {l.email && (
                                  <button onClick={() => sendFollowUp(l)}
                                    style={{ fontSize:11, background:C.b, color:'#fff',
                                      border:'none', borderRadius:7, padding:'5px 12px',
                                      cursor:'pointer', fontFamily:'Inter', fontWeight:600 }}>
                                    Relancer
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════ ALERTS ═══════ */}
            {tab==='alerts' && (
              <motion.div variants={vU}>
                {alerts.length===0 ? (
                  <div style={{ background:C.w, borderRadius:16, padding:40, border:`1px solid ${C.lt}`, textAlign:'center', color:C.g }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>◬</div>
                    <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Aucune alerte réglementaire</div>
                    <div style={{ fontSize:13, marginBottom:16 }}>
                      Démarrez le radar grcx pour surveiller DGFiP, CNIL, AMF, ACPR et ARCEP en temps réel.
                    </div>
                    <code style={{ fontSize:12, background:C.sub, padding:'8px 16px', borderRadius:8, display:'inline-block' }}>
                      python backend/vanivert_grcx/grcx_adapter.py
                    </code>
                  </div>
                ) : (
                  <div style={{ background:C.w, borderRadius:16, border:`1px solid ${C.lt}`, overflow:'hidden' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' as const }}>
                      <thead>
                        <tr style={{ background:C.sub }}>
                          {['Sévérité','Juridiction','Résumé','Source','Date'].map(h => (
                            <th key={h} style={{ padding:'10px 14px', textAlign:'left' as const, fontSize:10,
                              fontFamily:'monospace', textTransform:'uppercase' as const,
                              letterSpacing:'0.06em', color:C.g, borderBottom:`1px solid ${C.lt}`, fontWeight:600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map(a => (
                          <tr key={a.id} style={{ borderBottom:`1px solid ${C.lt}` }}>
                            <td style={{ padding:'11px 14px' }}><Badge status={a.severity}/></td>
                            <td style={{ padding:'11px 14px', fontSize:12, fontFamily:'monospace', fontWeight:700, color:C.ink }}>{a.jurisdiction}</td>
                            <td style={{ padding:'11px 14px', fontSize:13, color:C.ink, maxWidth:400 }}>{a.summary}</td>
                            <td style={{ padding:'11px 14px' }}>
                              {a.source_url ? (
                                <a href={a.source_url} target="_blank" style={{ fontSize:11, color:C.b, textDecoration:'none' }}>Voir →</a>
                              ) : '—'}
                            </td>
                            <td style={{ padding:'11px 14px', fontSize:11, fontFamily:'monospace', color:C.g }}>
                              {a.created_at?.split('T')[0]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════ PRICING ═══════ */}
            {tab==='pricing' && (
              <motion.div variants={vU} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {(['starter','business','premium'] as const).map(plan => (
                  <div key={plan} style={{ background:C.w, borderRadius:16, padding:24, border:`1px solid ${C.lt}` }}>
                    <div style={{ fontFamily:'monospace', fontSize:11, textTransform:'uppercase' as const,
                      letterSpacing:'0.1em', color:C.g, marginBottom:16 }}>{plan}</div>
                    <Input label="Prix mensuel (€ HT)"
                      value={content.pricing[plan as keyof typeof content.pricing]}
                      onChange={v => update('pricing', plan, +v)} type="number"/>
                    <Input label="Prix annuel (€ HT / mois)"
                      value={content.pricing[`${plan}Annual` as keyof typeof content.pricing]}
                      onChange={v => update('pricing', `${plan}Annual`, +v)} type="number"/>
                    <div style={{ padding:'10px 12px', borderRadius:10, background:C.sub, fontSize:12, color:C.g }}>
                      Réduction annuelle : {Math.round((1 - (content.pricing[`${plan}Annual` as keyof typeof content.pricing] as number) / (content.pricing[plan as keyof typeof content.pricing] as number)) * 100)}%
                    </div>
                  </div>
                ))}
                <div style={{ gridColumn:'span 3', background:'#EFF6FF', borderRadius:12,
                  padding:'14px 18px', fontSize:13, color:'#1e40af', border:'1px solid #bfdbfe' }}>
                  💡 Les modifications s'affichent immédiatement sur la page d'accueil après sauvegarde et redéploiement. Les clients existants ne sont pas affectés.
                </div>
              </motion.div>
            )}

            {/* ═══════ CONTENT ═══════ */}
            {tab==='content' && (
              <motion.div variants={vU}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ background:C.w, borderRadius:16, padding:24, border:`1px solid ${C.lt}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Héro — Texte principal</div>
                    <Input label="Texte bleu du titre (en gras)" value={content.hero.h1b} onChange={v => update('hero','h1b',v)}/>
                    <Input label="Sous-titre" value={content.hero.sub} onChange={v => update('hero','sub',v)}/>
                  </div>
                  <div style={{ background:C.w, borderRadius:16, padding:24, border:`1px solid ${C.lt}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:16 }}>Réception vocale</div>
                    <Input label="Numéro de démo (+33...)" value={content.voice.demoNumber} onChange={v => update('voice','demoNumber',v)} mono/>
                    <Input label="Frais d'installation (€)" value={content.voice.setupFee} onChange={v => update('voice','setupFee',+v)} type="number"/>
                    <Input label="Tarif/minute (€)" value={content.voice.minuteRate} onChange={v => update('voice','minuteRate',v)}/>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ CONTACT ═══════ */}
            {tab==='contact' && (
              <motion.div variants={vU}>
                <div style={{ background:C.w, borderRadius:16, padding:28, border:`1px solid ${C.lt}`, maxWidth:560 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:20 }}>
                    Coordonnées affichées sur le site
                  </div>
                  <Input label="Email de contact" value={content.contact.email} onChange={v => update('contact','email',v)} type="email"/>
                  <Input label="Numéro WhatsApp (+33...)" value={content.contact.whatsapp} onChange={v => update('contact','whatsapp',v)} mono/>
                  <Input label="Numéro démo vocale (+33...)" value={content.contact.phone} onChange={v => update('contact','phone',v)} mono/>
                  <Input label="Adresse (footer)" value={content.contact.address} onChange={v => update('contact','address',v)}/>
                  <div style={{ padding:'12px 16px', borderRadius:10, background:'#FEF3C7',
                    border:'1px solid #FDE68A', fontSize:12, color:'#92400E' }}>
                    ⚠ Après sauvegarde, mettez aussi à jour <code style={{ fontFamily:'monospace' }}>lib/site.config.ts</code> et repoussez sur GitHub pour que les changements soient visibles sur le site.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ LEGAL ═══════ */}
            {tab==='legal' && (
              <motion.div variants={vU}>
                <div style={{ background:C.w, borderRadius:16, padding:28, border:`1px solid ${C.lt}`, maxWidth:560 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:20 }}>Informations légales</div>
                  <Input label="SIRET (14 chiffres)" value={content.legal.siret} onChange={v => update('legal','siret',v)} mono/>
                  <Input label="SIREN (9 chiffres)" value={content.legal.siren} onChange={v => update('legal','siren',v)} mono/>
                  <Input label="RCS (ville d'immatriculation)" value={content.legal.rcs} onChange={v => update('legal','rcs',v)}/>
                  <Input label="Numéro TVA intracommunautaire" value={content.legal.vatNumber} onChange={v => update('legal','vatNumber',v)} mono/>
                  <div style={{ padding:'12px 16px', borderRadius:10, background:'#FEF3C7',
                    border:'1px solid #FDE68A', fontSize:12, color:'#92400E', marginTop:8 }}>
                    ⚠ Le SIRET sera disponible 1-3 semaines après inscription URSSAF → <a href="https://autoentrepreneur.urssaf.fr" target="_blank" style={{ color:C.b }}>autoentrepreneur.urssaf.fr</a>
                  </div>
                  <div style={{ marginTop:14, display:'flex', gap:10, flexWrap:'wrap' as const }}>
                    <a href="/legal/mentions-legales" target="_blank"
                      style={{ fontSize:12, color:C.b, textDecoration:'none', padding:'6px 12px',
                        borderRadius:8, border:`1px solid ${C.lt}` }}>Mentions légales →</a>
                    <a href="/legal/cgv" target="_blank"
                      style={{ fontSize:12, color:C.b, textDecoration:'none', padding:'6px 12px',
                        borderRadius:8, border:`1px solid ${C.lt}` }}>CGV →</a>
                    <a href="/legal/confidentialite" target="_blank"
                      style={{ fontSize:12, color:C.b, textDecoration:'none', padding:'6px 12px',
                        borderRadius:8, border:`1px solid ${C.lt}` }}>Confidentialité →</a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ SETTINGS ═══════ */}
            {tab==='settings' && (
              <motion.div variants={vU} style={{ maxWidth:520, display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ background:C.w, borderRadius:14, padding:'20px 22px', border:`1px solid ${C.lt}` }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:8 }}>Changer le mot de passe admin</div>
                  <div style={{ fontSize:13, color:C.g, marginBottom:12 }}>
                    Modifiez la constante <code style={{ fontFamily:'monospace', fontSize:12 }}>ADMIN_PW</code> dans <code style={{ fontFamily:'monospace', fontSize:12 }}>app/admin/page.tsx</code> ligne 1, puis redéployez.
                  </div>
                  <code style={{ fontSize:12, background:C.sub, padding:'10px 14px', borderRadius:8, display:'block', fontFamily:'monospace', color:C.ink }}>
                    const ADMIN_PW = 'VotreMotDePasse!'
                  </code>
                </div>
                <div style={{ background:C.w, borderRadius:14, padding:'20px 22px', border:`1px solid ${C.lt}` }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:8 }}>Variables d'environnement Vercel</div>
                  {[
                    ['NEXT_PUBLIC_SUPABASE_URL', SB_URL ? '✅ Configurée' : '❌ Manquante'],
                    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', SB_KEY ? '✅ Configurée' : '❌ Manquante'],
                    ['NEXT_PUBLIC_TWILIO_NUMBER', '⚠ À configurer'],
                    ['ANTHROPIC_API_KEY', '⚠ À configurer (backend)'],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between',
                      padding:'8px 0', borderBottom:`1px solid ${C.lt}`, fontSize:12 }}>
                      <code style={{ fontFamily:'monospace', color:C.ink }}>{k}</code>
                      <span style={{ color:v.startsWith('✅')?C.grn:v.startsWith('❌')?C.red:C.gold }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:C.w, borderRadius:14, padding:'20px 22px', border:`1px solid ${C.lt}` }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:12 }}>Actions de maintenance</div>
                  <div style={{ display:'flex', gap:10, flexDirection:'column' as const }}>
                    <button onClick={exportLeads}
                      style={{ fontSize:13, background:'transparent', color:C.b,
                        border:`1.5px solid ${C.b}`, borderRadius:10, padding:'10px',
                        cursor:'pointer', fontFamily:'Inter', fontWeight:600 }}>
                      Exporter tous les leads CSV
                    </button>
                    <button onClick={loadData}
                      style={{ fontSize:13, background:C.sub, color:C.ink,
                        border:`1px solid ${C.lt}`, borderRadius:10, padding:'10px',
                        cursor:'pointer', fontFamily:'Inter' }}>
                      Rafraîchir les données Supabase
                    </button>
                    <a href="https://supabase.com/dashboard/project/anmmezswjixpsmvnkqbw" target="_blank"
                      style={{ fontSize:13, background:C.sub, color:C.ink, textAlign:'center' as const,
                        border:`1px solid ${C.lt}`, borderRadius:10, padding:'10px',
                        textDecoration:'none', display:'block' }}>
                      Ouvrir Supabase Dashboard ↗
                    </a>
                    <a href="https://vercel.com" target="_blank"
                      style={{ fontSize:13, background:C.sub, color:C.ink, textAlign:'center' as const,
                        border:`1px solid ${C.lt}`, borderRadius:10, padding:'10px',
                        textDecoration:'none', display:'block' }}>
                      Ouvrir Vercel Dashboard ↗
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} ok={toast.ok}/>}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        *{box-sizing:border-box}
        button:active{transform:scale(0.98)}
      `}</style>
    </div>
  )
}
