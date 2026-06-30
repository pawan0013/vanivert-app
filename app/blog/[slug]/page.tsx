import { notFound } from 'next/navigation'

/* All article data inline - no cross-file imports to avoid 404 */
const ARTICLES = [
  {
    slug: 'e-facturation-2026-guide-bretagne',
    title: 'E-facturation 2026 : le guide complet pour les entreprises de Bretagne',
    excerpt: "Tout ce que les PME et TPE des Cotes d'Armor doivent savoir avant le 1er septembre 2026. Calendrier, obligations, sanctions et solutions.",
    category: 'Conformite', categoryColor: '#1A4480',
    date: '27 juin 2026', readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Documents comptables et factures sur un bureau professionnel',
  },
  {
    slug: 'appels-manques-artisans-bretagne',
    title: 'Artisans : combien perdez-vous par an a cause des appels manques ?',
    excerpt: "Un plombier a Lannion qui rate 3 appels par jour perd en moyenne 18 000 EUR de chiffre d'affaires annuel. Le calcul qui fait froid dans le dos.",
    category: 'IA Vocale', categoryColor: '#7C3AED',
    date: '27 juin 2026', readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Artisan plombier au travail, telephone manque',
  },
  {
    slug: 'annuaire-centralise-dgfip-piege',
    title: "L'annuaire centralise DGFiP : le piege que 90% des PME ne voient pas venir",
    excerpt: "Signer avec une plateforme agreee ne suffit pas. L'enrolement dans l'annuaire centralise prend 2 a 4 semaines.",
    category: 'Conformite', categoryColor: '#D97706',
    date: '27 juin 2026', readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Calendrier avec date butoir, delai reglementaire DGFiP',
  },
]

const INK = '#0D1117'
const CREAM = '#F9F7F4'
const CREAM2 = '#F0EDE8'
const MID = '#6B7280'
const BORDER = 'rgba(13,17,23,0.10)'
const D = '#080C10'
const VI = '#5B4CF5'

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  if (!article) return { title: 'Article introuvable' }
  return {
    title: `${article.title} - Vanivert`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.image] },
  }
}

function Article1() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.8, color: 'rgba(13,13,15,0.75)' }}>
      <p style={{ fontSize: 18, fontWeight: 500, color: INK, lineHeight: 1.75, marginBottom: 32 }}>
        Le compte a rebours est lance. Dans moins de 70 jours, le paysage de la facturation en France change definitivamente. Si votre entreprise n'est pas prete, vous risquez non seulement des amendes, mais surtout de perdre des clients qui, eux, seront conformes.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
        {[['10 M', "entreprises concernees en France", "DGFiP, rapport 2025"], ['15 000 EUR', 'amende maximale par an', 'Code general des impots'], ['50 EUR', 'par facture non conforme', 'PLF 2024, Art. 289 bis']].map(([n, l, s]) => (
          <div key={n} style={{ padding: '20px', background: '#EFF6FF', borderRadius: 12, border: '1px solid #BFDBFE', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 28, color: '#1A4480', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginTop: 8 }}>{l}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>{s}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Ce que dit vraiment la loi</h2>
      <p>La reforme, inscrite dans la loi de finances 2024 et precisee par le decret du 8 septembre 2025, s'articule autour d'un principe simple : toutes les transactions B2B entre entreprises francaises assujetties a la TVA doivent transiter par une infrastructure numerique certifiee.</p>
      <p>Concretement, cela signifie la fin des factures PDF envoyees par email, des factures Word, des factures Excel. Ces formats ne seront plus legalement acceptables pour les transactions entre professionnels assujettis a la TVA.</p>
      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 14, padding: '20px 24px', margin: '28px 0' }}>
        <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 8, fontSize: 15 }}>Le calendrier exact</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          {[['1er septembre 2026', 'Toutes les entreprises : obligation de RECEVOIR les factures electroniques via une PA. Aucune exception.', true], ['1er septembre 2026', 'Grandes entreprises et ETI : obligation d\'EMETTRE et d\'envoyer les donnees e-reporting.', true], ['1er septembre 2027', 'PME et TPE : obligation d\'EMETTRE en format structure.', false]].map(([date, desc, urgent]) => (
            <div key={date as string} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: urgent ? '#DC2626' : '#6B7280', flexShrink: 0, width: 140 }}>{date as string}</div>
              <div style={{ fontSize: 14, color: '#374151' }}>{desc as string}</div>
            </div>
          ))}
        </div>
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>L'annuaire centralise : le piege que personne n'explique</h2>
      <p>Voici ce que la plupart des articles ne mentionnent pas. Signer un contrat avec une plateforme agreee (PA) ne suffit pas. Il existe une deuxieme etape obligatoire : l'enrolement dans l'annuaire centralise DGFiP.</p>
      <p>Cet annuaire est un registre officiel tenu par la DGFiP qui reference chaque entreprise francaise, sa plateforme de rattachement, et ses coordonnees de routage electronique. Sans etre dans cet annuaire, vos fournisseurs ne peuvent pas vous envoyer de facture electronique, meme s'ils sont parfaitement conformes de leur cote.</p>
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '20px 24px', margin: '28px 0' }}>
        <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: 8, fontSize: 15 }}>Le delai cache qui fait rater la deadline</div>
        <p style={{ color: '#7F1D1D', margin: 0, lineHeight: 1.7, fontSize: 14 }}>L'enrolement dans l'annuaire centralise prend entre 2 et 4 semaines a etre traite et valide par la DGFiP. Une entreprise qui signe avec une PA le 10 aout 2026 ne sera donc operationnelle dans l'annuaire qu'autour du 25 aout au mieux, avec tres peu de marge avant le 1er septembre. Notre recommandation : commencer les demarches avant le 1er aout.</p>
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Les formats legaux</h2>
      <p>Votre logiciel doit produire au moins un de ces trois formats :</p>
      <ul style={{ paddingLeft: 24, color: '#374151', lineHeight: 2 }}>
        <li><strong>Factur-X</strong> : PDF standard avec fichier XML CII integre. Le plus simple pour les PME. Votre logiciel genere un PDF lisible avec les donnees structurees dedans.</li>
        <li><strong>UBL 2.1</strong> : XML pur, standard europeen. Pour les entreprises a fort volume ou echanges internationaux.</li>
        <li><strong>CII (UN/CEFACT)</strong> : XML pur, recommande DGFiP. Pour les grandes entreprises avec integration IT.</li>
      </ul>
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '22px 26px', margin: '36px 0', textAlign: 'center' as const }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1E40AF', marginBottom: 10 }}>Calculez votre exposition en 2 minutes</div>
        <p style={{ fontSize: 14, color: '#1D4ED8', margin: '0 0 16px', lineHeight: 1.7 }}>Notre outil gratuit analyse votre situation et vous donne un score de risque personnalise avec les recommandations adaptees.</p>
        <a href="/calculateur" style={{ display: 'inline-block', background: '#1A4480', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '11px 24px', textDecoration: 'none' }}>Calculer mon risque</a>
      </div>
    </div>
  )
}

