import Link from 'next/link'

export const metadata = {
  title: 'Blog Vanivert — E-facturation, IA vocale et gestion financière pour les PME',
  description: 'Guides pratiques sur la conformité e-facturation 2026, la réception vocale IA et la gestion financière pour les PME françaises. Conseils d\'experts pour les entreprises de Bretagne.',
}

export const ARTICLES = [
  {
    slug: 'e-facturation-2026-guide-bretagne',
    title: 'E-facturation 2026 : le guide complet pour les entreprises de Bretagne',
    excerpt: 'Tout ce que les PME et TPE des Côtes d\'Armor doivent savoir avant le 1er septembre 2026. Calendrier, obligations, sanctions et solutions concrètes.',
    category: 'Conformité',
    categoryColor: '#1F49B0',
    categoryBg: '#EEF5FF',
    date: '27 juin 2026',
    readTime: '8 min',
    // Unsplash: document/invoice/business theme
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Factures et documents comptables sur un bureau professionnel',
    stat: '15 000 €',
    statLabel: 'amende maximale',
  },
  {
    slug: 'appels-manques-artisans-bretagne',
    title: 'Artisans : combien perdez-vous par an à cause des appels manqués ?',
    excerpt: 'Un plombier à Lannion qui rate 3 appels par jour perd en moyenne 18 000 euros de chiffre d\'affaires annuel. Le calcul qui fait froid dans le dos.',
    category: 'IA Vocale',
    categoryColor: '#7C3AED',
    categoryBg: '#EDE9FE',
    date: '27 juin 2026',
    readTime: '5 min',
    // Unsplash: artisan/craftsman/phone theme
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Artisan plombier au travail, téléphone manqué',
    stat: '18 000 €',
    statLabel: 'perdus par an',
  },
  {
    slug: 'annuaire-centralise-dgfip-piege',
    title: 'L\'annuaire centralisé DGFiP : le piège que 90 % des PME ne voient pas venir',
    excerpt: 'Signer avec une plateforme agréée ne suffit pas. L\'enrôlement dans l\'annuaire centralisé prend 2 à 4 semaines — les entreprises qui attendent août rateront le 1er septembre.',
    category: 'Conformité',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    date: '27 juin 2026',
    readTime: '6 min',
    // Unsplash: calendar/deadline/urgency theme
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Calendrier avec date butoir marquée, délai réglementaire',
    stat: '90 %',
    statLabel: 'des PME ignorent ce piège',
  },
]

const C = {
  bg: '#F7F9FB', w: '#FFFFFF', ink: '#0A090A',
  g: '#6E6E73', lt: '#E8E8ED', b: '#1F49B0',
}

export default function Blog() {
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: C.w, borderBottom: `1px solid ${C.lt}`,
        position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: C.ink, textDecoration: 'none',
          letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.b }} />
          vanivert
        </a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: C.g, textDecoration: 'none' }}>Accueil</a>
          <a href="/calculateur" style={{ background: C.b, color: '#fff', fontSize: 13,
            fontWeight: 700, borderRadius: 980, padding: '8px 20px', textDecoration: 'none' }}>
            Calculer mon risque
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: C.w, borderBottom: `1px solid ${C.lt}`, padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: C.g, marginBottom: 16 }}>Ressources</div>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 48, letterSpacing: '-0.04em',
            color: C.ink, marginBottom: 12, marginTop: 0, lineHeight: 1.05 }}>Le blog Vanivert</h1>
          <p style={{ fontSize: 18, color: C.g, maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            Guides pratiques sur la conformité e-facturation, l'IA vocale et la gestion financière
            pour les PME françaises.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
          {ARTICLES.map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}`}
              style={{ textDecoration: 'none', display: 'block', background: C.w,
                borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.lt}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s' }}>

              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt={a.imageAlt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.4s ease' }}
                  loading="lazy"
                />
                {/* Overlay with stat */}
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}>
                </div>
                {/* Category badge */}
                <div style={{ position: 'absolute', top: 14, left: 14,
                  background: C.w, borderRadius: 8, padding: '4px 12px',
                  fontSize: 11, fontWeight: 700, color: a.categoryColor,
                  letterSpacing: '0.04em' }}>
                  {a.category}
                </div>
                {/* Stat */}
                <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff',
                    letterSpacing: '-0.03em', lineHeight: 1 }}>{a.stat}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)',
                    marginTop: 2 }}>{a.statLabel}</div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '22px 22px 20px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12,
                  fontSize: 11, color: C.g, fontFamily: 'monospace' }}>
                  <span>{a.date}</span>
                  <span>·</span>
                  <span>{a.readTime} de lecture</span>
                </div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 17,
                  letterSpacing: '-0.02em', color: C.ink, lineHeight: 1.3,
                  marginBottom: 10, marginTop: 0 }}>
                  {a.title}
                </h2>
                <p style={{ fontSize: 13, color: C.g, lineHeight: 1.65, margin: 0 }}>
                  {a.excerpt}
                </p>
                <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600,
                  color: a.categoryColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Lire l'article →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 64, padding: '36px 40px', background: C.w,
          borderRadius: 22, border: `1px solid ${C.lt}`,
          textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: C.g, marginBottom: 12 }}>
            Gratuit · 2 minutes
          </div>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28,
            letterSpacing: '-0.03em', color: C.ink, marginBottom: 10, marginTop: 0 }}>
            Vérifiez votre conformité e-facturation maintenant
          </h2>
          <p style={{ color: C.g, marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>
            Entrez votre SIRET et obtenez votre score de risque personnalisé en 2 minutes.
            Aucune inscription requise.
          </p>
          <a href="/calculateur"
            style={{ background: C.b, color: '#fff', fontWeight: 700, fontSize: 15,
              borderRadius: 980, padding: '14px 36px', textDecoration: 'none',
              display: 'inline-block', boxShadow: '0 4px 16px rgba(31,73,176,0.25)' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
