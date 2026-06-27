'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import {
  motion, AnimatePresence, useScroll, useSpring,
  type Variants
} from 'framer-motion'

const FluidBG = dynamic(() => import('./FluidBackground'), { ssr: false })

/* ─── TOKENS ─── */
const C = {
  bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A',
  g:'#6E6E73', lt:'#E8E8ED', sub:'#F2F2F7',
  b:'#1F49B0', b2:'#163A8C', grn:'#30D158', red:'#FF3B30'
}

/* ─── EASING ─── */
const E:[number,number,number,number] = [0.16,1,0.3,1]

/* ─── VARIANTS ─── */
const vU:Variants = { hidden:{opacity:0,y:32,filter:'blur(4px)'}, visible:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:0.76,ease:E}} }
const vS:Variants = { hidden:{}, visible:{transition:{staggerChildren:0.08}} }
const vL:Variants = { hidden:{opacity:0,x:60}, visible:{opacity:1,x:0,transition:{duration:0.8,ease:E}} }
const vR:Variants = { hidden:{opacity:0,x:-60}, visible:{opacity:1,x:0,transition:{duration:0.8,ease:E}} }
const vK:Variants = { hidden:{opacity:0,scale:0.91,y:24}, visible:{opacity:1,scale:1,y:0,transition:{duration:0.84,ease:E}} }

const VP = {once:true,margin:'-70px'} as const

/* ─── WAVEFORM (fixed heights — no hydration error) ─── */
const WH=[10,22,16,32,18,38,12,28,24,40,14,34,20,30,16,36,22,28,18,40,14,32,20,26,12,30,24,36]
function Wave({dark=false}:{dark?:boolean}) {
  return (
    <svg viewBox="0 0 216 48" style={{width:'100%',height:48}} fill="none">
      {WH.map((h,i)=>(
        <rect key={i} x={i*7.7+1} y={(48-h)/2} width={3.5} rx={2} height={h}
          fill={dark?'rgba(255,255,255,0.55)':C.b} opacity={0.72}
          style={{animation:`wb 1.1s ease-in-out ${(i*0.055).toFixed(2)}s infinite alternate`,transformOrigin:'center'}}/>
      ))}
      <style>{`@keyframes wb{from{transform:scaleY(.22)}to{transform:scaleY(1)}}`}</style>
    </svg>
  )
}

/* ─── COUNTDOWN ─── */
function CD({blue=false}:{blue?:boolean}) {
  const [d,setD]=useState(71)
  useEffect(()=>{
    const f=()=>setD(Math.max(0,Math.ceil((new Date('2026-09-01T00:00:00+02:00').getTime()-Date.now())/86400000)))
    f(); const id=setInterval(f,60000); return ()=>clearInterval(id)
  },[])
  return <span style={{color:blue?C.b:C.ink,fontFamily:'monospace',fontWeight:700}}>{d}</span>
}

