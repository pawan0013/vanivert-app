'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG    = 'linear-gradient(160deg,#0F3843 0%,#0A2030 40%,#020617 100%)'
const BG_S  = 'linear-gradient(160deg,#0B2D38 0%,#071520 100%)'
const BG_D  = 'linear-gradient(160deg,#061D28 0%,#020D16 100%)'
const CARD  = 'rgba(30,41,59,0.55)'
const LIME  = '#84CC16'
const LIME2 = '#6BAE0F'
const LIME_LT = 'rgba(132,204,22,0.13)'
const LIME_GL = 'rgba(132,204,22,0.22)'
const TEAL  = '#2DD4BF'
const WHITE = '#FFFFFF'
const OFF   = '#F1F5F9'
const MUTED = '#94A3B8'
const SUBTLE= '#64748B'
const RED   = '#F87171'
const GR    = '#4ADE80'
const BDR   = 'rgba(100,200,200,0.12)'
const BDR2  = 'rgba(100,200,200,0.22)'
const BDR_L = 'rgba(132,204,22,0.30)'
const FH    = "'Plus Jakarta Sans',system-ui,sans-serif"
const FB    = "'Inter',system-ui,sans-serif"
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const JOBS_KEY = 'vanivert_jobs_v1'

// ── DEFAULT JOB LISTINGS ──────────────────────────────────────────────────────
export const DEFAULT_JOBS = [
  {
    id: 'bde-paris',
    title: 'Business Developer, Agences immobilières',
    type: 'Stage / Alternance',
    location: 'Paris ou Île-de-France, hybride',
    duration: 'Dès septembre 2026 · 4 à 6 mois',
    color: LIME,
    published: true,
    tags: ['BDE','Vente B2B','Immobilier','Stage'],
    mission: "Vanivert entre en phase de déploiement commercial actif. On cherche quelqu'un qui aime décrocher son téléphone, qui comprend les agences immobilières et qui veut voir son travail se transformer en contrats signés, pas en slides.",
    responsibilities: [
      'Prospecter les directeurs d\'agences indépendantes en Île-de-France (téléphone, email, LinkedIn)',
      'Qualifier les besoins, organiser les démos produit avec le co-fondateur',
      'Gérer le pipeline de prospects dans notre CRM Vanivert (on mange notre propre cuisine)',
      'Rédiger les propositions commerciales et suivre les négociations jusqu\'à la signature',
      'Remonter les retours terrain pour faire évoluer le produit et le pitch',
      'Participer aux campagnes d\'appels IA vocaux et analyser les résultats',
    ],
    profile: [
      'Formation commerce, école de management, IAE ou équivalent (Bac+3 minimum)',
      'Un vrai goût pour la vente : de la pratique, pas de la théorie',
      'À l\'aise au téléphone, persévérant sans être lourd',
      'Connaissance du secteur immobilier appréciée (famille dans l\'immo, stage précédent...)',
      'Autonome, capable de s\'organiser sans qu\'on te tienne la main',
      'Français courant natif ou bilingue obligatoire, anglais conversationnel',
    ],
    offer: [
      "Rémunération 100 % à la commission : jusqu'à 1 000 € par contrat signé les 2 premiers mois",
      'Pas de plafond : plus tu signes, plus tu gagnes',
      'Modèle revu ensemble dès le 3e mois selon les résultats obtenus',
      'Accès complet à tous nos outils IA dès le premier jour',
      'Mentorat direct avec les fondateurs, zéro hiérarchie inutile',
      'Poste long terme envisagé si les résultats sont là',
    ],
  },
  {
    id: 'voice-ai-trainer',
    title: 'Entraîneur IA vocale, Immobilier français',
    type: 'Freelance / Mission',
    location: 'Full remote, France',
    duration: 'Dès août 2026 · Mission de 2 à 4 semaines',
    color: TEAL,
    published: true,
    tags: ['IA','Voice AI','NLP','Freelance'],
    mission: 'Sophie, notre agent vocal IA, doit parler comme un vrai conseiller immobilier français, et non comme un robot traduit de l\'anglais. On cherche quelqu\'un qui comprend à la fois les conversations immobilières et comment entraîner un modèle de langage.',
    responsibilities: [
      'Écouter et annoter des centaines d\'appels réels (décrochés ou manqués) pour identifier les patterns',
      'Rédiger des scripts de conversation naturels pour les scénarios d\'achat, de vente et de location',
      'Créer des jeux de données d\'entraînement : intentions, entités, réponses attendues',
      'Tester Sophie en conditions réelles et identifier les erreurs de compréhension ou de ton',
      'Proposer des formulations alternatives pour les réponses qui sonnent trop "bot"',
      'Documenter les règles métier (DPE, mandat, commission, visite, compromis...)',
    ],
    profile: [
      'Expérience en NLP, prompt engineering ou annotation de données conversationnelles',
      "Français natif ou niveau bilingue obligatoire : tu dois entendre quand une formulation sonne faux à l'oreille d'un Français",
      'Connaissance du vocabulaire immobilier français (mandat, DPE, compromis, acte authentique...)',
      'Sens du détail linguistique : vous entendez quand une phrase sonne faux',
      'Expérience avec des outils LLM (OpenAI, Mistral, ElevenLabs ou équivalent) appréciée',
      'Capacité à livrer de façon autonome sur une mission courte et dense',
    ],
    offer: [
      'Tarif journalier compétitif, à discuter selon profil et expérience',
      'Mission 100 % remote, organisation flexible',
      'Accès à notre infrastructure IA complète pour les tests',
      'Possibilité de mission récurrente sur les prochains mois',
      'Travailler sur un produit en production réelle, pas un POC',
    ],
  },
]

type Job = typeof DEFAULT_JOBS[0]

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Logo({s=30}:{s?:number}) {
  const cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.15
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={LIME} strokeWidth={1} fill="none" strokeOpacity="0.5"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill={LIME} opacity={i%2===0?"0.9":"0.5"}/>)}
      <circle cx={cx} cy={cy} r={cr} fill={LIME}/>
    </svg>
  )
}

