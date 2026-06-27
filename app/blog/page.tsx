import Link from 'next/link'

export const metadata = {
  title: 'Blog — Vanivert',
  description: 'Ressources et guides sur la conformité e-facturation 2026, l\'IA vocale et la gestion financière pour les PME françaises.',
}

export const ARTICLES = [
  {
    slug: 'e-facturation-2026-guide-bretagne',
    title: 'E-facturation 2026 : le guide complet pour les entreprises de Bretagne',
    excerpt: 'Tout ce que les PME et TPE des Côtes d\'Armor doivent savoir avant le 1er septembre 2026. Calendrier, obligations, sanctions et solutions.',
    category: 'Conformité',
    date: '27 juin 2026',
    readTime: '8 min',
    gradient: 'linear-gradient(135deg, #EEF5FF, #E3F2FD)',
  },
  {
    slug: 'appels-manques-artisans-bretagne',
    title: 'Artisans : combien perdez-vous par an à cause des appels manqués?',
    excerpt: 'Un plombier à Lannion qui rate 3 appels par jour perd en moyenne 18 000 euros de chiffre d\'affaires annuel. Le calcul qui fait froid dans le dos.',
    category: 'IA Vocale',
    date: '27 juin 2026',
    readTime: '5 min',
    gradient: 'linear-gradient(135deg, #E8EAF6, #EDE7F6)',
  },
  {
    slug: 'annuaire-centralise-dgfip-piege',
    title: 'L\'annuaire centralisé DGFiP : le piège que 90% des PME ne voient pas venir',
    excerpt: 'Choisir une plateforme agréée ne suffit pas. Les entreprises qui attendent août 2026 rateront l\'échéance de septembre même avec un contrat signé.',
    category: 'Conformité',
    date: '27 juin 2026',
    readTime: '6 min',
    gradient: 'linear-gradient(135deg, #FFF3E0, #FFECB3)',
  },
]

export default function Blog() {
  return (
    <div style={{ minHeight: '100dvh', background: '#F7F9FB', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #E8E8ED' }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: '#0A090A', textDecoration: 'none', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1F49B0' }} />
          vanivert
        </a>
        <a href="/calculateur" style={{ background: '#1F49B0', color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 980, padding: '8px 20px', textDecoration: 'none' }}>
          Calculer mon risque
        </a>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 32px 80px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 12 }}>Ressources</p>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 48, letterSpacing: '-0.04em', color: '#0A090A', marginBottom: 8, marginTop: 0 }}>Le blog Vanivert</h1>
        <p style={{ fontSize: 18, color: '#6E6E73', marginBottom: 56, lineHeight: 1.6 }}>Guides pratiques sur la conformité e-facturation, l'IA vocale et la gestion financière pour les PME françaises.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {ARTICLES.map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E8ED', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ height: 180, background: a.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#0A090A' }}>
                  {a.category}
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 12, color: '#6E6E73', fontFamily: 'monospace' }}>
                  <span>{a.date}</span>
                  <span>·</span>
                  <span>{a.readTime} de lecture</span>
                </div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#0A090A', lineHeight: 1.3, marginBottom: 10, marginTop: 0 }}>{a.title}</h2>
                <p style={{ fontSize: 14, color: '#6E6E73', lineHeight: 1.6, margin: 0 }}>{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 64, padding: '32px 36px', background: '#fff', borderRadius: 20, border: '1px solid #E8E8ED', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 12 }}>Gratuit</p>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.03em', color: '#0A090A', marginBottom: 8, marginTop: 0 }}>Vérifiez votre conformité en 2 minutes</h2>
          <p style={{ color: '#6E6E73', marginBottom: 24, fontSize: 15 }}>Calculateur gratuit — découvrez votre exposition aux amendes DGFiP et vos recommandations personnalisées.</p>
          <a href="/calculateur" style={{ background: '#1F49B0', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 980, padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
