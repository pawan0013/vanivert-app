'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEFAULT_ARTICLES, type Article } from '@/lib/articles'

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG='#FAFAF8', BG2='#F3F2EE', CARD='#FFFFFF', INK='#0D0D0F'
const VI='#5B6B3A', GOLD='#C8A96E', RED='#EF4444', GR='#22C55E'
const MUTED='rgba(13,13,15,0.50)', SUBTLE='rgba(13,13,15,0.30)'
const BDR='rgba(13,13,15,0.07)', BDR2='rgba(13,13,15,0.13)'

const ADMIN_PASS = 'vanivert2026admin'
const CMS_KEY    = 'vanivert_cms_v4'
const BLOG_KEY   = 'vanivert_blog_v1'
const LEADS_KEY  = 'vanivert_leads_cache'

// ── CMS DEFAULTS ──────────────────────────────────────────────────────────────
const DEFAULT_CMS = {
  hero_h1:         'L\'agence immobilière qui ne dort jamais.',
  hero_sub:        'Chaque appel reçu. Chaque lead centralisé. Chaque visite planifiée. Chaque client fidélisé à vie. Tout ça, pendant que vous faites votre vrai métier.',
  hero_cta1:       'Voir la démo — gratuit',
  hero_cta2:       'Comment ça marche',
  trust_tagline:   'Agences en cours de déploiement pilote',
  pricing_h2:      'Un abonnement. Tout dedans.',
  pricing_sub:     'Tarif sur mesure selon votre volume. Proposition écrite en 24h.',
  contact_h2:      'On vous rappelle. Promis.',
  contact_sub:     'Pas un bot. Pawan Kumar, co-fondateur, vous répond personnellement sous 24h ouvrées.',
  footer_tagline:  'L\'IA immobilière qui ne dort jamais. Fait en Bretagne, déployé partout en France.',
  company_email:   'contact@vanivert.fr',
  company_siret:   '93429900900019',
  company_address: 'Lannion, Côtes-d\'Armor, Bretagne, France',
  company_phone:   '+33 X XX XX XX XX',
  linkedin_url:    'https://www.linkedin.com/company/vanivert',
  pilot_count:     '10+',
  response_time:   '60s',
  cta_demo:        'Réserver une démo',
  cta_features:    'Comment ça marche',
}

type CMS = typeof DEFAULT_CMS