function Article2() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.8, color: 'rgba(13,13,15,0.75)' }}>
      <p style={{ fontSize: 18, fontWeight: 500, color: INK, lineHeight: 1.75, marginBottom: 32 }}>
        Il est 14h30. Vous etes sous l'evier, les mains dans les tuyaux, en train de reparer une fuite. Votre telephone sonne dans votre poche. Une fois. Deux fois. Vous ne pouvez pas decrocher. L'appelant raccroche. Trente secondes plus tard, il appelle votre concurrent. Ce scenario se joue plusieurs fois par semaine dans chaque atelier de plomberie, chaque cabinet de kinesitherapie, chaque salon de coiffure de Bretagne.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
        {[['62%', "des appelants ne rappellent pas apres un repondeur", "BVA Group 2026"], ['85%', 'raccrochent sans laisser de message', 'Ifop 2025'], ['18 000 EUR', 'perdus par an pour 3 appels manques/semaine', 'Calcul Vanivert base 350 EUR panier']].map(([n, l, s]) => (
          <div key={n} style={{ padding: '20px', background: '#F5F3FF', borderRadius: 12, border: '1px solid #C4B5FD', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 28, color: '#7C3AED', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6D28D9', marginTop: 8 }}>{l}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>{s}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Le calcul exact</h2>
      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px', margin: '20px 0 28px' }}>
        {[['Appels manques par semaine', '3 a 5 (pendant les interventions)'], ['Taux de non-rappel', '62% (BVA Group 2026)'], ['Clients perdus par semaine', '2 a 3'], ['Panier moyen', '350 EUR (plombier), 45 EUR x 10 seances (kine)'], ['Perte hebdomadaire', '700 a 1 050 EUR'], ['Perte annuelle (50 semaines)', '35 000 a 52 500 EUR']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 14 }}>
            <span style={{ color: '#6B7280' }}>{k}</span>
            <span style={{ fontWeight: 700, color: INK, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEE2E2', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#991B1B', textAlign: 'center' as const }}>
          Meme en divisant par 5 : 7 000 a 10 500 EUR de CA perdu chaque annee
        </div>
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Pourquoi le repondeur ne suffit pas</h2>
      <ul style={{ paddingLeft: 24, color: '#374151', lineHeight: 2 }}>
        <li><strong>85% des appelants raccrochent sans laisser de message</strong> quand ils tombent sur un repondeur professionnel (Ifop 2025). Pas 30%, pas 50%. 85%.</li>
        <li>Les 15% qui laissent un message ont souvent trouve quelqu'un d'autre dans les 20 minutes.</li>
        <li>Un patient qui a mal maintenant n'attend pas votre rappel de 18h.</li>
        <li>En haute saison touristique (juillet-aout en Bretagne), la duree de decision est de moins de 3 minutes.</li>
      </ul>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Les secteurs les plus exposes en Bretagne</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '20px 0 28px' }}>
        {[['Kinesitherapie', '12 000 - 28 000 EUR/an', '1 840 cabinets en Bretagne'], ['Dentistes', '18 000 - 40 000 EUR/an', '620 cabinets'], ['Hotels cotiers (haute saison)', '25 000 - 80 000 EUR/an', '680 etablissements'], ['Plombiers-chauffagistes', '8 000 - 20 000 EUR/an', '3 200 entreprises']].map(([s, l, n]) => (
          <div key={s} style={{ padding: '14px 16px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 4 }}>{s}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626', letterSpacing: '-0.02em', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>{l}</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: 14, padding: '22px 26px', margin: '36px 0', textAlign: 'center' as const }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#4C1D95', marginBottom: 10 }}>Essayez gratuitement pendant 30 jours</div>
        <p style={{ fontSize: 14, color: '#5B21B6', margin: '0 0 16px', lineHeight: 1.7 }}>Aucune carte bancaire. Configuration en 10 minutes. Si vous ne recuperez pas au moins un client supplementaire en 30 jours, vous ne payez rien.</p>
        <a href="/demo" style={{ display: 'inline-block', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '11px 24px', textDecoration: 'none' }}>Demarrer l'essai gratuit</a>
      </div>
    </div>
  )
}

function Article3() {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, lineHeight: 1.8, color: 'rgba(13,13,15,0.75)' }}>
      <p style={{ fontSize: 18, fontWeight: 500, color: INK, lineHeight: 1.75, marginBottom: 32 }}>
        Si vous avez lu les newsletters de votre CCI ou les emails de votre expert-comptable, vous avez probablement retenu un message : il faut choisir une plateforme agreee. C'est vrai. Mais c'est incomplet. Et cette incomplitude va faire rater la deadline a des milliers d'entreprises qui pensaient avoir fait le necessaire.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
        {[['2 a 4 sem.', "delai de traitement de l'enrolement annuaire", 'DGFiP guide technique v2.3'], ['77%', "des PME n'avaient pas commence en mai 2026", 'Bpifrance barometre mai 2026'], ['100+', 'plateformes agreees sur la liste DGFiP', 'Liste officielle DGFiP juin 2026']].map(([n, l, s]) => (
          <div key={n} style={{ padding: '20px', background: '#FFFBEB', borderRadius: 12, border: '1px solid #FDE68A', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 28, color: '#D97706', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#B45309', marginTop: 8 }}>{l}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>{s}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>C'est quoi, l'annuaire centralise DGFiP ?</h2>
      <p>Quand la reforme e-facturation entre en vigueur, chaque entreprise francaise assujettie a la TVA doit etre referencee dans un annuaire centralise gere par la DGFiP. Cet annuaire indique, pour chaque SIRET :</p>
      <ul style={{ paddingLeft: 24, color: '#374151', lineHeight: 2 }}>
        <li>Sa plateforme agreee de rattachement (PA ou PDP)</li>
        <li>Le format electronique qu'elle accepte</li>
        <li>Ses coordonnees de routage electronique</li>
      </ul>
      <p>Sans votre entree dans cet annuaire, personne ne peut vous envoyer de facture electronique, meme si vous avez signe avec la meilleure PA du marche.</p>
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '20px 24px', margin: '28px 0' }}>
        <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: 12, fontSize: 15 }}>Le scenario catastrophe - tres frequent</div>
        {[['1er aout', "Valeo envoie une lettre : factures electroniques obligatoires a partir du 1er septembre."], ['10 aout', "Signature avec une PA. Le commercial dit que c'est operationnel 'en quelques jours'."], ['1er septembre', "La PME recoit une facture de Valeo. Elle est rejetee : la PME n'est pas dans l'annuaire."], ['3 septembre', "L'annuaire traite l'enrolement. 3 jours de non-conformite. 50 EUR par facture."]].map(([date, event]) => (
          <div key={date} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#DC2626', flexShrink: 0, width: 80 }}>{date}</div>
            <div style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5 }}>{event}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'rgba(13,13,15,0.92)', marginBottom: 14, marginTop: 36 }}>Comment eviter ce piege en 3 etapes</h2>
      <ol style={{ paddingLeft: 24, color: '#374151', lineHeight: 2 }}>
        <li><strong>Choisissez votre PA maintenant</strong>, pas en aout. Vanivert travaille avec Docoon (PA n°0001 sur la liste DGFiP).</li>
        <li><strong>Demandez confirmation ecrite</strong> de votre PA que votre SIRET est bien inscrit dans l'annuaire centralise, avec la date de confirmation.</li>
        <li><strong>Testez avant le 15 aout</strong> : demandez une facture test. Si vous la recevez correctement, vous etes conforme.</li>
      </ol>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: '22px 26px', margin: '36px 0', textAlign: 'center' as const }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>Agissez avant le 15 aout</div>
        <p style={{ fontSize: 14, color: '#B45309', margin: '0 0 16px', lineHeight: 1.7 }}>Vanivert gere l'enrolement dans l'annuaire centralise pour le compte de ses clients. C'est inclus dans le service conformite a 1 200 EUR/mois, sans frais d'installation.</p>
        <a href="/calculateur" style={{ display: 'inline-block', background: '#D97706', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '11px 24px', textDecoration: 'none' }}>Verifier ma conformite</a>
      </div>
    </div>
  )
}

const CONTENT: Record<string, React.ComponentType> = {
  'e-facturation-2026-guide-bretagne': Article1,
  'appels-manques-artisans-bretagne': Article2,
  'annuaire-centralise-dgfip-piege': Article3,
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  const ArticleBody = CONTENT[params.slug]
  if (!article || !ArticleBody) notFound()

  return (
    <div style={{ minHeight: '100dvh', background: '#FAFAF8', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'rgba(13,13,15,0.88)' }}>
      {/* Nav */}
      <nav style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(250,250,248,0.94)', borderBottom: '1px solid rgba(13,13,15,0.08)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#fff' }}>v</span>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(13,13,15,0.88)' }}>vanivert</span>
        </a>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/blog" style={{ fontSize: 13, color: 'rgba(13,13,15,0.50)', textDecoration: 'none', padding: '6px 14px', borderRadius: 980, border: '1px solid rgba(13,13,15,0.12)' }}>Retour au blog</a>
          <a href="/calculateur" style={{ background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 980, padding: '8px 18px', textDecoration: 'none' }}>Calculer mon risque</a>
        </div>
      </nav>

      {/* Hero image */}
      <div style={{ height: 360, overflow: 'hidden', position: 'relative', background: '#080C10' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,16,0.7) 0%, rgba(8,12,16,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 32, left: 40, right: 40, maxWidth: 760 }}>
          <div style={{ display: 'inline-block', background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: article.categoryColor, marginBottom: 14, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{article.category}</div>
          <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400, fontSize: 30, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>{article.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <div style={{ background: 'rgba(250,250,248,0.95)', borderBottom: '1px solid rgba(13,13,15,0.08)', padding: '14px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 20, fontSize: 12, color: MID, fontFamily: 'JetBrains Mono, monospace', alignItems: 'center', flexWrap: 'wrap' as const }}>
          <span>{article.date}</span>
          <span>|</span>
          <span>{article.readTime} de lecture</span>
          <span>|</span>
          <span>Pawan Kumar, Co-fondateur Vanivert</span>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 40px 80px', background: '#FAFAF8' }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
        <ArticleBody />

        {/* Author */}
        <div style={{ marginTop: 52, padding: '22px 26px', background: 'rgba(13,13,15,0.03)', borderRadius: 16, border: '1px solid rgba(13,13,15,0.10)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 3 }}>Pawan Kumar</div>
            <div style={{ fontSize: 13, color: MID, lineHeight: 1.6 }}>Co-fondateur et CTO, Vanivert. EDHEC Business School MiM Finance. Ex-Junior Deck Officer Synergy Marine Group (15 pays). Ex-Co-fondateur Alliance Infosys (100K EUR MRR en 18 mois).</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <a href="/blog" style={{ fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 9, border: `1px solid ${BORDER}`, color: INK, textDecoration: 'none', background: CREAM2 }}>Tous les articles</a>
          <a href="/calculateur" style={{ fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 9, background: VI, color: '#fff', textDecoration: 'none' }}>Calculer mon risque</a>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 9, border: `1px solid ${BORDER}`, color: VI, textDecoration: 'none' }}>Essai gratuit 30 jours</a>
        </div>
      </div>
    </div>
  )
}
