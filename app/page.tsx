'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, type Variants } from 'framer-motion'

const FluidBG = dynamic(() => import('./FluidBackground'), { ssr: false })

/* ── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const C = {
  bg: '#F6F7F9', w: '#FFFFFF', ink: '#0B0C0E', g: '#64748B',
  lt: 'rgba(15,23,42,0.08)', sub: '#F1F5F9',
  b: '#2563EB', b2: '#1D4ED8', blo: 'rgba(37,99,235,0.08)',
  grn: '#16A34A', red: '#DC2626', gold: '#D97706',
}
/* DM Sans - not banned, premium grotesque */
const FONT = "'DM Sans', 'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', 'Fira Code', monospace"

const EP: [number,number,number,number] = [0.32,0.72,0,1]
const ES: [number,number,number,number] = [0.16,1,0.3,1]

const vUp: Variants = { hidden:{opacity:0,y:28,filter:'blur(6px)'}, visible:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:0.72,ease:ES}} }
const vS: Variants = { hidden:{}, visible:{transition:{staggerChildren:0.09}} }
const VP = { once:true, margin:'-60px' } as const

/* ── TRANSLATIONS ────────────────────────────────────────────────────────── */
const T = {
  fr: {
    nav: ['Smart CFO','Conformite','Reception vocale','Tarifs','Blog','Contact'],
    navHref: ['#cfo','#conformite','#voice','#tarifs','/blog','#contact'],
    tag: 'Infrastructure financiere souveraine',
    h1a: 'Le 1er septembre 2026,',
    h1b: 'la facture papier',
    h1c: 'disparait.',
    sub: "L'infrastructure financiere des grandes entreprises, accessible aux PME francaises. A partir de 19 euros/mois.",
    cta1: 'Calculer mon risque',
    cta2: 'Decouvrir',
    login: 'Connexion',
    dashboard: 'Dashboard',
    trial: 'Essai gratuit 30 jours',
    lang: 'EN',
    daysLeft: 'Jours avant le 1er septembre',
    statsQ: '"54 % des entrepreneurs francais n\'ont pas de logiciel de facturation. 50 % ne seront pas prets en septembre 2026."',
    statsS: 'OpinionWay / Tiime, mars 2026',
    s1: '15 000 EUR', s1l: 'Amende annuelle maximale',
    s2l: 'Jours avant l\'obligation de reception',
    s3: '50 EUR', s3l: 'Par facture non conforme emise',
    cfoTag: 'Smart CFO',
    cfoH: 'Votre directeur financier. Disponible 24h/24.',
    cfoP: 'Connecte a vos outils. Analyse vos flux. Predit vos besoins de tresorerie avant que vous ne les ressentiez.',
    cfoFeats: ['Tresorerie temps reel, connectee a votre banque','Predictions cash-flow sur 30, 60 et 90 jours','Alertes automatiques (retards, seuils, anomalies)','Compatible Pennylane, Tiime, Sage, Qonto, Bridge API'],
    cfoPrice: 'A partir de 29 EUR/mois',
    compTag: 'Conformite e-facturation',
    compH: 'Septembre 2026. Votre entreprise est-elle prete ?',
    compP: 'Vanivert connecte votre ERP a une plateforme agreee DGFiP. Vous ne changez rien a vos habitudes. On gere tout le pipeline technique.',
    compCta: 'Verifier ma conformite',
    voiceTag: 'Reception vocale professionnelle',
    voiceH: 'Ne perdez plus un seul client.',
    voiceP: 'Standard telephonique en francais. Repond 24h/24. Prend les rendez-vous. Zero donnee hors Europe.',
    voiceCta: 'Ecouter en direct',
    voicePrice: 'A partir de 19 EUR/mois + 0,08 EUR/min',
    pricingTag: 'Tarifs transparents',
    pricingH: 'Des prix qui respectent votre budget.',
    monthly: 'Mensuel', annual: 'Annuel',
    popular: 'Populaire', month: '/mois HT', start: 'Commencer',
    noCommit: 'Sans engagement. Resiliable a tout moment.',
    intTag: '18 integrations natives',
    intH: 'Fonctionne avec votre ecosysteme complet.',
    contactTag: 'Contact',
    contactH: 'Parlons de votre projet.',
    contactP: 'Un appel de 15 minutes suffit. Sans engagement. Sans pression commerciale.',
    sendMsg: 'Envoyer',
    ctaH: 'Commencez gratuitement.',
    ctaP: 'Verifiez votre conformite en 2 minutes. Aucune carte bancaire requise.',
    ctaBtn: 'Calculer mon risque',
    sovQ: '"Vos donnees ne quittent jamais l\'Europe."',
    firstName: 'Prenom', lastName: 'Nom', email: 'Email professionnel',
    company: 'Entreprise', service: 'Service', message: 'Message',
    rgpd: "J'accepte la politique de confidentialite",
    choose: 'Choisir...',
    services: ['Reception vocale','Smart CFO','Conformite e-facturation','Pack complet'],
    inCall: 'Appel entrant',
  },
  en: {
    nav: ['Smart CFO','Compliance','Voice Reception','Pricing','Blog','Contact'],
    navHref: ['#cfo','#conformite','#voice','#tarifs','/blog','#contact'],
    tag: 'Sovereign AI financial infrastructure',
    h1a: 'September 1st, 2026,',
    h1b: 'paper invoices',
    h1c: 'disappear.',
    sub: 'Enterprise-grade financial infrastructure, accessible to French SMEs. From EUR 19/month.',
    cta1: 'Calculate my risk',
    cta2: 'Discover',
    login: 'Login',
    dashboard: 'Dashboard',
    trial: '30-day free trial',
    lang: 'FR',
    daysLeft: 'Days until September 1st',
    statsQ: '"54% of French entrepreneurs have no invoicing software. 50% won\'t be ready for September 2026."',
    statsS: 'OpinionWay / Tiime, March 2026',
    s1: 'EUR 15,000', s1l: 'Maximum annual fine',
    s2l: 'Days until mandatory reception',
    s3: 'EUR 50', s3l: 'Per non-compliant invoice sent',
    cfoTag: 'Smart CFO',
    cfoH: 'Your CFO. Always available.',
    cfoP: 'Connected to your existing tools. Analyses your cash flows. Predicts your treasury needs.',
    cfoFeats: ['Real-time treasury, connected to your bank','30, 60, 90-day cash-flow predictions','Automatic alerts (delays, thresholds, anomalies)','Compatible with Pennylane, Tiime, Sage, Qonto, Bridge API'],
    cfoPrice: 'From EUR 29/month',
    compTag: 'E-invoicing compliance',
    compH: 'September 2026. Is your business ready?',
    compP: 'Vanivert connects your ERP to a DGFiP-certified platform. You change nothing. We handle the entire technical pipeline.',
    compCta: 'Check my compliance',
    voiceTag: 'Professional voice reception',
    voiceH: 'Never miss another client.',
    voiceP: 'Professional phone receptionist in French. Answers 24/7. Books appointments. Zero data outside Europe.',
    voiceCta: 'Listen live',
    voicePrice: 'From EUR 19/month + EUR 0.08/min',
    pricingTag: 'Transparent pricing',
    pricingH: 'Pricing that respects your budget.',
    monthly: 'Monthly', annual: 'Annual',
    popular: 'Popular', month: '/mo ex.VAT', start: 'Get started',
    noCommit: 'No commitment. Cancel anytime.',
    intTag: '18 native integrations',
    intH: 'Works with your complete ecosystem.',
    contactTag: 'Contact',
    contactH: "Let's talk about your project.",
    contactP: 'A 15-minute call is enough. No commitment. No sales pressure.',
    sendMsg: 'Send message',
    ctaH: 'Start for free.',
    ctaP: 'Check your compliance in 2 minutes. No credit card required.',
    ctaBtn: 'Calculate my risk',
    sovQ: '"Your data never leaves Europe."',
    firstName: 'First name', lastName: 'Last name', email: 'Professional email',
    company: 'Company', service: 'Service', message: 'Message',
    rgpd: 'I accept the privacy policy',
    choose: 'Choose...',
    services: ['Voice reception','Smart CFO','E-invoicing compliance','Full package'],
    inCall: 'Incoming call',
  }
}

