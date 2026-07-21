'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import { DEFAULT_ARTICLES } from '@/lib/articles'

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG    = '#FAFAF8'
const BG2   = '#F3F2EE'
const CARD  = '#FFFFFF'
const INK   = '#0D0D0F'
const VI    = '#5B6B3A'
const VI2   = '#4A5830'
const VI_LT = '#8FA660'
const GOLD  = '#C8A96E'
const MUTED = 'rgba(13,13,15,0.50)'
const SUBTLE= 'rgba(13,13,15,0.30)'
const BDR   = 'rgba(13,13,15,0.07)'
const BDR2  = 'rgba(13,13,15,0.13)'
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ── CURSOR DOT ────────────────────────────────────────────────────────────────
function CursorDot() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let rx = 0, ry = 0
    const move = (e: MouseEvent) => {
      if (dot.current) { dot.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)` }
      rx += (e.clientX - 16 - rx) * 0.12
      ry += (e.clientY - 16 - ry) * 0.12
      if (ring.current) { ring.current.style.transform = `translate(${rx}px,${ry}px)` }
    }
    let raf: number
    const loop = () => { raf = requestAnimationFrame(loop) }
    loop()
    window.addEventListener('mousemove', move)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div ref={dot} style={{ position:'fixed', top:0, left:0, width:8, height:8, borderRadius:'50%', background:VI, zIndex:9999, pointerEvents:'none', willChange:'transform' }}/>
      <div ref={ring} style={{ position:'fixed', top:0, left:0, width:32, height:32, borderRadius:'50%', border:`1.5px solid ${VI}`, zIndex:9998, pointerEvents:'none', willChange:'transform', opacity:0.5 }}/>
    </>
  )
}

// ── SCROLL PROGRESS BAR ───────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0,1], [0,1])
  return (
    <motion.div style={{ position:'fixed', top:0, left:0, right:0, height:2.5, background:`linear-gradient(90deg,${VI},${GOLD},${VI_LT})`, transformOrigin:'left', scaleX, zIndex:600, pointerEvents:'none' }}/>
  )
}

// ── FADE UP ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay=0, style={}, className }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inV = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:32 }} animate={inV?{opacity:1,y:0}:{}} transition={{ duration:0.8, ease:EZ, delay }} style={style} className={className}>
      {children}
    </motion.div>
  )
}

// ── PILL BADGE ────────────────────────────────────────────────────────────────
function Pill({ children, color=VI }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 13px', borderRadius:980, background:`${color}10`, border:`1px solid ${color}25`, fontSize:10, fontWeight:600, color, letterSpacing:'0.1em', textTransform:'uppercase' as const }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:color }}/>
      {children}
    </span>
  )
}

// ── LOGO ──────────────────────────────────────────────────────────────────────
function Logo({ s=28 }: { s?: number }) {
  const cx=s/2, cy=s/2, R=s*0.36, nr=s*0.07, cr=s*0.14
  const pts = Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={VI} strokeWidth={s*0.022} fill="none" strokeOpacity="0.35"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} stroke={VI} strokeWidth={s*0.028} fill={BG} strokeOpacity="0.8"/>)}
      <circle cx={cx} cy={cy} r={cr} fill={VI}/>
    </svg>
  )
}

// ── THREE.JS GLOBE ────────────────────────────────────────────────────────────
function Globe() {
  const mount = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mount.current) return
    const W = mount.current.clientWidth || 420
    const H = mount.current.clientHeight || 420
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.current.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 100)
    camera.position.z = 3.4
    // Wireframe sphere
    const wireGeo = new THREE.SphereGeometry(1, 28, 28)
    const wireMat = new THREE.MeshBasicMaterial({ color:new THREE.Color(VI), wireframe:true, opacity:0.14, transparent:true })
    const wireSphere = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireSphere)
    // Inner diffuse sphere
    const innerGeo = new THREE.SphereGeometry(0.9, 32, 32)
    const innerMat = new THREE.MeshPhongMaterial({ color:new THREE.Color('#F2F0E8'), shininess:60, transparent:true, opacity:0.85 })
    const innerSphere = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerSphere)
    // Node points on sphere surface
    const nodeMat = new THREE.MeshBasicMaterial({ color:new THREE.Color(VI) })
    const nodePositions = [[0.9,0.3,0.3],[-0.85,0.4,0.3],[0.2,0.95,0.2],[0.1,-0.9,0.4],[-0.3,0.2,0.95],[0.7,-0.6,0.4],[-0.5,-0.7,0.5],[0.3,0.5,-0.8]]
    const nodes = nodePositions.map(([x,y,z]) => {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.042,8,8), nodeMat)
      n.position.set(x as number,y as number,z as number)
      scene.add(n)
      return n
    })
    // Connection lines
    for (let i=0;i<nodes.length;i++) {
      const j=(i+3)%nodes.length
      const pts=[nodes[i].position.clone(), nodes[j].position.clone()]
      const lg=new THREE.BufferGeometry().setFromPoints(pts)
      scene.add(new THREE.Line(lg, new THREE.LineBasicMaterial({color:new THREE.Color(VI),opacity:0.22,transparent:true})))
    }
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const dl=new THREE.DirectionalLight(0xffffff, 0.85); dl.position.set(2,3,2); scene.add(dl)
    let f=0, raf=0
    const animate = () => {
      raf=requestAnimationFrame(animate); f++
      wireSphere.rotation.y=f*0.0028; wireSphere.rotation.x=f*0.0009
      innerSphere.rotation.y=-f*0.0018
      renderer.render(scene,camera)
    }
    animate()
    return () => { cancelAnimationFrame(raf); renderer.dispose(); if(mount.current&&renderer.domElement.parentNode===mount.current) mount.current.removeChild(renderer.domElement) }
  }, [])
  return <div ref={mount} style={{width:'100%',height:'100%'}}/>
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(()=>{
    const h=()=>setSc(window.scrollY>30)
    window.addEventListener('scroll',h,{passive:true})
    return ()=>window.removeEventListener('scroll',h)
  },[])
  const links:[string,string][]=[['Fonctionnalités','#features'],['Tarifs','#pricing'],['Blog','/blog'],['Équipe','/equipe']]
  return (
    <>
      <nav style={{position:'fixed',top:2.5,left:0,right:0,zIndex:200,height:64,display:'flex',alignItems:'center',background:sc?'rgba(250,250,248,0.96)':'transparent',backdropFilter:sc?'blur(18px)':'none',WebkitBackdropFilter:sc?'blur(18px)':'none',borderBottom:`1px solid ${sc?BDR2:'transparent'}`,transition:'all 0.35s cubic-bezier(0.32,0.72,0,1)'}}>
        <div style={{maxWidth:1240,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <Logo s={30}/><span style={{fontFamily:'Georgia,serif',fontSize:17,color:INK,fontStyle:'italic'}}>vanivert</span>
          </a>
          <div className="nav-links" style={{display:'flex',gap:2}}>
            {links.map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'7px 13px',borderRadius:8,fontWeight:450,transition:'color 0.2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=INK)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
            ))}
          </div>
          <div className="nav-links" style={{display:'flex',gap:10,alignItems:'center'}}>
            <a href="/login" style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'8px 14px',fontWeight:450,transition:'color 0.2s'}}
              onMouseEnter={e=>(e.currentTarget.style.color=INK)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>Connexion</a>
            <a href="/demo" style={{fontSize:13,fontWeight:600,color:'#fff',textDecoration:'none',padding:'9px 22px',borderRadius:980,background:INK,display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=INK}}>
              Réserver une démo
              <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>→</span>
            </a>
          </div>
          <button className="mob-nav" onClick={()=>setMob(!mob)} style={{display:'none',background:'none',border:`1px solid ${BDR2}`,borderRadius:10,cursor:'pointer',padding:'8px 10px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            <motion.span animate={{rotate:mob?45:0,y:mob?5.5:0}} style={{width:18,height:1.5,background:INK,display:'block',transformOrigin:'center'}}/>
            <motion.span animate={{opacity:mob?0:1}} style={{width:18,height:1.5,background:INK,display:'block'}}/>
            <motion.span animate={{rotate:mob?-45:0,y:mob?-5.5:0}} style={{width:18,height:1.5,background:INK,display:'block',transformOrigin:'center'}}/>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mob&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:250,background:'rgba(250,250,248,0.97)',backdropFilter:'blur(20px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            {[...links,['Connexion','/login'],['Réserver une démo','/demo']].map(([l,h],i)=>(
              <motion.a key={l} href={h} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} onClick={()=>setMob(false)}
                style={{fontSize:22,fontFamily:'Georgia,serif',fontStyle:'italic',color:INK,textDecoration:'none',padding:'12px 32px',textAlign:'center'}}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
const ROTATING = ['De la première voix au dernier avis Google.','L\'agence tourne. Même quand personne ne regarde.','Zéro lead manqué. Zéro client oublié.','Votre concurrent dort. Vous, non.']

function Hero() {
  const [phrase, setPhrase] = useState(0)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY,[0,600],[0,100])
  useEffect(()=>{const id=setInterval(()=>setPhrase(p=>(p+1)%ROTATING.length),3800);return()=>clearInterval(id)},[])
  return (
    <section style={{minHeight:'100dvh',background:BG,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',position:'relative',overflow:'hidden'}}>
      <motion.div style={{y:bgY,position:'absolute',top:'-10%',left:'-8%',width:'55vw',height:'55vw',maxWidth:640,borderRadius:'50%',background:`radial-gradient(circle,${VI}09 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <motion.div style={{y:bgY,position:'absolute',bottom:'-10%',right:'-8%',width:'45vw',height:'45vw',maxWidth:540,borderRadius:'50%',background:`radial-gradient(circle,${GOLD}07 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <div style={{maxWidth:1200,width:'100%',display:'grid',gridTemplateColumns:'1fr 440px',gap:64,alignItems:'center',position:'relative',zIndex:2}} className="hero-grid">
        <div>
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.05}} style={{marginBottom:22}}>
            <Pill color={VI}>IA immobilière · Native EU · RGPD</Pill>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.75,ease:EZ,delay:0.1}} style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(34px,4.6vw,60px)',color:INK,lineHeight:1.07,marginBottom:14,letterSpacing:'-0.03em'}}>
            L&apos;agence immobilière<br/><span style={{fontStyle:'italic',color:MUTED}}>qui ne dort jamais.</span>
          </motion.h1>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.28}} style={{height:26,marginBottom:18,overflow:'hidden'}}>
            <AnimatePresence mode="wait">
              <motion.p key={phrase} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}} style={{fontSize:15,color:VI,fontWeight:500,fontStyle:'italic'}}>
                {ROTATING[phrase]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}} style={{fontSize:16,color:MUTED,lineHeight:1.72,maxWidth:490,marginBottom:36}}>
            Chaque appel reçu. Chaque lead centralisé. Chaque visite planifiée. Chaque client fidélisé à vie. Chaque avis Google collecté. Tout ça, pendant que vous faites votre vrai métier.
          </motion.p>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}} style={{display:'flex',gap:12,flexWrap:'wrap' as const,marginBottom:40}}>
            <a href="/demo" style={{padding:'14px 28px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)',boxShadow:`0 8px 24px ${INK}14`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=INK}}>
              Voir la démo — gratuit
              <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>→</span>
            </a>
            <a href="#features" style={{padding:'14px 28px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=VI;(e.currentTarget as HTMLElement).style.color=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
              Comment ça marche
            </a>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}} style={{display:'flex',alignItems:'center',gap:24,paddingTop:24,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['10+','agences pilotes'],['60s','lead → WhatsApp'],['24/7','IA vocale Sophie'],['EU','hébergement RGPD']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:19,fontWeight:700,color:INK,fontFamily:'Georgia,serif',letterSpacing:'-0.02em'}}>{v}</div>
                <div style={{fontSize:11,color:SUBTLE}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.35}} style={{position:'relative',height:440}} className="hero-sphere">
          <div style={{position:'absolute',inset:0,borderRadius:28,overflow:'hidden',border:`1px solid ${BDR}`}}>
            <Globe/>
          </div>
          {[
            {top:28,right:-18,delay:0,children:<><div style={{fontSize:11,color:SUBTLE,marginBottom:4}}>Appel entrant</div><div style={{display:'flex',alignItems:'center',gap:8}}><motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:8,height:8,borderRadius:'50%',background:'#22C55E',boxShadow:'0 0 0 3px rgba(34,197,94,0.2)'}}/><span style={{fontSize:13,fontWeight:600,color:INK}}>Sophie répond · 0s</span></div></>},
            {bottom:100,left:-18,delay:0.8,children:<><div style={{fontSize:11,color:SUBTLE,marginBottom:4}}>Visite planifiée</div><div style={{fontSize:13,fontWeight:600,color:INK}}>Mercredi 10h · Agenda ✓</div></>},
            {bottom:24,right:14,delay:1.4,children:<><div style={{fontSize:11,color:SUBTLE,marginBottom:2}}>Nouvel avis Google</div><div style={{fontSize:13,color:GOLD,fontWeight:600}}>★★★★★  Reçu</div></>},
          ].map(({top,bottom,left,right,delay,children},i)=>(
            <motion.div key={i} animate={{y:[0,i%2===0?-7:7,0]}} transition={{duration:3.5+i*0.5,repeat:Infinity,ease:'easeInOut',delay}}
              style={{position:'absolute',top,bottom,left,right,background:CARD,border:`1px solid ${BDR}`,borderRadius:14,padding:'12px 16px',boxShadow:`0 10px 32px ${INK}0A`,backdropFilter:'blur(4px)'}}>
              {children}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── TICKER BAR ────────────────────────────────────────────────────────────────
const AGENCIES=['Century 21 Lannion','Orpi Bretagne','Laforêt Perros-Guirec','ERA Immobilier','Stéphane Plaza Rennes','FNAIM Bretagne','Guy Hoquet Brest','IAD France']
function TrustedBy() {
  return (
    <section style={{background:BG,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'22px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px'}}>
        <p style={{textAlign:'center',fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:16}}>Agences en cours de déploiement pilote</p>
        <div style={{overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${BG},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left,${BG},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{display:'flex',gap:48,animation:'ticker 24s linear infinite',width:'max-content',alignItems:'center'}}>
            {[...AGENCIES,...AGENCIES,...AGENCIES].map((n,i)=>(
              <span key={i} style={{fontSize:13,color:SUBTLE,fontFamily:'Georgia,serif',fontStyle:'italic',whiteSpace:'nowrap'}}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── BENEFIT FLOW ──────────────────────────────────────────────────────────────
function BenefitFlow() {
  const steps=[
    {icon:'📞',benefit:'Chaque appel, une opportunité saisie',sub:'Plus jamais un acheteur qui raccroche et ne rappelle pas.',color:VI},
    {icon:'👤',benefit:'Votre pipeline se remplit seul',sub:'SeLoger, LeBonCoin, BienIci — une seule interface.',color:VI},
    {icon:'🏠',benefit:'Le bon bien, au bon acheteur',sub:'Matching instantané sur budget, type, secteur.',color:GOLD},
    {icon:'📅',benefit:'La visite s\'organise sans vous',sub:'Trois confirmations WhatsApp simultanées. Rappels inclus.',color:VI},
    {icon:'✍️',benefit:'Chaque offre, immédiatement traitée',sub:'Alerte directeur en 30 secondes. Aucun dossier perdu.',color:VI},
    {icon:'⭐',benefit:'Votre réputation se construit automatiquement',sub:'Chaque client satisfait devient un avis cinq étoiles.',color:GOLD},
  ]
  return (
    <section style={{background:BG2,padding:'80px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:52}}>
          <Pill>Le cycle complet</Pill>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(24px,3vw,38px)',color:INK,marginTop:14,marginBottom:10,letterSpacing:'-0.025em'}}>
            De l&apos;appel entrant à l&apos;avis cinq étoiles.
          </h2>
          <p style={{fontSize:15,color:MUTED,maxWidth:460,margin:'0 auto'}}>Zéro action manuelle. Chaque étape automatisée, chaque client suivi.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}} className="benefit-grid">
          {steps.map((s,i)=>(
            <FadeUp key={s.benefit} delay={i*0.07}>
              <motion.div whileHover={{y:-4,borderColor:`${s.color}30`}} transition={{duration:0.22}} style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:20,padding:'28px 24px',height:'100%'}}>
                <div style={{fontSize:28,marginBottom:14}}>{s.icon}</div>
                <div style={{fontSize:14,fontWeight:600,color:INK,marginBottom:7,lineHeight:1.35}}>{s.benefit}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.6}}>{s.sub}</div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FEATURE BLOCKS ────────────────────────────────────────────────────────────
function FeatureBlock({pill,h2,body,mockup,anchor,reverse=false,badgeColor=VI}:{pill:string;h2:string;body:string;mockup:React.ReactNode;anchor:string;reverse?:boolean;badgeColor?:string}) {
  return (
    <section id={anchor} style={{background:BG,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center',direction:reverse?'rtl':'ltr'} as React.CSSProperties} className="alt-grid">
        <div style={{direction:'ltr'}}>
          <FadeUp>
            <Pill color={badgeColor}>{pill}</Pill>
            <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(22px,2.8vw,36px)',color:INK,margin:'16px 0 14px',lineHeight:1.2,letterSpacing:'-0.02em'}} dangerouslySetInnerHTML={{__html:h2}}/>
            <p style={{fontSize:14,color:MUTED,lineHeight:1.78}}>{body}</p>
          </FadeUp>
        </div>
        <FadeUp delay={0.12} style={{direction:'ltr'}}>
          <div style={{background:`${BDR}`,border:`1px solid ${BDR}`,borderRadius:26,padding:8}}>
            <div style={{background:BG2,borderRadius:20,padding:28,border:`1px solid ${BDR}`}}>{mockup}</div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// MOCKUP 1 — Lead cockpit
function LeadMockup() {
  const leads=[
    {name:'Marie Dupont',src:'SeLoger',budget:'320 000 €',status:'Nouveau',color:'#3B82F6'},
    {name:'Pierre Martin',src:'LeBonCoin',budget:'250 000 €',status:'Contacté',color:VI},
    {name:'Sophie Bernard',src:'BienIci',budget:'450 000 €',status:'Visite planifiée',color:GOLD},
    {name:'Jean Leclerc',src:'Sophie IA',budget:'190 000 €',status:'Offre reçue',color:'#22C55E'},
  ]
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <span style={{fontSize:12,fontWeight:600,color:INK}}>Leads aujourd&apos;hui</span>
        <span style={{fontSize:11,color:VI,fontWeight:600}}>+4 ce matin</span>
      </div>
      {leads.map((l,i)=>(
        <motion.div key={l.name} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',borderRadius:10,background:CARD,marginBottom:6,border:`1px solid ${BDR}`}}>
          <div><div style={{fontSize:12,fontWeight:600,color:INK}}>{l.name}</div><div style={{fontSize:10,color:SUBTLE}}>{l.src} · {l.budget}</div></div>
          <span style={{fontSize:10,fontWeight:600,color:l.color,background:`${l.color}12`,padding:'3px 10px',borderRadius:980}}>{l.status}</span>
        </motion.div>
      ))}
    </div>
  )
}

// MOCKUP 2 — Visit booking
function VisitMockup() {
  const [step,setStep]=useState(0)
  useEffect(()=>{const id=setInterval(()=>setStep(s=>(s+1)%4),2000);return()=>clearInterval(id)},[])
  const steps=[
    {label:'Sophie qualifie l\'acheteur',color:VI,icon:'🤖'},
    {label:'Agent confirme en 1 clic',color:GOLD,icon:'✅'},
    {label:'Acheteur + vendeur notifiés',color:'#3B82F6',icon:'📱'},
    {label:'Agenda synchronisé',color:'#22C55E',icon:'📅'},
  ]
  return (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:INK,marginBottom:14}}>18 Rue de la Mer, Lannion · Visite en cours</div>
      {steps.map((s,i)=>(
        <div key={s.label} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,background:i===step?`${s.color}0E`:CARD,border:`1px solid ${i===step?s.color+'28':BDR}`,marginBottom:6,transition:'all 0.4s'}}>
          <span style={{fontSize:16}}>{s.icon}</span>
          <span style={{fontSize:12,color:i<=step?INK:SUBTLE,fontWeight:i===step?600:400}}>{s.label}</span>
          {i<step&&<span style={{marginLeft:'auto',color:'#22C55E',fontSize:12}}>✓</span>}
          {i===step&&<motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:0.8,repeat:Infinity}} style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:s.color}}/>}
        </div>
      ))}
    </div>
  )
}

// MOCKUP 3 — Client lifetime
function ClientMockup() {
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <span style={{fontSize:12,fontWeight:600,color:INK}}>Messages automatiques</span>
        <Pill color={GOLD}>Actif</Pill>
      </div>
      {[
        {name:'Marie Dupont',event:'Anniversaire aujourd\'hui 🎂',date:'23 juil.',msg:'Envoyé ✓',color:GOLD},
        {name:'Jean Leclerc',event:'1 an dans sa maison',date:'15 août',msg:'Planifié',color:VI},
        {name:'Famille Bernard',event:'Estimation gratuite offerte',date:'20 oct.',msg:'Planifié',color:'#3B82F6'},
        {name:'Sophie Martin',event:'Vœux de Noël',date:'25 déc.',msg:'Planifié',color:SUBTLE},
      ].map(c=>(
        <div key={c.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 12px',borderRadius:10,background:CARD,marginBottom:5,border:`1px solid ${BDR}`}}>
          <div><div style={{fontSize:11,fontWeight:600,color:INK}}>{c.name}</div><div style={{fontSize:10,color:SUBTLE}}>{c.event} · {c.date}</div></div>
          <span style={{fontSize:10,fontWeight:600,color:c.color,background:`${c.color}12`,padding:'3px 9px',borderRadius:980}}>{c.msg}</span>
        </div>
      ))}
    </div>
  )
}

// MOCKUP 4 — Google Reviews
function ReviewMockup() {
  const [show,setShow]=useState(false)
  useEffect(()=>{const id=setTimeout(()=>setShow(true),1000);return()=>clearTimeout(id)},[])
  return (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:INK,marginBottom:12}}>Demande d&apos;avis WhatsApp · automatique</div>
      <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:12,padding:'14px 16px',marginBottom:10}}>
        <div style={{fontSize:10,color:SUBTLE,marginBottom:6}}>WhatsApp · Marie Dupont · 24h après signature</div>
        <div style={{fontSize:12,color:INK,lineHeight:1.6}}>&ldquo;Bonjour Marie, votre nouvelle maison vous plaît-elle ? Un avis Google de votre part nous aiderait beaucoup. 30 secondes suffisent 😊&rdquo;</div>
      </div>
      <AnimatePresence>
        {show&&(
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{background:`${GOLD}10`,border:`1px solid ${GOLD}28`,borderRadius:12,padding:'12px 16px'}}>
            <div style={{fontSize:12,fontWeight:600,color:GOLD,marginBottom:4}}>★★★★★  Nouvel avis reçu</div>
            <div style={{fontSize:11,color:MUTED}}>&ldquo;Équipe professionnelle et réactive. Je recommande vivement !&rdquo;</div>
            <div style={{fontSize:10,color:VI,marginTop:6,fontWeight:500}}>Réponse IA rédigée — prête à valider →</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// MOCKUP 5 — Property valuation (DVF + Géorisques + Cadastre)
function ValuationMockup() {
  return (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:INK,marginBottom:12}}>Estimation · 18 Rue de la Mer, Lannion</div>
      {[
        {label:'Fourchette marché',value:'285 000 – 310 000 €',src:'DVF data.gouv.fr',color:VI},
        {label:'Surface officielle',value:'112 m²',src:'API Cadastre',color:GOLD},
        {label:'Risques réglementaires',value:'Zone verte — aucun risque',src:'Géorisques.gouv.fr',color:'#22C55E'},
        {label:'DPE estimé',value:'Classe C',src:'Calcul Vanivert',color:'#F59E0B'},
      ].map(r=>(
        <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'9px 12px',borderRadius:10,background:CARD,marginBottom:5,border:`1px solid ${BDR}`}}>
          <div><div style={{fontSize:10,color:SUBTLE,marginBottom:2}}>{r.label}</div><div style={{fontSize:11,fontWeight:600,color:r.color}}>{r.value}</div></div>
          <span style={{fontSize:9,color:SUBTLE,background:BG,border:`1px solid ${BDR}`,padding:'2px 8px',borderRadius:6,flexShrink:0,marginLeft:8}}>{r.src}</span>
        </div>
      ))}
      <div style={{marginTop:10,padding:'10px 14px',borderRadius:10,background:`${VI}08`,border:`1px solid ${VI}20`}}>
        <div style={{fontSize:11,fontWeight:600,color:VI}}>Rapport complet envoyé sur WhatsApp agent · 30s</div>
      </div>
    </div>
  )
}

// MOCKUP 6 — Voice mandate
function MandateMockup() {
  const [step,setStep]=useState(0)
  useEffect(()=>{const id=setInterval(()=>setStep(s=>(s+1)%4),2200);return()=>clearInterval(id)},[])
  return (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:INK,marginBottom:14}}>Mandat depuis note vocale</div>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:12,background:`${VI}08`,border:`1px solid ${VI}20`,marginBottom:14}}>
        <motion.div animate={{scale:[1,1.2,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:10,height:10,borderRadius:'50%',background:'#EF4444'}}/>
        <span style={{fontSize:12,color:INK,fontStyle:'italic'}}>&ldquo;Maison 4 chambres Perros budget 350 000&rdquo;</span>
      </div>
      {[
        {label:'Transcription Whisper',done:step>=1},
        {label:'Extraction GPT-4 → fiche bien',done:step>=2},
        {label:'Mandat créé dans le CRM',done:step>=3},
        {label:'Alerte acheteurs correspondants',done:step>=3},
      ].map((r,i)=>(
        <div key={r.label} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,marginBottom:4}}>
          <motion.span animate={r.done?{scale:[1,1.15,1]}:{}} transition={{duration:0.3}} style={{width:18,height:18,borderRadius:'50%',background:r.done?VI:`${BDR}80`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',flexShrink:0}}>
            {r.done?'✓':(i+1)}
          </motion.span>
          <span style={{fontSize:12,color:r.done?INK:SUBTLE,fontWeight:r.done?500:400,transition:'color 0.3s'}}>{r.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── BENEFITS BENTO ─────────────────────────────────────────────────────────────
function BentoGrid() {
  const items=[
    {icon:'🇫🇷',title:'IA 100% en français',body:'Sophie parle français naturel, comprend les accents régionaux, répond au nom de votre agence. Pas de robot anglophone.',span:'col'},
    {icon:'🔒',title:'Données hébergées en Europe',body:'Supabase Dublin + Hetzner Frankfurt. RGPD natif. Vos données de clients ne quittent jamais l\'UE.',span:'col'},
    {icon:'⚡',title:'60 secondes chrono',body:'Appel entrant → lead qualifié → WhatsApp agent. Tout ça en moins d\'une minute, 24h/24.',span:'wide'},
    {icon:'📊',title:'Tableau de bord directeur',body:'Pipeline en temps réel, performance des agents, leads en attente, avis récents. Un seul écran, zéro tableur.',span:'col'},
    {icon:'🔗',title:'Zéro changement de logiciel',body:'Vanivert se connecte à ce que vous utilisez déjà : Gmail, Outlook, Google Calendar, WhatsApp.',span:'col'},
    {icon:'🇪🇺',title:'Conforme EU AI Act',body:'Article 50 appliqué : Sophie s\'identifie comme assistant virtuel en ouverture d\'appel. Aucun risque réglementaire.',span:'wide'},
  ]
  return (
    <section style={{background:BG2,padding:'80px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <Pill>Pourquoi Vanivert</Pill>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(22px,2.8vw,36px)',color:INK,marginTop:14,marginBottom:10,letterSpacing:'-0.025em'}}>
            Conçu pour le marché immobilier français.
          </h2>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}} className="bento-grid">
          {items.map((item,i)=>(
            <FadeUp key={item.title} delay={i*0.05} style={{gridColumn:item.span==='wide'?'span 2':'auto'} as React.CSSProperties} className={item.span==='wide'?'bento-wide':''}>
              <motion.div whileHover={{borderColor:`${VI}25`,y:-3}} transition={{duration:0.22}}
                style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:20,padding:'28px 24px',height:'100%'}}>
                <div style={{fontSize:28,marginBottom:12}}>{item.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:INK,marginBottom:8}}>{item.title}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.65}}>{item.body}</div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── INTEGRATIONS ──────────────────────────────────────────────────────────────
function Integrations() {
  const cats=[
    {label:'Portails leads',color:VI,items:['SeLoger (email parsing)','LeBonCoin (messagerie)','BienIci (notifications)','Google My Business (appels)']},
    {label:'Communication',color:GOLD,items:['WhatsApp Business (Twilio)','Sophie IA (ElevenLabs)','Email entrant (Postmark)','SMS notifications']},
    {label:'Agenda & CRM',color:'#3B82F6',items:['Google Calendar','Microsoft Outlook','Rappels J-1 et H-2','Sync multi-agents']},
    {label:'Data gouvernementale',color:'#22C55E',items:['DVF (data.gouv.fr)','Géorisques (georisques.gouv.fr)','Cadastre (API officielle)','Hébergement EU · RGPD']},
  ]
  return (
    <section id="integrations" style={{background:BG,padding:'80px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <Pill>Intégrations</Pill>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(22px,2.8vw,36px)',color:INK,marginTop:14,marginBottom:10,letterSpacing:'-0.025em'}}>Connecté à ce que vous utilisez déjà.</h2>
          <p style={{fontSize:14,color:MUTED,maxWidth:420,margin:'0 auto'}}>Aucun changement de logiciel. Vanivert se branche en arrière-plan.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}} className="pricing-grid">
          {cats.map(cat=>(
            <FadeUp key={cat.label}>
              <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:16,padding:'20px 18px',height:'100%'}}>
                <div style={{fontSize:11,fontWeight:700,color:cat.color,marginBottom:14,textTransform:'uppercase' as const,letterSpacing:'0.08em'}}>{cat.label}</div>
                {cat.items.map(name=>(
                  <div key={name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,fontSize:12.5,color:INK,padding:'7px 10px',borderRadius:8,background:BG}}>
                    <span style={{width:5,height:5,borderRadius:'50%',background:cat.color,flexShrink:0}}/>{name}
                  </div>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PRICING ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans=[
    {name:'Pilote',tag:'Commencer',tagColor:'#22C55E',highlight:false,desc:'Idéal pour tester avec une agence individuelle',items:['IA vocale Sophie 24h/24','CRM leads 3 portails centralisés','Planification de visites WhatsApp','Tableau de bord directeur','Support email sous 24h'],cta:'Démarrer le pilote',href:'/demo'},
    {name:'Croissance',tag:'Plus populaire',tagColor:VI,highlight:true,desc:'Pour les agences avec plusieurs agents',items:['Tout Pilote inclus','Relation client à vie automatisée','Avis Google collectés automatiquement','Mandat depuis note vocale en 30s','Estimations DVF + Géorisques + Cadastre','Support prioritaire sous 4h'],cta:'Réserver une démo',href:'/demo'},
    {name:'Réseau',tag:'Multi-agences',tagColor:GOLD,highlight:false,desc:'Franchise ou réseau de plusieurs agences',items:['Tout Croissance inclus','Multi-agences et multi-agents','API et intégrations sur mesure','Compte manager dédié','SLA garanti contractuellement'],cta:'Nous contacter',href:'mailto:contact@vanivert.fr'},
  ]
  return (
    <section id="pricing" style={{background:BG2,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:52}}>
          <Pill>Tarifs</Pill>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(24px,3.2vw,40px)',color:INK,marginTop:14,marginBottom:12,letterSpacing:'-0.025em'}}>Un abonnement. Tout dedans.</h2>
          <p style={{fontSize:15,color:MUTED,maxWidth:460,margin:'0 auto'}}>Tarif sur mesure selon votre volume. Proposition écrite en 24h. Aucun module caché.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}} className="pricing-grid">
          {plans.map((p,i)=>(
            <FadeUp key={p.name} delay={i*0.07}>
              <div style={{padding:'28px 24px',borderRadius:20,background:p.highlight?INK:CARD,border:`1.5px solid ${p.highlight?INK:BDR}`,display:'flex',flexDirection:'column',height:'100%'}}>
                <div style={{fontSize:10,fontWeight:700,color:p.tagColor,padding:'3px 10px',borderRadius:980,border:`1px solid ${p.tagColor}28`,background:`${p.tagColor}12`,marginBottom:14,alignSelf:'flex-start'}}>{p.tag}</div>
                <h3 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:22,color:p.highlight?'#fff':INK,marginBottom:6}}>{p.name}</h3>
                <p style={{fontSize:12,color:p.highlight?'rgba(255,255,255,0.5)':MUTED,marginBottom:20}}>{p.desc}</p>
                <div style={{flex:1,marginBottom:24}}>
                  {p.items.map(item=>(
                    <div key={item} style={{display:'flex',gap:8,marginBottom:9,fontSize:12.5,color:p.highlight?'rgba(255,255,255,0.75)':MUTED,lineHeight:1.4}}>
                      <span style={{color:p.highlight?'#86EFAC':VI,fontWeight:700,flexShrink:0}}>✓</span>{item}
                    </div>
                  ))}
                </div>
                <a href={p.href} style={{textAlign:'center',padding:'12px',borderRadius:980,background:p.highlight?'#fff':INK,color:p.highlight?INK:'#fff',fontWeight:600,fontSize:13,textDecoration:'none',display:'block',transition:'opacity 0.2s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='0.85'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}>{p.cta}</a>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2}>
          <div style={{marginTop:20,padding:'18px 24px',borderRadius:16,background:CARD,border:`1px solid ${BDR}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:16}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:INK,marginBottom:3}}>Tarif sur mesure selon votre volume et votre secteur.</div>
              <div style={{fontSize:13,color:MUTED}}>Aucune surprise. Proposition écrite remise sous 24h ouvrées.</div>
            </div>
            <a href="/demo" style={{padding:'11px 24px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:13,textDecoration:'none',whiteSpace:'nowrap' as const,transition:'background 0.25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=INK}}>Obtenir ma proposition →</a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── BLOG PREVIEW ──────────────────────────────────────────────────────────────
function BlogPreview() {
  const [articles, setArticles] = useState(DEFAULT_ARTICLES.filter(a=>a.published).slice(0,3))
  useEffect(()=>{
    try {
      const saved = localStorage.getItem('vanivert_blog_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        setArticles(parsed.filter((a: {published:boolean})=>a.published).slice(0,3))
      }
    } catch {}
  },[])
  if (articles.length===0) return null
  const [first, ...rest] = articles
  return (
    <section id="blog" style={{background:BG,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36,flexWrap:'wrap' as const,gap:12}}>
          <div><Pill>Blog</Pill>
            <h2 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontWeight:400,fontSize:'clamp(20px,2.6vw,32px)',color:INK,marginTop:12,letterSpacing:'-0.02em'}}>Ce que les meilleures agences font déjà.</h2>
          </div>
          <a href="/blog" style={{fontSize:13,color:VI,fontWeight:600,textDecoration:'none'}}>Tous les articles →</a>
        </FadeUp>
        <FadeUp>
          <a href={`/blog/${first.slug}`} style={{textDecoration:'none',display:'grid',gridTemplateColumns:'1fr 1fr',borderRadius:20,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,marginBottom:14,transition:'border-color 0.25s'}}
            onMouseEnter={e=>(e.currentTarget.style.borderColor=BDR2)} onMouseLeave={e=>(e.currentTarget.style.borderColor=BDR)} className="blog-featured">
            <div style={{height:280,overflow:'hidden'}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={first.image} alt={first.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.75)'}} loading="eager"/>
            </div>
            <div style={{padding:'30px 28px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <div>
                <Pill color={first.categoryColor}>{first.category}</Pill>
                <h3 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:19,color:INK,lineHeight:1.35,margin:'14px 0 12px'}}>{first.title}</h3>
                <p style={{fontSize:13,color:MUTED,lineHeight:1.65}}>{first.excerpt}</p>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
                <span style={{fontSize:11,color:SUBTLE}}>{first.readTime} de lecture · {first.date}</span>
                <span style={{fontSize:13,color:VI,fontWeight:600}}>Lire →</span>
              </div>
            </div>
          </a>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="pricing-grid">
          {rest.map((p,i)=>(
            <FadeUp key={p.slug} delay={i*0.08}>
              <a href={`/blog/${p.slug}`} style={{textDecoration:'none',display:'block',borderRadius:16,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,transition:'border-color 0.25s,transform 0.25s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR;(e.currentTarget as HTMLElement).style.transform='none'}}>
                <div style={{height:160,overflow:'hidden'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="lazy"/>
                </div>
                <div style={{padding:'18px 20px'}}>
                  <Pill color={p.categoryColor}>{p.category}</Pill>
                  <h3 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:15,color:INK,lineHeight:1.35,margin:'10px 0 8px'}}>{p.title}</h3>
                  <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:12}}>{p.excerpt}</p>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:11,color:SUBTLE}}>{p.readTime} · {p.date}</span>
                    <span style={{fontSize:12,color:VI,fontWeight:600}}>Lire →</span>
                  </div>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [agency,setAgency]=useState(''), [agents,setAgents]=useState(''), [message,setMessage]=useState(''), [sent,setSent]=useState(false), [loading,setLoading]=useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if(!email||!name) return; setLoading(true)
    if (SB_URL&&SB_KEY) {
      await fetch(`${SB_URL}/rest/v1/demo_requests`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name,email,agency_name:agency,agent_count:agents,message,created_at:new Date().toISOString()})}).catch(()=>{})
    }
    await new Promise(r=>setTimeout(r,400)); setSent(true); setLoading(false)
  }
  const inp: React.CSSProperties={width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BDR2}`,fontSize:14,outline:'none',color:INK,fontFamily:'system-ui,sans-serif',background:BG,boxSizing:'border-box'}
  return (
    <section id="contact" style={{background:BG2,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:960,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}} className="alt-grid">
        <FadeUp>
          <Pill>Contact</Pill>
          <h2 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontWeight:400,fontSize:'clamp(26px,3.2vw,40px)',color:INK,marginTop:14,marginBottom:12,letterSpacing:'-0.03em'}}>On vous rappelle.<br/>Promis.</h2>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.75,marginBottom:28}}>Pas un bot. Pawan Kumar, co-fondateur, vous répond personnellement sous 24h ouvrées.</p>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {[['📧','contact@vanivert.fr',`mailto:contact@vanivert.fr`],['📍','Lannion, Côtes-d\'Armor, Bretagne, France','https://maps.google.com/?q=Lannion,France'],['🔒','SIRET 93429900900019','#'],['🔗','linkedin.com/company/vanivert','https://linkedin.com/company/vanivert']].map(([icon,label,href])=>(
              <a key={label} href={href} target={href.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
                <span style={{fontSize:16}}>{icon}</span><span style={{fontSize:13,color:MUTED,transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color=INK)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{label}</span>
              </a>
            ))}
          </div>
          <div style={{borderRadius:14,overflow:'hidden',border:`1px solid ${BDR}`,height:110,background:BG,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <a href="https://maps.google.com/?q=Lannion,Bretagne,France" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:VI,textDecoration:'none',fontWeight:600}}>📍 Voir sur Google Maps — Lannion, Bretagne</a>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          {sent?(
            <div style={{padding:28,borderRadius:18,background:`${VI}08`,border:`1px solid ${VI}18`,textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:12}}>✅</div>
              <div style={{fontSize:16,fontWeight:600,color:INK,marginBottom:8}}>Message reçu !</div>
              <div style={{fontSize:13,color:MUTED}}>Pawan vous répond sous 24h ouvrées.</div>
            </div>
          ):(
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Votre prénom" style={inp}/>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email professionnel" style={inp}/>
              </div>
              <input value={agency} onChange={e=>setAgency(e.target.value)} placeholder="Nom de votre agence" style={inp}/>
              <select value={agents} onChange={e=>setAgents(e.target.value)} style={{...inp,appearance:'none' as const}}>
                <option value="">Nombre d&apos;agents</option>
                <option value="1">1 agent</option>
                <option value="2-5">2 à 5 agents</option>
                <option value="6-15">6 à 15 agents</option>
                <option value="15+">Plus de 15 agents</option>
              </select>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Votre message (optionnel)" rows={3} style={{...inp,resize:'vertical' as const}}/>
              <p style={{fontSize:11,color:SUBTLE,lineHeight:1.55}}>En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter. Conforme RGPD. Aucune transmission à des tiers. <a href="/legal/confidentialite" style={{color:VI}}>Politique de confidentialité →</a></p>
              <button type="submit" disabled={loading} style={{padding:'14px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:14,border:'none',cursor:'pointer',transition:'background 0.25s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=INK}}>
                {loading?'...':'Demander une démo gratuite →'}
              </button>
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  )
}

// ── FOOTER CTA ────────────────────────────────────────────────────────────────
function FooterCTA() {
  return (
    <section style={{background:BG,padding:'0 32px 72px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp>
          <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:28,padding:'88px 40px',textAlign:'center' as const,position:'relative',overflow:'hidden',backgroundImage:`linear-gradient(${BDR} 1px,transparent 1px),linear-gradient(90deg,${BDR} 1px,transparent 1px)`,backgroundSize:'72px 72px',backgroundPosition:'center center'}}>
            <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 85% at center,transparent 0%,${CARD} 72%)`,pointerEvents:'none'}}/>
            <div style={{position:'absolute',top:'50%',left:'50%',width:560,height:800,marginLeft:-280,marginTop:-400,borderRadius:'50%',border:`1px solid ${BDR2}`,pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:2}}>
              <Pill color={VI}>Disponible maintenant · Bretagne &amp; France entière</Pill>
              <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(28px,3.8vw,48px)',color:INK,margin:'20px auto 16px',letterSpacing:'-0.025em',lineHeight:1.15,maxWidth:620}}>L&apos;agence qui ne dort jamais.</h2>
              <p style={{fontSize:16,color:MUTED,maxWidth:440,margin:'0 auto 40px'}}>Rejoignez les agences qui ont automatisé leur croissance avec Vanivert.</p>
              <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap' as const}}>
                <a href="/demo" style={{padding:'14px 32px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:14,textDecoration:'none',transition:'background 0.25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=INK}}>Réserver une démo →</a>
                <a href="#contact" style={{padding:'14px 32px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=VI;(e.currentTarget as HTMLElement).style.color=VI}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>Nous contacter</a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols=[
    {h:'Produit',links:[['Fonctionnalités','#features'],['Tarifs','#pricing'],['Intégrations','#integrations'],['Connexion','/login'],['Réserver une démo','/demo']]},
    {h:'Ressources',links:[['Blog','/blog'],['Équipe','/equipe'],['FAQ','#contact']]},
    {h:'Légal',links:[['Mentions légales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Confidentialité','/legal/confidentialite'],['Administration','/admin']]},
  ]
  return (
    <footer style={{background:BG2,borderTop:`1px solid ${BDR}`,padding:'56px 32px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr repeat(3,1fr)',gap:32,marginBottom:48}} className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Logo s={26}/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:16,color:INK}}>vanivert</span></div>
            <p style={{fontSize:13,color:MUTED,lineHeight:1.65,maxWidth:220,marginBottom:16}}>L&apos;IA immobilière qui ne dort jamais. Fait en Bretagne, déployé partout en France.</p>
            <a href="https://www.linkedin.com/company/vanivert" target="_blank" rel="noopener noreferrer" style={{width:32,height:32,borderRadius:8,background:CARD,border:`1px solid ${BDR}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:INK,textDecoration:'none'}}>in</a>
          </div>
          {cols.map(col=>(
            <div key={col.h}>
              <div style={{fontSize:11,fontWeight:600,color:INK,marginBottom:14}}>{col.h}</div>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {col.links.map(([l,h])=>(
                  <a key={l} href={h} style={{fontSize:13,color:MUTED,textDecoration:'none',transition:'color 0.2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color=INK)} onMouseLeave={e=>(e.currentTarget.style.color=MUTED)}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${BDR}`,paddingTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:10}}>
          <span style={{fontSize:12,color:SUBTLE}}>© 2026 Vanivert · SIRET 93429900900019</span>
          <span style={{fontSize:12,color:SUBTLE}}>Lannion, Côtes-d&apos;Armor, Bretagne, France</span>
          <a href="mailto:contact@vanivert.fr" style={{fontSize:12,color:SUBTLE,textDecoration:'none'}}>contact@vanivert.fr</a>
        </div>
      </div>
    </footer>
  )
}

