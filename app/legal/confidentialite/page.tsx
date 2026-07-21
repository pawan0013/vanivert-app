export const metadata = { title: 'Politique de confidentialite - Vanivert' }
const INK='#0C0E1A',BLUE='#2563EB',BG='#FFFFFF',BDR='rgba(12,14,26,0.07)',MUTED='rgba(12,14,26,0.52)',SUBTLE='rgba(12,14,26,0.32)'
function Logo() {
  const s=28,cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.16
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill='none'><circle cx={cx} cy={cy} r={R} stroke='#2563EB' strokeWidth={1} fill='none' strokeOpacity='0.4'/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill='#2563EB' opacity='0.65'/>)}<circle cx={cx} cy={cy} r={cr} fill='#2563EB'/></svg>)
}
function Section({title,children}:{title:string;children:React.ReactNode}) {
  return (<div style={{marginBottom:36}}><h2 style={{fontSize:20,fontWeight:700,color:INK,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${BDR}`}}>{title}</h2><div style={{fontSize:14,color:MUTED,lineHeight:1.75}}>{children}</div></div>)
}
export default function Confidentialite() {
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
          <h1 style={{fontFamily:'Georgia,serif',fontWeight:700,fontSize:44,color:INK,letterSpacing:'-0.03em'}}>Politique de confidentialite</h1>
        </div>
        <Section title="Responsable du traitement">
          <p>Vanivert, represente par Adithya Latchoumanassamy.</p>
          <p>Adresse : 1 Clos des Sylthes, 95800 Cergy, France</p>
          <p>Email : <a href="mailto:privacy@vanivert.eu" style={{color:BLUE}}>privacy@vanivert.eu</a></p>
        </Section>
        <Section title="Donnees collectees">
          <p>Nous collectons uniquement les donnees que vous nous communiquez via le formulaire de contact : nom, email, nom de l&apos;agence, nombre d&apos;agents, message optionnel.</p>
          <p style={{marginTop:8}}>Ces donnees sont utilisees exclusivement pour repondre a votre demande de demonstration.</p>
        </Section>
        <Section title="Hebergement et securite">
          <p>Toutes les donnees sont hebergees en Union Europeenne sur les serveurs Supabase (Dublin, Irlande). Aucune donnee n&apos;est transmise hors UE ni a des tiers a des fins commerciales.</p>
        </Section>
        <Section title="Vos droits">
          <p>Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification, de suppression et de portabilite de vos donnees. Pour exercer ces droits, contactez : <a href="mailto:privacy@vanivert.eu" style={{color:BLUE}}>privacy@vanivert.eu</a></p>
        </Section>
        <Section title="Cookies">
          <p>Ce site utilise uniquement des cookies fonctionnels (preferences utilisateur, session d&apos;administration). Aucun cookie publicitaire ou de tracking n&apos;est utilise.</p>
        </Section>
        <Section title="Duree de conservation">
          <p>Les donnees de contact sont conservees 3 ans a compter du dernier contact. Vous pouvez demander leur suppression a tout moment.</p>
        </Section>
        <div style={{marginTop:48,padding:'20px 24px',borderRadius:14,background:'#F8F9FF',border:`1px solid ${BLUE}15`}}>
          <p style={{fontSize:12,color:SUBTLE}}>Derniere mise a jour : juillet 2026</p>
        </div>
      </main>
      <footer style={{borderTop:`1px solid ${BDR}`,padding:'24px 32px',display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10}}>
        <span style={{fontSize:12,color:SUBTLE}}>2026 Vanivert - SIRET 93429900900019</span>
        <div style={{display:'flex',gap:20}}>
          {[['Mentions legales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Accueil','/']].map(([l,h])=>(<a key={l} href={h} style={{fontSize:12,color:SUBTLE,textDecoration:'none'}}>{l}</a>))}
        </div>
      </footer>
    </div>
  )
}
