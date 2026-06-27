import { notFound } from 'next/navigation'
import { ARTICLES } from '../page'

const CONTENT: Record<string, React.ReactNode> = {
  'e-facturation-2026-guide-bretagne': (
    <>
      <p>Le 1er septembre 2026, la facturation électronique devient obligatoire pour toutes les entreprises françaises assujetties à la TVA. Voici exactement ce que cela signifie pour les PME et TPE des Côtes d'Armor.</p>
      <h2>Ce qui change au 1er septembre 2026</h2>
      <p>Contrairement à ce que beaucoup pensent, <strong>toutes</strong> les entreprises sont concernées dès le 1er septembre 2026 — pas seulement les grandes. La distinction est la suivante :</p>
      <ul>
        <li><strong>Toutes les entreprises (dès le 1er sept. 2026)</strong> : obligation de <em>recevoir</em> les factures électroniques via une plateforme agréée (PA/PDP).</li>
        <li><strong>Grandes entreprises et ETI (dès le 1er sept. 2026)</strong> : obligation d'<em>émettre</em> et d'e-reporter.</li>
        <li><strong>PME et TPE (dès le 1er sept. 2027)</strong> : obligation d'<em>émettre</em> en format structuré.</li>
      </ul>
      <h2>Le piège de l'annuaire centralisé</h2>
      <p>Ce que peu de comptables expliquent clairement : choisir une plateforme agréée ne suffit pas. Vous devez <strong>également</strong> vous enregistrer dans l'annuaire centralisé DGFiP. Ce processus prend 2 à 4 semaines.</p>
      <p>Conséquence directe : <strong>les entreprises qui attendent août 2026 rateront l'échéance du 1er septembre</strong>, même si elles signent avec une PA en août. L'enrôlement ne sera pas finalisé à temps.</p>
      <h2>Les sanctions en cas de non-conformité</h2>
      <ul>
        <li><strong>50 euros par facture non conforme</strong> transmise</li>
        <li>Plafond annuel : <strong>15 000 euros</strong></li>
        <li>En pratique : une PME émettant 500 factures/an = 25 000 euros de pénalités potentielles (plafonnées à 15 000 euros)</li>
      </ul>
      <h2>Ce que vous devez faire maintenant</h2>
      <ol>
        <li><strong>Choisir une plateforme agréée</strong> (PA ou PDP certifiée DGFiP)</li>
        <li><strong>S'enregistrer dans l'annuaire centralisé</strong> — ne pas attendre</li>
        <li><strong>Connecter votre logiciel de facturation</strong> à la plateforme choisie</li>
        <li><strong>Tester la réception</strong> d'une facture électronique test</li>
      </ol>
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '20px 24px', margin: '32px 0' }}>
        <strong style={{ color: '#1F49B0', display: 'block', marginBottom: 8 }}>Calculez votre exposition en 2 minutes</strong>
        <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>Notre calculateur gratuit analyse votre situation et vous donne un score de risque personnalisé avec vos recommandations.</p>
        <a href="/calculateur" style={{ display: 'inline-block', marginTop: 14, background: '#1F49B0', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '10px 22px', textDecoration: 'none' }}>Calculer mon risque →</a>
      </div>
      <h2>Les solutions disponibles pour les PME bretonnes</h2>
      <p>Le marché compte aujourd'hui plus de 100 plateformes agréées. Pour une PME bretonne, les critères de choix sont :</p>
      <ul>
        <li><strong>Compatibilité avec votre logiciel actuel</strong> (Sage, Pennylane, Cegid, Excel)</li>
        <li><strong>Frais d'installation</strong> : certains prestataires facturent 5 000 à 10 000 euros de setup</li>
        <li><strong>Support en français</strong> et disponibilité pour accompagner la mise en place</li>
        <li><strong>Gestion de l'enrôlement annuaire</strong> : vérifiez que votre prestataire le fait pour vous</li>
      </ul>
      <p>Vanivert propose une connexion clé en main pour zéro frais d'installation, à 1 200 euros par mois. Nous gérons l'enrôlement dans l'annuaire centralisé pour votre compte.</p>
    </>
  ),
  'appels-manques-artisans-bretagne': (
    <>
      <p>Vous êtes plombier, électricien, charpentier. Vous êtes sur un chantier. Votre téléphone sonne. Vous ne pouvez pas décrocher. L'appelant raccroche. Il appelle le concurrent. Ce scénario se répète 3 à 5 fois par jour pour la plupart des artisans bretons.</p>
      <h2>Le calcul qui fait froid dans le dos</h2>
      <p>Faisons le calcul ensemble pour un artisan type à Lannion :</p>
      <ul>
        <li>3 appels manqués par jour en semaine = <strong>15 appels manqués par semaine</strong></li>
        <li>62% des appelants qui tombent sur un répondeur ne rappellent pas (BVA 2026)</li>
        <li>Soit <strong>9 clients perdus par semaine</strong></li>
        <li>Panier moyen d'une intervention : 350 euros</li>
        <li><strong>Perte hebdomadaire : 3 150 euros</strong></li>
        <li><strong>Perte annuelle : 163 800 euros de chiffre d'affaires non réalisé</strong></li>
      </ul>
      <p>Même en divisant ce chiffre par 10 pour rester conservateur, c'est <strong>16 380 euros par an</strong> qui partent chez vos concurrents parce que votre téléphone n'a pas décroché.</p>
      <h2>La réalité d'un cabinet de kinésithérapie</h2>
      <p>Un kinésithérapeute à Perros-Guirec nous a partagé ses chiffres :</p>
      <blockquote style={{ borderLeft: '4px solid #1F49B0', paddingLeft: 20, margin: '24px 0', color: '#4A4A52', fontStyle: 'italic' }}>
        "Je rate entre 5 et 8 appels par jour pendant mes séances. Sur une semaine, c'est 30 à 40 nouveaux patients potentiels que je perds. À 10 séances par patient en moyenne à 40 euros la séance, je perds 12 000 à 16 000 euros de chiffre d'affaires par semaine."
      </blockquote>
      <h2>Pourquoi le répondeur ne fonctionne pas</h2>
      <p>85% des appelants qui tombent sur un répondeur raccrochent sans laisser de message (source : étude Ifop 2025). Les raisons sont simples :</p>
      <ul>
        <li>Ils veulent parler à quelqu'un maintenant</li>
        <li>Ils ne savent pas si vous allez rappeler</li>
        <li>Ils ont trouvé quelqu'un d'autre avant que vous rappeliez</li>
      </ul>
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '20px 24px', margin: '32px 0' }}>
        <strong style={{ color: '#1F49B0', display: 'block', marginBottom: 8 }}>La solution à 19 euros par mois</strong>
        <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>Vanivert répond à vos appels 24h/24 en français, prend les messages et les rendez-vous. Essai gratuit 30 jours. Aucune carte bancaire requise.</p>
        <a href="/demo" style={{ display: 'inline-block', marginTop: 14, background: '#1F49B0', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '10px 22px', textDecoration: 'none' }}>Essayer gratuitement →</a>
      </div>
    </>
  ),
  'annuaire-centralise-dgfip-piege': (
    <>
      <p>Tout le monde parle de choisir une plateforme agréée (PA) pour être conforme à la réforme e-facturation du 1er septembre 2026. Mais personne ne parle de l'étape que 90% des PME oublient : l'enrôlement dans l'annuaire centralisé DGFiP.</p>
      <h2>C'est quoi l'annuaire centralisé DGFiP?</h2>
      <p>L'annuaire centralisé est un répertoire officiel géré par la DGFiP qui référence toutes les entreprises et leur plateforme agréée. Sans enregistrement dans cet annuaire, <strong>vos fournisseurs ne peuvent pas vous envoyer de factures électroniques</strong>, même s'ils sont eux-mêmes conformes.</p>
      <p>En d'autres termes : une PA sans enrôlement annuaire = vous n'êtes pas conforme.</p>
      <h2>Le délai qui piège tout le monde</h2>
      <p>L'enrôlement dans l'annuaire centralisé prend <strong>2 à 4 semaines</strong> à être traité et validé.</p>
      <p>Conséquence mathématique :</p>
      <ul>
        <li>Vous signez avec une PA le <strong>15 août 2026</strong></li>
        <li>L'enrôlement prend 3 semaines</li>
        <li>Vous êtes dans l'annuaire le <strong>5 septembre 2026</strong></li>
        <li>Vous êtes <strong>non conforme au 1er septembre</strong> malgré votre contrat signé</li>
      </ul>
      <h2>Que dit la DGFiP exactement?</h2>
      <p>Selon les spécifications officielles DGFiP (version 2.3, mai 2026), chaque entreprise assujettie à la TVA doit :</p>
      <ol>
        <li>Choisir une Plateforme Agréée (PA) ou Plateforme de Dématérialisation Partenaire (PDP)</li>
        <li>Procéder à l'enrôlement dans l'annuaire centralisé via sa PA</li>
        <li>Tester la réception d'une facture électronique</li>
      </ol>
      <p>Les trois étapes sont obligatoires.</p>
      <h2>Comment Vanivert règle ce problème</h2>
      <p>Vanivert gère l'enrôlement dans l'annuaire centralisé pour le compte de ses clients. C'est inclus dans notre service de conformité à 1 200 euros par mois — pas de frais supplémentaires, pas de démarche à faire de votre côté.</p>
      <div style={{ background: '#FFF3E0', border: '1px solid #FFD591', borderRadius: 14, padding: '20px 24px', margin: '32px 0' }}>
        <strong style={{ color: '#D46B08', display: 'block', marginBottom: 8 }}>⚠️ Agissez maintenant</strong>
        <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>Il reste moins de 70 jours avant le 1er septembre. Pour garantir votre conformité à temps, vous devez commencer les démarches cette semaine.</p>
        <a href="/calculateur" style={{ display: 'inline-block', marginTop: 14, background: '#0A090A', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 980, padding: '10px 22px', textDecoration: 'none' }}>Vérifier ma conformité →</a>
      </div>
    </>
  ),
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  if (!article) notFound()
  const content = CONTENT[params.slug]

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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 32px 80px' }}>
        <a href="/blog" style={{ fontSize: 13, color: '#6E6E73', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          ← Retour au blog
        </a>
        <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#1F49B0', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 6, marginBottom: 16, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {article!.category}
        </div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', color: '#0A090A', lineHeight: 1.1, marginBottom: 16, marginTop: 0 }}>{article!.title}</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6E6E73', fontFamily: 'monospace', marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid #E8E8ED' }}>
          <span>{article!.date}</span>
          <span>·</span>
          <span>{article!.readTime} de lecture</span>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.8, color: '#0A090A' }}>
          {content}
        </div>
        <div style={{ marginTop: 56, padding: '28px 32px', background: '#fff', borderRadius: 20, border: '1px solid #E8E8ED', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 10 }}>Gratuit · 2 minutes</p>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: '#0A090A', marginBottom: 8, marginTop: 0 }}>Calculez votre exposition aux amendes DGFiP</h3>
          <p style={{ color: '#6E6E73', marginBottom: 20, fontSize: 14 }}>SIRET + 3 questions = votre score de risque personnalisé.</p>
          <a href="/calculateur" style={{ background: '#1F49B0', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 980, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