function FadeUp({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}) {
  const ref=useRef<HTMLDivElement>(null)
  const inV=useInView(ref,{once:true,margin:'-40px'})
  return (
    <motion.div ref={ref} initial={{opacity:0,y:22}} animate={inV?{opacity:1,y:0}:{}}
      transition={{duration:0.65,ease:EZ,delay}} style={style}>
      {children}
    </motion.div>
  )
}

// ── APPLICATION FORM ──────────────────────────────────────────────────────────
function ApplyForm({job,onClose}:{job:Job;onClose:()=>void}) {
  const [prenom,setPrenom]=useState('')
  const [nom,setNom]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [linkedin,setLinkedin]=useState('')
  const [portfolio,setPortfolio]=useState('')
  const [message,setMessage]=useState('')
  const [cvName,setCvName]=useState('')
  const [cvB64,setCvB64]=useState('')
  const [sent,setSent]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const fileRef=useRef<HTMLInputElement>(null)

  function handleFile(e:React.ChangeEvent<HTMLInputElement>) {
    const f=e.target.files?.[0]
    if(!f) return
    if(f.size>5*1024*1024){setError('Fichier trop lourd (5 Mo max)');return}
    setCvName(f.name)
    const reader=new FileReader()
    reader.onload=ev=>{setCvB64((ev.target?.result as string).split(',')[1]||'')}
    reader.readAsDataURL(f)
  }

  async function submit(e:React.FormEvent) {
    e.preventDefault()
    if(!prenom||!nom||!email){setError('Prénom, nom et email requis');return}
    if(!message){setError('Dites-nous quelques mots sur votre candidature');return}
    setError('');setLoading(true)
    try {
      const res = await fetch('/api/apply',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          job_id: job.id,
          job_title: job.title,
          prenom,nom,email,phone,linkedin,portfolio,message,
          cv_filename: cvName,
          cv_base64: cvB64,
        })
      })
      if(!res.ok) throw new Error('Erreur serveur')
      setSent(true)
    } catch {
      setError('Une erreur est survenue. Envoyez directement à team@vanivert.eu')
    }
    setLoading(false)
  }

  const inp:React.CSSProperties={width:'100%',padding:'12px 14px',borderRadius:12,border:`1px solid ${BDR2}`,fontSize:13,outline:'none',color:WHITE,fontFamily:FB,background:'rgba(30,41,59,0.60)',boxSizing:'border-box' as const}

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:500,background:'rgba(2,6,23,0.85)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <motion.div initial={{opacity:0,y:24,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:24}}
        transition={{duration:0.35,ease:EZ}}
        style={{background:'#0B1E2D',border:`1px solid ${BDR2}`,borderRadius:24,padding:'32px 28px',width:'100%',maxWidth:560,maxHeight:'90dvh',overflowY:'auto' as const,position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.08)',border:`1px solid ${BDR}`,borderRadius:8,color:MUTED,fontSize:14,cursor:'pointer',padding:'6px 10px',fontFamily:FB}}>✕</button>
        <div style={{fontSize:11,fontWeight:700,color:job.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:8}}>{job.type}</div>
        <h2 style={{fontFamily:FH,fontWeight:700,fontSize:18,color:WHITE,marginBottom:24,lineHeight:1.3}}>{job.title}</h2>

        {sent ? (
          <div style={{textAlign:'center' as const,padding:'32px 0'}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <div style={{fontSize:18,fontWeight:700,color:WHITE,marginBottom:8,fontFamily:FH}}>Candidature envoyée !</div>
            <div style={{fontSize:14,color:MUTED,lineHeight:1.7,fontFamily:FB}}>On revient vers vous sous 48h ouvrées. En attendant, testez Sophie au <a href="tel:+33221826074" style={{color:LIME}}>02 21 82 60 74</a></div>
            <button onClick={onClose} style={{marginTop:24,padding:'12px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,border:'none',cursor:'pointer',fontFamily:FH}}>Fermer</button>
          </div>
        ) : (
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <input required value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Prénom *" style={inp}/>
              <input required value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom *" style={inp}/>
            </div>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email *" style={inp}/>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Téléphone" style={inp}/>
            <input value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="Profil LinkedIn (url)" style={inp}/>
            <input value={portfolio} onChange={e=>setPortfolio(e.target.value)} placeholder="Portfolio / GitHub / site perso (optionnel)" style={inp}/>
            <textarea required value={message} onChange={e=>setMessage(e.target.value)} placeholder={`Pourquoi ce poste ? Qu'est-ce qui vous correspond dans ce que fait Vanivert ? (3-5 lignes)`} rows={5} style={{...inp,resize:'vertical' as const}}/>
            {/* CV upload */}
            <div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={handleFile}/>
              <button type="button" onClick={()=>fileRef.current?.click()}
                style={{width:'100%',padding:'12px',borderRadius:12,border:`1.5px dashed ${cvName?LIME:BDR2}`,background:cvName?LIME_LT:'transparent',color:cvName?LIME:MUTED,fontSize:13,cursor:'pointer',fontFamily:FB,transition:'all 0.2s'}}>
                {cvName ? `✓ ${cvName}` : '📎 Joindre votre CV (PDF, max 5 Mo, optionnel)'}
              </button>
            </div>
            {error&&<p style={{fontSize:12,color:RED,fontFamily:FB,margin:0}}>{error}</p>}
            <p style={{fontSize:11,color:SUBTLE,fontFamily:FB,lineHeight:1.55}}>En envoyant ce formulaire, vous acceptez que vos données soient utilisées pour l&apos;instruction de votre candidature. Données stockées en Europe, supprimées après 6 mois. <a href="/legal/confidentialite" style={{color:LIME}}>Confidentialité</a></p>
            <button type="submit" disabled={loading}
              style={{padding:'14px',borderRadius:980,background:loading?'rgba(255,255,255,0.1)':LIME,color:loading?MUTED:'#000',fontWeight:700,fontSize:14,border:'none',cursor:loading?'not-allowed':'pointer',fontFamily:FH,transition:'all 0.2s'}}
              onMouseEnter={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background=LIME}}>
              {loading?'Envoi en cours...':'Envoyer ma candidature →'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── JOB CARD ──────────────────────────────────────────────────────────────────
function JobCard({job,onApply}:{job:Job;onApply:()=>void}) {
  const [open,setOpen]=useState(false)
  return (
    <FadeUp>
      <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:20,overflow:'hidden',marginBottom:16,transition:'box-shadow 0.25s'}}>
        {/* Summary row */}
        <div style={{padding:'28px 32px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap' as const}}>
          <div style={{flex:1,minWidth:260}}>
            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap' as const}}>
              {job.tags.map(t=>(
                <span key={t} style={{fontSize:10,fontWeight:700,color:job.color,background:`${job.color}15`,padding:'3px 10px',borderRadius:980,fontFamily:FB}}>{t}</span>
              ))}
            </div>
            <h3 style={{fontFamily:FH,fontWeight:700,fontSize:19,color:WHITE,marginBottom:8,lineHeight:1.25}}>{job.title}</h3>
            <div style={{display:'flex',gap:16,flexWrap:'wrap' as const}}>
              <span style={{fontSize:12,color:MUTED,fontFamily:FB}}>📍 {job.location}</span>
              <span style={{fontSize:12,color:MUTED,fontFamily:FB}}>🗓 {job.duration}</span>
              <span style={{fontSize:12,fontWeight:600,color:job.color,fontFamily:FB}}>⚡ {job.type}</span>
            </div>
          </div>
          <div style={{display:'flex',gap:10,flexShrink:0}}>
            <button onClick={()=>setOpen(!open)}
              style={{padding:'10px 18px',borderRadius:980,border:`1.5px solid ${BDR2}`,background:'transparent',color:MUTED,fontSize:13,cursor:'pointer',fontFamily:FB,transition:'all 0.2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=job.color;(e.currentTarget as HTMLElement).style.color=job.color}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
              {open?'Masquer ▲':'Voir le poste ▼'}
            </button>
            <button onClick={onApply}
              style={{padding:'10px 22px',borderRadius:980,background:job.color,color:'#000',fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:FH,transition:'background 0.2s',boxShadow:`0 4px 16px ${job.color}30`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=job.color}}>
              Postuler →
            </button>
          </div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.35,ease:EZ}}
              style={{overflow:'hidden',borderTop:`1px solid ${BDR}`}}>
              <div style={{padding:'28px 32px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24}} className="job-grid">
                {/* Mission */}
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:job.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:10}}>La mission</div>
                  <p style={{fontSize:13,color:MUTED,lineHeight:1.7,fontFamily:FB,marginBottom:14}}>{job.mission}</p>
                  <div style={{fontSize:10,fontWeight:700,color:job.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:10}}>Ce que tu feras</div>
                  {job.responsibilities.map((r,i)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                      <span style={{color:job.color,fontSize:10,marginTop:3,flexShrink:0}}>▶</span>
                      <span style={{fontSize:12,color:MUTED,lineHeight:1.55,fontFamily:FB}}>{r}</span>
                    </div>
                  ))}
                </div>
                {/* Profile */}
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:job.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:10}}>Ton profil</div>
                  {job.profile.map((p,i)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                      <span style={{color:GR,fontSize:10,marginTop:3,flexShrink:0}}>✓</span>
                      <span style={{fontSize:12,color:MUTED,lineHeight:1.55,fontFamily:FB}}>{p}</span>
                    </div>
                  ))}
                </div>
                {/* Offer */}
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:job.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:10}}>Ce qu&apos;on offre</div>
                  {job.offer.map((o,i)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                      <span style={{color:LIME,fontSize:10,marginTop:3,flexShrink:0}}>★</span>
                      <span style={{fontSize:12,color:MUTED,lineHeight:1.55,fontFamily:FB}}>{o}</span>
                    </div>
                  ))}
                  <button onClick={onApply} style={{marginTop:16,width:'100%',padding:'12px',borderRadius:980,background:job.color,color:'#000',fontWeight:700,fontSize:13,border:'none',cursor:'pointer',fontFamily:FH}}>
                    Postuler à ce poste →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Carrieres() {
  const [jobs,setJobs]=useState<Job[]>(DEFAULT_JOBS)
  const [applying,setApplying]=useState<Job|null>(null)

  // Load any admin overrides from localStorage
  if(typeof window!=='undefined') {
    try {
      const s=localStorage.getItem(JOBS_KEY)
      if(s && jobs===DEFAULT_JOBS) setJobs(JSON.parse(s).filter((j:Job)=>j.published))
    } catch {}
  }

  const published=jobs.filter(j=>j.published)

  return (
    <div style={{minHeight:'100dvh',background:'#020617',color:OFF,fontFamily:FB}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020617;overflow-x:hidden}
        ::-webkit-scrollbar{display:none}
        input::placeholder,textarea::placeholder{color:#64748B}
        @media(max-width:768px){.job-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',background:'rgba(2,6,23,0.95)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${BDR}`}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
          <Logo s={28}/>
          <span style={{fontFamily:FH,fontWeight:700,fontSize:16,color:WHITE,letterSpacing:'-0.02em'}}>Vanivert</span>
          <span style={{fontSize:11,color:SUBTLE,fontFamily:FB,marginLeft:4}}>/ Carrières</span>
        </a>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none',fontFamily:FB}}>Retour au site</a>
          <a href="mailto:team@vanivert.eu" style={{padding:'9px 18px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',fontFamily:FH}}>
            Candidature spontanée
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:BG,padding:'80px 32px 64px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',right:'10%',width:'50vw',height:'50vw',maxWidth:600,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.06) 0%,transparent 65%)`,pointerEvents:'none'}}/>
        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:GR,boxShadow:`0 0 10px ${GR}`}}/>
              <span style={{fontSize:11,fontWeight:600,color:GR,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB}}>{published.length} poste{published.length>1?'s':''} ouvert{published.length>1?'s':''} · recrutement actif</span>
            </div>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:EZ,delay:0.08}}
            style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(36px,5vw,60px)',color:WHITE,lineHeight:1.06,marginBottom:18,letterSpacing:'-0.035em'}}>
            Construisez l&apos;avenir<br/><span style={{color:LIME}}>de l&apos;immobilier français.</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.18}}
            style={{fontSize:17,color:MUTED,lineHeight:1.75,maxWidth:560,marginBottom:36,fontFamily:FB}}>
            On lance Vanivert en production en septembre 2026. On cherche des gens qui veulent construire quelque chose de vrai, pas mettre leur logo sur un slide de présentation.
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} style={{display:'flex',gap:32,flexWrap:'wrap' as const}}>
            {[['🚀','Lancement sept. 2026'],['🇫🇷','Paris / Remote'],['🤝','Équipe de 3 fondateurs'],['🏠','SaaS immobilier']].map(([icon,label])=>(
              <div key={label} style={{fontSize:13,color:MUTED,fontFamily:FB,display:'flex',alignItems:'center',gap:8}}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{background:BG_D,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'52px 32px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}} className="job-grid">
            {[
              {icon:'🎯',title:'Vrai terrain dès le premier jour',body:'Pas de stage de 6 mois à apporter des cafés. Dès le premier jour, vrais clients, vrai produit, vraies responsabilités.'},
              {icon:'🧠',title:'Vous travaillez avec l\'IA, vraiment',body:'On utilise nos propres outils au quotidien. Vanivert, Sophie, le bot WhatsApp : vous aurez accès à tout et vous contribuerez à les améliorer.'},
              {icon:'📈',title:'Perspective de long terme',body:'On cherche des gens avec qui on a envie de continuer. Les stages se transforment en postes quand ça colle.'},
            ].map(v=>(
              <FadeUp key={v.title}>
                <div style={{padding:'22px 20px',borderRadius:16,background:CARD,border:`1px solid ${BDR}`}}>
                  <div style={{fontSize:28,marginBottom:12}}>{v.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:WHITE,marginBottom:8,fontFamily:FH}}>{v.title}</div>
                  <div style={{fontSize:13,color:MUTED,lineHeight:1.65,fontFamily:FB}}>{v.body}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* JOB LISTINGS */}
      <section style={{background:BG_S,padding:'72px 32px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <FadeUp style={{marginBottom:36}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Postes ouverts</span>
            </div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,38px)',color:WHITE,letterSpacing:'-0.03em'}}>On recrute maintenant.</h2>
          </FadeUp>
          {published.length===0 ? (
            <div style={{textAlign:'center' as const,padding:'48px 0',color:MUTED,fontFamily:FB}}>Aucun poste ouvert pour le moment. Envoyez une candidature spontanée à <a href="mailto:team@vanivert.eu" style={{color:LIME}}>team@vanivert.eu</a></div>
          ) : published.map(job=>(
            <JobCard key={job.id} job={job} onApply={()=>setApplying(job)}/>
          ))}
        </div>
      </section>

      {/* SPONTANEOUS */}
      <section style={{background:BG_D,padding:'64px 32px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:600,margin:'0 auto',textAlign:'center' as const}}>
          <FadeUp>
            <div style={{fontSize:36,marginBottom:16}}>👋</div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(22px,3vw,32px)',color:WHITE,marginBottom:12,letterSpacing:'-0.025em'}}>
              Votre profil ne correspond à aucun poste ?
            </h2>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.75,marginBottom:28,fontFamily:FB}}>
              On est ouverts aux profils atypiques. Si vous pensez pouvoir apporter quelque chose à Vanivert, écrivez-nous directement.
            </p>
            <a href="mailto:team@vanivert.eu?subject=Candidature spontanée Vanivert"
              style={{padding:'14px 32px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              Envoyer une candidature spontanée →
            </a>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'rgba(2,6,23,0.99)',borderTop:`1px solid ${BDR}`,padding:'24px 32px',display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10,alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Logo s={20}/>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>© 2026 Vanivert · SIRET 93429900900019</span>
        </div>
        <div style={{display:'flex',gap:20}}>
          {[['Accueil','/'],['Mentions légales','/legal/mentions-legales'],['Confidentialité','/legal/confidentialite']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:12,color:SUBTLE,textDecoration:'none',fontFamily:FB}}>{l}</a>
          ))}
        </div>
      </footer>

      {/* Application modal */}
      <AnimatePresence>
        {applying && <ApplyForm job={applying} onClose={()=>setApplying(null)}/>}
      </AnimatePresence>
    </div>
  )
}