/* ── PLANS ─────────────────────────────────────────────────────────────── */
const PLANS = [
  { name:'Starter', m:19, a:16, pop:false,
    feats:{ fr:['Reception vocale 24h/24','200 min incluses/mois','Doctolib ou Google Calendar','Tableau de bord basique','Support email','Essai gratuit 30 jours'],
            en:['Voice reception 24/7','200 min included/month','Doctolib or Google Calendar','Basic dashboard','Email support','30-day free trial'] } },
  { name:'Business', m:29, a:24, pop:true,
    feats:{ fr:['Tout Starter, plus :','Smart CFO (tresorerie temps reel)','Conformite e-facturation (PA agreee)','500 min vocales/mois','Connexion bancaire (Qonto, BNP, CA)','Alertes et relances automatiques'],
            en:['Everything Starter, plus:','Smart CFO (real-time treasury)','E-invoicing compliance (certified PA)','500 voice min/month','Bank connection (Qonto, BNP, CA)','Automatic alerts and follow-ups'] } },
  { name:'Premium', m:99, a:82, pop:false,
    feats:{ fr:['Tout Business, plus :','BD automatise (30 leads/mois)','ERP complet (Sage, Cegid)','1 500 min vocales/mois','Document Intelligence (Pxtly)','Onboarding dedie'],
            en:['Everything Business, plus:','Automated BD (30 leads/month)','Full ERP (Sage, Cegid)','1,500 voice min/month','Document Intelligence (Pxtly)','Dedicated onboarding'] } },
]

/* ── INTEGRATION LOGOS (SVG inline) ─────────────────────────────────────── */
const INTEGRATIONS = [
  { name:'Pennylane', color:'#0052CC', bg:'#EEF5FF', letter:'P', desc:'Comptabilite' },
  { name:'Qonto', color:'#1A237E', bg:'#E8EAF6', letter:'Q', desc:'Banque pro' },
  { name:'Tiime', color:'#EA580C', bg:'#FFF7ED', letter:'T', desc:'Facturation' },
  { name:'Sage', color:'#16A34A', bg:'#F0FDF4', letter:'S', desc:'ERP' },
  { name:'Stripe', color:'#6366F1', bg:'#EEF2FF', letter:'S', desc:'Paiements' },
  { name:'GoCardless', color:'#0D9488', bg:'#F0FDFA', letter:'G', desc:'Prelevements' },
  { name:'Doctolib', color:'#0369A1', bg:'#F0F9FF', letter:'D', desc:'Agenda medical' },
  { name:'Google Cal', color:'#DC2626', bg:'#FEF2F2', letter:'G', desc:'Agenda' },
  { name:'Microsoft', color:'#0EA5E9', bg:'#F0F9FF', letter:'M', desc:'Azure / Teams' },
  { name:'Cegid', color:'#EA580C', bg:'#FFF7ED', letter:'C', desc:'ERP France' },
  { name:'Docoon', color:'#7C3AED', bg:'#F5F3FF', letter:'D', desc:'PA DGFiP' },
  { name:'Chorus Pro', color:'#15803D', bg:'#F0FDF4', letter:'C', desc:'Factures B2G' },
  { name:'Bridge API', color:'#0284C7', bg:'#F0F9FF', letter:'B', desc:'PSD2 bancaire' },
  { name:'n8n', color:'#EA580C', bg:'#FFF7ED', letter:'n', desc:'Workflows' },
  { name:'Supabase', color:'#16A34A', bg:'#F0FDF4', letter:'S', desc:'Base de donnees' },
  { name:'Hetzner', color:'#DC2626', bg:'#FEF2F2', letter:'H', desc:'Cloud EU' },
  { name:'Mistral AI', color:'#0B0C0E', bg:'#F1F5F9', letter:'M', desc:'LLM souverain' },
  { name:'Twilio', color:'#DC2626', bg:'#FEF2F2', letter:'T', desc:'Telephonie' },
]

/* ── COUNTDOWN ──────────────────────────────────────────────────────────── */
function CD() {
  const [d,setD]=useState(65)
  useEffect(()=>{
    const f=()=>setD(Math.max(0,Math.ceil((new Date('2026-09-01T00:00:00+02:00').getTime()-Date.now())/86400000)))
    f(); const id=setInterval(f,60000); return ()=>clearInterval(id)
  },[])
  return <>{d}</>
}

