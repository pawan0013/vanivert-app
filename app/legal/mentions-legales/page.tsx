import { SITE_CONFIG as S } from '@/lib/site.config'

export const metadata = {
  title: 'Mentions Légales — Vanivert',
  description: 'Mentions légales obligatoires du site vanivert.fr',
}

export default function MentionsLegales() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px', fontFamily: 'Inter, sans-serif', color: '#0A090A', lineHeight: 1.7 }}>
      <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 17, color: '#0A090A', textDecoration: 'none', letterSpacing: '-0.04em', marginBottom: 48 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1F49B0' }} />
        vanivert
      </a>

      <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6E6E73', marginBottom: 12 }}>Mentions légales</p>
      <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', marginBottom: 48, marginTop: 0 }}>Mentions Légales</h1>

      <Section title="Éditeur du site">
        <p><strong>{S.companyName}</strong><br />
        Forme juridique : {S.legalForm}<br />
        Représentant légal : {S.founderName}<br />
        Adresse : {S.address}<br />
        SIRET : {S.siret}<br />
        N° TVA intracommunautaire : {S.vatNumber}<br />
        Email : <a href={`mailto:${S.email}`} style={{ color: '#1F49B0' }}>{S.email}</a><br />
        Téléphone : {S.phone}</p>
      </Section>

      <Section title="Hébergement">
        <p><strong>Hébergeur du site web :</strong><br />
        {S.hostingProvider}<br />
        Site : <a href="https://vercel.com" style={{ color: '#1F49B0' }} target="_blank" rel="noopener">vercel.com</a></p>
        <p><strong>Hébergement des données :</strong><br />
        {S.dataHosting}</p>
      </Section>

      <Section title="Directeur de la publication">
        <p>{S.founderName}<br />
        Contact : <a href={`mailto:${S.email}`} style={{ color: '#1F49B0' }}>{S.email}</a></p>
      </Section>

      <Section title="Activité de l'éditeur">
        <p>Vanivert est un éditeur de logiciels SaaS proposant :</p>
        <ul>
          <li>Des services de réception vocale automatisée par intelligence artificielle</li>
          <li>Des services de conformité à la réforme de la facturation électronique DGFiP 2026</li>
          <li>Des services de gestion financière (Smart CFO) pour les PME françaises</li>
        </ul>
        <p>Le service de réception vocale est opéré dans le cadre d'une déclaration d'opérateur auprès de l'ARCEP (Autorité de Régulation des Communications Électroniques et des Postes).</p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>L'ensemble du contenu du site {S.siteUrl} (textes, images, logos, architecture, code source) est la propriété exclusive de {S.companyName}, sauf mentions contraires.</p>
        <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de {S.companyName}.</p>
        <p>Les marques et logos figurant sur le site sont des marques déposées par leurs propriétaires respectifs.</p>
      </Section>

      <Section title="Liens hypertextes">
        <p>Le site peut contenir des liens vers des sites tiers. {S.companyName} n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
        <p>La création de liens vers le site {S.siteUrl} est autorisée sous réserve que ces liens ne portent pas atteinte à l'image de {S.companyName} et qu'ils ne s'inscrivent pas dans un cadre concurrentiel déloyal.</p>
      </Section>

      <Section title="Données personnelles">
        <p>Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD - UE 2016/679), vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données.</p>
        <p>Pour en savoir plus : <a href="/legal/confidentialite" style={{ color: '#1F49B0' }}>Politique de confidentialité</a></p>
        <p>Autorité de contrôle : <a href="https://www.cnil.fr" style={{ color: '#1F49B0' }} target="_blank" rel="noopener">Commission Nationale de l'Informatique et des Libertés (CNIL)</a></p>
      </Section>

      <Section title="Cookies">
        <p>Ce site utilise Plausible Analytics, un outil de mesure d'audience ne déposant aucun cookie et ne collectant aucune donnée personnelle identifiable. Aucun consentement n'est requis.</p>
        <p>Pour en savoir plus : <a href="/legal/confidentialite" style={{ color: '#1F49B0' }}>Politique de confidentialité</a></p>
      </Section>

      <Section title="Droit applicable">
        <p>Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
      </Section>

      <div style={{ marginTop: 48, padding: '20px 24px', background: '#F2F2F7', borderRadius: 14, fontSize: 13, color: '#6E6E73' }}>
        <strong style={{ color: '#0A090A' }}>Pages légales connexes : </strong>
        <a href="/legal/confidentialite" style={{ color: '#1F49B0', marginRight: 16 }}>Politique de confidentialité</a>
        <a href="/legal/cgv" style={{ color: '#1F49B0' }}>CGV</a>
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