/* ─── DASHBOARD MOCKUP ─── */
function Dash() {
  return (
    <div style={{background:'rgba(255,255,255,0.72)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.45)',borderRadius:24,overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,0.08)'}}>
      <div style={{display:'flex',alignItems:'center',gap:6,padding:'10px 16px',background:'rgba(255,255,255,0.5)',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
        {['#FF5F56','#FFBD2E','#27C93F'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
        <span style={{marginLeft:8,fontFamily:'monospace',fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:C.g}}>Smart CFO — Vanivert</span>
      </div>
      <div style={{padding:18,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[{l:'Conformité DGFiP',v:'100%',c:'#22c55e',bg:'#f0fdf4'},{l:'Score Trésorerie',v:'A+',c:C.b,bg:'#eff6ff'},{l:'Factures payées',v:'94%',c:C.ink,bg:C.sub},{l:'Prévision J+30',v:'+8 200 €',c:'#22c55e',bg:'#f0fdf4'}].map(m=>(
          <div key={m.l} style={{borderRadius:12,padding:'14px 12px',background:m.bg}}>
            <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:4}}>{m.l}</div>
            <div style={{fontSize:18,fontWeight:700,color:m.c,fontFamily:'Inter'}}>{m.v}</div>
          </div>
        ))}
        <div style={{gridColumn:'span 2',borderRadius:12,background:C.sub,padding:'12px 14px'}}>
          <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:8}}>Trésorerie temps réel</div>
          <svg viewBox="0 0 300 52" style={{width:'100%',height:40}} fill="none">
            <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.b} stopOpacity="0.16"/><stop offset="100%" stopColor={C.b} stopOpacity="0"/></linearGradient></defs>
            <path d="M0 40 C50 36 80 28 110 20 C140 14 160 18 185 10 C205 4 230 2 260 2 C278 2 290 3 300 2" stroke={C.b} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M0 40 C50 36 80 28 110 20 C140 14 160 18 185 10 C205 4 230 2 260 2 C278 2 290 3 300 2 L300 52 L0 52Z" fill="url(#cg)"/>
            <circle cx="185" cy="10" r="4" fill={C.b}/>
            <line x1="185" y1="10" x2="185" y2="52" stroke={C.b} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.25"/>
            <text x="185" y="7" fill={C.b} fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="600">Aujourd'hui</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ─── INTEGRATIONS DATA ─── */
const INTS=[
  {n:'Pennylane',l:'P',c:'#0052CC',b:'#EEF5FF'},{n:'Qonto',l:'Q',c:'#1A237E',b:'#E8EAF6'},
  {n:'Tiime',l:'T',c:'#F57C00',b:'#FFF3E0'},{n:'Sage',l:'S',c:'#2E7D32',b:'#E8F5E9'},
  {n:'Stripe',l:'S',c:'#4527A0',b:'#EDE7F6'},{n:'GoCardless',l:'G',c:'#00695C',b:'#E0F2F1'},
  {n:'Doctolib',l:'D',c:'#0277BD',b:'#E3F2FD'},{n:'Google Cal',l:'G',c:'#C62828',b:'#FFEBEE'},
  {n:'Cegid',l:'C',c:'#E65100',b:'#FFF3E0'},{n:'Docoon',l:'D',c:'#6A1B9A',b:'#F3E5F5'},
  {n:'Chorus Pro',l:'C',c:'#1B5E20',b:'#E8F5E9'},{n:'Bridge API',l:'B',c:'#01579B',b:'#E1F5FE'},
  {n:'grcx',l:'G',c:C.b,b:'#EEF3FF'},{n:'Pxtly',l:'P',c:'#4A148C',b:'#F3E5F5'},
  {n:'Mistral AI',l:'M',c:C.ink,b:C.sub},{n:'Hetzner',l:'H',c:'#D50000',b:'#FFEBEE'},
  {n:'Supabase',l:'S',c:'#3ECF8E',b:'#E8FDF5'},{n:'n8n',l:'n',c:'#E67E22',b:'#FFF3E0'},
]

/* ─── PLANS ─── */
const PLANS=[
  {name:'Starter',m:9,a:7,pop:false,feats:['Réception vocale 24h/24','200 min incluses/mois','Doctolib ou Google Calendar','Tableau de bord basique','Support email']},
  {name:'Business',m:29,a:24,pop:true,feats:['Tout Starter, plus :','Smart CFO — trésorerie temps réel','Conformité e-facturation (PA certifiée)','500 min vocales/mois','Connexion bancaire (Qonto, BNP, CA)','Alertes et relances automatiques','Radar réglementaire (grcx)']},
  {name:'Premium',m:99,a:82,pop:false,feats:['Tout Business, plus :','BD automatisé — 30 leads/mois','ERP complet (Sage, Cegid)','1 500 min vocales/mois','Document Intelligence (Pxtly)','Onboarding dédié','Support prioritaire']},
]

/* ─── GLASS STYLE ─── */
const GL={background:'rgba(255,255,255,0.68)',backdropFilter:'blur(22px)',WebkitBackdropFilter:'blur(22px)',border:'1px solid rgba(255,255,255,0.40)',boxShadow:'0 8px 32px rgba(0,0,0,0.06)'}

/* ─── BTN HOVER HELPERS ─── */
function hoverDark(el:HTMLElement,on:boolean){el.style.background=on?C.b2:C.b;el.style.transform=on?'translateY(-2px)':'translateY(0)';el.style.boxShadow=on?'0 12px 32px rgba(31,73,176,0.28)':'none'}
function hoverInk(el:HTMLElement,on:boolean){el.style.background=on?C.b:C.ink;el.style.transform=on?'translateY(-1px)':'translateY(0)'}
function hoverCard(el:HTMLElement,on:boolean){el.style.transform=on?'translateY(-4px)':'translateY(0)'}

/* ─── NAV ─── */
function Nav() {
  const [sc,setSc]=useState(false)
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const h=()=>setSc(window.scrollY>48)
    window.addEventListener('scroll',h,{passive:true})
    return ()=>window.removeEventListener('scroll',h)
  },[])
  const links:[string,string][]=[['Smart CFO','#cfo'],['Conformité','#conformite'],['Réception vocale','#voice'],['Tarifs','#tarifs'],['Intégrations','#integrations'],['Contact','#contact']]

  /* Nav inner style — avoid duplicate keys by keeping margin only in one branch */
  const innerBase:React.CSSProperties={maxWidth:1240,display:'flex',alignItems:'center',justifyContent:'space-between'}
  const innerScrolled:React.CSSProperties={...innerBase,background:'rgba(247,249,251,0.88)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(0,0,0,0.06)',borderRadius:980,margin:'0 20px',padding:'10px 24px',boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}
  const innerDefault:React.CSSProperties={...innerBase,margin:'0 auto',padding:'0 40px'}

  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:sc?'10px 0':'18px 0',transition:'all .4s'}}>
        <div style={sc?innerScrolled:innerDefault}>
          <a href="/" style={{fontWeight:800,fontSize:19,letterSpacing:'-0.04em',color:C.ink,textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:C.b,boxShadow:`0 0 8px ${C.b}88`}}/>
            vanivert
          </a>
          <ul style={{display:'flex',gap:26,listStyle:'none',alignItems:'center',margin:0,padding:0}} className="nav-links">
            {links.map(([l,h])=>(
              <li key={l}><a href={h} style={{fontSize:13,color:C.g,textDecoration:'none',fontWeight:500,transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=C.ink)}
                onMouseLeave={e=>(e.currentTarget.style.color=C.g)}>{l}</a></li>
            ))}
          </ul>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <a href="/calculateur"
              style={{background:C.b,color:'#fff',fontSize:13,fontWeight:700,borderRadius:980,padding:'8px 20px',textDecoration:'none',transition:'all .3s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.b2;(e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(31,73,176,0.3)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.b;(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
              Calculer mon risque
            </a>
            <button className="nav-burger" onClick={()=>setOpen(v=>!v)}
              style={{background:'none',border:'none',cursor:'pointer',padding:4,display:'none'}}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill={C.ink}>
                <rect width="20" height="1.5" rx="1"/><rect y="6" width="20" height="1.5" rx="1"/><rect y="12" width="20" height="1.5" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:C.w,zIndex:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:32}}>
            <button onClick={()=>setOpen(false)} style={{position:'absolute',top:24,right:24,fontSize:28,color:C.g,background:'none',border:'none',cursor:'pointer'}}>×</button>
            {links.map(([l,h])=>(
              <a key={l} href={h} onClick={()=>setOpen(false)}
                style={{fontSize:22,fontWeight:700,color:C.ink,textDecoration:'none',letterSpacing:'-0.03em'}}>{l}</a>
            ))}
            <a href="/calculateur" style={{background:C.b,color:'#fff',fontWeight:700,borderRadius:980,padding:'14px 32px',textDecoration:'none',fontSize:16,marginTop:8}}>
              Calculer mon risque
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [annual,setAnnual]=useState(false)
  const {scrollYProgress}=useScroll()
  const scaleX=useSpring(scrollYProgress,{stiffness:400,damping:90})

  return (
    <div style={{background:C.bg,color:C.ink,fontFamily:'Inter, Helvetica Neue, sans-serif',position:'relative'}}>

      {/* Scroll progress bar */}
      <motion.div style={{position:'fixed',top:0,left:0,right:0,height:2,background:C.b,zIndex:500,scaleX,transformOrigin:'left'}}/>

      <FluidBG/>
      <Nav/>

      {/* ── HERO ── */}
      <section style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',padding:'120px 40px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1,background:'radial-gradient(ellipse 75% 65% at 50% 42%,rgba(247,249,251,0.93) 25%,rgba(247,249,251,0.55) 65%,transparent 100%)'}}/>

        {/* Floating invoice */}
        <motion.div
          initial={{opacity:0,y:20,rotate:-2}}
          animate={{opacity:1,y:[0,-12,0],rotate:[-1,1.5,-1]}}
          transition={{opacity:{duration:0.8,delay:1.2},y:{duration:5,repeat:Infinity,ease:'easeInOut' as const},rotate:{duration:6,repeat:Infinity,ease:'easeInOut' as const}}}
          style={{position:'absolute',top:'14%',right:'7%',width:196,zIndex:2,...GL,borderRadius:16,padding:18}}
          className="hero-float">
          <div style={{fontSize:9,fontFamily:'monospace',color:C.g,letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:12}}>Facture #2026-0847</div>
          {[['Client','PROLANN SAS'],['Montant HT','4 200 €'],['TVA 20%','840 €'],['Total TTC','5 040 €']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'5px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
              <span style={{color:C.g}}>{k}</span><span style={{fontWeight:700,color:C.ink}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:10,display:'inline-flex',alignItems:'center',gap:5,background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:7,padding:'4px 9px',fontSize:9,fontWeight:700,color:'#15803d'}}>
            ✓ Conforme DGFiP
          </div>
        </motion.div>

        {/* Floating CFO stat */}
        <motion.div
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:[0,-8,0]}}
          transition={{opacity:{duration:0.8,delay:1.7},y:{duration:6,delay:1,repeat:Infinity,ease:'easeInOut' as const}}}
          style={{position:'absolute',bottom:'22%',left:'6%',zIndex:2,...GL,borderRadius:14,padding:'14px 20px'}}
          className="hero-float">
          <div style={{fontSize:9,fontFamily:'monospace',color:C.g,letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:4}}>Prévision J+30</div>
          <div style={{fontSize:20,fontWeight:700,color:'#22c55e',fontFamily:'Inter'}}>+8 200 €</div>
        </motion.div>

        <motion.div style={{position:'relative',zIndex:3,textAlign:'center',maxWidth:800,width:'100%'}}
          initial="hidden" animate="visible" variants={vS}>

          <motion.span variants={vU}
            style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,marginBottom:28,...GL,borderRadius:980,padding:'6px 16px'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:C.b,animation:'pulse 2s ease-in-out infinite'}}/>
            Infrastructure financière souveraine
          </motion.span>

          <motion.h1 variants={vU}
            style={{fontFamily:'Inter',fontWeight:900,lineHeight:1.03,letterSpacing:'-0.04em',fontSize:'clamp(40px,6.5vw,82px)',color:C.ink,marginBottom:22,marginTop:0}}>
            Le 1er septembre 2026,<br/>
            <span style={{color:C.b}}>la facture papier</span><br/>
            disparaît.
          </motion.h1>

          <motion.p variants={vU}
            style={{fontSize:18,color:C.g,lineHeight:1.68,maxWidth:500,margin:'0 auto 40px'}}>
            L'infrastructure financière des grandes entreprises, accessible aux PME françaises. À partir de 9 €/mois.
          </motion.p>

          <motion.div variants={vU} style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' as const}}>
            <a href="/calculateur"
              style={{background:C.b,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'15px 30px',textDecoration:'none',transition:'all .3s',display:'inline-block'}}
              onMouseEnter={e=>hoverDark(e.currentTarget as HTMLElement,true)}
              onMouseLeave={e=>hoverDark(e.currentTarget as HTMLElement,false)}>
              Activer mon infrastructure CFO
            </a>
            <a href="#cfo"
              style={{fontWeight:600,fontSize:15,borderRadius:980,padding:'15px 30px',textDecoration:'none',transition:'all .3s',display:'inline-block',color:C.ink,...GL}}>
              Découvrir →
            </a>
          </motion.div>

          <motion.div variants={vU}
            style={{marginTop:52,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'monospace',fontSize:12,color:C.g}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:C.red,animation:'pulse 2s ease-in-out infinite'}}/>
            Obligation de réception dans <CD blue/> jours
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{background:C.w,padding:'80px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <motion.blockquote initial="hidden" whileInView="visible" viewport={VP} variants={vU}
            style={{textAlign:'center',fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'clamp(18px,2.5vw,26px)',color:C.ink,maxWidth:680,margin:'0 auto 52px',lineHeight:1.45}}>
            "54% des entrepreneurs français n'ont pas de logiciel de facturation. 50% ne seront pas prêts en septembre 2026."
            <cite style={{display:'block',fontStyle:'normal',fontFamily:'monospace',fontSize:11,color:C.g,marginTop:14,letterSpacing:'0.06em',textTransform:'uppercase' as const}}>
              OpinionWay / Tiime, mars 2026
            </cite>
          </motion.blockquote>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[{n:'15 000 €',l:'Amende annuelle maximale pour non-conformité',u:false},{n:'',l:"Jours avant l'obligation de réception",u:true},{n:'50 €',l:'Par facture non conforme transmise',u:false}].map((s,i)=>(
              <motion.div key={i} variants={vU}
                style={{textAlign:'center',padding:'40px 28px',borderRadius:22,...GL,transition:'transform .3s'}}
                onMouseEnter={e=>hoverCard(e.currentTarget as HTMLElement,true)}
                onMouseLeave={e=>hoverCard(e.currentTarget as HTMLElement,false)}>
                <div style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(34px,5vw,56px)',color:s.u?C.b:C.ink,letterSpacing:'-0.04em',lineHeight:1,marginBottom:10}}>
                  {s.u?<CD blue/>:s.n}
                </div>
                <div style={{fontSize:13,color:C.g,lineHeight:1.4}}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SMART CFO ── */}
      <section id="cfo" style={{background:C.w,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>Smart CFO</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(30px,4vw,54px)',letterSpacing:'-0.035em',lineHeight:1.06,color:C.ink,marginBottom:20,marginTop:0}}>
              Votre directeur<br/>financier. Toujours<br/>disponible.
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:17,color:C.g,lineHeight:1.68,maxWidth:420,marginBottom:28}}>
              Connecté à vos outils existants. Analyse vos flux. Prédit vos besoins de trésorerie avant que vous ne les ressentiez.
            </motion.p>
            <motion.div variants={vS} style={{display:'flex',flexDirection:'column' as const,gap:12,marginBottom:32}}>
              {['Trésorerie en temps réel, connectée à votre banque','Prédictions cash-flow sur 30, 60 et 90 jours','Alertes automatiques — retards, seuils, anomalies','Compatible Pennylane, Tiime, Sage, Qonto, Bridge API'].map(f=>(
                <motion.div key={f} variants={vU} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,color:C.ink}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:C.b,marginTop:6,flexShrink:0}}/>
                  {f}
                </motion.div>
              ))}
            </motion.div>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:13,fontWeight:600,color:C.b}}>À partir de 29 €/mois</motion.span>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vL}><Dash/></motion.div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="conformite" style={{background:C.sub,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vR}
            style={{position:'relative',paddingLeft:28}}>
            <div style={{position:'absolute',left:5,top:8,bottom:8,width:1.5,background:`linear-gradient(to bottom,${C.b},rgba(31,73,176,0.1))`}}/>
            {[
              {date:'Février 2026',title:'Phase pilote ouverte',desc:'Tests en production avec les plateformes agréées DGFiP',done:true,urgent:false},
              {date:'1er septembre 2026',title:'Réception obligatoire — toutes les entreprises',desc:'Chaque entreprise doit recevoir des e-factures via une PA',done:true,urgent:true},
              {date:'1er septembre 2026',title:'Émission — grandes entreprises et ETI',desc:'Émission et e-reporting pour les +250 salariés',done:true,urgent:false},
              {date:'1er septembre 2027',title:'Émission — PME et TPE',desc:'Toutes les entreprises doivent émettre au format structuré',done:false,urgent:false},
            ].map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}}
                viewport={VP} transition={{delay:i*0.12,duration:0.7,ease:E}}
                style={{position:'relative',marginBottom:28}}>
                <div style={{position:'absolute',left:-28,top:4,width:13,height:13,borderRadius:'50%',background:item.done?C.b:'#E5E5EA',border:`2px solid ${item.done?C.b:'#C7C7CC'}`,boxShadow:item.done?`0 0 0 5px rgba(31,73,176,0.12)`:'none'}}/>
                <div style={{fontFamily:'monospace',fontSize:10,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase' as const,color:item.urgent?C.b:C.g,marginBottom:4}}>{item.date}</div>
                <div style={{fontWeight:700,fontSize:15,color:item.urgent?C.b:C.ink,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:13,color:C.g,lineHeight:1.5}}>{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>Conformité e-facturation</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(30px,4vw,54px)',letterSpacing:'-0.035em',lineHeight:1.06,color:C.ink,marginBottom:20,marginTop:0}}>
              Septembre 2026.<br/>Votre entreprise<br/>est-elle prête?
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:17,color:C.g,lineHeight:1.68,maxWidth:420,marginBottom:32}}>
              Vanivert connecte votre ERP à une plateforme agréée DGFiP. Vous ne changez rien à vos habitudes. On gère tout le pipeline technique.
            </motion.p>
            <motion.a variants={vU} href="/calculateur"
              style={{display:'inline-flex',alignItems:'center',gap:8,background:C.ink,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'14px 28px',textDecoration:'none',transition:'all .3s'}}
              onMouseEnter={e=>hoverInk(e.currentTarget as HTMLElement,true)}
              onMouseLeave={e=>hoverInk(e.currentTarget as HTMLElement,false)}>
              Vérifier ma conformité →
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── VOICE AI — DARK ── */}
      <section id="voice" style={{background:C.ink,padding:'112px 40px',position:'relative',zIndex:10,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 50% at 50% 30%,rgba(31,73,176,0.14) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:820,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.3)',display:'block',marginBottom:16}}>
              Réception vocale professionnelle
            </motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(34px,5.5vw,68px)',letterSpacing:'-0.04em',lineHeight:1.04,color:'#fff',marginBottom:18,marginTop:0}}>
              Ne perdez plus<br/>un seul client.
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:18,color:'rgba(255,255,255,0.5)',maxWidth:420,margin:'0 auto 48px',lineHeight:1.65}}>
              Standard téléphonique professionnel en français. Répond 24h/24. Prend les rendez-vous. Zéro donnée hors Europe.
            </motion.p>

            {/* Phone mockup */}
            <motion.div variants={vK}
              style={{width:220,height:420,background:'#111',borderRadius:36,border:'2.5px solid #252525',margin:'0 auto 32px',position:'relative',overflow:'hidden',boxShadow:'0 40px 100px rgba(0,0,0,0.7)'}}>
              <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:80,height:20,background:'#111',borderRadius:'0 0 12px 12px',zIndex:2}}/>
              <div style={{position:'absolute',inset:2,background:'linear-gradient(160deg,#0d1117 0%,#0a1628 100%)',borderRadius:34,display:'flex',flexDirection:'column' as const,alignItems:'center',justifyContent:'center',gap:10,padding:'36px 18px 24px'}}>
                <div style={{fontFamily:'monospace',fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.3)'}}>Appel entrant</div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff',fontFamily:'Inter'}}>Cabinet Dr. Martin</div>
                <div style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.35)'}}>00:47</div>
                <div style={{width:'100%',padding:'0 4px'}}><Wave dark/></div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',textAlign:'center',lineHeight:1.5,fontStyle:'italic'}}>
                  "Bonjour, cabinet du Dr. Martin.<br/>Comment puis-je vous aider?"
                </div>
                <div style={{display:'flex',gap:14,marginTop:6}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔇</div>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,59,48,0.8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>📞</div>
                </div>
              </div>
            </motion.div>

            {/* Tech strip */}
            <motion.div variants={vU}
              style={{maxWidth:380,margin:'0 auto 28px',background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:18,padding:'18px 22px'}}>
              <Wave dark/>
              <div style={{fontSize:11,fontFamily:'monospace',color:'rgba(255,255,255,0.3)',letterSpacing:'0.06em',marginTop:10}}>
                Whisper STT · Mistral 7B · XTTS-v2 · Hetzner Frankfurt
              </div>
            </motion.div>

            <motion.div variants={vU} style={{display:'flex',flexWrap:'wrap' as const,gap:8,justifyContent:'center',marginBottom:32}}>
              {['Whisper STT','Mistral 7B','XTTS-v2','Silero VAD','Hetzner DE','Zéro donnée hors UE'].map(t=>(
                <span key={t} style={{fontSize:11,fontWeight:500,borderRadius:980,padding:'5px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.45)'}}>{t}</span>
              ))}
            </motion.div>
            <motion.div variants={vU}>
              <a href="tel:+33XXXXXXXXX"
                style={{display:'inline-block',background:C.b,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'15px 32px',textDecoration:'none',transition:'all .3s',boxShadow:'0 8px 28px rgba(31,73,176,0.35)'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 14px 40px rgba(31,73,176,0.45)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(31,73,176,0.35)'}}>
                Écouter en direct
              </a>
              <div style={{marginTop:14,fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.2)'}}>À partir de 9 €/mois + 0,08 €/min</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SOVEREIGNTY STRIP ── */}
      <section style={{background:C.w,padding:'56px 40px',borderTop:`1px solid ${C.lt}`,borderBottom:`1px solid ${C.lt}`,position:'relative',zIndex:10}}>
        <div style={{maxWidth:880,margin:'0 auto',textAlign:'center'}}>
          <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={VP}
            transition={{duration:0.8,ease:E}}
            style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'clamp(19px,2.5vw,27px)',color:C.ink,marginBottom:28,lineHeight:1.4}}>
            "Vos données ne quittent jamais l'Europe."
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            style={{display:'flex',flexWrap:'wrap' as const,alignItems:'center',justifyContent:'center',gap:28}}>
            {['Hetzner Frankfurt','Supabase Dublin','Mistral AI Paris','Conforme RGPD','Zéro API US'].map((s,i)=>(
              <motion.div key={s} variants={vU}
                style={{display:'flex',alignItems:'center',gap:7,fontFamily:'monospace',fontSize:11,color:C.g,fontWeight:600,letterSpacing:'0.07em',textTransform:'uppercase' as const}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:C.grn,flexShrink:0}}/>{s}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" style={{background:C.sub,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{textAlign:'center',marginBottom:48}}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:14}}>Tarifs</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(30px,4.5vw,52px)',letterSpacing:'-0.035em',color:C.ink,marginBottom:8,marginTop:0}}>
              Des prix qui respectent<br/>votre budget.
            </motion.h2>
            <motion.div variants={vU} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:20}}>
              <span style={{fontSize:13,fontWeight:600,cursor:'pointer',color:!annual?C.ink:C.g}} onClick={()=>setAnnual(false)}>Mensuel</span>
              <button onClick={()=>setAnnual(v=>!v)} aria-label="Annuel/Mensuel"
                style={{width:48,height:26,borderRadius:13,border:'none',cursor:'pointer',position:'relative',transition:'background .3s',background:annual?C.b:'#C7C7CC',padding:0}}>
                <span style={{position:'absolute',top:3,left:annual?24:3,width:20,height:20,background:'#fff',borderRadius:'50%',transition:'left .3s',boxShadow:'0 1px 4px rgba(0,0,0,0.15)',display:'block'}}/>
              </button>
              <span style={{fontSize:13,fontWeight:600,cursor:'pointer',color:annual?C.ink:C.g}} onClick={()=>setAnnual(true)}>
                Annuel {annual&&<span style={{marginLeft:4,background:'rgba(31,73,176,0.1)',color:C.b,fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:6}}>-17%</span>}
              </span>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {PLANS.map((plan,i)=>(
              <motion.div key={plan.name} variants={vU}
                style={{borderRadius:24,padding:'32px 26px',position:'relative',transition:'transform .35s',
                  ...(plan.pop?{background:C.b,color:'#fff',transform:'translateY(-10px) scale(1.02)',boxShadow:'0 20px 60px rgba(31,73,176,0.22)'}:{background:C.w,color:C.ink,border:`1px solid ${C.lt}`,boxShadow:'0 4px 20px rgba(0,0,0,0.04)'})}}
                onMouseEnter={e=>{if(!plan.pop)hoverCard(e.currentTarget as HTMLElement,true)}}
                onMouseLeave={e=>{if(!plan.pop)hoverCard(e.currentTarget as HTMLElement,false)}}>
                {plan.pop&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#fff',color:C.b,fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase' as const,padding:'4px 16px',borderRadius:980,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',whiteSpace:'nowrap' as const}}>Populaire</div>}
                <div style={{fontSize:11,fontFamily:'monospace',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'0.1em',marginBottom:14,color:plan.pop?'rgba(255,255,255,0.55)':C.g}}>{plan.name}</div>
                <div style={{fontFamily:'Inter',fontWeight:900,fontSize:50,letterSpacing:'-0.04em',lineHeight:1,color:plan.pop?'#fff':C.ink}}>
                  {annual?plan.a:plan.m} €
                </div>
                <div style={{fontSize:12,color:plan.pop?'rgba(255,255,255,0.55)':C.g,marginTop:4,marginBottom:24}}>par mois HT</div>
                <ul style={{listStyle:'none',padding:0,margin:'0 0 28px',display:'flex',flexDirection:'column' as const,gap:9}}>
                  {plan.feats.map(f=>(
                    <li key={f} style={{fontSize:13,color:plan.pop?'rgba(255,255,255,0.88)':C.ink,display:'flex',alignItems:'flex-start',gap:9,lineHeight:1.4}}>
                      <span style={{width:4,height:4,borderRadius:'50%',background:plan.pop?'#fff':C.b,marginTop:6,flexShrink:0}}/>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`/signup?plan=${plan.name.toLowerCase()}`}
                  style={{display:'block',textAlign:'center',fontWeight:700,fontSize:14,borderRadius:980,padding:'12px',textDecoration:'none',transition:'all .3s',background:plan.pop?'#fff':C.ink,color:plan.pop?C.b:'#fff'}}>
                  Commencer
                </a>
              </motion.div>
            ))}
          </motion.div>
          <p style={{textAlign:'center',fontSize:13,color:C.g,marginTop:28}}>
            Pas d'engagement. Résiliable à tout moment. <a href="#contact" style={{color:C.ink,fontWeight:600,textDecoration:'none'}}>Offre sur mesure?</a>
          </p>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={{background:C.w,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1040,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{textAlign:'center',marginBottom:52}}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:14}}>18 intégrations natives</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(28px,4vw,48px)',letterSpacing:'-0.035em',color:C.ink,marginTop:0,marginBottom:10}}>
              Fonctionne avec votre<br/>écosystème complet.
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:16,color:C.g,maxWidth:480,margin:'0 auto'}}>
              Comptabilité, banque, paiements, agenda, conformité réglementaire, infrastructure souveraine.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            className="grid-6" style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12}}>
            {INTS.map((int)=>(
              <motion.div key={int.n} variants={vU}
                style={{borderRadius:14,padding:'18px 10px',textAlign:'center',cursor:'default',transition:'all .3s',background:C.sub}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background=C.w;el.style.transform='translateY(-4px)';el.style.boxShadow='0 8px 24px rgba(0,0,0,0.07)'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=C.sub;el.style.transform='translateY(0)';el.style.boxShadow='none'}}>
                <div style={{width:36,height:36,borderRadius:9,background:int.b,color:int.c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,margin:'0 auto 7px'}}>
                  {int.l}
                </div>
                <div style={{fontSize:11,fontWeight:600,color:C.ink,lineHeight:1.2}}>{int.n}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── OPEN SOURCE ── */}
      <section style={{background:C.sub,padding:'90px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1040,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{textAlign:'center',marginBottom:48}}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:14}}>Technologie</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(26px,3.5vw,42px)',letterSpacing:'-0.035em',color:C.ink,marginTop:0,marginBottom:8}}>
              La puissance des meilleures<br/>solutions open source.
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {name:'grcx',role:'Radar Réglementaire',desc:"Surveille DGFiP, CNIL, AMF, ACPR en temps réel. Alerte dès qu'une règle change. Piste d'audit cryptographique.",tag:'MIT License',c:C.b},
              {name:'Pxtly',role:'Document Intelligence',desc:"ChromaDB vector search, détection AML, ZK-KYC. Interrogez 5 ans de factures en langage naturel.",tag:'Apache 2.0',c:'#4A148C'},
              {name:'Stack Vanivert',role:'Infrastructure vocale souveraine',desc:'Whisper STT + Mistral 7B + XTTS-v2. Hébergé sur Hetzner Frankfurt. Zéro donnée hors Europe.',tag:'EU Sovereign',c:C.ink},
            ].map((item)=>(
              <motion.div key={item.name} variants={vU}
                style={{borderRadius:22,padding:'28px 24px',background:C.w,border:`1px solid ${C.lt}`,boxShadow:'0 4px 20px rgba(0,0,0,0.04)',transition:'transform .3s'}}
                onMouseEnter={e=>hoverCard(e.currentTarget as HTMLElement,true)}
                onMouseLeave={e=>hoverCard(e.currentTarget as HTMLElement,false)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{fontFamily:'Inter',fontWeight:900,fontSize:17,color:item.c,letterSpacing:'-0.02em'}}>{item.name}</div>
                  <span style={{fontSize:9,fontFamily:'monospace',fontWeight:700,padding:'3px 8px',borderRadius:6,background:C.sub,color:C.g,letterSpacing:'0.05em'}}>{item.tag}</span>
                </div>
                <div style={{fontSize:11,fontFamily:'monospace',fontWeight:600,textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:10}}>{item.role}</div>
                <div style={{fontSize:13,color:'#4A4A52',lineHeight:1.6}}>{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{background:C.w,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'flex-start'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vU} style={{fontFamily:'monospace',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>Contact</motion.span>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(28px,4vw,50px)',letterSpacing:'-0.035em',lineHeight:1.06,color:C.ink,marginBottom:18,marginTop:0}}>
              Parlons de votre<br/>projet.
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:17,color:C.g,lineHeight:1.65,maxWidth:340,marginBottom:32}}>
              Un appel de 15 minutes suffit. Sans engagement. Sans pression commerciale.
            </motion.p>
            <motion.div variants={vS} style={{display:'flex',flexDirection:'column' as const,gap:14,marginBottom:28}}>
              {[{icon:'✉️',bg:'#EEF5FF',text:'contact@vanivert.fr',href:'mailto:contact@vanivert.fr',hc:C.b},{icon:'💬',bg:'#F0FDF4',text:'WhatsApp — réponse < 1h',href:'https://wa.me/33XXXXXXXXX',hc:'#16a34a'}].map(m=>(
                <motion.a key={m.text} variants={vU} href={m.href}
                  style={{display:'flex',alignItems:'center',gap:12,fontSize:15,fontWeight:600,color:C.ink,textDecoration:'none',transition:'color .2s'}}
                  onMouseEnter={e=>(e.currentTarget.style.color=m.hc)}
                  onMouseLeave={e=>(e.currentTarget.style.color=C.ink)}>
                  <span style={{width:40,height:40,borderRadius:'50%',background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{m.icon}</span>
                  {m.text}
                </motion.a>
              ))}
            </motion.div>
            <motion.div variants={vU} style={{padding:'18px 22px',borderRadius:16,background:'#EFF6FF',border:'1px solid #BFDBFE'}}>
              <div style={{fontFamily:'monospace',fontSize:10,textTransform:'uppercase' as const,letterSpacing:'0.1em',color:C.b,fontWeight:700,marginBottom:6}}>Bpifrance</div>
              <div style={{fontSize:13,color:'#374151',lineHeight:1.6}}>Éligible aux aides Bpifrance pour la transformation numérique des PME. Notre équipe vous accompagne dans les démarches.</div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vL}>
            <form style={{background:C.w,borderRadius:24,padding:32,border:`1px solid ${C.lt}`,boxShadow:'0 4px 32px rgba(0,0,0,0.06)'}}
              onSubmit={e=>{e.preventDefault();alert('Message envoyé. Nous vous répondons sous 24h.')}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                {[['Prénom','Jean'],['Nom','Dupont']].map(([l,ph])=>(
                  <div key={l}>
                    <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{l}</label>
                    <input placeholder={ph} style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',transition:'border-color .2s',background:C.sub,boxSizing:'border-box' as const}}
                      onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                  </div>
                ))}
              </div>
              {[['Email professionnel *','email','jean@monentreprise.fr'],['Entreprise','text','Mon Entreprise SARL']].map(([l,t,ph])=>(
                <div key={l} style={{marginBottom:14}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{l}</label>
                  <input type={t} placeholder={ph} required={l.includes('*')}
                    style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',transition:'border-color .2s',background:C.sub,boxSizing:'border-box' as const}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Service</label>
                <select style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}>
                  <option>Choisir...</option>
                  <option>Réception vocale</option><option>Smart CFO</option>
                  <option>Conformité e-facturation</option><option>Pack complet</option>
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>Message</label>
                <textarea rows={3} style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',resize:'vertical' as const,background:C.sub,boxSizing:'border-box' as const}}
                  onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
              </div>
              <div style={{display:'flex',alignItems:'flex-start',gap:9,marginBottom:18}}>
                <input type="checkbox" required id="rgpd" style={{marginTop:2,accentColor:C.b}}/>
                <label htmlFor="rgpd" style={{fontSize:12,color:C.g,lineHeight:1.5}}>
                  J'accepte la <a href="/legal/confidentialite" style={{color:C.b,textDecoration:'underline'}}>politique de confidentialité</a>
                </label>
              </div>
              <button type="submit"
                style={{width:'100%',background:C.ink,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:980,padding:'14px',cursor:'pointer',fontFamily:'Inter',transition:'all .3s'}}
                onMouseEnter={e=>{(e.currentTarget.style.background=C.b);(e.currentTarget.style.transform='translateY(-1px)')}}
                onMouseLeave={e=>{(e.currentTarget.style.background=C.ink);(e.currentTarget.style.transform='translateY(0)')}}>
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{background:C.sub,padding:'100px 40px',textAlign:'center',position:'relative',zIndex:10}}>
        <div style={{maxWidth:640,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.h2 variants={vU} style={{fontFamily:'Inter',fontWeight:900,fontSize:'clamp(30px,4.5vw,54px)',letterSpacing:'-0.04em',color:C.ink,marginBottom:16,marginTop:0}}>
              Commencez gratuitement.
            </motion.h2>
            <motion.p variants={vU} style={{fontSize:18,color:C.g,marginBottom:36,lineHeight:1.6}}>
              Vérifiez votre conformité en 2 minutes.<br/>Aucune carte bancaire requise.
            </motion.p>
            <motion.a variants={vU} href="/calculateur"
              style={{display:'inline-block',background:C.b,color:'#fff',fontWeight:700,fontSize:16,borderRadius:980,padding:'16px 36px',textDecoration:'none',transition:'all .3s'}}
              onMouseEnter={e=>hoverDark(e.currentTarget as HTMLElement,true)}
              onMouseLeave={e=>hoverDark(e.currentTarget as HTMLElement,false)}>
              Calculer mon risque →
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:C.ink,color:'rgba(255,255,255,0.4)',padding:'56px 40px 32px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'flex',flexWrap:'wrap' as const,justifyContent:'space-between',gap:40,marginBottom:48}}>
            <div style={{maxWidth:260}}>
              <div style={{fontWeight:800,fontSize:19,color:'#fff',letterSpacing:'-0.04em',marginBottom:10,display:'flex',alignItems:'center',gap:7}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:C.b}}/>vanivert
              </div>
              <p style={{fontSize:13,lineHeight:1.65,color:'rgba(255,255,255,0.35)',margin:0}}>
                Infrastructure financière souveraine pour les PME françaises. 100% hébergé en Europe.
              </p>
            </div>
            <div style={{display:'flex',flexWrap:'wrap' as const,gap:48}}>
              {[
                {h:'Produit',ls:['Smart CFO','Conformité','Réception vocale','Tarifs','Intégrations']},
                {h:'Ressources',ls:['Blog','Calculateur','Documentation','Contact','Statut système']},
                {h:'Légal',ls:['Mentions légales','CGV','CGU','Confidentialité','DPA RGPD']},
              ].map(col=>(
                <div key={col.h}>
                  <h4 style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:'monospace',color:'rgba(255,255,255,0.2)',marginBottom:14,marginTop:0}}>{col.h}</h4>
                  <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column' as const,gap:9}}>
                    {col.ls.map(l=>(
                      <li key={l}><a href="#" style={{fontSize:13,color:'rgba(255,255,255,0.4)',textDecoration:'none',transition:'color .2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}>{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:24,display:'flex',flexWrap:'wrap' as const,justifyContent:'space-between',alignItems:'center',gap:14}}>
            <div style={{fontSize:11,fontFamily:'monospace',color:'rgba(255,255,255,0.18)'}}>
              © 2026 Vanivert. Tous droits réservés. SIRET : en cours · contact@vanivert.fr · vanivert.fr · vanivert.eu
            </div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap' as const}}>
              {['RGPD','EU Hosted','Hetzner DE','Supabase IE'].map(b=>(
                <span key={b} style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',padding:'4px 9px',borderRadius:6,display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:4,height:4,borderRadius:'50%',background:C.grn}}/>{b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/33XXXXXXXXX" target="_blank" rel="noopener" aria-label="WhatsApp"
        style={{position:'fixed',bottom:32,right:28,zIndex:400,width:52,height:52,borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(37,211,102,0.4)',transition:'transform .3s',textDecoration:'none'}}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.1)')}
        onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(31,73,176,0.4)}50%{box-shadow:0 0 0 6px rgba(31,73,176,0)}}
        @media(max-width:900px){.grid-2{grid-template-columns:1fr!important;gap:48px!important}.grid-3{grid-template-columns:1fr!important}.grid-6{grid-template-columns:repeat(3,1fr)!important}.hero-float{display:none!important}}
        @media(max-width:600px){.grid-6{grid-template-columns:repeat(2,1fr)!important}.nav-links{display:none!important}.nav-burger{display:flex!important}}
      `}</style>
    </div>
  )
}
