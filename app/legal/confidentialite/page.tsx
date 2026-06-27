import { SITE_CONFIG as S } from '@/lib/site.config'

export const metadata = {
  title: 'Politique de confidentialité — Vanivert',
  description: 'Comment Vanivert collecte, utilise et protège vos données personnelles.',
}

export default function Confidentialite() {
  const updated = '27 juin 2026'
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px', fontFamily: 'Inter, sans-serif', color: '#0A090A', lineHeight: 1.7 }}>
      <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 17, color: '#0A090A', textDecoration: 'none', letterSpacing: '-0.04em', marginBottom: 48 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1F49B0' }} />
        vanivert
      </a>

      <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 12 }}>Politique de confidentialité</p>
      <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', marginBottom: 8, marginTop: 0 }}>Vos données nous sont confiées.</h1>
      <p style={{ color: '#6E6E73', marginBottom: 48, fontSize: 14 }}>Dernière mise à jour : {updated}</p>

      <Section title="1. Responsable du traitement">
        <p>Le responsable du traitement des données personnelles collectées via le site <strong>vanivert.fr</strong> est :</p>
        <p><strong>{S.companyName}</strong> — {S.legalForm}<br />
        Représentant légal : {S.founderName}<br />
        Email : <a href={`mailto:${S.founderEmail}`} style={{ color: '#1F49B0' }}>{S.founderEmail}</a><br />
        Adresse : {S.address}<br />
        SIRET : {S.siret}</p>
      </Section>

      <Section title="2. Données collectées et finalités">
        <p>Nous collectons les données suivantes :</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#F2F2F7' }}>
              {['Données', 'Finalité', 'Base légale', 'Durée'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, borderBottom: '2px solid #E8E8ED' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Nom, email, téléphone', 'Répondre à vos demandes de contact', 'Intérêt légitime', '3 ans'],
              ['SIRET, raison sociale', 'Calculateur de risque de conformité', 'Consentement', '3 ans'],
              ['Données de navigation', 'Amélioration du site (Plausible Analytics)', 'Intérêt légitime', '2 ans'],
              ['Enregistrements vocaux', 'Amélioration du service IA vocale', 'Consentement explicite', '30 jours'],
              ['Données de facturation', 'Conformité e-facturation DGFiP', 'Obligation légale', '10 ans'],
              ['Données bancaires (IBAN)', 'Traitement des paiements', 'Exécution du contrat', 'Durée contrat + 5 ans'],
            ].map(([d, f, b, dur], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #E8E8ED', background: i % 2 === 0 ? '#fff' : '#F7F9FB' }}>
                {[d, f, b, dur].map((v, j) => <td key={j} style={{ padding: '10px 14px', fontSize: 13 }}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="3. Hébergement et transferts de données">
        <p>Toutes vos données sont hébergées exclusivement en Europe :</p>
        <ul>
          <li><strong>Base de données</strong> : Supabase EU-West (Dublin, Irlande) — chiffrement AES-256</li>
          <li><strong>Fichiers et enregistrements vocaux</strong> : Hetzner Object Storage (Francfort, Allemagne)</li>
          <li><strong>Frontend</strong> : Vercel (région EU)</li>
          <li><strong>Modèles IA</strong> : Mistral 7B et Whisper sur Hetzner Frankfurt — aucun appel vers des API américaines dans le pipeline de données sensibles</li>
        </ul>
        <p><strong>Aucun transfert de données hors de l'Union Européenne</strong> pour les données sensibles (financières, médicales, vocales).</p>
      </Section>

      <Section title="4. Cookies et traceurs">
        <p>Nous utilisons <strong>Plausible Analytics</strong>, un outil de mesure d'audience respectueux de la vie privée :</p>
        <ul>
          <li>Aucun cookie déposé sur votre navigateur</li>
          <li>Aucune donnée personnelle collectée</li>
          <li>Hébergé en Europe (conforme RGPD sans consentement requis)</li>
          <li>Vous pouvez consulter notre tableau de bord public sur plausible.io</li>
        </ul>
        <p>Nous n'utilisons aucun cookie publicitaire, aucun pixel de tracking, aucun outil d'analyse comportementale américain.</p>
      </Section>

      <Section title="5. Vos droits">
        <p>Conformément au RGPD (Règlement UE 2016/679), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : supprimer vos données ("droit à l'oubli")</li>
          <li><strong>Droit à la limitation</strong> : limiter le traitement dans certains cas</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement basé sur l'intérêt légitime</li>
        </ul>
        <p>Pour exercer vos droits, contactez-nous : <a href={`mailto:${S.founderEmail}`} style={{ color: '#1F49B0' }}>{S.founderEmail}</a></p>
        <p>Délai de réponse : 30 jours maximum. En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr/fr/plaintes" style={{ color: '#1F49B0' }} target="_blank" rel="noopener">CNIL</a>.</p>
      </Section>

      <Section title="6. Sécurité des données">
        <ul>
          <li>Chiffrement AES-256 pour toutes les données sensibles au repos</li>
          <li>Protocole TLS 1.3 pour toutes les transmissions</li>
          <li>Row Level Security (RLS) sur Supabase — isolation totale entre clients</li>
          <li>Authentification à deux facteurs pour l'accès administrateur</li>
          <li>Logs d'accès sans données personnelles (PII stripping automatique)</li>
          <li>Sauvegardes quotidiennes chiffrées avec test de restauration mensuel</li>
        </ul>
      </Section>

      <Section title="7. Données vocales — Traitement spécifique">
        <p>Dans le cadre du service de réception vocale IA :</p>
        <ul>
          <li>Chaque appel commence par une annonce obligatoire informant l'appelant qu'il interagit avec un système automatisé</li>
          <li>L'enregistrement est conditionné à un consentement explicite (pression de la touche 1)</li>
          <li>Les enregistrements sont supprimés automatiquement après 30 jours</li>
          <li>Les transcriptions sont anonymisées avant tout traitement d'amélioration</li>
          <li>Aucune donnée vocale n'est partagée avec des tiers</li>
        </ul>
      </Section>

      <Section title="8. Durées de conservation">
        <ul>
          <li>Données de contact : 3 ans après le dernier contact</li>
          <li>Données contractuelles : durée du contrat + 5 ans (prescription civile)</li>
          <li>Données comptables et factures : 10 ans (obligation légale CGI Art. 54)</li>
          <li>Enregistrements vocaux : 30 jours maximum</li>
          <li>Logs système (sans PII) : 12 mois</li>
          <li>Données du calculateur sans email : 3 ans</li>
        </ul>
      </Section>

      <Section title="9. Contact">
        <p>Pour toute question relative à la protection de vos données :</p>
        <p><strong>{S.companyName}</strong><br />
        À l'attention de : {S.founderName}<br />
        Email : <a href={`mailto:${S.founderEmail}`} style={{ color: '#1F49B0' }}>{S.founderEmail}</a><br />
        Adresse : {S.address}</p>
      </Section>

      <div style={{ marginTop: 48, padding: '20px 24px', background: '#F2F2F7', borderRadius: 14, fontSize: 13, color: '#6E6E73' }}>
        <strong style={{ color: '#0A090A' }}>Pages légales connexes : </strong>
        <a href="/legal/cgv" style={{ color: '#1F49B0', marginRight: 16 }}>Conditions Générales de Vente</a>
        <a href="/legal/cgu" style={{ color: '#1F49B0', marginRight: 16 }}>Conditions Générales d'Utilisation</a>
        <a href="/legal/mentions-legales" style={{ color: '#1F49B0' }}>Mentions Légales</a>
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
