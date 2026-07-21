'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import { DEFAULT_ARTICLES } from '@/lib/articles'

// TOKENS - vibrant white + blue + orange
const BG    = '#FFFFFF'
const BG2   = '#F8F9FF'
const BG3   = '#FFF8F3'
const CARD  = '#FFFFFF'
const INK   = '#0C0E1A'
const BLUE  = '#2563EB'
const BLUE2 = '#1D4ED8'
const BLUE_LT= '#EFF6FF'
const ORG   = '#F97316'
const ORG_LT= '#FFF7ED'
const TEAL  = '#0D9488'
const MUTED = 'rgba(12,14,26,0.52)'
const SUBTLE= 'rgba(12,14,26,0.32)'
const BDR   = 'rgba(12,14,26,0.07)'
const BDR2  = 'rgba(12,14,26,0.13)'
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Paris address from registration doc
const PARIS_ADDRESS = '1 Clos des Sylthes, 95800 Cergy, France'
const SIRET = '93429900900019'
const EMAIL = 'team@vanivert.eu'

// CURSOR DOT
function CursorDot() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) dot.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)`
      if (ring.current) ring.current.style.transform = `translate(${e.clientX-16}px,${e.clientY-16}px)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <>
      <div ref={dot} style={{position:'fixed',top:0,left:0,width:8,height:8,borderRadius:'50%',background:BLUE,zIndex:9999,pointerEvents:'none',willChange:'transform',transition:'transform 0.05s'}}/>
      <div ref={ring} style={{position:'fixed',top:0,left:0,width:32,height:32,borderRadius:'50%',border:`1.5px solid ${BLUE}`,zIndex:9998,pointerEvents:'none',willChange:'transform',transition:'transform 0.12s',opacity:0.4}}/>
    </>
  )
}

