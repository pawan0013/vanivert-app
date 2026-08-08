import React from 'react'

export const metadata = { title: "Politique de confidentialité · Vanivert" }

const LIME='#84CC16'; const WHITE='#FFFFFF'; const MUTED='#94A3B8'; const SUBTLE='#64748B'
const BG='#020617'; const BDR='rgba(100,200,200,0.12)'
const FH="'Plus Jakarta Sans',system-ui,sans-serif"; const FB="'Inter',system-ui,sans-serif"

function Logo({ s=30 }: { s?:number }) {
  const cx=s/2,cy=s/2,R=s*0.38,nr=s*0.06,cr=s*0.15
  const pts=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}})
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><circle cx={cx} cy={cy} r={R} stroke={LIME} strokeWidth={1} fill="none" strokeOpacity="0.5"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={nr} fill={LIME} opacity={i%2===0?"0.9":"0.5"}/>)}<circle cx={cx} cy={cy} r={cr} fill={LIME}/></svg>)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{marginBottom:36}}>
      <h2 style={{fontSize:18,fontWeight:700,color:WHITE,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${BDR}`,letterSpacing:'-0.01em',fontFamily:FH}}>{title}</h2>
      <div style={{fontSize:14,color:MUTED,lineHeight:1.8,fontFamily:FB}}>{children}</div>
    </div>
  )
}

export default function Confidentialite() {
  return (
    <div style={{minHeight:'100dvh',background:BG,fontFamily:FB,color:WHITE}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:${BG}}`}</style>
      <nav style={{padding:'16px 32px',borderBottom:`1px solid ${BDR}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(2,6,23,0.95)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
          <Logo s={28}/><span style={{fontFamily:FH,fontWeight:700,fontSize:17,color:WHITE,letterSpacing:'-0.02em'}}>Vanivert</span>
        </a>
        <a href="/" style={{fontSize:13,color:MUTED,textDecoration:'none',fontFamily:FB}}>← Retour au site</a>
      </nav>
      <main style={{maxWidth:760,margin:'0 auto',padding:'64px 32px 80px'}}>
        <div style={{marginBottom:48}}>
          <div style={{fontSize:10,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12,fontFamily:FB}}>Document légal</div>
          <h1 style={{fontWeight:700,fontSize:'clamp(32px,5vw,48px)',color:WHITE,letterSpacing:'-0.03em',lineHeight:1.1,fontFamily:FH}}>Politique de confidentialité</h1>
        </div>
        <Section title="Responsable du traitement">
          <p>Vanivert, représenté par Adithya Latchoumanassamy.</p>
          <p>Adresse : 1 Clos des Sylthes, 95800 Cergy, France</p>
          <p>Email : <a href="mailto:privacy@vanivert.eu" style={{color:LIME}}>privacy@vanivert.eu</a></p>
        </Section>
        <Section title="Données collectées">
          <p>Nous collectons uniquement les données que vous nous communiquez via le formulaire de contact : nom, email, nom de l&apos;agence, nombre d&apos;agents, message optionnel.</p>
          <p style={{marginTop:8}}>Ces données sont utilisées exclusivement pour répondre à votre demande de démonstration.</p>
        </Section>
        <Section title="Hébergement et sécurité">
          <p>Toutes les données sont hébergées en Union Européenne sur les serveurs Supabase (Dublin, Irlande). Aucune donnée n&apos;est transmise hors UE ni à des tiers à des fins commerciales.</p>
        </Section>
        <Section title="Vos droits">
          <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez : <a href="mailto:privacy@vanivert.eu" style={{color:LIME}}>privacy@vanivert.eu</a></p>
        </Section>
        <Section title="Cookies">
          <p>Ce site utilise uniquement des cookies fonctionnels (préférences utilisateur, session d&apos;administration). Aucun cookie publicitaire ou de tracking n&apos;est utilisé.</p>
        </Section>
        <Section title="Durée de conservation">
          <p>Les données de contact sont conservées 3 ans à compter du dernier contact. Vous pouvez demander leur suppression à tout moment.</p>
        </Section>
        <div style={{marginTop:48,padding:'20px 24px',borderRadius:14,background:'rgba(132,204,22,0.06)',border:'1px solid rgba(132,204,22,0.18)'}}>
          <p style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>Dernière mise à jour : juillet 2026</p>
        </div>
      </main>
      <footer style={{borderTop:`1px solid ${BDR}`,padding:'24px 32px',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <span style={{fontSize:12,color:SUBTLE,fontFamily:FB}}>© 2026 Vanivert · SIRET 93429900900019</span>
        <div style={{display:'flex',gap:20}}>
          {[['Mentions légales','/legal/mentions-legales'],['CGV','/legal/cgv'],['Accueil','/']].map(([l,h])=>(<a key={l} href={h} style={{fontSize:12,color:SUBTLE,textDecoration:'none',fontFamily:FB}}>{l}</a>))}
        </div>
      </footer>
    </div>
  )
}
