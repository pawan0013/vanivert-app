import { SITE_CONFIG as S } from '@/lib/site.config'

export const metadata = {
  title: 'Conditions Générales de Vente — Vanivert',
  description: 'Conditions générales de vente des services Vanivert.',
}

export default function CGV() {
  const updated = '27 juin 2026'
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px', fontFamily: 'Inter, sans-serif', color: '#0A090A', lineHeight: 1.7 }}>
      <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 17, color: '#0A090A', textDecoration: 'none', letterSpacing: '-0.04em', marginBottom: 48 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1F49B0' }} />
        vanivert
      </a>

      <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 12 }}>Conditions Générales de Vente</p>
      <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', marginBottom: 8, marginTop: 0 }}>CGV</h1>
      <p style={{ color: '#6E6E73', marginBottom: 48, fontSize: 14 }}>Dernière mise à jour : {updated} — En vigueur à compter du 27 juin 2026</p>

      <Section title="Article 1 — Objet et champ d'application">
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>{S.companyName}</strong> ({S.legalForm}, {S.founderName}, {S.address}, SIRET : {S.siret}, ci-après "le Prestataire") et tout client professionnel (ci-après "le Client") souhaitant souscrire aux services proposés sur le site {S.siteUrl}.</p>
        <p>Les CGV s'appliquent à l'exclusion de tout autre document, notamment les conditions générales d'achat du Client. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
      </Section>

      <Section title="Article 2 — Services proposés">
        <p>Le Prestataire propose les services suivants :</p>
        <ul>
          <li><strong>Vanivert Starter (19 €/mois HT)</strong> : Service de réception vocale automatisée en français, 200 minutes incluses, intégration agenda (Doctolib ou Google Calendar), tableau de bord basique, support par email.</li>
          <li><strong>Vanivert Business (29 €/mois HT)</strong> : Tout Starter, plus Smart CFO (trésorerie temps réel), conformité e-facturation via plateforme agréée DGFiP, 500 minutes vocales, connexion bancaire PSD2, alertes automatiques.</li>
          <li><strong>Vanivert Premium (99 €/mois HT)</strong> : Tout Business, plus business development automatisé (30 leads qualifiés/mois), intégration ERP complète (Sage, Cegid), 1 500 minutes vocales, onboarding dédié, support prioritaire.</li>
          <li><strong>Minutes vocales supplémentaires</strong> : 0,08 €/min HT (Starter), 0,07 €/min HT (Business), 0,06 €/min HT (Premium).</li>
          <li><strong>Audit de conformité e-facturation</strong> : Prestation ponctuelle sur devis, à partir de 300 € HT.</li>
          <li><strong>Retainer de conformité</strong> : Abonnement mensuel, à partir de 1 200 € HT/mois.</li>
        </ul>
        <p>Les tarifs sont indiqués hors taxes (HT). La TVA applicable est celle en vigueur au jour de la facturation (20% pour les prestations de services en France).</p>
      </Section>

      <Section title="Article 3 — Essai gratuit et souscription">
        <p><strong>Essai gratuit</strong> : Tout nouveau Client bénéficie d'une période d'essai gratuite de 30 jours sans engagement et sans carte bancaire requise. À l'issue de cette période, le Client peut souscrire à un abonnement payant ou cesser d'utiliser le service sans frais.</p>
        <p><strong>Souscription</strong> : La souscription est effectuée en ligne via le site {S.siteUrl}. Le contrat est conclu à réception de la confirmation de commande par email.</p>
        <p><strong>Engagement</strong> : Les abonnements sont sans engagement de durée minimale. Le Client peut résilier à tout moment conformément à l'Article 7.</p>
      </Section>

      <Section title="Article 4 — Facturation et paiement">
        <ul>
          <li>Les abonnements sont facturés mensuellement ou annuellement selon l'option choisie, à terme à échoir.</li>
          <li>Le paiement est effectué par prélèvement automatique (SEPA) ou carte bancaire via Stripe.</li>
          <li>En cas de dépassement du quota de minutes incluses, les minutes supplémentaires sont facturées en fin de mois sur relevé de consommation.</li>
          <li>Tout retard de paiement entraîne des pénalités égales à 3 fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de recouvrement de 40 € conformément à l'article L.441-10 du Code de commerce.</li>
          <li>En cas de non-paiement après relance, le Prestataire se réserve le droit de suspendre l'accès aux services dans un délai de 15 jours après mise en demeure.</li>
        </ul>
      </Section>

      <Section title="Article 5 — Obligations du Prestataire">
        <p>Le Prestataire s'engage à :</p>
        <ul>
          <li>Fournir les services décrits avec diligence et dans les règles de l'art</li>
          <li>Maintenir une disponibilité du service de 99,5% mensuelle (hors maintenance programmée notifiée 48h à l'avance)</li>
          <li>Assurer la confidentialité et la sécurité des données conformément au RGPD</li>
          <li>Héberger l'ensemble des données du Client en Europe (France et Allemagne)</li>
          <li>Notifier le Client dans les 72 heures en cas de violation de données à caractère personnel</li>
          <li>Conserver les données comptables et factures pendant 10 ans conformément au Code général des impôts</li>
        </ul>
      </Section>

      <Section title="Article 6 — Obligations du Client">
        <p>Le Client s'engage à :</p>
        <ul>
          <li>Fournir des informations exactes et à jour lors de la souscription</li>
          <li>Utiliser les services conformément aux présentes CGV et à la législation en vigueur</li>
          <li>Ne pas utiliser les services à des fins illicites, frauduleuses ou portant atteinte aux droits des tiers</li>
          <li>Informer ses appelants de l'utilisation d'un système de réception vocale automatisé</li>
          <li>S'assurer que l'utilisation du service vocal est conforme aux obligations ARCEP et RGPD applicables à son secteur</li>
          <li>Régler les factures dans les délais convenus</li>
        </ul>
      </Section>

      <Section title="Article 7 — Résiliation">
        <p><strong>Résiliation par le Client</strong> : Le Client peut résilier son abonnement à tout moment depuis son espace client ou en envoyant un email à {S.email}. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement au prorata n'est effectué sauf accord exprès du Prestataire.</p>
        <p><strong>Résiliation par le Prestataire</strong> : Le Prestataire peut résilier le contrat de plein droit, sans préavis, en cas de violation grave des présentes CGV par le Client, notamment en cas de non-paiement persistant ou d'utilisation illicite des services.</p>
        <p><strong>Effets de la résiliation</strong> : À la date d'effet de la résiliation, l'accès aux services est coupé. Le Client dispose d'un délai de 30 jours pour exporter ses données. Au-delà, les données sont supprimées définitivement.</p>
      </Section>

      <Section title="Article 8 — Responsabilité et limitation">
        <p>Le Prestataire est soumis à une obligation de moyens et non de résultat.</p>
        <p>La responsabilité du Prestataire ne peut être engagée en cas de :</p>
        <ul>
          <li>Force majeure (panne Internet, catastrophe naturelle, acte gouvernemental)</li>
          <li>Interruption due à une maintenance programmée notifiée</li>
          <li>Utilisation non conforme des services par le Client</li>
          <li>Perte de données imputable au Client</li>
          <li>Défaillance de services tiers (Twilio, Supabase, Docoon)</li>
        </ul>
        <p>En tout état de cause, la responsabilité du Prestataire est plafonnée au montant des sommes versées par le Client au cours des 3 derniers mois précédant le dommage.</p>
      </Section>

      <Section title="Article 9 — Propriété intellectuelle">
        <p>Le Client conserve la propriété de l'ensemble de ses données (factures, enregistrements, données comptables). Le Prestataire n'acquiert aucun droit de propriété sur ces données.</p>
        <p>Le Prestataire conserve la propriété de l'ensemble de ses outils, algorithmes, logiciels et interfaces. Toute reproduction ou utilisation sans autorisation est interdite.</p>
        <p>Le Client autorise le Prestataire à mentionner son nom et son logo à titre de référence commerciale, sauf opposition écrite de sa part.</p>
      </Section>

      <Section title="Article 10 — Protection des données (DPA)">
        <p>Dans le cadre de l'exécution des services, le Prestataire agit en qualité de sous-traitant au sens de l'article 28 du RGPD. Un Accord de Traitement des Données (DPA) est disponible sur demande à {S.email} et est réputé annexé aux présentes CGV.</p>
        <p>Le Prestataire s'engage à traiter les données personnelles exclusivement pour les finalités définies dans le contrat et à ne pas les sous-traiter sans accord préalable du Client.</p>
      </Section>

      <Section title="Article 11 — Loi applicable et juridiction">
        <p>Les présentes CGV sont soumises au droit français.</p>
        <p>En cas de litige, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours. À défaut d'accord, le litige sera soumis aux tribunaux compétents du ressort du siège social du Prestataire (Tribunal de commerce de Saint-Brieuc).</p>
        <p>Conformément à l'article L.612-1 du Code de la consommation (pour les clients personnes physiques), le Client peut recourir gratuitement à un médiateur de la consommation : <a href="https://www.mediateur-consommation-ffd.fr" style={{ color: '#1F49B0' }} target="_blank" rel="noopener">médiateur-consommation-ffd.fr</a></p>
      </Section>

      <Section title="Article 12 — Contact">
        <p>Pour toute question relative aux présentes CGV :</p>
        <p><strong>{S.companyName}</strong><br />
        {S.founderName}<br />
        <a href={`mailto:${S.email}`} style={{ color: '#1F49B0' }}>{S.email}</a><br />
        {S.address}</p>
      </Section>

      <div style={{ marginTop: 48, padding: '20px 24px', background: '#F2F2F7', borderRadius: 14, fontSize: 13, color: '#6E6E73' }}>
        <strong style={{ color: '#0A090A' }}>Pages légales connexes : </strong>
        <a href="/legal/confidentialite" style={{ color: '#1F49B0', marginRight: 16 }}>Politique de confidentialité</a>
        <a href="/legal/mentions-legales" style={{ color: '#1F49B0', marginRight: 16 }}>Mentions Légales</a>
        <a href="/legal/dpa" style={{ color: '#1F49B0' }}>Accord DPA</a>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: '#1F49B0', marginBottom: 14, marginTop: 0, paddingBottom: 8, borderBottom: '1px solid #E8E8ED' }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: '#0A090A' }}>{children}</div>
    </div>
  )
}
