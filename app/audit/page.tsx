'use client'
import { useState } from 'react'

const BG = '#FAFAF8', BG2 = '#F3F2EE', CARD = '#FFFFFF', INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)', VI = '#6366F1', GR = '#10B981', EM = '#F59E0B'
const MUTED = 'rgba(13,13,15,0.50)', SUBTLE = 'rgba(13,13,15,0.32)'

const SEPT1 = new Date('2026-09-01T00:00:00+02:00').getTime()
function daysLeft() { return Math.max(0, Math.floor((SEPT1 - Date.now()) / 86400000)) }

function VLogo() {
  return <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill={VI}/><path d="M9 16.5L14 21.5L23 10.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 21.5C11.5 19 9.5 15.5 9.5 11.5C9.5 9.8 9.9 8.4 10.5 7.5C11.8 9.2 13.2 10 14.8 10C13.8 11.6 13.5 13.5 14 15.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/></svg>
}

function Chk() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:3}}><path d="M5 13l4 4L19 7" stroke={GR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default function Audit() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const deliverables = [
    'Inventaire complet de vos factures entrantes et sortantes',
    'Controle SIRET fournisseur et verification TVA',
    'Verification de vos obligations e-facturation et e-reporting',
    'Controle de votre enrolement dans l\'annuaire centralise DGFiP',
    'Plan d\'action priorise en 3 etapes concretes',
    'Rapport PDF clair, sans jargon, remis en 72h',
    'Accompagnement a la mise en conformite inclus',
  ]

  const faq = [
    { q: 'Combien de temps prend l\'audit?', a: 'Un creneau de 30 minutes par visioconference, puis 48 a 72 heures pour recevoir le rapport complet. Vous recevez un WhatsApp a chaque etape.' },
    { q: 'Que faut-il preparer?', a: 'Rien de special. Votre SIRET, le nom de votre expert-comptable si vous en avez un, et une idee approximative du nombre de factures que vous recevez par mois. On s\'occupe du reste.' },
    { q: 'Mon comptable reste?', a: 'Absolument. On ne remplace pas votre expert-comptable, on lui facilite le travail. Il recevra des exports propres et passera moins de temps a trier vos documents.' },
    { q: 'Mes donnees restent-elles en Europe?', a: 'Oui. Tout l\'infrastructure Vanivert est hebergee en Union europeenne (Supabase Dublin, Hetzner Francfort). Vos donnees ne quittent jamais l\'UE.' },
    { q: 'Qu\'est-ce qui se passe apres l\'audit?', a: 'Vous recevez un rapport clair avec votre plan d\'action. Si vous souhaitez qu\'on s\'occupe de la mise en conformite complete, on vous propose un accompagnement sur mesure. Sans engagement lors de l\'audit.' },
  ]

  return (
    <div style={{minHeight:'100dvh',background:BG,fontFamily:'system-ui,-apple-system,sans-serif',color:INK}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}@media(max-width:768px){.audit-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Nav */}
      <nav style={{padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${BORDER}`,position:'sticky',top:0,background:'rgba(250,250,248,0.95)',backdropFilter:'blur(16px)',zIndex:100}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}><VLogo/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:17,color:INK}}>vanivert</span></a>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <a href="/blog" style={{fontSize:13,color:MUTED,textDecoration:'none',padding:'7px 14px',borderRadius:980,border:`1px solid ${BORDER}`}}>Blog</a>
          <a href="/demo" style={{fontSize:13,fontWeight:600,color:'#fff',textDecoration:'none',padding:'8px 18px',borderRadius:980,background:INK}}>Reserver une demo</a>
        </div>
      </nav>

      {/* Announcement */}
      <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,padding:'10px 32px',textAlign:'center',fontSize:13}}>
        <span style={{fontWeight:500}}>1er septembre 2026 - </span>
        <span style={{background:VI,color:'#fff',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:980,margin:'0 6px'}}>J-{daysLeft()}</span>
        <span> Les entreprises qui attendent aout seront dans l&apos;urgence. </span>
        <a href="#form" style={{color:VI,fontWeight:600,textDecoration:'none'}}>Reserver maintenant →</a>
      </div>

      {/* Hero */}
      <section style={{maxWidth:860,margin:'0 auto',padding:'72px 32px 56px',textAlign:'center'}}>
        <div style={{display:'inline-block',fontSize:11,fontWeight:600,color:GR,padding:'3px 12px',borderRadius:980,border:`1px solid ${GR}30`,background:`${GR}10`,marginBottom:20}}>Disponible maintenant</div>
        <h1 style={{fontFamily:'Georgia,serif',fontWeight:400,fontStyle:'italic',fontSize:'clamp(28px,4vw,48px)',color:INK,letterSpacing:'-0.025em',lineHeight:1.15,marginBottom:16}}>
          Un audit qui se termine par une mise en conformite, pas par un devis.
        </h1>
        <p style={{fontSize:16,color:MUTED,maxWidth:580,margin:'0 auto 32px',lineHeight:1.7}}>
          Nous auditons vos factures, vos obligations DGFiP et votre situation complete, puis nous vous remettons un plan d&apos;action en 72 heures. Vous gardez votre banque, votre caisse et votre comptable.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="#form" style={{padding:'13px 28px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:14,textDecoration:'none'}}>Demander mon audit</a>
          <a href="/calculateur" style={{padding:'12px 24px',borderRadius:980,border:`1px solid ${BORDER}`,color:INK,fontWeight:500,fontSize:14,textDecoration:'none'}}>Tester mon risque d&apos;abord →</a>
        </div>
        <p style={{fontSize:12,color:SUBTLE,marginTop:12,fontStyle:'italic'}}>Sans engagement. Reponse sous 24h ouvrees.</p>
      </section>

      {/* Capacity warning */}
      <div style={{maxWidth:700,margin:'0 auto 48px',padding:'0 32px'}}>
        <div style={{background:`${EM}10`,border:`1px solid ${EM}40`,borderRadius:14,padding:'16px 22px',textAlign:'center',fontSize:14}}>
          <span style={{fontWeight:600,color:'#92400E'}}>Capacite limitee: </span>
          <span style={{color:'#92400E'}}>nous accompagnons 12 entreprises par mois en Cotes-d&apos;Armor et Ille-et-Vilaine. Creneaux d&apos;aout disponibles - commencez maintenant pour etre conforme le 1er septembre.</span>
        </div>
      </div>

      {/* What's included */}
      <section style={{background:BG2,borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:'64px 32px'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <p style={{fontSize:11,color:SUBTLE,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:14,textAlign:'center'}}>Ce qui est inclus</p>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontStyle:'italic',fontSize:'clamp(22px,3vw,34px)',color:INK,textAlign:'center',marginBottom:40}}>Un audit complet, sans langue de bois.</h2>
          <div className="audit-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {deliverables.map(d => (
              <div key={d} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'14px 18px',background:CARD,borderRadius:12,border:`1px solid ${BORDER}`}}>
                <Chk/><span style={{fontSize:14,color:INK,lineHeight:1.5}}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{padding:'64px 32px',maxWidth:860,margin:'0 auto',textAlign:'center'}}>
        <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontStyle:'italic',fontSize:'clamp(20px,2.5vw,30px)',color:INK,marginBottom:40}}>Comment ca se passe</h2>
        <div style={{display:'flex',justifyContent:'center',gap:40,flexWrap:'wrap'}}>
          {[{n:'1',t:'Vous reservez un creneau de 30 min'},{n:'2',t:'Nous auditons votre situation complete'},{n:'3',t:'Rapport + plan d\'action en 72h'}].map((s,i) => (
            <div key={i} style={{maxWidth:200,textAlign:'center'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:INK,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:15,margin:'0 auto 12px'}}>{s.n}</div>
              <p style={{fontSize:14,color:INK,lineHeight:1.5}}>{s.t}</p>
            </div>
          ))}
        </div>
        <p style={{fontSize:13,color:SUBTLE,marginTop:28,fontStyle:'italic'}}>Delai typique: 72 heures. Vous recevez un WhatsApp a chaque etape.</p>
      </section>

      {/* FAQ */}
      <section style={{background:BG2,borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:'64px 32px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontStyle:'italic',fontSize:'clamp(20px,2.5vw,30px)',color:INK,textAlign:'center',marginBottom:36}}>Questions frequentes</h2>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {faq.map(f => (
              <div key={f.q} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:'18px 22px'}}>
                <p style={{fontWeight:600,fontSize:14,color:INK,marginBottom:8}}>{f.q}</p>
                <p style={{fontSize:14,color:MUTED,lineHeight:1.65}}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form" style={{padding:'72px 32px',maxWidth:640,margin:'0 auto'}}>
        <h2 style={{fontFamily:'Georgia,serif',fontWeight:400,fontStyle:'italic',fontSize:'clamp(22px,3vw,34px)',color:INK,textAlign:'center',marginBottom:8}}>Reserver mon audit</h2>
        <p style={{fontSize:14,color:MUTED,textAlign:'center',marginBottom:36}}>Reponse sous 24h ouvrees. Sans engagement.</p>
        {sent ? (
          <div style={{textAlign:'center',padding:'48px 32px',background:CARD,borderRadius:18,border:`1px solid ${BORDER}`}}>
            <div style={{width:48,height:48,borderRadius:'50%',background:`${GR}15`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={GR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{fontFamily:'Georgia,serif',fontSize:22,color:INK,marginBottom:8}}>C&apos;est note.</h3>
            <p style={{color:MUTED,fontSize:14,lineHeight:1.6}}>Vous recevrez une proposition de creneau sous 24h ouvrees. Si vous avez un creneau urgent, envoyez-nous un WhatsApp directement.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:18,padding:'36px 32px',display:'flex',flexDirection:'column',gap:16}}>
            {[{label:'Votre prenom *',key:'name',type:'text',placeholder:'Marie'},{label:'Email professionnel *',key:'email',type:'email',placeholder:'marie@monentreprise.fr'},{label:'Nom de l\'entreprise *',key:'company',type:'text',placeholder:'Boulangerie Martin'},{label:'Telephone',key:'phone',type:'tel',placeholder:'+33 6 XX XX XX XX'}].map(f => (
              <div key={f.key}>
                <label style={{fontSize:13,fontWeight:500,color:INK,display:'block',marginBottom:6}}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={e => setForm({...form,[f.key]:e.target.value})} required={f.label.includes('*')} style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1px solid ${BORDER}`,fontSize:14,color:INK,background:BG,outline:'none',fontFamily:'inherit'}}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:13,fontWeight:500,color:INK,display:'block',marginBottom:6}}>Votre situation (optionnel)</label>
              <textarea rows={3} placeholder="Ex: On recoit ~50 factures papier par mois, pas de logiciel de compta..." value={form.message} onChange={e => setForm({...form,message:e.target.value})} style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1px solid ${BORDER}`,fontSize:14,color:INK,background:BG,outline:'none',resize:'vertical',fontFamily:'inherit'}}/>
            </div>
            <button type="submit" style={{padding:'13px 28px',borderRadius:980,background:INK,color:'#fff',fontWeight:600,fontSize:14,border:'none',cursor:'pointer',marginTop:4}}>Demander mon audit</button>
            <p style={{fontSize:12,color:SUBTLE,textAlign:'center',fontStyle:'italic'}}>Sans engagement. Le risque, c&apos;est de ne pas savoir.</p>
            <p style={{fontSize:11,color:SUBTLE,textAlign:'center',marginTop:4}}>Audit concu par des ingenieurs formes a l&apos;EDHEC et chez BP (British Petroleum).</p>
          </form>
        )}
      </section>

      <footer style={{borderTop:`1px solid ${BORDER}`,padding:'24px 32px',textAlign:'center',background:BG2}}>
        <div style={{display:'flex',gap:20,justifyContent:'center',flexWrap:'wrap',fontSize:13,color:MUTED}}>
          <a href="/" style={{color:MUTED,textDecoration:'none'}}>Accueil</a>
          <a href="/blog" style={{color:MUTED,textDecoration:'none'}}>Blog</a>
          <a href="/calculateur" style={{color:MUTED,textDecoration:'none'}}>Calculateur</a>
          <a href="/legal/mentions-legales" style={{color:MUTED,textDecoration:'none'}}>Mentions legales</a>
        </div>
        <p style={{fontSize:12,color:SUBTLE,marginTop:12}}>© 2026 Vanivert. Lannion, Bretagne. Hebergement 100% UE.</p>
      </footer>
    </div>
  )
}