// ── HELPERS ───────────────────────────────────────────────────────────────────
function inp(extra?: React.CSSProperties): React.CSSProperties {
  return { width:'100%', padding:'10px 13px', borderRadius:10, border:`1px solid ${BDR2}`, fontSize:13, outline:'none', color:INK, fontFamily:'system-ui,sans-serif', background:BG, boxSizing:'border-box' as const, ...extra }
}
function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:11, fontWeight:600, color:MUTED, marginBottom:5, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>{children}</div>
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:CARD, border:`1px solid ${BDR}`, borderRadius:16, padding:'24px 22px', marginBottom:16 }}>
      <div style={{ fontSize:13, fontWeight:700, color:INK, marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${BDR}` }}>{title}</div>
      {children}
    </div>
  )
}
function Btn({ children, onClick, color=INK, disabled=false }: { children: React.ReactNode; onClick: ()=>void; color?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:'9px 18px', borderRadius:980, background:color, color:'#fff', fontWeight:600, fontSize:12, border:'none', cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'opacity 0.2s' }}>
      {children}
    </button>
  )
}

// ── SIDEBAR TABS ──────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'cms' | 'blog' | 'leads' | 'settings'
const TABS: [Tab, string, string][] = [
  ['dashboard','📊','Tableau de bord'],
  ['cms','✏️','Contenu site'],
  ['blog','📝','Blog'],
  ['leads','👤','Leads'],
  ['settings','⚙️','Paramètres'],
]

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const [leads, setLeads] = useState<{email:string;name:string;agency_name:string;created_at:string}[]>([])
  useEffect(()=>{
    try {
      const c = localStorage.getItem(LEADS_KEY)
      if (c) setLeads(JSON.parse(c))
    } catch {}
  },[])
  const stats = [
    { label:'Leads reçus', value:leads.length.toString(), color:VI },
    { label:'Cette semaine', value:leads.filter(l=>Date.now()-new Date(l.created_at).getTime()<7*86400000).length.toString(), color:GOLD },
    { label:'Articles publiés', value:'4', color:'#3B82F6' },
    { label:'Uptime', value:'99.9%', color:GR },
  ]
  return (
    <div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:400, color:INK, marginBottom:24, fontStyle:'italic' }}>Tableau de bord</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:CARD, border:`1px solid ${BDR}`, borderRadius:14, padding:'20px 18px' }}>
            <div style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:'Georgia,serif', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>
      <Section title="Derniers leads entrants">
        {leads.length===0 ? (
          <p style={{ fontSize:13, color:MUTED }}>Aucun lead enregistré pour l&apos;instant. Les soumissions du formulaire de contact apparaîtront ici (nécessite Supabase configuré).</p>
        ) : (
          <div>
            {leads.slice(0,10).map((l,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', borderRadius:10, background:BG, marginBottom:6, border:`1px solid ${BDR}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:INK }}>{l.name} — {l.agency_name}</div>
                  <div style={{ fontSize:11, color:SUBTLE }}>{l.email}</div>
                </div>
                <div style={{ fontSize:11, color:SUBTLE }}>{new Date(l.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section title="Liens rapides">
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
          {[['Voir le site','/',VI],['Supabase Dashboard','https://supabase.com/dashboard',GOLD],['Vercel Dashboard','https://vercel.com/dashboard','#000'],['LinkedIn','https://linkedin.com/company/vanivert','#0077B5']].map(([l,h,c])=>(
            <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ padding:'8px 16px', borderRadius:980, background:c, color:'#fff', fontWeight:600, fontSize:12, textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── CMS TAB ───────────────────────────────────────────────────────────────────
function CMSTab() {
  const [cms, setCms] = useState<CMS>(DEFAULT_CMS)
  const [saved, setSaved] = useState(false)
  useEffect(()=>{
    try { const s=localStorage.getItem(CMS_KEY); if(s) setCms({...DEFAULT_CMS,...JSON.parse(s)}) } catch {}
  },[])
  function save() {
    try { localStorage.setItem(CMS_KEY, JSON.stringify(cms)); setSaved(true); setTimeout(()=>setSaved(false),2000) } catch {}
  }
  function reset() { if(confirm('Remettre tout le contenu par défaut ?')) { localStorage.removeItem(CMS_KEY); setCms(DEFAULT_CMS) } }
  function Field({ label, field, multiline=false }: { label: string; field: keyof CMS; multiline?: boolean }) {
    return (
      <div style={{ marginBottom:14 }}>
        <Label>{label}</Label>
        {multiline ? (
          <textarea value={cms[field]} onChange={e=>setCms({...cms,[field]:e.target.value})} rows={3} style={inp({resize:'vertical'})}/>
        ) : (
          <input value={cms[field]} onChange={e=>setCms({...cms,[field]:e.target.value})} style={inp()}/>
        )}
      </div>
    )
  }
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:400, color:INK, fontStyle:'italic' }}>Contenu du site</div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn onClick={reset} color={RED}>Réinitialiser</Btn>
          <Btn onClick={save} color={saved?GR:VI}>{saved?'✓ Sauvegardé':'Sauvegarder'}</Btn>
        </div>
      </div>
      <Section title="Hero — Section d'accueil">
        <Field label="Titre principal" field="hero_h1"/>
        <Field label="Sous-titre" field="hero_sub" multiline/>
        <Field label="Bouton CTA 1" field="hero_cta1"/>
        <Field label="Bouton CTA 2" field="hero_cta2"/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><Label>Stat 1 (agences pilotes)</Label><input value={cms.pilot_count} onChange={e=>setCms({...cms,pilot_count:e.target.value})} style={inp()}/></div>
          <div><Label>Stat 2 (délai lead→WhatsApp)</Label><input value={cms.response_time} onChange={e=>setCms({...cms,response_time:e.target.value})} style={inp()}/></div>
        </div>
      </Section>
      <Section title="Agences de confiance">
        <Field label="Tagline sous le ticker" field="trust_tagline"/>
      </Section>
      <Section title="Tarifs">
        <Field label="Titre section tarifs" field="pricing_h2"/>
        <Field label="Sous-titre tarifs" field="pricing_sub" multiline/>
      </Section>
      <Section title="Contact">
        <Field label="Titre section contact" field="contact_h2"/>
        <Field label="Sous-titre contact" field="contact_sub" multiline/>
      </Section>
      <Section title="Entreprise &amp; footer">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><Label>Email de contact</Label><input value={cms.company_email} onChange={e=>setCms({...cms,company_email:e.target.value})} style={inp()}/></div>
          <div><Label>Téléphone</Label><input value={cms.company_phone} onChange={e=>setCms({...cms,company_phone:e.target.value})} style={inp()}/></div>
          <div><Label>SIRET</Label><input value={cms.company_siret} onChange={e=>setCms({...cms,company_siret:e.target.value})} style={inp()}/></div>
          <div><Label>LinkedIn URL</Label><input value={cms.linkedin_url} onChange={e=>setCms({...cms,linkedin_url:e.target.value})} style={inp()}/></div>
        </div>
        <div style={{ marginTop:12 }}><Label>Adresse complète</Label><input value={cms.company_address} onChange={e=>setCms({...cms,company_address:e.target.value})} style={inp()}/></div>
        <div style={{ marginTop:12 }}><Label>Tagline footer</Label><input value={cms.footer_tagline} onChange={e=>setCms({...cms,footer_tagline:e.target.value})} style={inp()}/></div>
      </Section>
    </div>
  )
}

// ── BLOG TAB ─────────────────────────────────────────────────────────────────
function BlogTab() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editing, setEditing] = useState<Article|null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(()=>{
    try {
      const s=localStorage.getItem(BLOG_KEY)
      setArticles(s ? JSON.parse(s) : DEFAULT_ARTICLES)
    } catch { setArticles(DEFAULT_ARTICLES) }
  },[])

  function persist(list: Article[]) {
    setArticles(list)
    try { localStorage.setItem(BLOG_KEY, JSON.stringify(list)) } catch {}
  }

  function saveEdit() {
    if (!editing) return
    const exists = articles.find(a=>a.slug===editing.slug)
    const next = exists ? articles.map(a=>a.slug===editing.slug?editing:a) : [...articles, editing]
    persist(next); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  function newArticle() {
    setEditing({
      slug: `article-${Date.now()}`,
      title: 'Nouvel article',
      excerpt: '',
      category: 'IA & Immobilier',
      categoryColor: '#5B6B3A',
      date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
      imageAlt: '',
      body: '',
      published: false,
    })
  }

  function deleteArticle(slug: string) {
    if (!confirm('Supprimer cet article ?')) return
    persist(articles.filter(a=>a.slug!==slug))
    if (editing?.slug===slug) setEditing(null)
  }

  function togglePublish(slug: string) {
    persist(articles.map(a=>a.slug===slug?{...a,published:!a.published}:a))
  }

  if (editing) {
    return (
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <button onClick={()=>setEditing(null)} style={{ fontSize:13, color:MUTED, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>← Retour</button>
          <div style={{ display:'flex', gap:10 }}>
            <Btn onClick={()=>setEditing(null)} color={MUTED}>Annuler</Btn>
            <Btn onClick={saveEdit} color={saved?GR:VI}>{saved?'✓ Sauvegardé':'Sauvegarder'}</Btn>
          </div>
        </div>
        <Section title="Éditer l'article">
          <div style={{ marginBottom:12 }}><Label>Titre</Label><input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} style={inp()}/></div>
          <div style={{ marginBottom:12 }}><Label>Slug (URL)</Label><input value={editing.slug} onChange={e=>setEditing({...editing,slug:e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')})} style={inp()}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
            <div><Label>Catégorie</Label><input value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})} style={inp()}/></div>
            <div><Label>Couleur catégorie</Label><input value={editing.categoryColor} onChange={e=>setEditing({...editing,categoryColor:e.target.value})} style={inp()}/></div>
            <div><Label>Temps de lecture</Label><input value={editing.readTime} onChange={e=>setEditing({...editing,readTime:e.target.value})} style={inp()}/></div>
          </div>
          <div style={{ marginBottom:12 }}><Label>Extrait (visible sur la liste)</Label><textarea value={editing.excerpt} onChange={e=>setEditing({...editing,excerpt:e.target.value})} rows={3} style={inp({resize:'vertical'})}/></div>
          <div style={{ marginBottom:12 }}><Label>Image URL (Unsplash recommandé)</Label><input value={editing.image} onChange={e=>setEditing({...editing,image:e.target.value})} style={inp()}/></div>
          <div style={{ marginBottom:12 }}><Label>Alt text image</Label><input value={editing.imageAlt} onChange={e=>setEditing({...editing,imageAlt:e.target.value})} style={inp()}/></div>
          <div style={{ marginBottom:12 }}><Label>Corps de l&apos;article (Markdown supporté)</Label><textarea value={editing.body||''} onChange={e=>setEditing({...editing,body:e.target.value})} rows={14} style={inp({resize:'vertical',fontFamily:'monospace',fontSize:12})}/></div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Label>Publié</Label>
            <input type="checkbox" checked={editing.published} onChange={e=>setEditing({...editing,published:e.target.checked})} style={{ width:16, height:16, accentColor:VI }}/>
            <span style={{ fontSize:12, color:MUTED }}>{editing.published?'Visible sur le site':'Brouillon — non visible'}</span>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:400, color:INK, fontStyle:'italic' }}>Articles de blog</div>
        <Btn onClick={newArticle} color={VI}>+ Nouvel article</Btn>
      </div>
      {articles.map(a=>(
        <div key={a.slug} style={{ background:CARD, border:`1px solid ${BDR}`, borderRadius:14, padding:'16px 18px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:INK, marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.title}</div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:10, fontWeight:700, color:a.categoryColor, background:`${a.categoryColor}12`, padding:'2px 8px', borderRadius:980 }}>{a.category}</span>
              <span style={{ fontSize:11, color:SUBTLE }}>{a.date} · {a.readTime}</span>
              <span style={{ fontSize:11, fontWeight:600, color:a.published?GR:MUTED }}>{a.published?'✓ Publié':'Brouillon'}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button onClick={()=>togglePublish(a.slug)} style={{ padding:'6px 12px', borderRadius:980, background:a.published?`${RED}12`:`${GR}12`, color:a.published?RED:GR, fontWeight:600, fontSize:11, border:`1px solid ${a.published?RED:GR}28`, cursor:'pointer' }}>{a.published?'Dépublier':'Publier'}</button>
            <button onClick={()=>setEditing(a)} style={{ padding:'6px 12px', borderRadius:980, background:`${VI}12`, color:VI, fontWeight:600, fontSize:11, border:`1px solid ${VI}28`, cursor:'pointer' }}>Éditer</button>
            <button onClick={()=>deleteArticle(a.slug)} style={{ padding:'6px 12px', borderRadius:980, background:`${RED}10`, color:RED, fontWeight:600, fontSize:11, border:`1px solid ${RED}25`, cursor:'pointer' }}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── LEADS TAB ────────────────────────────────────────────────────────────────
function LeadsTab() {
  const [leads, setLeads] = useState<{name:string;email:string;agency_name:string;agent_count:string;message:string;created_at:string}[]>([])
  useEffect(()=>{
    try { const c=localStorage.getItem(LEADS_KEY); if(c) setLeads(JSON.parse(c)) } catch {}
  },[])
  function exportCSV() {
    const rows = [['Prénom','Email','Agence','Agents','Message','Date'],...leads.map(l=>[l.name,l.email,l.agency_name,l.agent_count,l.message,l.created_at])]
    const csv = rows.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n')
    const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='vanivert-leads.csv'; a.click()
  }
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:400, color:INK, fontStyle:'italic' }}>Leads &amp; démandes de démo</div>
        <Btn onClick={exportCSV} color={VI}>Exporter CSV</Btn>
      </div>
      {leads.length===0 ? (
        <Section title="Aucun lead pour l'instant">
          <p style={{ fontSize:13, color:MUTED, lineHeight:1.6 }}>Les soumissions du formulaire de contact du site apparaîtront ici une fois Supabase configuré et la table <code>demo_requests</code> créée.</p>
          <div style={{ marginTop:14, padding:'12px 16px', borderRadius:10, background:BG, border:`1px solid ${BDR}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:MUTED, marginBottom:8, textTransform:'uppercase' as const }}>SQL — Créer la table</div>
            <pre style={{ fontSize:11, color:INK, fontFamily:'monospace', overflowX:'auto' }}>{`CREATE TABLE demo_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text NOT NULL,
  agency_name text,
  agent_count text,
  message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_public" ON demo_requests FOR INSERT WITH CHECK (true);`}</pre>
          </div>
        </Section>
      ) : (
        leads.map((l,i)=>(
          <div key={i} style={{ background:CARD, border:`1px solid ${BDR}`, borderRadius:14, padding:'16px 18px', marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:13, fontWeight:600, color:INK }}>{l.name} — {l.agency_name}</div>
              <div style={{ fontSize:11, color:SUBTLE }}>{new Date(l.created_at).toLocaleString('fr-FR')}</div>
            </div>
            <div style={{ fontSize:12, color:MUTED, marginBottom:4 }}>{l.email} · {l.agent_count} agents</div>
            {l.message&&<div style={{ fontSize:12, color:INK, background:BG, padding:'8px 12px', borderRadius:8, marginTop:8 }}>{l.message}</div>}
          </div>
        ))
      )}
    </div>
  )
}

// ── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ onLogout }: { onLogout: ()=>void }) {
  const [newPass, setNewPass] = useState('')
  const [saved, setSaved] = useState(false)
  function savePass() {
    if (!newPass || newPass.length<8) { alert('Mot de passe trop court (8 caractères minimum)'); return }
    try { localStorage.setItem('vanivert_admin_pass', newPass); setSaved(true); setTimeout(()=>setSaved(false),2000) } catch {}
  }
  function clearAll() {
    if (!confirm('Effacer TOUTES les données CMS, blog, et leads du localStorage ? (Supabase non affecté)')) return
    try { [CMS_KEY,BLOG_KEY,LEADS_KEY,'vanivert_admin_pass'].forEach(k=>localStorage.removeItem(k)) } catch {}
    alert('Données effacées. La page va se recharger.')
    window.location.reload()
  }
  return (
    <div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:400, color:INK, marginBottom:24, fontStyle:'italic' }}>Paramètres</div>
      <Section title="Sécurité — Mot de passe admin">
        <p style={{ fontSize:13, color:MUTED, marginBottom:14 }}>Le mot de passe par défaut est <code>vanivert2026admin</code>. Changez-le immédiatement en production.</p>
        <div style={{ display:'flex', gap:10 }}>
          <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Nouveau mot de passe" style={{ ...inp(), flex:1 }}/>
          <Btn onClick={savePass} color={saved?GR:VI}>{saved?'✓ Sauvegardé':'Changer'}</Btn>
        </div>
      </Section>
      <Section title="Variables d'environnement requises">
        <div style={{ background:BG, borderRadius:10, padding:'14px 16px', fontFamily:'monospace', fontSize:11, color:INK, lineHeight:1.8 }}>
          <div>NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co</div>
          <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...</div>
        </div>
        <p style={{ fontSize:12, color:MUTED, marginTop:10 }}>À définir dans Vercel → Settings → Environment Variables.</p>
      </Section>
      <Section title="Données locales">
        <p style={{ fontSize:13, color:MUTED, marginBottom:14 }}>Le CMS et les articles de blog sont stockés dans le localStorage du navigateur. Les leads réels nécessitent Supabase.</p>
        <div style={{ display:'flex', gap:10 }}>
          <Btn onClick={clearAll} color={RED}>Effacer toutes les données locales</Btn>
          <Btn onClick={onLogout} color={MUTED}>Déconnexion</Btn>
        </div>
      </Section>
      <Section title="Déploiement">
        <p style={{ fontSize:13, color:MUTED, marginBottom:12 }}>Commandes à exécuter après chaque modification du code :</p>
        <div style={{ background:BG, borderRadius:10, padding:'14px 16px', fontFamily:'monospace', fontSize:11, color:INK, lineHeight:2 }}>
          <div>git add -A &amp;&amp; git commit -m &quot;update content&quot;</div>
          <div>git push origin main</div>
          <div style={{ color:MUTED }}># Vercel déploie automatiquement</div>
        </div>
      </Section>
    </div>
  )
}

// ── MAIN ADMIN ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [err, setErr] = useState(false)
  const [tab, setTab] = useState<Tab>('dashboard')

  useEffect(()=>{
    try { if(sessionStorage.getItem('vanivert_admin_session')==='1') setAuthed(true) } catch {}
  },[])

  function login(e: React.FormEvent) {
    e.preventDefault()
    const stored = (()=>{try{return localStorage.getItem('vanivert_admin_pass')||ADMIN_PASS}catch{return ADMIN_PASS}})()
    if (passInput===stored) {
      try { sessionStorage.setItem('vanivert_admin_session','1') } catch {}
      setAuthed(true); setErr(false)
    } else { setErr(true) }
  }

  function logout() {
    try { sessionStorage.removeItem('vanivert_admin_session') } catch {}
    setAuthed(false); setPassInput('')
  }

  if (!authed) {
    return (
      <div style={{ minHeight:'100dvh', background:BG, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ background:CARD, border:`1px solid ${BDR}`, borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:380 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28 }}>
            <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
              <circle cx={14} cy={14} r={9.8} stroke={VI} strokeWidth={0.62} fill="none" strokeOpacity="0.35"/>
              {Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return<circle key={i} cx={14+9.8*Math.cos(a)} cy={14+9.8*Math.sin(a)} r={1.96} stroke={VI} strokeWidth={0.78} fill={BG} strokeOpacity="0.8"/>})}
              <circle cx={14} cy={14} r={3.92} fill={VI}/>
            </svg>
            <span style={{ fontFamily:'Georgia,serif', fontSize:18, color:INK, fontStyle:'italic' }}>vanivert admin</span>
          </div>
          <form onSubmit={login} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="Mot de passe administrateur" autoFocus
              style={{ ...inp(), borderColor:err?RED:BDR2 }}/>
            {err&&<p style={{ fontSize:12, color:RED, margin:0 }}>Mot de passe incorrect</p>}
            <button type="submit" style={{ padding:'12px', borderRadius:980, background:INK, color:'#fff', fontWeight:600, fontSize:14, border:'none', cursor:'pointer' }}>Accéder au panneau</button>
          </form>
          <p style={{ fontSize:11, color:SUBTLE, marginTop:16, textAlign:'center' }}>Accès réservé aux administrateurs Vanivert</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100dvh', background:BG, display:'flex' }}>
      {/* Sidebar */}
      <div style={{ width:220, background:CARD, borderRight:`1px solid ${BDR}`, padding:'24px 0', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', padding:'0 20px', marginBottom:28 }}>
          <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
            <circle cx={14} cy={14} r={9.8} stroke={VI} strokeWidth={0.62} fill="none" strokeOpacity="0.35"/>
            {Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return<circle key={i} cx={14+9.8*Math.cos(a)} cy={14+9.8*Math.sin(a)} r={1.96} stroke={VI} strokeWidth={0.78} fill={BG} strokeOpacity="0.8"/>})}
            <circle cx={14} cy={14} r={3.92} fill={VI}/>
          </svg>
          <span style={{ fontFamily:'Georgia,serif', fontSize:15, color:INK, fontStyle:'italic' }}>vanivert</span>
        </a>
        {TABS.map(([t,icon,label])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 20px', background:tab===t?`${VI}0D`:'transparent', color:tab===t?VI:MUTED, border:'none', cursor:'pointer', textAlign:'left', fontSize:13, fontWeight:tab===t?600:450, borderLeft:`3px solid ${tab===t?VI:'transparent'}`, transition:'all 0.2s', width:'100%' }}>
            <span>{icon}</span>{label}
          </button>
        ))}
        <div style={{ marginTop:'auto', padding:'0 20px 20px' }}>
          <button onClick={logout} style={{ fontSize:12, color:SUBTLE, background:'none', border:'none', cursor:'pointer', padding:'8px 0' }}>Déconnexion →</button>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex:1, padding:32, overflowY:'auto' as const, maxWidth:'100%' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}>
            {tab==='dashboard'&&<DashboardTab/>}
            {tab==='cms'&&<CMSTab/>}
            {tab==='blog'&&<BlogTab/>}
            {tab==='leads'&&<LeadsTab/>}
            {tab==='settings'&&<SettingsTab onLogout={logout}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