// SCROLL BAR
function ScrollBar() {
  const {scrollYProgress} = useScroll()
  const scaleX = useTransform(scrollYProgress,[0,1],[0,1])
  return <motion.div style={{position:'fixed',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${BLUE},${ORG})`,transformOrigin:'left',scaleX,zIndex:600,pointerEvents:'none'}}/>
}

// FADE UP
function FadeUp({children,delay=0,style={},className}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties;className?:string}) {
  const ref = useRef<HTMLDivElement>(null)
  const inV = useInView(ref,{once:true,margin:'-60px'})
  return (
    <motion.div ref={ref} initial={{opacity:0,y:28}} animate={inV?{opacity:1,y:0}:{}} transition={{duration:0.75,ease:EZ,delay}} style={style} className={className}>
      {children}
    </motion.div>
  )
}

// PILL
function Pill({children}:{children:React.ReactNode;color?:string}) {
  return null
}

// LOGO
function Logo({s=32}:{s?:number}) {
  const cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.16
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={BLUE} strokeWidth={1} fill="none" strokeOpacity="0.4"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill={BLUE} opacity="0.65"/>)}
      <circle cx={cx} cy={cy} r={cr} fill={BLUE}/>
    </svg>
  )
}

// THREE GLOBE
function Globe() {
  const mount = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mount.current) return
    const W = mount.current.clientWidth || 460
    const H = mount.current.clientHeight || 460
    const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setSize(W,H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setClearColor(0x000000,0)
    mount.current.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42,W/H,0.1,100)
    camera.position.z = 3.4
    const wireGeo = new THREE.SphereGeometry(1,28,28)
    const wireMat = new THREE.MeshBasicMaterial({color:new THREE.Color(BLUE),wireframe:true,opacity:0.12,transparent:true})
    const wire = new THREE.Mesh(wireGeo,wireMat)
    scene.add(wire)
    const innerGeo = new THREE.SphereGeometry(0.9,32,32)
    const innerMat = new THREE.MeshPhongMaterial({color:new THREE.Color('#F0F5FF'),shininess:80,transparent:true,opacity:0.92})
    const inner = new THREE.Mesh(innerGeo,innerMat)
    scene.add(inner)
    const nodeMat = new THREE.MeshBasicMaterial({color:new THREE.Color(BLUE)})
    const orangeMat = new THREE.MeshBasicMaterial({color:new THREE.Color(ORG)})
    const nodePos = [[0.9,0.3,0.3],[-0.85,0.4,0.3],[0.2,0.95,0.2],[0.1,-0.9,0.4],[-0.3,0.2,0.95],[0.7,-0.6,0.4],[-0.5,-0.7,0.5],[0.3,0.5,-0.8]]
    const nodes = nodePos.map(([x,y,z],i) => {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.044,8,8),i%3===0?orangeMat:nodeMat)
      n.position.set(x as number,y as number,z as number)
      scene.add(n)
      return n
    })
    for(let i=0;i<nodes.length;i++){
      const pts=[nodes[i].position.clone(),nodes[(i+3)%nodes.length].position.clone()]
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:new THREE.Color(BLUE),opacity:0.18,transparent:true})))
    }
    scene.add(new THREE.AmbientLight(0xffffff,0.7))
    const dl=new THREE.DirectionalLight(0xffffff,0.9);dl.position.set(2,3,2);scene.add(dl)
    let f=0,raf=0
    const animate=()=>{raf=requestAnimationFrame(animate);f++;wire.rotation.y=f*0.003;wire.rotation.x=f*0.001;inner.rotation.y=-f*0.002;renderer.render(scene,camera)}
    animate()
    return ()=>{cancelAnimationFrame(raf);renderer.dispose();if(mount.current&&renderer.domElement.parentNode===mount.current)mount.current.removeChild(renderer.domElement)}
  },[])
  return <div ref={mount} style={{width:'100%',height:'100%'}}/>
}

// NAV
function Nav() {
  const [sc,setSc]=useState(false)
  const [mob,setMob]=useState(false)
  useEffect(()=>{const h=()=>setSc(window.scrollY>30);window.addEventListener('scroll',h,{passive:true});return()=>window.removeEventListener('scroll',h)},[])
  const links:[string,string][]=[['Fonctionnalites','#features'],['ROI','#roi'],['Equipe','#team'],['Investisseurs','#investors']]
  return (
    <>
      <nav style={{position:'fixed',top:3,left:0,right:0,zIndex:200,height:64,display:'flex',alignItems:'center',background:sc?'rgba(255,255,255,0.96)':'transparent',backdropFilter:sc?'blur(18px)':'none',WebkitBackdropFilter:sc?'blur(18px)':'none',borderBottom:`1px solid ${sc?BDR2:'transparent'}`,transition:'all 0.35s cubic-bezier(0.32,0.72,0,1)'}}>
        <div style={{maxWidth:1240,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <Logo s={30}/>
            <span style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontSize:17,color:INK,fontWeight:600,letterSpacing:'-0.02em'}}>Vanivert</span>
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
            <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
              style={{fontSize:13,fontWeight:600,color:'#fff',textDecoration:'none',padding:'9px 22px',borderRadius:980,background:BLUE,display:'inline-flex',alignItems:'center',gap:8,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)',boxShadow:`0 4px 14px ${BLUE}28`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BLUE2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=BLUE}}>
              Boostez votre CA
              <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>→</span>
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:250,background:'rgba(255,255,255,0.98)',backdropFilter:'blur(20px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
            {[...links,['Connexion','/login'],['Voir la demo','/demo']].map(([l,h],i)=>(
              <motion.a key={l} href={h} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} onClick={()=>setMob(false)}
                style={{fontSize:22,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',color:INK,textDecoration:'none',padding:'12px 32px',textAlign:'center'}}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// HERO
const ROTATING=['De l\'appel entrant a l\'avis cinq etoiles.','Zero lead perdu. Zero client oublie.','Votre concurrent dort. Vous, non.','L\'agence qui tourne en pilote automatique.']

function Hero() {
  const [phrase,setPhrase]=useState(0)
  const {scrollY}=useScroll()
  const bgY=useTransform(scrollY,[0,600],[0,80])
  useEffect(()=>{const id=setInterval(()=>setPhrase(p=>(p+1)%ROTATING.length),3800);return()=>clearInterval(id)},[])
  return (
    <section style={{minHeight:'100dvh',background:BG,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',position:'relative',overflow:'hidden'}}>
      <motion.div style={{y:bgY,position:'absolute',top:'-15%',left:'-8%',width:'50vw',height:'50vw',maxWidth:600,borderRadius:'50%',background:`radial-gradient(circle,${BLUE}08 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <motion.div style={{y:bgY,position:'absolute',bottom:'-10%',right:'-5%',width:'40vw',height:'40vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,${ORG}08 0%,transparent 65%)`,pointerEvents:'none'}}/>
      <div style={{maxWidth:1200,width:'100%',display:'grid',gridTemplateColumns:'1fr 460px',gap:64,alignItems:'center',position:'relative',zIndex:2}} className="hero-grid">
        <div>
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.05}} style={{marginBottom:22}}>
            <Pill color={BLUE}>IA immobiliere - Registre France - RGPD EU</Pill>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.75,ease:EZ,delay:0.1}}
            style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontWeight:400,fontSize:'clamp(34px,4.6vw,60px)',color:INK,lineHeight:1.07,marginBottom:14,letterSpacing:'-0.03em'}}>
            L&apos;agence immobiliere<br/><span style={{fontStyle:'italic',color:MUTED}}>qui ne dort jamais.</span>
          </motion.h1>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.28}} style={{height:26,marginBottom:18,overflow:'hidden'}}>
            <AnimatePresence mode="wait">
              <motion.p key={phrase} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}}
                style={{fontSize:15,color:BLUE,fontWeight:600,fontStyle:'italic'}}>
                {ROTATING[phrase]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}}
            style={{fontSize:17,color:MUTED,lineHeight:1.7,maxWidth:490,marginBottom:36}}>
            Vanivert gere vos appels, vos leads, vos visites et votre reputation en ligne. Vous, vous vendez.
          </motion.p>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}} style={{display:'flex',gap:12,flexWrap:'wrap' as const,marginBottom:40}}>
            <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
              style={{padding:'14px 28px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,transition:'background 0.25s cubic-bezier(0.32,0.72,0,1)',boxShadow:`0 8px 24px ${BLUE}28`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BLUE2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=BLUE}}>
              Demander une demo gratuite
              <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>→</span>
            </a>
            <a href="#roi" style={{padding:'14px 28px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=BLUE;(e.currentTarget as HTMLElement).style.color=BLUE}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
              Calculer mon gain
            </a>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}} style={{display:'flex',alignItems:'center',gap:24,paddingTop:24,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['10+','agences pilotes'],['60s','lead WhatsApp'],['24/7','IA vocale'],['EU','donnees RGPD']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:20,fontWeight:700,color:INK,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',letterSpacing:'-0.02em'}}>{v}</div>
                <div style={{fontSize:11,color:SUBTLE}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.35}} style={{position:'relative',height:460}} className="hero-sphere">
          <div style={{position:'absolute',inset:0,borderRadius:28,overflow:'hidden',border:`1px solid ${BDR}`}}><Globe/></div>
          {[
            {top:28,right:-18,delay:0,bg:`${BLUE_LT}`,bdrc:BLUE,children:<><div style={{fontSize:11,color:BLUE,fontWeight:600,marginBottom:4}}>Appel entrant</div><div style={{display:'flex',alignItems:'center',gap:8}}><motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:8,height:8,borderRadius:'50%',background:'#22C55E',boxShadow:'0 0 0 3px rgba(34,197,94,0.2)'}}/><span style={{fontSize:13,fontWeight:600,color:INK}}>Sophie repond - 0s</span></div></>},
            {bottom:110,left:-18,delay:0.8,bg:'#fff',bdrc:BDR2,children:<><div style={{fontSize:11,color:MUTED,marginBottom:4}}>Visite planifiee</div><div style={{fontSize:13,fontWeight:600,color:INK}}>Mercredi 10h - Agenda ✓</div></>},
            {bottom:28,right:14,delay:1.4,bg:ORG_LT,bdrc:ORG,children:<><div style={{fontSize:11,color:ORG,fontWeight:600,marginBottom:2}}>Avis Google recu</div><div style={{fontSize:13,color:ORG,fontWeight:700}}>★★★★★  Nouveau</div></>},
          ].map(({top,bottom,left,right,delay,bg,bdrc,children},i)=>(
            <motion.div key={i} animate={{y:[0,i%2===0?-7:7,0]}} transition={{duration:3.5+i*0.5,repeat:Infinity,ease:'easeInOut',delay}}
              style={{position:'absolute',top,bottom,left,right,background:bg,border:`1px solid ${bdrc}`,borderRadius:14,padding:'12px 16px',boxShadow:'0 8px 24px rgba(12,14,26,0.08)'}}>
              {children}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// TICKER
const PARIS_AGENCIES=['Foncia Paris 8e','Century 21 Trocadero','Laforet Paris 16e','Orpi Paris Centre','Stéphane Plaza Paris 17e','IAD France Ile-de-France','ERA Immobilier Paris','Guy Hoquet Paris 15e','Nexity Solutions Immobilieres']

function Ticker() {
  return (
    <section style={{background:BG,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'20px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px'}}>
        <p style={{textAlign:'center',fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:14}}>Agences en cours de deploiement pilote en Ile-de-France et Province</p>
        <div style={{overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${BG},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left,${BG},transparent)`,zIndex:2,pointerEvents:'none'}}/>
          <div style={{display:'flex',gap:56,animation:'ticker 28s linear infinite',width:'max-content',alignItems:'center'}}>
            {[...PARIS_AGENCIES,...PARIS_AGENCIES,...PARIS_AGENCIES].map((n,i)=>(
              <span key={i} style={{fontSize:13,color:SUBTLE,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',whiteSpace:'nowrap'}}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ROI CALCULATOR
function ROICalc() {
  const [leads,setLeads]=useState(40)
  const [closeRate,setCloseRate]=useState(15)
  const [avgComm,setAvgComm]=useState(8000)
  const [hoursAdmin,setHoursAdmin]=useState(2)
  const missedLeadPct=0.35
  const missedDeals=Math.round(leads*missedLeadPct*(closeRate/100))
  const extraRevenue=missedDeals*avgComm
  const hoursSaved=hoursAdmin*22
  const hourValue=80
  const timeSaved=hoursSaved*hourValue
  const total=extraRevenue+timeSaved

  return (
    <section id="roi" style={{background:`linear-gradient(135deg,${BG2} 0%,${BG3} 100%)`,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:52}}>
          <Pill color={ORG}>Calculateur ROI</Pill>
          <h2 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontWeight:400,fontSize:'clamp(24px,3vw,40px)',color:INK,marginTop:14,marginBottom:10,letterSpacing:'-0.025em'}}>
            Combien Vanivert peut vous rapporter ?
          </h2>
          <p style={{fontSize:15,color:MUTED,maxWidth:480,margin:'0 auto'}}>Les agences perdent en moyenne 35% de leurs leads faute de reponse rapide. Voici votre gain potentiel.</p>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}} className="alt-grid">
          <FadeUp>
            <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:20,padding:'32px 28px',boxShadow:'0 4px 24px rgba(12,14,26,0.06)'}}>
              <div style={{fontSize:13,fontWeight:700,color:INK,marginBottom:24}}>Votre situation actuelle</div>
              {[
                {label:'Leads entrants par mois',val:leads,setVal:setLeads,min:10,max:200,step:5,suffix:'leads'},
                {label:'Taux de signature (%)',val:closeRate,setVal:setCloseRate,min:5,max:40,step:1,suffix:'%'},
                {label:'Commission moyenne (EUR)',val:avgComm,setVal:setAvgComm,min:2000,max:20000,step:500,suffix:'EUR'},
                {label:'Heures admin par jour',val:hoursAdmin,setVal:setHoursAdmin,min:0.5,max:6,step:0.5,suffix:'h'},
              ].map(({label,val,setVal,min,max,step,suffix})=>(
                <div key={label} style={{marginBottom:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontSize:12,color:MUTED}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:INK}}>{val}{suffix}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e=>setVal(Number(e.target.value))}
                    style={{width:'100%',accentColor:BLUE,height:4,cursor:'pointer'}}/>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{background:INK,borderRadius:20,padding:'32px 28px',color:'#fff',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:340}}>
              <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.6)',marginBottom:24}}>Votre gain avec Vanivert</div>
              <div>
                {[
                  {label:`+${missedDeals} deals recuperes/mois`,value:`+${extraRevenue.toLocaleString('fr-FR')} EUR`,color:`${ORG}`,sub:'leads non repondus transformes'},
                  {label:`${hoursSaved}h admin economisees/mois`,value:`+${timeSaved.toLocaleString('fr-FR')} EUR`,color:'#86EFAC',sub:'temps valorise a 80EUR/h'},
                ].map(r=>(
                  <div key={r.label} style={{marginBottom:20,padding:'16px 18px',borderRadius:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:4}}>{r.sub}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.85)',marginBottom:6}}>{r.label}</div>
                    <div style={{fontSize:22,fontWeight:700,color:r.color,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'}}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:20,marginTop:8}}>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:4}}>Gain annuel estime</div>
                <div style={{fontSize:36,fontWeight:700,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',color:'#fff'}}>{(total*12).toLocaleString('fr-FR')} EUR</div>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{display:'block',marginTop:20,padding:'12px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'background 0.25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BLUE2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=BLUE}}>
                  Voir ma demo - gratuit →
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// INTERACTIVE FEATURES
const FEATURES = [
  {
    id:'leads', icon:'📥', color:BLUE, tag:'Lead Capture',
    headline:'Chaque appel manque vous coute une commission.',
    stat:'35% de leads perdus faute de reponse en moins de 5 minutes.',
    impact:'Recuperez 35% de leads en plus. Sans effort.',
    body:'SeLoger, LeBonCoin, BienIci, Google My Business, WhatsApp entrant - tout arrive dans une seule interface en moins de 10 secondes. Sophie repond par voix en 0 seconde, 24h/24. Qualification automatique, score de priorite, zero double saisie.',
    metrics:['+35% leads traites','60s lead WhatsApp','Deduplication auto'],
  },
  {
    id:'visits', icon:'📅', color:TEAL, tag:'Planification visites',
    headline:'25 minutes de trajet pour une propriete vide.',
    stat:'23% des visites se terminent par un no-show ou une annulation de derniere minute.',
    impact:'Zero no-show non gere. Chaque visite confirmee.',
    body:'Coordination tripartite automatique : acheteur, vendeur, agent. Confirmation WhatsApp pour les trois parties simultanement. Rappel la veille, rappel 2 heures avant avec lien Maps. Si le vendeur annule, le systeme propose un creneau de remplacement sans intervention humaine.',
    metrics:['3 confirmations simultanées','Rappel J-1 et H-2','Lien Maps integre'],
  },
  {
    id:'client', icon:'🎂', color:ORG, tag:'Client a vie',
    headline:'8 ans de clients que vous n\'avez plus jamais contactes.',
    stat:'Un client fidele coute 5x moins a conserver qu\'a acquerir. Combien avez-vous contactes ce mois ?',
    impact:'Votre CRM se souvient de tout, tout le temps.',
    body:'Anniversaires, anniversaire d\'achat, estimations trimestrielles gratuites, voeux de Noel et 14 Juillet. Chaque message personnalise, envoye automatiquement depuis le nom de l\'agent. Quand un client G-class doit vendre ou renover, Vanivert le detecte et cree une opportunite de mandat.',
    metrics:['Anniversaires auto','Estimations trimestrielles','Re-engagement 3 ans'],
  },
  {
    id:'reviews', icon:'⭐', color:ORG, tag:'Reputation Google',
    headline:'1 etoile de plus sur Google = 18% de leads en plus.',
    stat:'80% des agences ne collectent pas d\'avis systematiquement. Les 20% qui le font recueillent 3x plus de contacts.',
    impact:'Chaque transaction devient un avis cinq etoiles.',
    body:'Deal marque Gagne, 24 heures plus tard, acheteur et vendeur recoivent chacun un WhatsApp personnalise. Les avis Google arrivent dans le tableau de bord avec une reponse IA prete a valider en un clic. Si 5 etoiles : draft Instagram genere automatiquement pour validation directeur.',
    metrics:['Demande auto 24h apres','Reponse IA en 1 clic','Draft Instagram inclus'],
  },
  {
    id:'compliance', icon:'🔒', color:'#7C3AED', tag:'Conformite LCB-FT',
    headline:'Une inspection DGCCRF peut vous couter votre carte professionnelle.',
    stat:'Depuis le decret d\'avril 2026, la tracabilite LCB-FT est une obligation renforcee. Les inspections se multiplient.',
    impact:'Audit trail complet. En un clic.',
    body:'Chaque dossier depasse 100K ou structure inhabituellement : flag automatique pour due diligence renforcee. L\'agent est guide etape par etape. Le directeur voit un tableau de conformite par dossier : Verifie, En cours, Action requise. Export PDF pour inspection DGCCRF en 30 secondes.',
    metrics:['Tracabilite LCB-FT','Export PDF inspection','Zero non-conformite'],
  },
  {
    id:'valuation', icon:'📊', color:TEAL, tag:'Estimation bien',
    headline:'Le vendeur a verifie les prix DVF avant votre visite.',
    stat:'70% des vendeurs arrivent informes sur les prix du marche. Votre agent arrive avec quoi ?',
    impact:'Arrivez avec les chiffres. Gagnez le mandat.',
    body:'DVF recupere les 5 dernieres transactions comparables. Georisques identifie tous les risques reglementaires obligatoires. Le Cadastre confirme la surface officielle. Tout ca agrege automatiquement en un rapport envoye sur WhatsApp a l\'agent 30 minutes avant sa visite. Sources gouvernementales gratuites, donnees officielles.',
    metrics:['DVF data.gouv.fr','Georisques API officielle','Cadastre surface exacte'],
  },
]

function FeaturesSection() {
  const [active,setActive]=useState(0)
  const f=FEATURES[active]
  return (
    <section id="features" style={{background:BG,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{textAlign:'center',marginBottom:48}}>
          <Pill color={BLUE}>Fonctionnalites</Pill>
          <h2 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontWeight:400,fontSize:'clamp(24px,3vw,40px)',color:INK,marginTop:14,marginBottom:10,letterSpacing:'-0.025em'}}>
            Ce que vos agents font manuellement.<br/><span style={{fontStyle:'italic',color:MUTED}}>Ce que Vanivert fait automatiquement.</span>
          </h2>
        </FadeUp>
        {/* Tab bar */}
        <div style={{display:'flex',gap:8,marginBottom:32,overflowX:'auto' as const,paddingBottom:4,scrollbarWidth:'none' as const}}>
          {FEATURES.map((feat,i)=>(
            <button key={feat.id} onClick={()=>setActive(i)} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:980,background:active===i?feat.color:CARD,color:active===i?'#fff':MUTED,fontWeight:active===i?700:450,fontSize:12,border:`1.5px solid ${active===i?feat.color:BDR2}`,cursor:'pointer',transition:'all 0.25s',whiteSpace:'nowrap' as const,fontFamily:'system-ui,sans-serif',flexShrink:0}}>
              <span>{feat.icon}</span>{feat.tag}
            </button>
          ))}
        </div>
        {/* Active feature */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.3}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}} className="alt-grid">
              <div style={{padding:'36px 32px',borderRadius:20,background:`${f.color}08`,border:`1.5px solid ${f.color}20`}}>
                <div style={{fontSize:11,fontWeight:700,color:f.color,textTransform:'uppercase' as const,letterSpacing:'0.1em',marginBottom:16}}>{f.tag}</div>
                <div style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontSize:'clamp(17px,2vw,24px)',color:INK,lineHeight:1.35,marginBottom:12,fontWeight:400}}>{f.headline}</div>
                <div style={{padding:'12px 16px',borderRadius:12,background:`${f.color}10`,border:`1px solid ${f.color}20`,marginBottom:16}}>
                  <div style={{fontSize:12,color:f.color,lineHeight:1.6,fontStyle:'italic'}}>{f.stat}</div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:INK,marginBottom:10}}>{f.impact}</div>
                <div style={{fontSize:13,color:MUTED,lineHeight:1.72,marginBottom:20}}>{f.body}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                  {f.metrics.map(m=>(
                    <span key={m} style={{fontSize:11,fontWeight:600,color:f.color,background:`${f.color}12`,padding:'4px 10px',borderRadius:980,border:`1px solid ${f.color}20`}}>{m}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{fontSize:36,padding:'24px',borderRadius:16,background:BG2,border:`1px solid ${BDR}`,textAlign:'center' as const}}>{f.icon}</div>
                {[
                  {before:'Agent verifie 3 boites mail et copie-colle les contacts',after:'Lead cree en 10 secondes depuis n\'importe quelle source',ok:active===0},
                  {before:'Agent appelle pour confirmer la visite avec chaque partie',after:'3 confirmations WhatsApp simultanées, rappels inclus',ok:active===1},
                  {before:'Le client ne rappelle plus apres la vente',after:'Message anniversaire personnalise depuis le nom de l\'agent',ok:active===2},
                  {before:'Moins de 3% des clients laissent un avis sans relance',after:'34% de taux de reponse avec WhatsApp personnalise 24h apres',ok:active===3},
                  {before:'Tracabilite LCB-FT dans un tableur Excel',after:'Audit trail automatique, export PDF en 30 secondes',ok:active===4},
                  {before:'Agent estime de memoire pendant la visite vendeur',after:'Rapport DVF-Georisques recu sur WhatsApp avant la visite',ok:active===5},
                ].filter(r=>r.ok).map((r,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div style={{padding:'14px 16px',borderRadius:12,background:'#FEF2F2',border:'1px solid rgba(239,68,68,0.2)'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#EF4444',marginBottom:4,textTransform:'uppercase' as const}}>Avant</div>
                      <div style={{fontSize:12,color:'#7F1D1D',lineHeight:1.5}}>{r.before}</div>
                    </div>
                    <div style={{padding:'14px 16px',borderRadius:12,background:`${f.color}08`,border:`1px solid ${f.color}20`}}>
                      <div style={{fontSize:10,fontWeight:700,color:f.color,marginBottom:4,textTransform:'uppercase' as const}}>Avec Vanivert</div>
                      <div style={{fontSize:12,color:INK,lineHeight:1.5,fontWeight:500}}>{r.after}</div>
                    </div>
                  </div>
                ))}
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{padding:'13px',borderRadius:980,background:f.color,color:'#fff',fontWeight:700,fontSize:13,textDecoration:'none',textAlign:'center' as const,transition:'opacity 0.2s',display:'block'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='0.88'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}>
                  Voir cette fonctionnalite en demo →
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// SOCIAL PROOF - key stats
function SocialProof() {
  const stats=[
    {n:'+34%',label:'de leads traites dans les 5 premieres minutes',color:BLUE},
    {n:'-60%',label:'de temps consacre a la saisie manuelle',color:TEAL},
    {n:'4.8/5',label:'note Google moyenne apres 3 mois de deploiement',color:ORG},
    {n:'<60s',label:'de l\'appel entrant au WhatsApp agent',color:BLUE},
  ]
  return (
    <section style={{background:INK,padding:'64px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <p style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase' as const}}>Resultats constates sur nos agences pilotes</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}} className="stats-grid">
          {stats.map((s,i)=>(
            <FadeUp key={s.label} delay={i*0.07}>
              <div style={{textAlign:'center',padding:'24px 16px',borderRadius:16,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div style={{fontSize:36,fontWeight:700,fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',color:s.color,marginBottom:8}}>{s.n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// BLOG
function BlogPreview() {
  const [articles,setArticles]=useState(DEFAULT_ARTICLES.filter(a=>a.published).slice(0,3))
  useEffect(()=>{try{const s=localStorage.getItem('vanivert_blog_v1');if(s)setArticles(JSON.parse(s).filter((a:{published:boolean})=>a.published).slice(0,3))}catch{}},[])
  if(!articles.length) return null
  const [first,...rest]=articles
  return (
    <section id="blog" style={{background:BG2,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36,flexWrap:'wrap' as const,gap:12}}>
          <div><Pill color={BLUE}>Blog</Pill>
            <h2 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',fontWeight:400,fontSize:'clamp(20px,2.6vw,32px)',color:INK,marginTop:12,letterSpacing:'-0.02em'}}>Ce que les meilleures agences font deja.</h2>
          </div>
          <a href="/blog" style={{fontSize:13,color:BLUE,fontWeight:600,textDecoration:'none'}}>Tous les articles →</a>
        </FadeUp>
        <FadeUp>
          <a href={`/blog/${first.slug}`} style={{textDecoration:'none',display:'grid',gridTemplateColumns:'1fr 1fr',borderRadius:20,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,marginBottom:14,transition:'box-shadow 0.25s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(37,99,235,0.10)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}} className="blog-feat">
            <div style={{height:280,overflow:'hidden'}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={first.image} alt={first.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.75)'}} loading="eager"/>
            </div>
            <div style={{padding:'32px 28px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <div>
                <Pill color={first.categoryColor}>{first.category}</Pill>
                <h3 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',fontSize:19,color:INK,lineHeight:1.35,margin:'14px 0 12px'}}>{first.title}</h3>
                <p style={{fontSize:13,color:MUTED,lineHeight:1.65}}>{first.excerpt}</p>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
                <span style={{fontSize:11,color:SUBTLE}}>{first.readTime} - {first.date}</span>
                <span style={{fontSize:13,color:BLUE,fontWeight:600}}>Lire →</span>
              </div>
            </div>
          </a>
        </FadeUp>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="pricing-grid">
          {rest.map((p,i)=>(
            <FadeUp key={p.slug} delay={i*0.08}>
              <a href={`/blog/${p.slug}`} style={{textDecoration:'none',display:'block',borderRadius:16,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,transition:'box-shadow 0.25s,transform 0.25s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(37,99,235,0.08)';(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none';(e.currentTarget as HTMLElement).style.transform='none'}}>
                <div style={{height:160,overflow:'hidden'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="lazy"/>
                </div>
                <div style={{padding:'18px 20px'}}>
                  <Pill color={p.categoryColor}>{p.category}</Pill>
                  <h3 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',fontSize:15,color:INK,lineHeight:1.35,margin:'10px 0 8px'}}>{p.title}</h3>
                  <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:12}}>{p.excerpt}</p>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:11,color:SUBTLE}}>{p.readTime} - {p.date}</span>
                    <span style={{fontSize:12,color:BLUE,fontWeight:600}}>Lire →</span>
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


// TEAM STORY - narrative only
function TeamStory() {
  return (
    <section id="team" style={{background:BG,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <FadeUp>
          <div style={{marginBottom:40}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
              <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${BLUE},${ORG})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:BLUE,letterSpacing:'0.14em',textTransform:'uppercase' as const}}>Notre histoire</span>
            </div>
            <h2 style={{fontWeight:700,fontSize:'clamp(30px,3.8vw,48px)',color:INK,letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24}}>
              On a travaille pour des entreprises<br/>qui brassent des milliards.<br/>
              <span style={{color:MUTED}}>Puis on a vu l&apos;immobilier francais.</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{fontSize:16,color:MUTED,lineHeight:1.85}}>
            <p style={{marginBottom:20}}>Logistique maritime internationale. Tech. Operations dans 15 pays. Des systemes ou une erreur de 30 secondes coute des millions. C&apos;est la ou on a appris a construire des choses qui tournent sans supervision.</p>
            <p style={{marginBottom:20}}>Quand on a pose un pied dans l&apos;immobilier francais, le contraste etait brutal. Des agences avec 5 agents et 3 boites mail. Des leads qui arrivent a 21h et que personne ne rappelle. Des clients qui disparaissent apres la vente. Des visites confirmees par telephone, une par une.</p>
            <p style={{marginBottom:20}}>Ce n&apos;est pas un probleme de talent. Les agents sont bons. C&apos;est un probleme d&apos;infrastructure. Les outils n&apos;ont pas suivi.</p>
            <p style={{marginBottom:20,color:INK,fontWeight:600,fontSize:18}}>Alors on a construit l&apos;infrastructure.</p>
            <p>Vanivert automatise tout ce qui peut l&apos;etre pour que l&apos;agent fasse ce qu&apos;il fait le mieux : vendre, negocier, convaincre. Le systeme fait le reste. 24h/24. Sans supervision.</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div style={{display:'flex',gap:32,marginTop:40,paddingTop:32,borderTop:`1px solid ${BDR}`,flexWrap:'wrap' as const}}>
            {[['15+','pays d\'operations'],['3','co-fondateurs'],['10+','agences pilotes'],['SIRET','93429900900019']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:22,fontWeight:700,color:INK,marginBottom:2}}>{v}</div>
                <div style={{fontSize:12,color:SUBTLE}}>{l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// INVESTORS
function Investors() {
  return (
    <section id="investors" style={{background:INK,padding:'96px 32px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 20% 50%,${BLUE}25 0%,transparent 50%),radial-gradient(circle at 80% 50%,${ORG}15 0%,transparent 50%)`,pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <span style={{width:32,height:3,borderRadius:2,background:`linear-gradient(90deg,${ORG},${BLUE})`}}/>
            <span style={{fontSize:12,fontWeight:800,color:ORG,letterSpacing:'0.14em',textTransform:'uppercase' as const}}>Investisseurs</span>
          </div>
          <h2 style={{fontWeight:700,fontSize:'clamp(30px,4vw,50px)',color:'#fff',letterSpacing:'-0.035em',lineHeight:1.1,marginBottom:24}}>
            Building the operating system<br/>for French real estate.
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.75,maxWidth:620,marginBottom:40}}>
            8 500 agences independantes paient entre 70 et 150 EUR par mois a des CRM qui ne font ni l&apos;automatisation WhatsApp, ni la centralisation des leads portails, ni la collecte d&apos;avis Google, ni la relation client post-vente. C&apos;est un marche de plus de 10 millions d&apos;euros par an rien qu&apos;en France. Nous construisons l&apos;alternative.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:48}} className="stats-grid">
            {[
              {n:'8 500+',l:'agences independantes en France',color:BLUE},
              {n:'EUR 10M+',l:'marche CRM immobilier francais annuel',color:ORG},
              {n:'10+',l:'agences pilotes actives',color:'#22C55E'},
              {n:'0',l:'concurrent fait WhatsApp + leads + avis + CRM',color:'#A78BFA'},
            ].map(s=>(
              <div key={s.l} style={{padding:'20px 18px',borderRadius:14,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize:24,fontWeight:700,color:s.color,marginBottom:6}}>{s.n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.5}}>{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div style={{display:'flex',gap:24,flexWrap:'wrap' as const,alignItems:'center',paddingTop:32,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{flex:1,minWidth:240}}>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:4}}>Enregistre en France</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>SIRET 93429900900019 - Cergy, France</div>
            </div>
            <a href="mailto:investors@vanivert.eu" style={{padding:'14px 32px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${BLUE}40`,display:'inline-flex',alignItems:'center',gap:8}}>
              investors@vanivert.eu
              <span style={{fontSize:16}}>→</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// CONTACT
function Contact() {
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [agency,setAgency]=useState(''), [agents,setAgents]=useState(''), [message,setMessage]=useState(''), [sent,setSent]=useState(false), [loading,setLoading]=useState(false)
  async function submit(e:React.FormEvent) {
    e.preventDefault(); if(!email||!name) return; setLoading(true)
    if(SB_URL&&SB_KEY){
      await fetch(`${SB_URL}/rest/v1/demo_requests`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name,email,agency_name:agency,agent_count:agents,message,created_at:new Date().toISOString()})}).catch(()=>{})
    }
    await new Promise(r=>setTimeout(r,400)); setSent(true); setLoading(false)
  }
  const inp:React.CSSProperties={width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BDR2}`,fontSize:14,outline:'none',color:INK,fontFamily:'system-ui,sans-serif',background:BG,boxSizing:'border-box' as const}
  return (
    <section id="contact" style={{background:BG,padding:'88px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:960,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}} className="alt-grid">
        <FadeUp>
          <Pill color={BLUE}>Contact</Pill>
          <h2 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',fontWeight:400,fontSize:'clamp(26px,3.2vw,40px)',color:INK,marginTop:14,marginBottom:12,letterSpacing:'-0.03em'}}>Parlez-nous de votre agence.</h2>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.75,marginBottom:28}}>Demande de demo, question technique, partenariat - nous repondons personnellement sous 24h ouvrees.</p>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {[['📧','team@vanivert.eu','mailto:team@vanivert.eu'],['📍',PARIS_ADDRESS,'https://maps.google.com/?q=Cergy,France'],['🏛',`SIRET ${SIRET}`,'#'],['🔗','linkedin.com/company/vanivert','https://linkedin.com/company/vanivert']].map(([icon,label,href])=>(
              <a key={label} href={href} target={href.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
                <span style={{fontSize:16}}>{icon}</span>
                <span style={{fontSize:13,color:MUTED}}>{label}</span>
              </a>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          {sent ? (
            <div style={{padding:28,borderRadius:18,background:BLUE_LT,border:`1px solid ${BLUE}20`,textAlign:'center' as const}}>
              <div style={{fontSize:36,marginBottom:12}}>✅</div>
              <div style={{fontSize:16,fontWeight:600,color:INK,marginBottom:8}}>Message recu !</div>
              <div style={{fontSize:13,color:MUTED}}>Pawan vous repond sous 24h ouvrees.</div>
            </div>
          ) : (
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Votre prenom" style={inp}/>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email professionnel" style={inp}/>
              </div>
              <input value={agency} onChange={e=>setAgency(e.target.value)} placeholder="Nom de votre agence" style={inp}/>
              <select value={agents} onChange={e=>setAgents(e.target.value)} style={{...inp,appearance:'none' as const}}>
                <option value="">Nombre d&apos;agents</option>
                <option value="1">1 agent</option>
                <option value="2-5">2 a 5 agents</option>
                <option value="6-15">6 a 15 agents</option>
                <option value="15+">Plus de 15 agents</option>
              </select>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Votre message (optionnel)" rows={3} style={{...inp,resize:'vertical' as const}}/>
              <p style={{fontSize:11,color:SUBTLE,lineHeight:1.55}}>En soumettant ce formulaire, vous acceptez que vos donnees soient utilisees pour vous recontacter. Conforme RGPD. Voir notre <a href="/legal/confidentialite" style={{color:BLUE}}>politique de confidentialite</a>.</p>
              <button type="submit" disabled={loading} style={{padding:'14px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',transition:'background 0.25s',boxShadow:`0 4px 14px ${BLUE}28`}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BLUE2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=BLUE}}>
                {loading?'...':'Demander une demo gratuite →'}
              </button>
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  )
}

// FOOTER CTA
function FooterCTA() {
  return (
    <section style={{background:`linear-gradient(135deg,${BG2} 0%,${BG3} 100%)`,padding:'0 32px 72px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <FadeUp>
          <div style={{background:INK,borderRadius:28,padding:'88px 40px',textAlign:'center' as const,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:`radial-gradient(circle at 30% 50%,${BLUE}30 0%,transparent 55%),radial-gradient(circle at 70% 50%,${ORG}20 0%,transparent 55%)`,pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:2}}>
              <Pill color={ORG}>Disponible maintenant - France entiere</Pill>
              <h2 style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontWeight:400,fontSize:'clamp(28px,3.8vw,48px)',color:'#fff',margin:'20px auto 16px',letterSpacing:'-0.025em',lineHeight:1.15,maxWidth:620}}>
                L&apos;agence qui ne dort jamais.
              </h2>
              <p style={{fontSize:16,color:'rgba(255,255,255,0.55)',maxWidth:440,margin:'0 auto 40px'}}>
                Rejoignez les agences qui ont automatise leur croissance avec Vanivert.
              </p>
              <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap' as const}}>
                <a href="https://realestate-eu-demo.vercel.app/login" target="_blank" rel="noopener noreferrer"
                  style={{padding:'14px 32px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:700,fontSize:14,textDecoration:'none',transition:'background 0.25s',boxShadow:`0 8px 24px ${BLUE}40`}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BLUE2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=BLUE}}>
                  Boostez votre CA →
                </a>
                <a href="#contact" style={{padding:'14px 32px',borderRadius:980,border:'1.5px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',fontWeight:500,fontSize:14,textDecoration:'none',transition:'all 0.25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.5)';(e.currentTarget as HTMLElement).style.color='#fff'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.2)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}}>
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}


// LOCATION / MAP
function LocationMap() {
  return (
    <section style={{background:BG2,padding:'56px 32px',borderTop:`1px solid ${BDR}`}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:32,alignItems:'center'}} className="alt-grid">
        <FadeUp>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${BLUE},${ORG})`}}/>
            <span style={{fontSize:11,fontWeight:800,color:BLUE,letterSpacing:'0.14em',textTransform:'uppercase' as const}}>Ou nous trouver</span>
          </div>
          <h3 style={{fontWeight:700,fontSize:'clamp(20px,2.4vw,28px)',color:INK,letterSpacing:'-0.02em',marginBottom:14,lineHeight:1.25}}>
            Base en France.<br/>Deployes partout.
          </h3>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,marginBottom:16}}>
            Vanivert est enregistre a Cergy, en region parisienne, et deploie ses agences pilotes dans toute la France.
          </p>
          <div style={{fontSize:14,color:INK,fontWeight:600,marginBottom:4}}>1 Clos des Sylthes</div>
          <div style={{fontSize:14,color:MUTED,marginBottom:12}}>95800 Cergy, France</div>
          <a href="https://maps.google.com/?q=1+Clos+des+Sylthes,95800+Cergy,France" target="_blank" rel="noopener noreferrer"
            style={{fontSize:13,color:BLUE,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}}>
            Ouvrir dans Google Maps <span>→</span>
          </a>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{borderRadius:20,overflow:'hidden',border:`1px solid ${BDR}`,height:280,boxShadow:'0 4px 24px rgba(12,14,26,0.06)'}}>
            <iframe
              title="Vanivert location - Cergy, France"
              width="100%"
              height="100%"
              style={{border:0}}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=1+Clos+des+Sylthes,95800+Cergy,France&output=embed">
            </iframe>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// FOOTER
