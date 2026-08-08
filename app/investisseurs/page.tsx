'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG    = 'linear-gradient(160deg,#0F3843 0%,#0A2030 40%,#020617 100%)'
const BG_S  = 'linear-gradient(160deg,#0B2D38 0%,#071520 100%)'
const BG_D  = 'linear-gradient(160deg,#061D28 0%,#020D16 100%)'
const CARD  = 'rgba(30,41,59,0.55)'
const LIME  = '#84CC16'
const LIME2 = '#6BAE0F'
const LIME_GL = 'rgba(132,204,22,0.22)'
const TEAL  = '#2DD4BF'
const WHITE = '#FFFFFF'
const OFF   = '#F1F5F9'
const MUTED = '#94A3B8'
const SUBTLE= '#64748B'
const PURPLE= '#A78BFA'
const BDR   = 'rgba(100,200,200,0.12)'
const BDR2  = 'rgba(100,200,200,0.22)'
const FH    = "'Plus Jakarta Sans',system-ui,sans-serif"
const FB    = "'Inter',system-ui,sans-serif"
const EZ: [number,number,number,number] = [0.32,0.72,0,1]

function FadeUp({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}) {
  const ref=useRef<HTMLDivElement>(null)
  const inV=useInView(ref,{once:true,margin:'-40px'})
  return (
    <motion.div ref={ref} initial={{opacity:0,y:22}} animate={inV?{opacity:1,y:0}:{}}
      transition={{duration:0.7,ease:EZ,delay}} style={style}>
      {children}
    </motion.div>
  )
}

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

// ── MARKET DATA ───────────────────────────────────────────────────────────────
const TAM_DATA = [
  {label:'TAM France',   value:'104 M€/an', sub:'30 000 agences × ARPU 239 €/mois',      color:LIME},
  {label:'SAM',          value:'62 M€/an',  sub:'18 000 agences indépendantes ciblées',   color:TEAL},
  {label:'SOM (5 ans)',  value:'14,3 M€ ARR',sub:'5 000 agences — 17 % du SAM',          color:'#22C55E'},
]

const ARPU_DATA = [
  {label:'Forfait SaaS',       value:'199 €/mois',  note:"Jusqu'à 10 agents inclus, tout inclus"},
  {label:'Sophie Voice AI',    value:'0,20 €/min',  note:'~40 €/mois usage moyen (5 agents)'},
  {label:'ARPU cible',         value:'239 €/mois',  note:'SaaS + voix par agence, conservateur'},
  {label:'ROI agence pilote',  value:'95 000 €/an', note:'Documenté Century 21 — 6 agents'},
]

const ROADMAP = [
  {phase:'Phase 1', timeline:'18 mois', n:'500 agences',   arr:'1,1 M€ ARR',  color:LIME,  pct:'2,8 % du SAM'},
  {phase:'Phase 2', timeline:'3 ans',   n:'2 000 agences', arr:'5,7 M€ ARR',  color:TEAL,  pct:'11 % du SAM'},
  {phase:'Phase 3', timeline:'5 ans',   n:'5 000 agences', arr:'14,3 M€ ARR', color:'#22C55E',pct:'28 % du SAM'},
]

const MOAT = [
  '0 concurrent offrant CRM + WhatsApp + IA vocale + avis Google + conformité LCB-FT dans un seul produit',
  'Seule solution conforme EU AI Act Article 50 dans l\'immobilier résidentiel français',
  'Données hébergées 100 % en Union Européenne (Supabase Dublin) — avantage RGPD décisif',
  'Prix 2 à 5 fois inférieur aux solutions partielles (Apimo, Hektor, Yanport, Immofacile)',
  'Un seul moteur IA (Mistral-class, auto-hébergé) : améliorer Sophie améliore aussi le bot WhatsApp',
]

const TRACTION = [
  {n:'330',   l:'appels IA vocaux déployés en production',         c:LIME},
  {n:'14',    l:'leads qualifiés identifiés post-campagne',         c:TEAL},
  {n:'1',     l:'pilote actif Century 21 — contrat en cours',      c:'#22C55E'},
  {n:'95 k€', l:'ROI documenté an 1 par agence pilote (6 agents)', c:PURPLE},
]

const MARKET_CONTEXT = [
  {stat:'30 000', label:'agences immobilières en France en 2025', source:'FNAIM / INSEE 2025'},
  {stat:'12,2 Md€', label:'CA total du secteur immobilier France', source:'Prigent Immobilier 2025'},
  {stat:'4,73 Md$', label:'marché mondial CRM immobilier en 2025', source:'Business Research Insights'},
  {stat:'+12,2 %', label:'CAGR du CRM immobilier mondial 2025–2035', source:'Business Research Insights'},
]

export default function InvestisseursPage() {
  const [email] = useState('investors@vanivert.eu')
  const [copied, setCopied] = useState(false)

  return (
    <div style={{minHeight:'100dvh',background:'#020617',color:OFF,fontFamily:FB}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020617;overflow-x:hidden}
        ::-webkit-scrollbar{display:none}
        @media(max-width:768px){.grid-3{grid-template-columns:1fr!important}.grid-4{grid-template-columns:1fr 1fr!important}.grid-2{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 40px',background:'rgba(2,6,23,0.95)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${BDR}`}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
          <Logo s={28}/>
          <span style={{fontFamily:FH,fontWeight:700,fontSize:16,color:WHITE,letterSpacing:'-0.02em'}}>Vanivert</span>
          <span style={{fontSize:11,color:SUBTLE,fontFamily:FB,marginLeft:4}}>/ Investisseurs</span>
        </a>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none',fontFamily:FB}}>← Retour au site</a>
          <a href={`mailto:${email}`} style={{padding:'9px 20px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:13,textDecoration:'none',fontFamily:FH}}>
            Contacter l&apos;équipe
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:BG,padding:'96px 40px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'10%',width:'60vw',height:'60vw',maxWidth:700,borderRadius:'50%',background:`radial-gradient(circle,rgba(132,204,22,0.06) 0%,transparent 65%)`,pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-5%',right:'5%',width:'40vw',height:'40vw',maxWidth:500,borderRadius:'50%',background:`radial-gradient(circle,rgba(45,212,191,0.05) 0%,transparent 65%)`,pointerEvents:'none'}}/>
        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px 5px 10px',borderRadius:980,background:'rgba(45,212,191,0.10)',border:`1px solid ${BDR2}`,marginBottom:24}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#22C55E',boxShadow:'0 0 8px #22C55E'}}/>
              <span style={{fontSize:11,fontWeight:600,color:TEAL,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB}}>Dossier investisseur — confidentiel</span>
            </div>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:EZ,delay:0.1}}
            style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(38px,5vw,64px)',color:WHITE,lineHeight:1.05,marginBottom:20,letterSpacing:'-0.035em'}}>
            Nous bâtissons le socle<br/><span style={{color:LIME}}>de l&apos;immobilier français.</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}}
            style={{fontSize:18,color:MUTED,lineHeight:1.75,maxWidth:640,marginBottom:40,fontFamily:FB}}>
            30 000 agences immobilières en France paient entre 70 et 150 € par mois pour des CRM qui ne font ni la voix IA, ni le WhatsApp automatisé, ni les avis Google, ni la conformité réglementaire. Vanivert est la première plateforme à tout réunir en un seul moteur.
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}} style={{display:'flex',gap:14,flexWrap:'wrap' as const}}>
            <a href={`mailto:${email}`} style={{padding:'14px 28px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:`0 8px 24px ${LIME_GL}`,fontFamily:FH}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
              Contacter l&apos;équipe fondatrice →
            </a>
            <button onClick={()=>{try{navigator.clipboard.writeText(email)}catch{};setCopied(true);setTimeout(()=>setCopied(false),2000)}}
              style={{padding:'14px 22px',borderRadius:980,border:`1.5px solid ${BDR2}`,background:'transparent',color:MUTED,fontWeight:500,fontSize:14,cursor:'pointer',fontFamily:FB,transition:'all 0.2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=LIME;(e.currentTarget as HTMLElement).style.color=LIME}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BDR2;(e.currentTarget as HTMLElement).style.color=MUTED}}>
              {copied?'Copié ✓':email}
            </button>
          </motion.div>
        </div>
      </section>

      {/* TRACTION — 4 live numbers above the fold */}
      <section style={{background:BG_D,borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:'52px 40px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,color:SUBTLE,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:24,textAlign:'center' as const}}>Traction — août 2026</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}} className="grid-4">
            {TRACTION.map((t,i)=>(
              <FadeUp key={t.l} delay={i*0.07}>
                <div style={{textAlign:'center' as const,padding:'22px 16px',borderRadius:16,background:CARD,border:`1px solid ${t.c}20`}}>
                  <div style={{fontSize:36,fontWeight:800,fontFamily:FH,color:t.c,letterSpacing:'-0.03em',marginBottom:8}}>{t.n}</div>
                  <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FB}}>{t.l}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET CONTEXT */}
      <section style={{background:BG_S,padding:'80px 40px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <FadeUp>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Contexte de marché</span>
            </div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,38px)',color:WHITE,marginBottom:10,letterSpacing:'-0.03em',marginTop:14}}>
              Un marché de 104 M€ en France.<br/><span style={{color:LIME}}>Non adressé. Non consolidé.</span>
            </h2>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.75,maxWidth:640,marginBottom:40,fontFamily:FB}}>
              Le marché mondial du CRM immobilier atteint 4,73 milliards de dollars en 2025, avec un CAGR de 12,2 % prévu jusqu'en 2035. En France, aucun acteur ne couvre la chaîne complète. Les solutions existantes — Apimo, Hektor, Yanport — couvrent au mieux 20 % des besoins de Vanivert.
            </p>
          </FadeUp>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:10}} className="grid-4">
            {MARKET_CONTEXT.map((m,i)=>(
              <FadeUp key={m.stat} delay={i*0.07}>
                <div style={{padding:'20px 18px',borderRadius:14,background:CARD,border:`1px solid ${BDR}`}}>
                  <div style={{fontSize:22,fontWeight:800,color:WHITE,fontFamily:FH,letterSpacing:'-0.02em',marginBottom:6}}>{m.stat}</div>
                  <div style={{fontSize:12,color:MUTED,lineHeight:1.5,fontFamily:FB,marginBottom:6}}>{m.label}</div>
                  <div style={{fontSize:10,color:SUBTLE,fontFamily:FB}}>{m.source}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* TAM / SAM / SOM */}
      <section style={{background:BG_D,padding:'80px 40px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <FadeUp>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:TEAL,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Taille du marché adressable</span>
            </div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,38px)',color:WHITE,marginBottom:10,letterSpacing:'-0.03em',marginTop:14}}>TAM / SAM / SOM</h2>
            <p style={{fontSize:13,color:SUBTLE,marginBottom:32,fontFamily:FB}}>Calcul bottom-up · Sources : INSEE, FNAIM 2025 · ARPU = 199 € SaaS + 40 € voix IA moy. (0,20 €/min × 5 agents × 10 appels × 4 min)</p>
          </FadeUp>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:40}} className="grid-3">
            {TAM_DATA.map((t,i)=>(
              <FadeUp key={t.label} delay={i*0.1}>
                <div style={{padding:'28px 24px',borderRadius:18,background:CARD,border:`1px solid ${t.color}35`,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:t.color,borderRadius:'18px 18px 0 0'}}/>
                  <div style={{fontSize:11,fontWeight:700,color:t.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,marginBottom:10,fontFamily:FB}}>{t.label}</div>
                  <div style={{fontSize:32,fontWeight:800,color:WHITE,fontFamily:FH,letterSpacing:'-0.03em',marginBottom:8}}>{t.value}</div>
                  <div style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>{t.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* ARPU breakdown table */}
          <FadeUp delay={0.15}>
            <div style={{fontSize:11,fontWeight:700,color:SUBTLE,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:14}}>Modèle de revenus par agence (ARPU)</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}} className="grid-4">
              {ARPU_DATA.map(a=>(
                <div key={a.label} style={{padding:'18px 16px',borderRadius:14,background:'rgba(30,41,59,0.40)',border:`1px solid ${BDR}`}}>
                  <div style={{fontSize:10,color:SUBTLE,fontFamily:FB,marginBottom:6}}>{a.label}</div>
                  <div style={{fontSize:20,fontWeight:800,color:LIME,fontFamily:FH,marginBottom:4}}>{a.value}</div>
                  <div style={{fontSize:10,color:SUBTLE,fontFamily:FB}}>{a.note}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ARR ROADMAP */}
      <section style={{background:BG_S,padding:'80px 40px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <FadeUp>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Trajectoire ARR</span>
            </div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,38px)',color:WHITE,marginBottom:10,letterSpacing:'-0.03em',marginTop:14}}>
              De 1,1 M€ à 14,3 M€ ARR en 5 ans.
            </h2>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.75,maxWidth:580,marginBottom:36,fontFamily:FB}}>Chaque phase est rentabilisable avant la suivante. Setup one-shot + abonnement mensuel = structure de revenus à forte visibilité.</p>
          </FadeUp>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}} className="grid-3">
            {ROADMAP.map((r,i)=>(
              <FadeUp key={r.phase} delay={i*0.1}>
                <div style={{padding:'28px 24px',borderRadius:18,background:CARD,border:`1px solid ${r.color}25`,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:r.color}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:700,color:r.color,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB}}>{r.phase}</span>
                    <span style={{fontSize:10,color:SUBTLE,fontFamily:FB}}>{r.timeline}</span>
                  </div>
                  <div style={{fontSize:14,color:MUTED,fontFamily:FB,marginBottom:12}}>{r.n}</div>
                  <div style={{fontSize:30,fontWeight:800,color:WHITE,fontFamily:FH,letterSpacing:'-0.03em',marginBottom:6}}>{r.arr}</div>
                  <div style={{fontSize:11,color:SUBTLE,fontFamily:FB}}>{r.pct}</div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Visual ARR bar */}
          <FadeUp delay={0.2}>
            <div style={{padding:'24px',borderRadius:16,background:'rgba(30,41,59,0.40)',border:`1px solid ${BDR}`}}>
              <div style={{fontSize:11,color:SUBTLE,fontFamily:FB,marginBottom:16}}>ARR progression</div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[
                  {label:'Phase 1 · 500 agences', arr:1.1, max:14.3, color:LIME},
                  {label:'Phase 2 · 2 000 agences', arr:5.7, max:14.3, color:TEAL},
                  {label:'Phase 3 · 5 000 agences', arr:14.3, max:14.3, color:'#22C55E'},
                ].map(b=>(
                  <div key={b.label} style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{fontSize:12,color:MUTED,fontFamily:FB,width:200,flexShrink:0}}>{b.label}</div>
                    <div style={{flex:1,height:8,borderRadius:4,background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
                      <motion.div initial={{width:0}} whileInView={{width:`${(b.arr/b.max)*100}%`}} viewport={{once:true}} transition={{duration:1.2,ease:EZ,delay:0.2}}
                        style={{height:'100%',borderRadius:4,background:b.color}}/>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:b.color,fontFamily:FH,width:90,textAlign:'right' as const}}>{b.arr} M€</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* COMPETITIVE MOAT */}
      <section style={{background:BG_D,padding:'80px 40px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <FadeUp>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${LIME},${TEAL})`}}/>
              <span style={{fontSize:12,fontWeight:800,color:LIME,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Avantage concurrentiel</span>
            </div>
            <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(24px,3vw,38px)',color:WHITE,marginBottom:10,letterSpacing:'-0.03em',marginTop:14}}>
              Zéro concurrent n&apos;offre<br/><span style={{color:LIME}}>ce que Vanivert offre.</span>
            </h2>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.75,maxWidth:580,marginBottom:36,fontFamily:FB}}>Les solutions partielles (Apimo, Hektor, Yanport) coûtent 2 à 5 fois plus cher pour 20 % des fonctionnalités. Vanivert est la seule plateforme full-stack pour l'agence immobilière française.</p>
          </FadeUp>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {MOAT.map((item,i)=>(
              <FadeUp key={i} delay={i*0.06}>
                <div style={{display:'flex',gap:16,alignItems:'flex-start',padding:'18px 22px',borderRadius:14,background:CARD,border:`1px solid ${BDR}`}}>
                  <span style={{width:28,height:28,borderRadius:'50%',background:'rgba(132,204,22,0.12)',color:LIME,fontSize:13,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:FH}}>{i+1}</span>
                  <span style={{fontSize:14,color:OFF,lineHeight:1.6,fontFamily:FB}}>{item}</span>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Competitor comparison mini-table */}
          <FadeUp delay={0.2}>
            <div style={{marginTop:40,padding:'24px',borderRadius:16,background:'rgba(30,41,59,0.40)',border:`1px solid ${BDR}`}}>
              <div style={{fontSize:11,fontWeight:700,color:SUBTLE,letterSpacing:'0.10em',textTransform:'uppercase' as const,fontFamily:FB,marginBottom:18}}>Comparatif solutions existantes</div>
              <div style={{overflowX:'auto' as const}}>
                <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12,fontFamily:FB}}>
                  <thead>
                    <tr>
                      {['Solution','CRM','WhatsApp IA','Voix IA','Avis Google','Conformité','Prix/mois'].map(h=>(
                        <th key={h} style={{textAlign:'left' as const,padding:'8px 12px',color:SUBTLE,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase' as const,borderBottom:`1px solid ${BDR}`,fontFamily:FB}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Vanivert',     '✓','✓','✓','✓','✓','199 €',true],
                      ['Apimo',        '✓','✗','✗','✗','✗','~120 €',false],
                      ['Hektor',       '✓','✗','✗','✗','✗','~100 €',false],
                      ['Yanport',      '✓','✗','✗','✗','Partiel','~150 €',false],
                      ['Immofacile',   '✓','✗','✗','✗','✗','~90 €',false],
                    ].map(([name,...cells])=>(
                      <tr key={name as string} style={{borderBottom:`1px solid ${BDR}`}}>
                        <td style={{padding:'12px 12px',fontWeight: name==='Vanivert'?700:400,color:name==='Vanivert'?LIME:OFF,fontFamily:name==='Vanivert'?FH:FB}}>{name}</td>
                        {cells.slice(0,-2).map((c,i)=>(
                          <td key={i} style={{padding:'12px 12px',color:c==='✓'?'#22C55E':c==='✗'?'rgba(248,113,113,0.7)':MUTED,fontWeight:600}}>{c as string}</td>
                        ))}
                        <td style={{padding:'12px 12px',color:name==='Vanivert'?LIME:MUTED,fontWeight:name==='Vanivert'?700:400}}>{cells[cells.length-2] as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* TEAM + CONTACT */}
      <section style={{background:BG_S,padding:'80px 40px',borderTop:`1px solid ${BDR}`}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}} className="grid-2">
            <FadeUp>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <span style={{width:28,height:3,borderRadius:2,background:`linear-gradient(90deg,${TEAL},${LIME})`}}/>
                <span style={{fontSize:12,fontWeight:800,color:TEAL,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:FB}}>Équipe</span>
              </div>
              <h2 style={{fontFamily:FH,fontWeight:700,fontSize:'clamp(22px,2.5vw,32px)',color:WHITE,marginBottom:16,letterSpacing:'-0.025em'}}>Opérateurs, pas théoriciens.</h2>
              <div style={{fontSize:14,color:MUTED,lineHeight:1.8,fontFamily:FB}}>
                <p style={{marginBottom:12}}>Logistique maritime internationale, 15 pays, systèmes critiques sans supervision. C'est là qu'on a appris à construire ce qui tourne sans jamais s'arrêter.</p>
                <p>Vanivert est bâti par des gens qui ont géré des opérations où une erreur de 30 secondes coûte des millions. On applique la même rigueur à l'automatisation immobilière.</p>
              </div>
              <div style={{display:'flex',gap:24,marginTop:24,paddingTop:20,borderTop:`1px solid ${BDR}`}}>
                {[['15+','pays d\'opérations'],['3','co-fondateurs'],['SIRET','93429900900019']].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontSize:18,fontWeight:700,color:WHITE,fontFamily:FH}}>{v}</div>
                    <div style={{fontSize:11,color:SUBTLE,fontFamily:FB}}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div style={{padding:'32px',borderRadius:20,background:'rgba(132,204,22,0.06)',border:`1px solid rgba(132,204,22,0.20)`,height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:LIME,fontFamily:FH,marginBottom:8}}>Prendre contact</div>
                  <p style={{fontSize:13,color:MUTED,lineHeight:1.7,fontFamily:FB,marginBottom:24}}>
                    15 minutes avec Pawan, co-fondateur. Vos questions directement adressées, vos données importées sur la démo si vous souhaitez voir votre agence dans le produit.
                  </p>
                  <div style={{fontSize:11,color:SUBTLE,fontFamily:FB,marginBottom:6}}>Email investisseurs</div>
                  <div style={{fontSize:16,fontWeight:700,color:WHITE,fontFamily:FH,marginBottom:20}}>{email}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <a href={`mailto:${email}`} style={{padding:'13px 20px',borderRadius:980,background:LIME,color:'#000',fontWeight:700,fontSize:14,textDecoration:'none',textAlign:'center' as const,fontFamily:FH,transition:'background 0.2s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=LIME2}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=LIME}}>
                    Envoyer un message →
                  </a>
                  <a href="/" style={{padding:'13px 20px',borderRadius:980,border:`1.5px solid ${BDR2}`,color:MUTED,fontWeight:500,fontSize:13,textDecoration:'none',textAlign:'center' as const,fontFamily:FB}}>
                    Voir le produit en ligne
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'rgba(2,6,23,0.99)',borderTop:`1px solid ${BDR}`,padding:'24px 40px',display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10,alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Logo s={20}/>
          <span style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>© 2026 Vanivert · SIRET 93429900900019 · 1 Clos des Sylthes, 95800 Cergy</span>
        </div>
        <div style={{display:'flex',gap:20}}>
          {[['Produit','/'],[' Mentions légales','/legal/mentions-legales'],['Contact','mailto:team@vanivert.eu']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:12,color:SUBTLE,textDecoration:'none',fontFamily:FB}}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
