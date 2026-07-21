export const metadata = { title: 'CGV - Vanivert' }
const INK='#0C0E1A',BLUE='#2563EB',BG='#FFFFFF',BDR='rgba(12,14,26,0.07)',MUTED='rgba(12,14,26,0.52)',SUBTLE='rgba(12,14,26,0.32)'
function Logo() {
  return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="9" fill={BLUE}/><circle cx="16" cy="11" r="3" fill="white"/><circle cx="10" cy="21" r="2.5" fill="white" opacity="0.7"/><circle cx="22" cy="21" r="2.5" fill="white" opacity="0.7"/><line x1="16" y1="14" x2="10" y2="19" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="16" y1="14" x2="22" y2="19" stroke="white" strokeWidth="1.5" opacity="0.6"/></svg>)
}
function Section({title,children}:{title:string;children:React.ReactNode}) {
  return (<div style={{marginBottom:36}}><h2 style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:400,color:INK,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${BDR}`}}>{title}</h2><div style={{fontSize:14,color:MUTED,lineHeight:1.75}}>{children}</div></div>)
}
export default function CGV() {
  return (
    <div style={{minHeight:'100dvh',background:BG,fontFamily:'system-ui,sans-serif',color:INK}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${BG}}`}</style>
      <nav style={{padding:'16px 32px',borderBottom:`1px solid ${BDR}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.96)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}><Logo/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:17,color:INK}}>vanivert</span></a>
        <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none'}}>← Retour au site</a>
      </nav>
      <main style={{maxWidth:760,margin:'0 auto',padding:'64px 32px 80px'}}>
        <div style={{marginBottom:40}}>
          <div style={{fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase' as const,marginBottom:10}}>Document legal</div>
          <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontSize:36,color:INK,letterSpacing:'-0.025em'}}>Conditions generales de vente</h1>
        </div>
        <Section title="Objet">
          <p>Les presentes conditions generales de vente s&apos;appliquent a tous les contrats conclus entre Vanivert et ses clients professionnels pour la fourniture de son logiciel de gestion d&apos;agence immobiliere en mode SaaS.</p>
        </Section>
        <Section title="Prestataire">
          <p>Vanivert, represente par Adithya Latchoumanassamy, entrepreneur individuel.</p>
          <p>SIRET : 93429900900019 - Adresse : 1 Clos des Sylthes, 95800 Cergy, France.</p>
        </Section>
        <Section title="Description du service">
          <p>Vanivert est une plateforme SaaS d&apos;automatisation pour agences immobilières françaises comprenant : centralisation des leads, IA vocale, planification de visites, gestion CRM, avis Google automatises et outils de conformite reglementaire.</p>
        </Section>
        <Section title="Tarifs">
          <p>Les tarifs sont fixes sur devis personnalise selon le volume d&apos;activite et le nombre d&apos;agents. Tout abonnement est soumis a une proposition ecrite remise sous 24h ouvrees. Les prix sont exprimes en euros HT.</p>
        </Section>
        <Section title="Duree et resiliation">
          <p>Les abonnements sont souscrits par periode mensuelle ou annuelle. La resiliation est possible a tout moment avec un preavis d&apos;un mois. Les donnees sont exportees et supprimees dans les 30 jours suivant la resiliation.</p>
        </Section>
        <Section title="Responsabilite">
          <p>Vanivert s&apos;engage a mettre en oeuvre tous les moyens raisonnables pour assurer la disponibilite du service. La responsabilite de Vanivert est limitee au montant des sommes versees par le client au cours des 12 derniers mois.</p>
        </Section>
        <Section title="Loi applicable">
          <p>Les presentes CGV sont soumises au droit francais. Tout litige sera soumis aux tribunaux competents du ressort de Cergy (Val-d&apos;Oise).</p>
        </Section>
        <div style={{marginTop:48,padding:'20px 24px',borderRadius:14,background:'#F8F9FF',border:`1px solid ${BLUE}15`}}>
          <p style={{fontSize:12,color:SUBTLE}}>Derniere mise a jour : juillet 2026</p>
        </div>
      </main>
      <footer style={{borderTop:`1px solid ${BDR}`,padding:'24px 32px',display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10}}>
        <span style={{fontSize:12,color:SUBTLE}}>2026 Vanivert - SIRET 93429900900019</span>
        <div style={{display:'flex',gap:20}}>
          {[['Mentions legales','/legal/mentions-legales'],['Confidentialite','/legal/confidentialite'],['Accueil','/']].map(([l,h])=>(<a key={l} href={h} style={{fontSize:12,color:SUBTLE,textDecoration:'none'}}>{l}</a>))}
        </div>
      </footer>
    </div>
  )
}
