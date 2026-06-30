'use client'
import Link from 'next/link'

const POSTS = [
  {
    slug: 'e-facturation-2026-guide-bretagne',
    title: 'E-facturation 2026 : ce qui change pour vos factures',
    excerpt: "Calendrier, obligations, amendes. Ce que vous devez faire avant le 1er septembre pour ne pas vous retrouver hors la loi.",
    date: '27 juin 2026', readTime: '8 min', cat: 'Conformite DGFiP',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'appels-manques-artisans-bretagne',
    title: "Chaque appel manque, c'est un client chez le voisin",
    excerpt: "Un plombier a Lannion perd en moyenne 18 000 EUR par an a cause des appels sans reponse. On a fait le calcul, secteur par secteur.",
    date: '27 juin 2026', readTime: '5 min', cat: 'Reception vocale IA',
    img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'annuaire-centralise-dgfip-piege',
    title: "Signer avec une PA, ce n'est pas suffisant. Voila pourquoi.",
    excerpt: "L'annuaire centralise DGFiP, c'est la deuxieme etape obligatoire. Celle que 90% des PME oublient. Et qui prend 2 a 4 semaines.",
    date: '27 juin 2026', readTime: '6 min', cat: 'Conformite DGFiP',
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80',
  },
]

const CAT_COLORS: Record<string, string> = {
  'Conformite DGFiP': '#6366F1',
  'Reception vocale IA': '#10B981',
}

export default function BlogIndex() {
  return (
    <div style={{ minHeight: '100dvh', background: '#FAFAF8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(13,13,15,0.08)', position: 'sticky', top: 0, background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>v</span>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(13,13,15,0.88)' }}>vanivert</span>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/calculateur" style={{ fontSize: 13, color: 'rgba(13,13,15,0.50)', textDecoration: 'none', padding: '7px 14px', borderRadius: 980, border: '1px solid rgba(13,13,15,0.12)' }}>
            Calculer mon risque
          </Link>
          <Link href="/demo" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 980, background: '#6366F1' }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '72px 32px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 10, color: 'rgba(13,13,15,0.32)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'system-ui' }}>Blog</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 48px)', color: 'rgba(13,13,15,0.88)', marginBottom: 12, marginTop: 0, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Lire avant de s'y prendre trop tard.
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(13,13,15,0.50)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          E-facturation DGFiP, reception vocale IA, gestion financiere. Des articles courts, concrets, ecrits pour les PME et artisans bretons.
        </p>
      </div>

      {/* Articles */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 32px 80px' }}>
        {/* Featured article (first one, larger) */}
        <Link href={`/blog/${POSTS[0].slug}`} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 18, overflow: 'hidden', background: '#FFFFFF', border: '1px solid rgba(13,13,15,0.08)', marginBottom: 16, transition: 'border-color 0.3s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,13,15,0.18)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,13,15,0.08)')}>
          <div style={{ height: 280, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTS[0].img} alt={POSTS[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} loading="eager" />
          </div>
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-block', background: `${CAT_COLORS[POSTS[0].cat] || '#6366F1'}18`, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 600, color: CAT_COLORS[POSTS[0].cat] || '#6366F1', marginBottom: 14, letterSpacing: '0.04em' }}>{POSTS[0].cat}</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 22, color: 'rgba(13,13,15,0.88)', lineHeight: 1.35, marginBottom: 12, marginTop: 0, letterSpacing: '-0.01em' }}>{POSTS[0].title}</h2>
              <p style={{ fontSize: 14, color: 'rgba(13,13,15,0.50)', lineHeight: 1.65, margin: 0 }}>{POSTS[0].excerpt}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 }}>
              <span style={{ fontSize: 11, color: 'rgba(13,13,15,0.32)', fontFamily: 'system-ui' }}>{POSTS[0].date}</span>
              <span style={{ fontSize: 11, color: 'rgba(13,13,15,0.25)' }}>·</span>
              <span style={{ fontSize: 11, color: 'rgba(13,13,15,0.32)', fontFamily: 'system-ui' }}>{POSTS[0].readTime} de lecture</span>
              <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6366F1', fontFamily: 'system-ui' }}>Lire →</span>
            </div>
          </div>
        </Link>

        {/* Remaining 2 articles in a row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {POSTS.slice(1).map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', border: '1px solid rgba(13,13,15,0.08)', transition: 'border-color 0.3s, transform 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,13,15,0.18)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,13,15,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{ height: 160, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} loading="lazy" />
              </div>
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'inline-block', background: `${CAT_COLORS[post.cat] || '#6366F1'}18`, borderRadius: 6, padding: '3px 10px', fontSize: 9, fontWeight: 600, color: CAT_COLORS[post.cat] || '#6366F1', marginBottom: 10, letterSpacing: '0.04em' }}>{post.cat}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 17, color: 'rgba(13,13,15,0.88)', lineHeight: 1.35, marginBottom: 10, marginTop: 0, letterSpacing: '-0.01em' }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(13,13,15,0.45)', lineHeight: 1.6, margin: '0 0 14px', fontFamily: 'system-ui' }}>{post.excerpt}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'rgba(13,13,15,0.30)', fontFamily: 'system-ui' }}>{post.date}</span>
                  <span style={{ fontSize: 10, color: 'rgba(13,13,15,0.25)' }}>·</span>
                  <span style={{ fontSize: 10, color: 'rgba(13,13,15,0.30)', fontFamily: 'system-ui' }}>{post.readTime}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6366F1' }}>Lire →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ borderTop: '1px solid rgba(13,13,15,0.08)', padding: '24px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(13,13,15,0.30)', fontFamily: 'system-ui', marginBottom: 12 }}>Calculez votre risque de non-conformite DGFiP en 2 minutes</p>
        <Link href="/calculateur" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 980, background: '#6366F1', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          Calculer mon risque →
        </Link>
      </div>
    </div>
  )
}
