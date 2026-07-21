import { notFound } from 'next/navigation'
import { DEFAULT_ARTICLES } from '@/lib/articles'

export async function generateStaticParams() {
  return DEFAULT_ARTICLES.map(a=>({ slug: a.slug }))
}

const BG='#FAFAF8',BG2='#F3F2EE',CARD='#FFFFFF',INK='#0D0D0F'
const VI='#5B6B3A',MUTED='rgba(13,13,15,0.50)',SUBTLE='rgba(13,13,15,0.30)',BDR='rgba(13,13,15,0.07)',BDR2='rgba(13,13,15,0.13)'

function Logo({s=24}:{s?:number}) {
  const cx=s/2,cy=s/2,R=s*0.36,nr=s*0.07,cr=s*0.14
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return(<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><circle cx={cx} cy={cy} r={R} stroke={VI} strokeWidth={s*0.022} fill="none" strokeOpacity="0.35"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} stroke={VI} strokeWidth={s*0.028} fill={BG} strokeOpacity="0.8"/>)}<circle cx={cx} cy={cy} r={cr} fill={VI}/></svg>)
}

function renderBody(body: string) {
  return body.split('\n\n').map((para,i)=>{
    if (para.startsWith('**')&&para.endsWith('**')) return <h3 key={i} style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:400,color:INK,margin:'28px 0 10px',letterSpacing:'-0.02em'}}>{para.slice(2,-2)}</h3>
    const html = para.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    return <p key={i} style={{fontSize:16,color:MUTED,lineHeight:1.78,marginBottom:20}} dangerouslySetInnerHTML={{__html:html}}/>
  })
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = DEFAULT_ARTICLES.find(a=>a.slug===params.slug)
  if (!article) notFound()
  const related = DEFAULT_ARTICLES.filter(a=>a.slug!==article.slug).slice(0,2)
  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${BG};color:${INK};font-family:Georgia,serif}`}</style>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(250,250,248,0.96)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderBottom:`1px solid ${BDR2}`,height:64,display:'flex',alignItems:'center',padding:'0 32px'}}>
        <div style={{maxWidth:820,margin:'0 auto',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}><Logo s={24}/><span style={{fontFamily:'Georgia,serif',fontSize:15,color:INK,fontStyle:'italic'}}>vanivert</span></a>
          <a href="/blog" style={{fontSize:13,color:MUTED,textDecoration:'none'}}>← Tous les articles</a>
        </div>
      </nav>
      <main style={{maxWidth:820,margin:'0 auto',padding:'60px 32px 80px'}}>
        <div style={{marginBottom:20}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 11px',borderRadius:980,background:`${article.categoryColor}12`,border:`1px solid ${article.categoryColor}25`,fontSize:10,fontWeight:600,color:article.categoryColor,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>{article.category}</span>
        </div>
        <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:'clamp(24px,3.5vw,40px)',color:INK,lineHeight:1.18,marginBottom:16,letterSpacing:'-0.025em'}}>{article.title}</h1>
        <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:32,paddingBottom:24,borderBottom:`1px solid ${BDR}`}}>
          <span style={{fontSize:13,color:MUTED}}>Par <strong style={{color:INK}}>Pawan Kumar</strong>, co-fondateur Vanivert</span>
          <span style={{color:SUBTLE}}>·</span>
          <span style={{fontSize:12,color:SUBTLE}}>{article.date}</span>
          <span style={{color:SUBTLE}}>·</span>
          <span style={{fontSize:12,color:SUBTLE}}>{article.readTime} de lecture</span>
        </div>
        <div style={{borderRadius:18,overflow:'hidden',marginBottom:36,height:340}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image} alt={article.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.8)'}} loading="eager"/>
        </div>
        <p style={{fontSize:17,color:INK,lineHeight:1.72,marginBottom:28,fontStyle:'italic',borderLeft:`3px solid ${VI}`,paddingLeft:20}}>{article.excerpt}</p>
        {article.body ? renderBody(article.body) : <p style={{fontSize:16,color:MUTED,lineHeight:1.75}}>Contenu complet de l&apos;article disponible prochainement.</p>}
        <div style={{marginTop:48,padding:'24px 28px',borderRadius:18,background:`${VI}08`,border:`1px solid ${VI}18`}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:18,color:INK,marginBottom:8}}>Envie d&apos;automatiser votre agence ?</div>
          <p style={{fontSize:14,color:MUTED,marginBottom:16}}>Vanivert déploie l&apos;intégralité du cycle décrit dans cet article pour votre agence. Démo gratuite, résultats visibles en 2 semaines.</p>
          <a href="/demo" style={{padding:'11px 24px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:13,textDecoration:'none',display:'inline-block',transition:'background 0.25s'}}
            onMouseEnter={undefined} onMouseLeave={undefined}>Réserver une démo gratuite →</a>
        </div>
        {related.length>0&&(
          <div style={{marginTop:48}}>
            <div style={{fontSize:14,fontWeight:600,color:INK,marginBottom:16}}>À lire aussi</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="rel-grid">
              {related.map(r=>(
                <a key={r.slug} href={`/blog/${r.slug}`} style={{textDecoration:'none',borderRadius:14,overflow:'hidden',background:CARD,border:`1px solid ${BDR}`,display:'block'}}>
                  <div style={{height:130,overflow:'hidden'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt={r.imageAlt} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.72)'}} loading="lazy"/>
                  </div>
                  <div style={{padding:'14px 16px'}}>
                    <h3 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:14,color:INK,lineHeight:1.35,marginBottom:6}}>{r.title}</h3>
                    <span style={{fontSize:12,color:VI,fontWeight:600}}>Lire →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer style={{borderTop:`1px solid ${BDR}`,padding:'28px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:12,background:BG2}}>
        <span style={{fontSize:12,color:SUBTLE}}>© 2026 Vanivert · SIRET 93429900900019 · Lannion, Bretagne</span>
        <div style={{display:'flex',gap:20}}>
          <a href="/legal/mentions-legales" style={{fontSize:12,color:SUBTLE,textDecoration:'none'}}>Mentions légales</a>
          <a href="/legal/confidentialite" style={{fontSize:12,color:SUBTLE,textDecoration:'none'}}>Confidentialité</a>
        </div>
      </footer>
      <style>{`@media(max-width:600px){.rel-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  )
}
