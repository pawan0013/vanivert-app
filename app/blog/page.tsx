'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_ARTICLES, type Article } from '@/lib/articles'

const BG='#FAFAF8',BG2='#F3F2EE',CARD='#FFFFFF',INK='#0D0D0F'
const VI='#5B6B3A',GOLD='#C8A96E',MUTED='rgba(13,13,15,0.50)',SUBTLE='rgba(13,13,15,0.30)',BDR='rgba(13,13,15,0.07)',BDR2='rgba(13,13,15,0.13)'
const EZ:[number,number,number,number]=[0.32,0.72,0,1]

function Logo({s=26}:{s?:number}) {
  const cx=s/2,cy=s/2,R=s*0.36,nr=s*0.07,cr=s*0.14
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return(<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><circle cx={cx} cy={cy} r={R} stroke={VI} strokeWidth={s*0.022} fill="none" strokeOpacity="0.35"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} stroke={VI} strokeWidth={s*0.028} fill={BG} strokeOpacity="0.8"/>)}<circle cx={cx} cy={cy} r={cr} fill={VI}/></svg>)
}

const CATS=['Tous','IA & Immobilier','Productivité','Réputation','Outils & Data']

export default function BlogIndex() {
  const [articles, setArticles] = useState<Article[]>([])
  const [cat, setCat] = useState('Tous')

  useEffect(()=>{
    try {
      const s=localStorage.getItem('vanivert_blog_v1')
      setArticles(s ? JSON.parse(s).filter((a:Article)=>a.published) : DEFAULT_ARTICLES.filter(a=>a.published))
    } catch { setArticles(DEFAULT_ARTICLES.filter(a=>a.published)) }
  },[])

  const filtered = cat==='Tous' ? articles : articles.filter(a=>a.category===cat)

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${BG};color:${INK};font-family:Georgia,serif}`}</style>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(250,250,248,0.96)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderBottom:`1px solid ${BDR2}`,height:64,display:'flex',alignItems:'center',padding:'0 32px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}><Logo s={26}/><span style={{fontFamily:'Georgia,serif',fontSize:16,color:INK,fontStyle:'italic'}}>vanivert</span></a>
          <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none'}}>← Retour au site</a>
        </div>
      </nav>
      <main style={{maxWidth:1100,margin:'0 auto',padding:'64px 32px 80px'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:EZ}} style={{textAlign:'center',marginBottom:52}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 13px',borderRadius:980,background:`${VI}10`,border:`1px solid ${VI}25`,fontSize:10,fontWeight:600,color:VI,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:VI}}/>Blog
          </div>
          <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(28px,4vw,48px)',color:INK,letterSpacing:'-0.03em',marginBottom:12}}>Ce que les meilleures<br/><span style={{fontStyle:'italic',color:MUTED}}>agences font déjà.</span></h1>
          <p style={{fontSize:15,color:MUTED,maxWidth:440,margin:'0 auto'}}>Stratégies, outils, et données pour les agences immobilières qui veulent garder une longueur d&apos;avance.</p>
        </motion.div>
        {/* Category filter */}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:40,flexWrap:'wrap'}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:'7px 16px',borderRadius:980,background:cat===c?INK:CARD,color:cat===c?'#fff':MUTED,fontWeight:cat===c?600:450,fontSize:12,border:`1px solid ${cat===c?INK:BDR2}`,cursor:'pointer',transition:'all 0.2s',fontFamily:'system-ui,sans-serif'}}>{c}</button>
          ))}
        </div>
        {filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:MUTED}}>Aucun article dans cette catégorie pour l&apos;instant.</div>
        ) : (
          <>
            {/* Featured */}
            <motion.a href={`/blog/${filtered[0].slug}`} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:EZ}}
              style={{textDecoration:'none',display:'grid',gridTemplateColumns:'1fr 1fr',borderRadius:20,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,marginBottom:20,transition:'border-color 0.25s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor=BDR2)} onMouseLeave={e=>(e.currentTarget.style.borderColor=BDR)} className="blog-feat">
              <div style={{height:320,overflow:'hidden'}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={filtered[0].image} alt={filtered[0].imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="eager"/>
              </div>
              <div style={{padding:'36px 32px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                <div>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'3px 11px',borderRadius:980,background:`${filtered[0].categoryColor}12`,border:`1px solid ${filtered[0].categoryColor}25`,fontSize:10,fontWeight:600,color:filtered[0].categoryColor,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:14}}>{filtered[0].category}</span>
                  <h2 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:22,color:INK,lineHeight:1.35,marginBottom:14}}>{filtered[0].title}</h2>
                  <p style={{fontSize:13,color:MUTED,lineHeight:1.7}}>{filtered[0].excerpt}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                  <span style={{fontSize:11,color:SUBTLE}}>{filtered[0].readTime} de lecture · {filtered[0].date}</span>
                  <span style={{fontSize:13,color:VI,fontWeight:600}}>Lire →</span>
                </div>
              </div>
            </motion.a>
            {/* Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}} className="blog-grid">
              {filtered.slice(1).map((a,i)=>(
                <motion.a key={a.slug} href={`/blog/${a.slug}`} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.07,ease:EZ}}
                  style={{textDecoration:'none',borderRadius:16,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,display:'block',transition:'transform 0.25s,border-color 0.25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.borderColor=BDR2}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.borderColor=BDR}}>
                  <div style={{height:180,overflow:'hidden'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.image} alt={a.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="lazy"/>
                  </div>
                  <div style={{padding:'18px 20px'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:980,background:`${a.categoryColor}12`,border:`1px solid ${a.categoryColor}25`,fontSize:9,fontWeight:600,color:a.categoryColor,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>{a.category}</span>
                    <h3 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:15,color:INK,lineHeight:1.35,marginBottom:9}}>{a.title}</h3>
                    <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:12}}>{a.excerpt}</p>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:11,color:SUBTLE}}>{a.readTime} · {a.date}</span>
                      <span style={{fontSize:12,color:VI,fontWeight:600}}>Lire →</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </>
        )}
      </main>
      <footer style={{borderTop:`1px solid ${BDR}`,padding:'28px 32px',textAlign:'center',background:BG2}}>
        <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none'}}>← Retour sur vanivert.fr</a>
      </footer>
      <style>{`
        @media(max-width:768px){.blog-feat{grid-template-columns:1fr!important}.blog-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.blog-grid{grid-template-columns:1fr!important}}
      `}</style>
    </>
  )
}