function Footer() {
  const cols=[
    {h:'Produit',links:[['Fonctionnalites','#features'],['ROI','#roi'],['Demo','https://realestate-eu-demo.vercel.app/login'],['Connexion','/login']]},
    {h:'Ressources',links:[['Equipe','#team'],['Contact','#contact'],['Investisseurs','mailto:investors@vanivert.eu']]},
    {h:'Legal',links:[['Mentions legales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Confidentialite','/legal/confidentialite'],['Admin','/admin']]},
  ]
  return (
    <footer style={{background:'#0C0E1A',borderTop:`1px solid rgba(255,255,255,0.06)`,padding:'56px 32px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr repeat(3,1fr)',gap:32,marginBottom:48}} className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Logo s={26}/><span style={{fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif',fontStyle:'italic',fontSize:16,color:'#fff'}}>vanivert</span></div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',lineHeight:1.65,maxWidth:220,marginBottom:16}}>L&apos;IA immobiliere qui ne dort jamais. Enregistre en France, deploye partout.</p>
            <a href="https://www.linkedin.com/company/vanivert" target="_blank" rel="noopener noreferrer"
              style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff',textDecoration:'none'}}>in</a>
          </div>
          {cols.map(col=>(
            <div key={col.h}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:14,textTransform:'uppercase' as const,letterSpacing:'0.07em'}}>{col.h}</div>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {col.links.map(([l,h])=>(
                  <a key={l} href={h} target={h.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
                    style={{fontSize:13,color:'rgba(255,255,255,0.45)',textDecoration:'none',transition:'color 0.2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:10}}>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.25)'}}>2026 Vanivert - SIRET {SIRET}</span>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.25)'}}>{PARIS_ADDRESS}</span>
          <a href={`mailto:${EMAIL}`} style={{fontSize:12,color:'rgba(255,255,255,0.25)',textDecoration:'none'}}>{EMAIL}</a>
        </div>
      </div>
    </footer>
  )
}

// GDPR
function GDPR() {
  const [visible,setVisible]=useState(false)
  useEffect(()=>{try{if(!localStorage.getItem('vanivert_gdpr_v4'))setVisible(true)}catch{}},[])
  const accept=()=>{try{localStorage.setItem('vanivert_gdpr_v4','accepted')}catch{}setVisible(false)}
  const decline=()=>{try{localStorage.setItem('vanivert_gdpr_v4','declined')}catch{}setVisible(false)}
  if(!visible) return null
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:2.5}}
      style={{position:'fixed',bottom:20,left:20,right:20,zIndex:9990,maxWidth:480,margin:'0 auto',background:CARD,border:`1px solid ${BDR2}`,borderRadius:18,padding:'20px 22px',boxShadow:'0 8px 40px rgba(0,0,0,0.10)',display:'flex',flexDirection:'column',gap:10}}>
      <p style={{fontSize:13,fontWeight:600,color:INK,margin:0}}>Ce site utilise des cookies</p>
      <p style={{fontSize:12,color:MUTED,lineHeight:1.55,margin:0}}>Cookies fonctionnels uniquement. Hebergement 100% UE. Aucune donnee transmise a des tiers. <a href="/legal/confidentialite" style={{color:BLUE}}>privacy@vanivert.eu</a></p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={accept} style={{flex:1,padding:'9px 16px',borderRadius:980,background:BLUE,color:'#fff',fontWeight:600,fontSize:12,border:'none',cursor:'pointer'}}>Accepter</button>
        <button onClick={decline} style={{flex:1,padding:'9px 16px',borderRadius:980,background:'transparent',color:MUTED,fontWeight:500,fontSize:12,border:`1px solid ${BDR2}`,cursor:'pointer'}}>Refuser</button>
      </div>
    </motion.div>
  )
}

// ROOT
export default function Home() {
  return (
    <>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${INK};font-family:system-ui,-apple-system,sans-serif;overflow-x:hidden}
        input,textarea,select,button{font-family:system-ui,-apple-system,sans-serif}
        
        input::placeholder,textarea::placeholder{color:rgba(12,14,26,0.3)}
        input[type=range]{cursor:pointer}
        .nav-links{display:flex}.mob-nav{display:none}
        @media(max-width:860px){.nav-links{display:none!important}.mob-nav{display:flex!important}}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.hero-sphere{display:none}.alt-grid{grid-template-columns:1fr!important}}
        @media(max-width:768px){.pricing-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}.blog-feat{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:1fr!important}}
        
        ::-webkit-scrollbar{display:none}
      `}</style>
      {/* cursor dot removed for professional look */}
      <ScrollBar/>
      <Nav/>
      <main>
        <Hero/>
        <Ticker/>
        <ROICalc/>
        <FeaturesSection/>
        <SocialProof/>
        <TeamStory/>
        <Investors/>
        <Contact/>
        <FooterCTA/>
      </main>
      <LocationMap/>
      <Footer/>
      <GDPR/>
    </>
  )
}