// ── GDPR ──────────────────────────────────────────────────────────────────────
function GDPR() {
  const [visible,setVisible]=useState(false)
  useEffect(()=>{try{if(!localStorage.getItem('vanivert_gdpr_v3'))setVisible(true)}catch{}},[])
  const accept=()=>{try{localStorage.setItem('vanivert_gdpr_v3','accepted')}catch{}setVisible(false)}
  const decline=()=>{try{localStorage.setItem('vanivert_gdpr_v3','declined')}catch{}setVisible(false)}
  if(!visible) return null
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:2.5}}
      style={{position:'fixed',bottom:20,left:20,right:20,zIndex:9990,maxWidth:480,margin:'0 auto',background:CARD,border:`1px solid ${BDR2}`,borderRadius:18,padding:'20px 22px',boxShadow:'0 8px 40px rgba(0,0,0,0.08)',display:'flex',flexDirection:'column',gap:10}}>
      <p style={{fontSize:13,fontWeight:600,color:INK,margin:0}}>Ce site utilise des cookies</p>
      <p style={{fontSize:12,color:MUTED,lineHeight:1.55,margin:0}}>Cookies fonctionnels uniquement. Hébergement 100% UE. Aucune donnée transmise à des tiers. <a href="/legal/confidentialite" style={{color:VI}}>En savoir plus</a></p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={accept} style={{flex:1,padding:'9px 16px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:12,border:'none',cursor:'pointer'}}>Accepter</button>
        <button onClick={decline} style={{flex:1,padding:'9px 16px',borderRadius:980,background:'transparent',color:MUTED,fontWeight:500,fontSize:12,border:`1px solid ${BDR2}`,cursor:'pointer'}}>Refuser</button>
      </div>
    </motion.div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${INK};font-family:Georgia,serif;overflow-x:hidden;cursor:none}
        input,textarea,select,button{font-family:system-ui,-apple-system,sans-serif;cursor:none}
        a{cursor:none}
        input::placeholder,textarea::placeholder{color:rgba(13,13,15,0.3)}
        .nav-links{display:flex}.mob-nav{display:none}
        @media(max-width:860px){.nav-links{display:none!important}.mob-nav{display:flex!important}}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-sphere{display:none}.alt-grid{grid-template-columns:1fr!important;direction:ltr!important}}
        @media(max-width:768px){.benefit-grid{grid-template-columns:1fr 1fr!important}.pricing-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}.blog-featured{grid-template-columns:1fr!important}.bento-grid{grid-template-columns:1fr!important}.bento-wide{grid-column:auto!important}}
        @media(max-width:480px){.benefit-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr!important}.pricing-grid{grid-template-columns:1fr!important}}
        @media(hover:none){body{cursor:auto}a,button,input,select,textarea{cursor:auto}}
      `}</style>
      <CursorDot/>
      <ScrollBar/>
      <Nav/>
      <main>
        <Hero/>
        <TrustedBy/>
        <BenefitFlow/>
        <FeatureBlock anchor="leads" pill="Leads · SeLoger · LeBonCoin · BienIci · GMB" h2="Tous vos leads.<br/>Un seul endroit." body="Chaque demande entrante — des trois portails, de Google My Business, de Sophie IA — arrive dans votre CRM en moins de 10 secondes. Déduplication automatique. Score de priorité. Plus de copier-coller entre les onglets." mockup={<LeadMockup/>} badgeColor={VI}/>
        <FeatureBlock anchor="visits" pill="Google Calendar · Outlook · WhatsApp" h2="La visite planifiée.<br/><em style='color:rgba(13,13,15,0.5)'>Sans un seul appel manuel.</em>" body="L'acheteur confirme son intérêt. L'agent valide en un clic. Acheteur, vendeur et agent reçoivent une confirmation WhatsApp simultanée. Rappels automatiques la veille et deux heures avant. Zéro no-show non géré." mockup={<VisitMockup/>} reverse badgeColor={GOLD}/>
        <FeatureBlock anchor="clients" pill="Anniversaires · Estimations · Fidélisation" h2="Vos clients ne vous oublieront plus.<br/><em style='color:rgba(13,13,15,0.5)'>Parce que vous ne les oubliez pas.</em>" body="Anniversaires, premier anniversaire dans la maison, estimations trimestrielles gratuites, vœux de Noël et 14 Juillet. Chaque message personnalisé, envoyé automatiquement depuis le nom de l'agent. Le client rappelle vous — pas l'inverse." mockup={<ClientMockup/>} badgeColor={VI}/>
        <FeatureBlock anchor="reviews" pill="Deal signé → Avis automatique 24h après" h2="Chaque transaction,<br/>un avis cinq étoiles de plus." body="Deal marqué Gagné. Vingt-quatre heures plus tard, acheteur et vendeur reçoivent chacun un WhatsApp personnalisé. Les avis Google arrivent dans le tableau de bord avec une réponse IA prête à valider en un clic. Votre note monte. Vos leads entrants aussi." mockup={<ReviewMockup/>} reverse badgeColor={GOLD}/>
        <FeatureBlock anchor="valuation" pill="DVF · Géorisques · Cadastre — APIs officielles" h2="Une estimation crédible<br/>en 30 secondes." body="DVF récupère les 15 dernières transactions comparables. Géorisques identifie tous les risques réglementaires obligatoires à mentionner. Le Cadastre confirme la surface officielle. Tout ça agrégé automatiquement en un rapport envoyé sur WhatsApp à l'agent. Gratuit, légal, sourcé." mockup={<ValuationMockup/>} badgeColor={VI}/>
        <FeatureBlock anchor="mandate" pill="Note vocale → Mandat en 30s" h2="Dictez. Le mandat<br/>se crée tout seul." body="Dictez les caractéristiques d'un bien pendant une visite. Whisper transcrit. GPT extrait le type, les pièces, la surface, le budget, le secteur. La fiche mandat apparaît dans le CRM en trente secondes avec alerte automatique aux acheteurs qui correspondent." mockup={<MandateMockup/>} reverse badgeColor={GOLD}/>
        <BentoGrid/>
        <Integrations/>
        <Pricing/>
        <BlogPreview/>
        <Contact/>
        <FooterCTA/>
      </main>
      <Footer/>
      <GDPR/>
    </>
  )
}
