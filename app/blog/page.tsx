import Link from 'next/link'
import { ARTICLES } from '@/lib/articles'

export const metadata = {
  title: 'Blog Vanivert — E-facturation, IA vocale et gestion financière pour les PME',
  description: 'Guides pratiques sur la conformité e-facturation 2026, la réception vocale IA et la gestion financière pour les PME françaises.',
}

const C = { bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73', lt:'#E8E8ED', b:'#1F49B0' }

export default function Blog() {
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, fontFamily:'Inter, sans-serif' }}>
      <nav style={{ padding:'18px 40px', display:'flex', alignItems:'center',
        justifyContent:'space-between', background:C.w, borderBottom:`1px solid ${C.lt}`,
        position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ fontWeight:800, fontSize:18, color:C.ink, textDecoration:'none',
          letterSpacing:'-0.04em', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.b }}/>vanivert
        </a>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <a href="/" style={{ fontSize:13, color:C.g, textDecoration:'none' }}>Accueil</a>
          <a href="/calculateur" style={{ background:C.b, color:'#fff', fontSize:13,
            fontWeight:700, borderRadius:980, padding:'8px 20px', textDecoration:'none' }}>
            Calculer mon risque
          </a>
        </div>
      </nav>

      <div style={{ background:C.w, borderBottom:`1px solid ${C.lt}`, padding:'56px 40px 44px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontFamily:'monospace', fontSize:11, letterSpacing:'0.14em',
            textTransform:'uppercase', color:C.g, marginBottom:14 }}>Ressources</div>
          <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:48, letterSpacing:'-0.04em',
            color:C.ink, marginBottom:12, marginTop:0, lineHeight:1.05 }}>Le blog Vanivert</h1>
          <p style={{ fontSize:18, color:C.g, maxWidth:560, lineHeight:1.6, margin:0 }}>
            Guides pratiques sur la conformité e-facturation, l'IA vocale et la gestion financière
            pour les PME françaises.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'52px 40px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:26 }}>
          {ARTICLES.map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}`}
              style={{ textDecoration:'none', display:'block', background:C.w,
                borderRadius:20, overflow:'hidden', border:`1px solid ${C.lt}`,
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)', transition:'transform 0.25s, box-shadow 0.25s' }}>
              <div style={{ position:'relative', height:200, overflow:'hidden', background:'#E5E7EB' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.imageAlt}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy"/>
                <div style={{ position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 65%)' }}/>
                <div style={{ position:'absolute', top:14, left:14,
                  background:C.w, borderRadius:8, padding:'4px 12px',
                  fontSize:11, fontWeight:700, color:a.categoryColor }}>
                  {a.category}
                </div>
                <div style={{ position:'absolute', bottom:14, left:14 }}>
                  <div style={{ fontSize:26, fontWeight:900, color:'#fff',
                    letterSpacing:'-0.03em', lineHeight:1 }}>{a.stat}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:2 }}>{a.statLabel}</div>
                </div>
              </div>
              <div style={{ padding:'20px 22px 18px' }}>
                <div style={{ display:'flex', gap:10, marginBottom:10,
                  fontSize:11, color:C.g, fontFamily:'monospace' }}>
                  <span>{a.date}</span><span>·</span><span>{a.readTime} de lecture</span>
                </div>
                <h2 style={{ fontFamily:'Inter', fontWeight:800, fontSize:16,
                  letterSpacing:'-0.02em', color:C.ink, lineHeight:1.35,
                  marginBottom:8, marginTop:0 }}>{a.title}</h2>
                <p style={{ fontSize:13, color:C.g, lineHeight:1.6, margin:'0 0 14px' }}>{a.excerpt}</p>
                <div style={{ fontSize:13, fontWeight:600, color:a.categoryColor }}>Lire l'article →</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop:60, padding:'36px 40px', background:C.w, borderRadius:22,
          border:`1px solid ${C.lt}`, textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ fontFamily:'monospace', fontSize:10, textTransform:'uppercase',
            letterSpacing:'0.14em', color:C.g, marginBottom:12 }}>Gratuit · 2 minutes</div>
          <h2 style={{ fontFamily:'Inter', fontWeight:900, fontSize:26,
            letterSpacing:'-0.03em', color:C.ink, marginBottom:10, marginTop:0 }}>
            Vérifiez votre conformité e-facturation maintenant
          </h2>
          <p style={{ color:C.g, marginBottom:22, fontSize:15, lineHeight:1.6 }}>
            Entrez votre SIRET et obtenez votre score de risque personnalisé en 2 minutes.
          </p>
          <a href="/calculateur" style={{ background:C.b, color:'#fff', fontWeight:700, fontSize:15,
            borderRadius:980, padding:'13px 32px', textDecoration:'none', display:'inline-block' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