/* ── LOGO SLIDER ─────────────────────────────────────────────────────────── */
function LogoSlider() {
  // Extended integrations with SVG-ready brand colors
  const LOGOS = [
    {name:'Qonto',bg:'#E8EAF6',fg:'#1A237E',letter:'Q',desc:'Banque'},
    {name:'Bridge API',bg:'#E3F2FD',fg:'#0277BD',letter:'B',desc:'PSD2'},
    {name:'Pennylane',bg:'#EEF5FF',fg:'#0052CC',letter:'P',desc:'Compta'},
    {name:'Docoon PA',bg:'#F3E5F5',fg:'#6A1B9A',letter:'D',desc:'DGFiP'},
    {name:'Chorus Pro',bg:'#E8F5E9',fg:'#2E7D32',letter:'C',desc:'B2G'},
    {name:'Doctolib',bg:'#E3F2FD',fg:'#0277BD',letter:'D',desc:'Agenda'},
    {name:'Sage 100',bg:'#E8F5E9',fg:'#388E3C',letter:'S',desc:'ERP'},
    {name:'Microsoft',bg:'#F3F4F6',fg:'#0078D4',svgType:'microsoft',desc:'OAuth'},
    {name:'Google',bg:'#FFF9E6',fg:'#EA4335',svgType:'google',desc:'OAuth'},
    {name:'Stripe',bg:'#EDE7F6',fg:'#635BFF',letter:'S',desc:'Paiement'},
    {name:'GoCardless',bg:'#E0F2F1',fg:'#00695C',letter:'G',desc:'SEPA'},
    {name:'n8n',bg:'#FFF3E0',fg:'#E65100',letter:'n',desc:'Workflow'},
    {name:'Salesforce',bg:'#E1F5FE',fg:'#00A1E0',letter:'S',desc:'CRM'},
    {name:'Cegid XRP',bg:'#FFF3E0',fg:'#EF6C00',letter:'C',desc:'ERP'},
  ]
  const doubled = [...LOGOS,...LOGOS,...LOGOS]
  return (
    <div style={{overflow:'hidden',position:'relative',padding:'8px 0'}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,
        background:'linear-gradient(to right,#F6F7F9,transparent)',zIndex:2,pointerEvents:'none'}}/>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,
        background:'linear-gradient(to left,#F6F7F9,transparent)',zIndex:2,pointerEvents:'none'}}/>
      <div style={{display:'flex',gap:12,animation:'slide 35s linear infinite',width:'max-content'}}>
        {doubled.map((int,i)=>(
          <div key={i} style={{display:'flex',flexDirection:'column' as const,alignItems:'center',
            gap:5,padding:'12px 14px',borderRadius:14,background:C.w,
            border:`1px solid ${C.lt}`,minWidth:82,flexShrink:0,
            boxShadow:'0 1px 6px rgba(15,23,42,0.05)',cursor:'default',
            transition:'all 0.25s ease',userSelect:'none' as const}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(15,23,42,0.10)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 1px 6px rgba(15,23,42,0.05)'}}>
            <div style={{width:38,height:38,borderRadius:9,background:int.bg,
              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {(int as {svgType?:string}).svgType==='microsoft'?(
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                  <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
                  <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
                  <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
                  <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
                </svg>
              ):(int as {svgType?:string}).svgType==='google'?(
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              ):(
                <span style={{fontWeight:900,fontSize:15,color:int.fg,fontFamily:'Inter,sans-serif'}}>{(int as {letter?:string}).letter}</span>
              )}
            </div>
            <div style={{fontSize:10,fontWeight:700,color:C.ink,textAlign:'center' as const,lineHeight:1.2,fontFamily:'Inter,sans-serif'}}>{int.name}</div>
            <div style={{fontSize:9,color:C.g,fontFamily:'monospace'}}>{int.desc}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes slide{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
    </div>
  )
}

/* ── MICROSOFT SVG LOGO ──────────────────────────────────────────────────── */
function MicrosoftLogo({size=18}:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
      <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
    </svg>
  )
}

/* ── GOOGLE SVG LOGO ─────────────────────────────────────────────────────── */
function GoogleLogo({size=18}:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/* ── DASHBOARD MOCKUP ────────────────────────────────────────────────────── */
function DashMockup() {
  return (
    <div style={{background:'rgba(255,255,255,0.72)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:24,overflow:'hidden',boxShadow:'0 32px 80px rgba(15,23,42,0.10)'}}>
      <div style={{display:'flex',alignItems:'center',gap:6,padding:'10px 16px',background:'rgba(255,255,255,0.5)',borderBottom:'1px solid rgba(15,23,42,0.06)'}}>
        {['#FF5F56','#FFBD2E','#27C93F'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
        <span style={{marginLeft:8,fontFamily:MONO,fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:C.g}}>Smart CFO -- Vanivert</span>
      </div>
      <div style={{padding:18,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[{l:'Conformite DGFiP',v:'100%',c:C.grn,bg:'#F0FDF4'},{l:'Score Tresorerie',v:'A+',c:C.b,bg:'#EFF6FF'},{l:'Factures payees',v:'94%',c:C.ink,bg:C.sub},{l:'Prevision J+30',v:'+8 200 EUR',c:C.grn,bg:'#F0FDF4'}].map(m=>(
          <div key={m.l} style={{borderRadius:12,padding:'14px 12px',background:m.bg}}>
            <div style={{fontSize:9,fontFamily:MONO,textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:4}}>{m.l}</div>
            <div style={{fontSize:18,fontWeight:800,color:m.c,fontFamily:FONT,letterSpacing:'-0.04em'}}>{m.v}</div>
          </div>
        ))}
        <div style={{gridColumn:'span 2',borderRadius:12,background:C.sub,padding:'12px 14px'}}>
          <div style={{fontSize:9,fontFamily:MONO,textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:8}}>Tresorerie temps reel</div>
          <svg viewBox="0 0 300 52" style={{width:'100%',height:40}} fill="none">
            <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.b} stopOpacity="0.16"/><stop offset="100%" stopColor={C.b} stopOpacity="0"/></linearGradient></defs>
            <path d="M0 40 C50 36 80 28 110 20 C140 14 160 18 185 10 C205 4 230 2 260 2 C278 2 290 3 300 2" stroke={C.b} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M0 40 C50 36 80 28 110 20 C140 14 160 18 185 10 C205 4 230 2 260 2 C278 2 290 3 300 2 L300 52 L0 52Z" fill="url(#cg)"/>
            <circle cx="185" cy="10" r="4" fill={C.b}/>
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── NAV ────────────────────────────────────────────────────────────────── */
function Nav({t,lang,setLang}:{t:typeof T.fr;lang:'fr'|'en';setLang:(l:'fr'|'en')=>void}) {
  const [sc,setSc]=useState(false)
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const h=()=>setSc(window.scrollY>56)
    window.addEventListener('scroll',h,{passive:true})
    return ()=>window.removeEventListener('scroll',h)
  },[])
  const pill:React.CSSProperties={
    maxWidth:1240,margin:'0 auto',
    ...(sc?{background:'rgba(246,247,249,0.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',border:'1px solid rgba(15,23,42,0.08)',borderRadius:980,padding:'10px 24px',boxShadow:'0 4px 32px rgba(15,23,42,0.08)'}:{padding:'0 40px'}),
    display:'flex',alignItems:'center',justifyContent:'space-between',transition:`all 0.5s cubic-bezier(${EP.join(',')})`
  }
  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:sc?'10px 16px':'18px 0',transition:`all 0.5s cubic-bezier(${EP.join(',')})`}}>
        <div style={pill}>
          <a href="/" style={{fontWeight:800,fontSize:19,letterSpacing:'-0.05em',color:C.ink,textDecoration:'none',display:'flex',alignItems:'center',gap:8,fontFamily:FONT}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:C.b,boxShadow:`0 0 10px ${C.b}88`}}/>
            vanivert
          </a>
          <ul style={{display:'flex',gap:20,listStyle:'none',alignItems:'center',margin:0,padding:0}} className="nav-links">
            {t.nav.map((l,i)=>(
              <li key={l}><a href={t.navHref[i]}
                style={{fontSize:13,color:C.g,textDecoration:'none',fontWeight:500,fontFamily:FONT,transition:'color 0.2s',letterSpacing:'-0.01em'}}
                onMouseEnter={e=>(e.currentTarget.style.color=C.ink)}
                onMouseLeave={e=>(e.currentTarget.style.color=C.g)}>{l}</a></li>
            ))}
          </ul>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={()=>setLang(lang==='fr'?'en':'fr')}
              style={{background:'transparent',border:`1px solid ${C.lt}`,borderRadius:980,padding:'5px 12px',fontSize:11,fontWeight:700,fontFamily:MONO,letterSpacing:'0.08em',cursor:'pointer',color:C.g,transition:'all 0.2s'}}>{t.lang}</button>
            <a href="/dashboard" style={{fontSize:13,fontWeight:600,color:C.g,textDecoration:'none',padding:'7px 14px',borderRadius:980,transition:'all 0.2s',fontFamily:FONT}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=C.ink}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=C.g}}>{t.dashboard}</a>
            <a href="/login" style={{fontSize:13,fontWeight:600,color:C.g,textDecoration:'none',padding:'7px 14px',borderRadius:980,transition:'all 0.2s',fontFamily:FONT,display:'flex',alignItems:'center',gap:6}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=C.ink}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=C.g}}>{t.login}</a>
            <a href="/demo" style={{background:C.b,color:'#fff',fontSize:13,fontWeight:700,borderRadius:980,padding:'9px 20px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.b2;(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(37,99,235,0.3)';(e.currentTarget as HTMLElement).style.transform='translateY(-1px)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.b;(e.currentTarget as HTMLElement).style.boxShadow='none';(e.currentTarget as HTMLElement).style.transform='none'}}>{t.trial}</a>
            <button className="nav-burger" onClick={()=>setOpen(v=>!v)} style={{background:'none',border:'none',cursor:'pointer',padding:4,display:'none'}}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill={C.ink}><rect width="20" height="1.5" rx="1"/><rect y="6" width="20" height="1.5" rx="1"/><rect y="12" width="20" height="1.5" rx="1"/></svg>
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:C.w,zIndex:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:28}}>
            <button onClick={()=>setOpen(false)} style={{position:'absolute',top:24,right:24,fontSize:28,color:C.g,background:'none',border:'none',cursor:'pointer',fontFamily:FONT}}>x</button>
            {t.nav.map((l,i)=>(
              <motion.a key={l} href={t.navHref[i]} onClick={()=>setOpen(false)}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                style={{fontSize:22,fontWeight:800,color:C.ink,textDecoration:'none',letterSpacing:'-0.04em',fontFamily:FONT}}>{l}</motion.a>
            ))}
            <a href="/demo" style={{background:C.b,color:'#fff',fontWeight:700,borderRadius:980,padding:'14px 32px',textDecoration:'none',fontSize:16,fontFamily:FONT,marginTop:8}}>{t.trial}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [lang,setLang]=useState<'fr'|'en'>('fr')
  const [annual,setAnnual]=useState(false)
  const {scrollYProgress}=useScroll()
  const scaleX=useSpring(scrollYProgress,{stiffness:400,damping:90})
  const t=T[lang]
  return (
    <div style={{background:C.bg,color:C.ink,fontFamily:FONT,position:'relative'}}>
      <motion.div style={{position:'fixed',top:0,left:0,right:0,height:2,background:C.b,zIndex:500,scaleX,transformOrigin:'left'}}/>
      <FluidBG/>
      <Nav t={t} lang={lang} setLang={setLang}/>

      {/* ── HERO ── */}
      <section style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',padding:'120px 40px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 72% 60% at 50% 44%,rgba(246,247,249,0.92) 20%,rgba(246,247,249,0.52) 65%,transparent 100%)',pointerEvents:'none'}}/>
        {/* Floating invoice card */}
        <motion.div initial={{opacity:0,y:20,rotate:-2}} animate={{opacity:1,y:[0,-12,0],rotate:[-1,1.5,-1]}}
          transition={{opacity:{duration:0.8,delay:1.2},y:{duration:5,repeat:Infinity,ease:'easeInOut' as const},rotate:{duration:6,repeat:Infinity,ease:'easeInOut' as const}}}
          style={{position:'absolute',top:'14%',right:'7%',width:196,zIndex:2,background:'rgba(255,255,255,0.80)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:16,padding:18,boxShadow:'0 20px 56px rgba(15,23,42,0.10)'}} className="hero-float">
          <div style={{fontSize:9,fontFamily:MONO,color:C.g,letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:12}}>Facture #2026-0847</div>
          {[['Client','PROLANN SAS'],['Montant HT','4 200 EUR'],['TVA 20%','840 EUR'],['Total TTC','5 040 EUR']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'5px 0',borderBottom:'1px solid rgba(15,23,42,0.06)'}}>
              <span style={{color:C.g,fontFamily:FONT}}>{k}</span>
              <span style={{fontWeight:700,color:C.ink,fontFamily:FONT}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:10,display:'inline-flex',alignItems:'center',gap:5,background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:7,padding:'4px 9px',fontSize:9,fontWeight:700,color:'#166534',fontFamily:FONT}}>
            Conforme DGFiP
          </div>
        </motion.div>
        {/* Floating stat */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:[0,-8,0]}}
          transition={{opacity:{duration:0.8,delay:1.7},y:{duration:6,delay:1,repeat:Infinity,ease:'easeInOut' as const}}}
          style={{position:'absolute',bottom:'22%',left:'6%',zIndex:2,background:'rgba(255,255,255,0.80)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:14,padding:'14px 20px',boxShadow:'0 12px 40px rgba(15,23,42,0.08)'}} className="hero-float">
          <div style={{fontSize:9,fontFamily:MONO,color:C.g,letterSpacing:'0.1em',textTransform:'uppercase' as const,marginBottom:4}}>Prevision J+30</div>
          <div style={{fontSize:20,fontWeight:800,color:C.grn,fontFamily:FONT,letterSpacing:'-0.04em'}}>+8 200 EUR</div>
        </motion.div>

        <motion.div style={{position:'relative',zIndex:3,textAlign:'center',maxWidth:820,width:'100%'}} initial="hidden" animate="visible" variants={vS}>
          <motion.span variants={vUp} style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,marginBottom:28,background:'rgba(255,255,255,0.70)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(15,23,42,0.08)',borderRadius:980,padding:'6px 16px'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:C.b,animation:'pulse 2s ease-in-out infinite'}}/>
            {t.tag}
          </motion.span>
          <motion.h1 variants={vUp} style={{fontFamily:FONT,fontWeight:800,lineHeight:1.04,letterSpacing:'-0.05em',fontSize:'clamp(40px,7vw,86px)',color:C.ink,marginBottom:22,marginTop:0}}>
            {t.h1a}<br/><span style={{color:C.b}}>{t.h1b}</span><br/>{t.h1c}
          </motion.h1>
          <motion.p variants={vUp} style={{fontSize:18,color:C.g,lineHeight:1.7,maxWidth:500,margin:'0 auto 40px',fontFamily:FONT,fontWeight:400}}>{t.sub}</motion.p>
          <motion.div variants={vUp} style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' as const}}>
            <a href="/calculateur" style={{background:C.b,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'15px 30px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.b2;(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 12px 32px rgba(37,99,235,0.28)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.b;(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
              {t.cta1}
            </a>
            <a href="#cfo" style={{fontWeight:600,fontSize:15,borderRadius:980,padding:'15px 30px',textDecoration:'none',fontFamily:FONT,color:C.ink,background:'rgba(255,255,255,0.80)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(15,23,42,0.08)',transition:'all 0.3s'}}>
              {t.cta2} &rarr;
            </a>
          </motion.div>
          <motion.div variants={vUp} style={{marginTop:48,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:MONO,fontSize:12,color:C.g}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:C.red,animation:'pulse 2s ease-in-out infinite'}}/>
            <CD/> {t.daysLeft}
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{background:C.w,padding:'80px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <motion.blockquote initial="hidden" whileInView="visible" viewport={VP} variants={vUp}
            style={{textAlign:'center',fontFamily:'Georgia, serif',fontStyle:'italic',fontSize:'clamp(18px,2.4vw,25px)',color:C.ink,maxWidth:680,margin:'0 auto 52px',lineHeight:1.48}}>
            {t.statsQ}
            <cite style={{display:'block',fontStyle:'normal',fontFamily:MONO,fontSize:11,color:C.g,marginTop:14,letterSpacing:'0.06em',textTransform:'uppercase' as const}}>{t.statsS}</cite>
          </motion.blockquote>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}
            style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[{n:t.s1,l:t.s1l,u:false},{n:'',l:t.s2l,u:true},{n:t.s3,l:t.s3l,u:false}].map((s,i)=>(
              <motion.div key={i} variants={vUp} style={{textAlign:'center',padding:'40px 28px',borderRadius:24,background:'rgba(255,255,255,0.80)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(15,23,42,0.07)',boxShadow:'0 4px 24px rgba(15,23,42,0.05)',transition:`transform 0.4s cubic-bezier(${EP.join(',')})`}}
                onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(34px,5vw,56px)',color:s.u?C.b:C.ink,letterSpacing:'-0.05em',lineHeight:1,marginBottom:10}}>
                  {s.u?<CD/>:s.n}
                </div>
                <div style={{fontSize:13,color:C.g,lineHeight:1.4,fontFamily:FONT}}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CFO ── */}
      <section id="cfo" style={{background:C.w,padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>{t.cfoTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(28px,4vw,52px)',letterSpacing:'-0.045em',lineHeight:1.07,color:C.ink,marginBottom:20,marginTop:0}}>{t.cfoH}</motion.h2>
            <motion.p variants={vUp} style={{fontSize:17,color:C.g,lineHeight:1.7,maxWidth:420,marginBottom:28,fontFamily:FONT}}>{t.cfoP}</motion.p>
            <motion.div variants={vS} style={{display:'flex',flexDirection:'column' as const,gap:12,marginBottom:32}}>
              {t.cfoFeats.map(f=>(
                <motion.div key={f} variants={vUp} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,color:C.ink,fontFamily:FONT}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:C.b,marginTop:6,flexShrink:0}}/>
                  {f}
                </motion.div>
              ))}
            </motion.div>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.b}}>{t.cfoPrice}</motion.span>
          </motion.div>
          <motion.div initial={{opacity:0,x:60}} whileInView={{opacity:1,x:0}} viewport={VP} transition={{duration:0.8,ease:ES}}>
            <DashMockup/>
          </motion.div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="conformite" style={{background:'#F1F5F9',padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <motion.div initial={{opacity:0,x:-60}} whileInView={{opacity:1,x:0}} viewport={VP} transition={{duration:0.8,ease:ES}} style={{position:'relative',paddingLeft:28}}>
            <div style={{position:'absolute',left:5,top:8,bottom:8,width:1.5,background:`linear-gradient(to bottom,${C.b},rgba(37,99,235,0.1))`}}/>
            {(lang==='fr'?[
              {date:'Fevrier 2026',title:'Phase pilote terminee',desc:'Tests valides avec les plateformes agreees DGFiP',done:true,urgent:false},
              {date:'1er septembre 2026',title:'Reception obligatoire -- toutes les entreprises',desc:'Toutes les entreprises assujetties a la TVA doivent recevoir via une PA',done:true,urgent:true},
              {date:'1er septembre 2026',title:'Emission -- grandes entreprises et ETI',desc:'Emission et e-reporting obligatoires pour les plus de 250 salaries',done:true,urgent:false},
              {date:'1er septembre 2027',title:'Emission -- PME et TPE',desc:'Toutes les entreprises doivent emettre au format structure',done:false,urgent:false},
            ]:[
              {date:'February 2026',title:'Pilot phase completed',desc:'Tests validated with DGFiP-certified platforms',done:true,urgent:false},
              {date:'September 1, 2026',title:'Mandatory reception -- all businesses',desc:'All VAT-registered companies must receive via a certified PA',done:true,urgent:true},
              {date:'September 1, 2026',title:'Emission -- large companies and ETIs',desc:'Mandatory emission and e-reporting for 250+ employees',done:true,urgent:false},
              {date:'September 1, 2027',title:'Emission -- SMEs and micro-businesses',desc:'All companies must emit in structured format',done:false,urgent:false},
            ]).map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={VP} transition={{delay:i*0.12,duration:0.7,ease:ES}} style={{position:'relative',marginBottom:28}}>
                <div style={{position:'absolute',left:-28,top:4,width:13,height:13,borderRadius:'50%',background:item.done?C.b:'#CBD5E1',border:`2px solid ${item.done?C.b:'#94A3B8'}`,boxShadow:item.done?`0 0 0 5px rgba(37,99,235,0.10)`:'none'}}/>
                <div style={{fontFamily:MONO,fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase' as const,color:item.urgent?C.b:C.g,marginBottom:4}}>{item.date}</div>
                <div style={{fontWeight:700,fontSize:15,color:item.urgent?C.b:C.ink,marginBottom:3,fontFamily:FONT}}>{item.title}</div>
                <div style={{fontSize:13,color:C.g,lineHeight:1.5,fontFamily:FONT}}>{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>{t.compTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(28px,4vw,52px)',letterSpacing:'-0.045em',lineHeight:1.07,color:C.ink,marginBottom:20,marginTop:0}}>{t.compH}</motion.h2>
            <motion.p variants={vUp} style={{fontSize:17,color:C.g,lineHeight:1.7,maxWidth:420,marginBottom:32,fontFamily:FONT}}>{t.compP}</motion.p>
            <motion.a variants={vUp} href="/calculateur"
              style={{display:'inline-flex',alignItems:'center',gap:8,background:C.ink,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'14px 28px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.b;(e.currentTarget as HTMLElement).style.transform='translateY(-1px)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.ink;(e.currentTarget as HTMLElement).style.transform='none'}}>
              {t.compCta} &rarr;
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── VOICE -- DARK ── */}
      <section id="voice" style={{background:'#0B0C0E',padding:'112px 40px',position:'relative',zIndex:10,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 45% at 50% 28%,rgba(37,99,235,0.12) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:820,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.28)',display:'block',marginBottom:16}}>{t.voiceTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(32px,5.5vw,68px)',letterSpacing:'-0.05em',lineHeight:1.05,color:'#fff',marginBottom:18,marginTop:0}}>{t.voiceH}</motion.h2>
            <motion.p variants={vUp} style={{fontSize:18,color:'rgba(255,255,255,0.48)',maxWidth:420,margin:'0 auto 48px',lineHeight:1.65,fontFamily:FONT}}>{t.voiceP}</motion.p>

            {/* Phone mockup */}
            <motion.div variants={vUp} style={{width:220,height:420,background:'#111',borderRadius:36,border:'2.5px solid #252525',margin:'0 auto 32px',position:'relative',overflow:'hidden',boxShadow:'0 40px 100px rgba(0,0,0,0.7)'}}>
              <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:80,height:20,background:'#111',borderRadius:'0 0 12px 12px',zIndex:2}}/>
              <div style={{position:'absolute',inset:2,background:'linear-gradient(160deg,#0d1117 0%,#0a1628 100%)',borderRadius:34,display:'flex',flexDirection:'column' as const,alignItems:'center',justifyContent:'center',gap:10,padding:'36px 18px 24px'}}>
                <div style={{fontFamily:MONO,fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.28)'}}>{t.inCall}</div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff',fontFamily:FONT}}>Cabinet Dr. Martin</div>
                <div style={{fontFamily:MONO,fontSize:11,color:'rgba(255,255,255,0.32)'}}>00:47</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',textAlign:'center',lineHeight:1.5,fontStyle:'italic',fontFamily:FONT}}>
                  "Bonjour, cabinet du Dr. Martin.<br/>Comment puis-je vous aider ?"
                </div>
                <div style={{display:'flex',gap:14,marginTop:6}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>M</div>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(239,68,68,0.8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>X</div>
                </div>
              </div>
            </motion.div>

            {/* Tech tags */}
            <motion.div variants={vUp} style={{display:'flex',flexWrap:'wrap' as const,gap:8,justifyContent:'center',marginBottom:32}}>
              {['Whisper STT','Mistral 7B','XTTS-v2','Silero VAD','Hetzner DE','Zero donnee hors UE'].map(tag=>(
                <span key={tag} style={{fontSize:11,fontWeight:500,borderRadius:980,padding:'5px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.42)',fontFamily:MONO}}>{tag}</span>
              ))}
            </motion.div>

            <motion.div variants={vUp} style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' as const}}>
              <a href="tel:+33XXXXXXXXX" style={{display:'inline-block',background:C.b,color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'15px 32px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',boxShadow:'0 8px 28px rgba(37,99,235,0.35)',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 14px 40px rgba(37,99,235,0.45)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(37,99,235,0.35)'}}>
                {t.voiceCta}
              </a>
              <a href="/demo" style={{display:'inline-block',background:'transparent',color:'#fff',fontWeight:700,fontSize:15,borderRadius:980,padding:'15px 32px',textDecoration:'none',fontFamily:FONT,border:'1.5px solid rgba(255,255,255,0.18)',transition:'all 0.3s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.45)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.18)'}}>
                Demo gratuite
              </a>
            </motion.div>
            <div style={{marginTop:14,fontFamily:MONO,fontSize:11,color:'rgba(255,255,255,0.2)'}}>{t.voicePrice}</div>
          </motion.div>
        </div>
      </section>

      {/* ── SOVEREIGNTY BAR ── */}
      <section style={{background:C.w,padding:'48px 40px',borderTop:`1px solid ${C.lt}`,borderBottom:`1px solid ${C.lt}`,position:'relative',zIndex:10}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={VP} transition={{duration:0.8,ease:ES}}
            style={{fontFamily:'Georgia, serif',fontStyle:'italic',fontSize:'clamp(18px,2.5vw,26px)',color:C.ink,marginBottom:28,lineHeight:1.45}}>
            {t.sovQ}
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{display:'flex',flexWrap:'wrap' as const,alignItems:'center',justifyContent:'center',gap:28}}>
            {['Hetzner Frankfurt','Supabase Dublin','Mistral AI Paris','Conforme RGPD','Zero API US'].map(s=>(
              <motion.div key={s} variants={vUp} style={{display:'flex',alignItems:'center',gap:7,fontFamily:MONO,fontSize:11,color:C.g,fontWeight:600,letterSpacing:'0.07em',textTransform:'uppercase' as const}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:C.grn,flexShrink:0}}/>{s}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" style={{background:'#F1F5F9',padding:'112px 40px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{textAlign:'center',marginBottom:48}}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:14}}>{t.pricingTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(28px,4.5vw,52px)',letterSpacing:'-0.045em',color:C.ink,marginBottom:8,marginTop:0}}>{t.pricingH}</motion.h2>
            <motion.div variants={vUp} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:20}}>
              <span style={{fontSize:13,fontWeight:600,cursor:'pointer',color:!annual?C.ink:C.g,fontFamily:FONT}} onClick={()=>setAnnual(false)}>{t.monthly}</span>
              <button onClick={()=>setAnnual(v=>!v)} style={{width:48,height:26,borderRadius:13,border:'none',cursor:'pointer',position:'relative',background:annual?C.b:'#CBD5E1',padding:0,transition:`background 0.3s cubic-bezier(${EP.join(',')})`}}>
                <span style={{position:'absolute',top:3,left:annual?24:3,width:20,height:20,background:'#fff',borderRadius:'50%',transition:`left 0.3s cubic-bezier(${EP.join(',')})`,display:'block',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}/>
              </button>
              <span style={{fontSize:13,fontWeight:600,cursor:'pointer',color:annual?C.ink:C.g,fontFamily:FONT}} onClick={()=>setAnnual(true)}>
                {t.annual} {annual&&<span style={{marginLeft:4,background:'rgba(37,99,235,0.10)',color:C.b,fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:6}}>-17%</span>}
              </span>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {PLANS.map(plan=>(
              <motion.div key={plan.name} variants={vUp}
                style={{borderRadius:24,padding:'32px 26px',position:'relative',transition:`transform 0.4s cubic-bezier(${EP.join(',')})`,
                  ...(plan.pop?{background:C.b,color:'#fff',transform:'translateY(-10px) scale(1.02)',boxShadow:'0 24px 64px rgba(37,99,235,0.22)'}:{background:C.w,color:C.ink,border:`1px solid ${C.lt}`,boxShadow:'0 4px 20px rgba(15,23,42,0.05)'})}}
                onMouseEnter={e=>{if(!plan.pop)(e.currentTarget.style.transform='translateY(-4px)')}}
                onMouseLeave={e=>{if(!plan.pop)(e.currentTarget.style.transform='translateY(0)')}}>
                {plan.pop&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#fff',color:C.b,fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase' as const,padding:'4px 16px',borderRadius:980,boxShadow:'0 4px 12px rgba(0,0,0,0.08)',whiteSpace:'nowrap' as const,fontFamily:FONT}}>{t.popular}</div>}
                <div style={{fontSize:11,fontFamily:MONO,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'0.1em',marginBottom:14,color:plan.pop?'rgba(255,255,255,0.52)':C.g}}>{plan.name}</div>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:50,letterSpacing:'-0.05em',lineHeight:1,color:plan.pop?'#fff':C.ink}}>{annual?plan.a:plan.m} EUR</div>
                <div style={{fontSize:12,color:plan.pop?'rgba(255,255,255,0.52)':C.g,marginTop:4,marginBottom:24,fontFamily:FONT}}>{t.month}</div>
                <ul style={{listStyle:'none',padding:0,margin:'0 0 28px',display:'flex',flexDirection:'column' as const,gap:9}}>
                  {(lang==='fr'?plan.feats.fr:plan.feats.en).map(f=>(
                    <li key={f} style={{fontSize:13,color:plan.pop?'rgba(255,255,255,0.85)':C.ink,display:'flex',alignItems:'flex-start',gap:9,lineHeight:1.4,fontFamily:FONT}}>
                      <span style={{width:4,height:4,borderRadius:'50%',background:plan.pop?'#fff':C.b,marginTop:6,flexShrink:0}}/>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`/signup?plan=${plan.name.toLowerCase()}`}
                  style={{display:'block',textAlign:'center',fontWeight:700,fontSize:14,borderRadius:980,padding:'12px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.3s cubic-bezier(${EP.join(',')})`,background:plan.pop?'#fff':C.ink,color:plan.pop?C.b:'#fff'}}>
                  {t.start}
                </a>
              </motion.div>
            ))}
          </motion.div>
          <p style={{textAlign:'center',fontSize:13,color:C.g,marginTop:28,fontFamily:FONT}}>{t.noCommit}</p>
        </div>
      </section>

      {/* ── INTEGRATIONS SLIDER ── */}
      <section id="integrations" style={{background:C.w,padding:'96px 0 80px',position:'relative',zIndex:10,overflow:'hidden'}}>
        <div style={{maxWidth:1040,margin:'0 auto',padding:'0 40px',marginBottom:40}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS} style={{textAlign:'center'}}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:14}}>{t.intTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(26px,4vw,48px)',letterSpacing:'-0.045em',color:C.ink,marginTop:0,marginBottom:8}}>{t.intH}</motion.h2>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={VP} transition={{duration:0.8}}>
          <LogoSlider/>
        </motion.div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{background:'#F1F5F9',padding:'112px 40px',position:'relative',zIndex:10}}>
        <div className="grid-2" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'flex-start'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.span variants={vUp} style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:C.g,display:'block',marginBottom:16}}>{t.contactTag}</motion.span>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(28px,4vw,50px)',letterSpacing:'-0.045em',lineHeight:1.07,color:C.ink,marginBottom:18,marginTop:0}}>{t.contactH}</motion.h2>
            <motion.p variants={vUp} style={{fontSize:17,color:C.g,lineHeight:1.65,maxWidth:340,marginBottom:32,fontFamily:FONT}}>{t.contactP}</motion.p>
            <motion.div variants={vS} style={{display:'flex',flexDirection:'column' as const,gap:14,marginBottom:28}}>
              {[{icon:'✉',text:'contact@vanivert.fr',href:'mailto:contact@vanivert.fr',c:C.b},{icon:'💬',text:'WhatsApp',href:'https://wa.me/33XXXXXXXXX',c:C.grn}].map(m=>(
                <motion.a key={m.text} variants={vUp} href={m.href}
                  style={{display:'flex',alignItems:'center',gap:12,fontSize:15,fontWeight:600,color:C.ink,textDecoration:'none',fontFamily:FONT,transition:`color 0.2s`}}
                  onMouseEnter={e=>(e.currentTarget.style.color=m.c)}
                  onMouseLeave={e=>(e.currentTarget.style.color=C.ink)}>
                  <span style={{width:40,height:40,borderRadius:'50%',background:C.w,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0,border:`1px solid ${C.lt}`}}>{m.icon}</span>
                  {m.text}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{opacity:0,x:60}} whileInView={{opacity:1,x:0}} viewport={VP} transition={{duration:0.8,ease:ES}}>
            <form style={{background:C.w,borderRadius:24,padding:32,border:`1px solid ${C.lt}`,boxShadow:'0 4px 32px rgba(15,23,42,0.06)'}}
              onSubmit={e=>{e.preventDefault();alert(lang==='fr'?'Message envoye. Nous vous repondons sous 24h.':'Message sent. We will reply within 24h.')}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                {[t.firstName,t.lastName].map(l=>(
                  <div key={l}>
                    <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5,fontFamily:FONT}}>{l}</label>
                    <input style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:FONT,outline:'none',background:'#F8FAFC',boxSizing:'border-box' as const,color:C.ink,transition:`border-color 0.2s`}}
                      onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                  </div>
                ))}
              </div>
              {[{l:t.email,t:'email',r:true},{l:t.company,t:'text',r:false}].map(f=>(
                <div key={f.l} style={{marginBottom:14}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5,fontFamily:FONT}}>{f.l}</label>
                  <input type={f.t} required={f.r} style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:FONT,outline:'none',background:'#F8FAFC',boxSizing:'border-box' as const,color:C.ink,transition:`border-color 0.2s`}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5,fontFamily:FONT}}>{t.service}</label>
                <select style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:FONT,outline:'none',background:'#F8FAFC',boxSizing:'border-box' as const,color:C.ink}}>
                  <option>{t.choose}</option>
                  {t.services.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5,fontFamily:FONT}}>{t.message}</label>
                <textarea rows={3} style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:FONT,outline:'none',resize:'vertical' as const,background:'#F8FAFC',boxSizing:'border-box' as const,color:C.ink,transition:`border-color 0.2s`}}
                  onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
              </div>
              <div style={{display:'flex',alignItems:'flex-start',gap:9,marginBottom:18}}>
                <input type="checkbox" required id="rgpd" style={{marginTop:2,accentColor:C.b}}/>
                <label htmlFor="rgpd" style={{fontSize:12,color:C.g,lineHeight:1.5,fontFamily:FONT}}>
                  {t.rgpd} -- <a href="/legal/confidentialite" style={{color:C.b,textDecoration:'underline'}}>Politique de confidentialite</a>
                </label>
              </div>
              <button type="submit" style={{width:'100%',background:C.ink,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:980,padding:'14px',cursor:'pointer',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
                onMouseEnter={e=>{(e.currentTarget.style.background=C.b);(e.currentTarget.style.transform='translateY(-1px)')}}
                onMouseLeave={e=>{(e.currentTarget.style.background=C.ink);(e.currentTarget.style.transform='translateY(0)')}}>
                {t.sendMsg}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:C.w,padding:'100px 40px',textAlign:'center',position:'relative',zIndex:10}}>
        <div style={{maxWidth:640,margin:'0 auto'}}>
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={vS}>
            <motion.h2 variants={vUp} style={{fontFamily:FONT,fontWeight:800,fontSize:'clamp(30px,4.5vw,54px)',letterSpacing:'-0.05em',color:C.ink,marginBottom:16,marginTop:0}}>{t.ctaH}</motion.h2>
            <motion.p variants={vUp} style={{fontSize:18,color:C.g,marginBottom:36,lineHeight:1.6,fontFamily:FONT}}>{t.ctaP}</motion.p>
            <motion.div variants={vUp} style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' as const}}>
              <a href="/calculateur" style={{display:'inline-block',background:C.b,color:'#fff',fontWeight:700,fontSize:16,borderRadius:980,padding:'16px 36px',textDecoration:'none',fontFamily:FONT,letterSpacing:'-0.01em',transition:`all 0.4s cubic-bezier(${EP.join(',')})`}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.b2;(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 14px 40px rgba(37,99,235,0.28)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=C.b;(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
                {t.ctaBtn}
              </a>
              <a href="/demo" style={{display:'inline-block',background:'transparent',color:C.ink,fontWeight:700,fontSize:16,borderRadius:980,padding:'16px 36px',textDecoration:'none',fontFamily:FONT,border:`1.5px solid ${C.lt}`,transition:'all 0.3s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.ink}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.lt}}>
                Demo gratuite
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:'#0B0C0E',color:'rgba(255,255,255,0.38)',padding:'56px 40px 32px',position:'relative',zIndex:10}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'flex',flexWrap:'wrap' as const,justifyContent:'space-between',gap:40,marginBottom:48}}>
            <div style={{maxWidth:260}}>
              <div style={{fontWeight:800,fontSize:19,color:'#fff',letterSpacing:'-0.05em',marginBottom:10,display:'flex',alignItems:'center',gap:7,fontFamily:FONT}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:C.b}}/>vanivert
              </div>
              <p style={{fontSize:13,lineHeight:1.65,color:'rgba(255,255,255,0.32)',margin:0,fontFamily:FONT}}>
                {lang==='fr'?'Infrastructure financiere souveraine pour les PME francaises. 100% heberge en Europe.':'Sovereign financial infrastructure for French SMEs. 100% hosted in Europe.'}
              </p>
            </div>
            <div style={{display:'flex',flexWrap:'wrap' as const,gap:48}}>
              {(lang==='fr'?[
                {h:'Produit',ls:[{l:'Smart CFO',u:'#cfo'},{l:'Conformite',u:'#conformite'},{l:'Reception vocale',u:'#voice'},{l:'Tarifs',u:'#tarifs'},{l:'Dashboard',u:'/dashboard'}]},
                {h:'Ressources',ls:[{l:'Blog',u:'/blog'},{l:'Calculateur',u:'/calculateur'},{l:'Contact',u:'#contact'},{l:'Statut systeme',u:'#'}]},
                {h:'Legal',ls:[{l:'Mentions legales',u:'/legal/mentions-legales'},{l:'CGV',u:'/legal/cgv'},{l:'Confidentialite',u:'/legal/confidentialite'},{l:'DPA RGPD',u:'/legal/confidentialite'}]},
              ]:[
                {h:'Product',ls:[{l:'Smart CFO',u:'#cfo'},{l:'Compliance',u:'#conformite'},{l:'Voice Reception',u:'#voice'},{l:'Pricing',u:'#tarifs'},{l:'Dashboard',u:'/dashboard'}]},
                {h:'Resources',ls:[{l:'Blog',u:'/blog'},{l:'Calculator',u:'/calculateur'},{l:'Contact',u:'#contact'},{l:'System Status',u:'#'}]},
                {h:'Legal',ls:[{l:'Legal Notice',u:'/legal/mentions-legales'},{l:'Terms',u:'/legal/cgv'},{l:'Privacy Policy',u:'/legal/confidentialite'},{l:'GDPR DPA',u:'/legal/confidentialite'}]},
              ]).map(col=>(
                <div key={col.h}>
                  <h4 style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase' as const,fontFamily:MONO,color:'rgba(255,255,255,0.18)',marginBottom:14,marginTop:0}}>{col.h}</h4>
                  <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column' as const,gap:9}}>
                    {col.ls.map(item=>(
                      <li key={item.l}><a href={item.u} style={{fontSize:13,color:'rgba(255,255,255,0.38)',textDecoration:'none',fontFamily:FONT,transition:'color 0.2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.38)')}>{item.l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:24,display:'flex',flexWrap:'wrap' as const,justifyContent:'space-between',alignItems:'center',gap:14}}>
            <div style={{fontSize:11,fontFamily:MONO,color:'rgba(255,255,255,0.16)',display:'flex',gap:12,flexWrap:'wrap' as const,alignItems:'center'}}>
              <span>2026 Vanivert. SIRET: en cours</span>
              <a href="mailto:contact@vanivert.fr" style={{color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>contact@vanivert.fr</a>
              <a href="https://vanivert.fr" style={{color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>vanivert.fr</a>
              <a href="/legal/mentions-legales" style={{color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>Mentions legales</a>
              <a href="/legal/confidentialite" style={{color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>Confidentialite</a>
            </div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap' as const}}>
              {['RGPD','EU Hosted','Hetzner DE','Supabase IE'].map(b=>(
                <span key={b} style={{fontFamily:MONO,fontSize:9,color:'rgba(255,255,255,0.22)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',padding:'4px 9px',borderRadius:6,display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:4,height:4,borderRadius:'50%',background:C.grn}}/>{b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/33XXXXXXXXX" target="_blank" rel="noopener" aria-label="WhatsApp"
        style={{position:'fixed',bottom:32,right:28,zIndex:400,width:52,height:52,borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(37,211,102,0.4)',transition:`transform 0.4s cubic-bezier(${EP.join(',')})`,textDecoration:'none'}}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.1)')}
        onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Font load */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.4)}50%{box-shadow:0 0 0 6px rgba(37,99,235,0)}}
        @media(max-width:900px){.grid-2{grid-template-columns:1fr!important;gap:48px!important}.grid-3{grid-template-columns:1fr!important}.hero-float{display:none!important}}
        @media(max-width:600px){.nav-links{display:none!important}.nav-burger{display:flex!important}}
        *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      `}</style>
    </div>
  )
}
