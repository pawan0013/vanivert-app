'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── TOKENS (exact from Figma screenshots) ── */
const C = {
  bg:'#FAFAF8', sidebar:'#FFFFFF', card:'#FFFFFF', card2:'#F3F2EE',
  border:'rgba(13,13,15,0.08)', border2:'rgba(13,13,15,0.14)',
  b:'#6366F1', blo:'rgba(99,102,241,0.10)', bhi:'rgba(99,102,241,0.18)',
  w:'#0D0D0F', g1:'rgba(13,13,15,0.88)', g2:'rgba(13,13,15,0.50)', g3:'rgba(13,13,15,0.32)',
  grn:'#10B981', grn2:'rgba(16,185,129,0.10)',
  red:'#EF4444', red2:'rgba(239,68,68,0.10)',
  gold:'#F59E0B', gold2:'rgba(245,158,11,0.10)',
  purple:'#8B5CF6', purple2:'rgba(139,92,246,0.10)',
  teal:'#14B8A6',
}
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL||''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''
const E: [number,number,number,number] = [0.16,1,0.3,1]
const TODAY = new Date()
const DAYS_LEFT = Math.max(0,Math.ceil((new Date('2026-09-01T00:00:00+02:00').getTime()-TODAY.getTime())/86400000))

/* ── SUPABASE HELPERS ── */
async function sbGet(table:string,filter='') {
  if(!SB_URL||!SB_KEY) return []
  try {
    const res=await fetch(`${SB_URL}/rest/v1/${table}?order=created_at.desc&limit=100${filter}`,{
      headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}
    })
    if(!res.ok) return []
    return res.json()
  } catch { return [] }
}
async function sbPost(table:string,body:object) {
  if(!SB_URL||!SB_KEY) return null
  try {
    const res=await fetch(`${SB_URL}/rest/v1/${table}`,{
      method:'POST',
      headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(body)
    })
    return res.json()
  } catch { return null }
}
async function sbPatch(table:string,id:string,body:object) {
  if(!SB_URL||!SB_KEY) return null
  try {
    const res=await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`,{
      method:'PATCH',
      headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(body)
    })
    return res.json()
  } catch { return null }
}

/* ── TRANSLATIONS ── */
const T = {
  fr:{
    nav:['Vue generale','Tresorerie','Factures','Conformite','Integrations','Alertes','Voix','Documents','Benchmark'],
    allSystems:'Tous systemes actifs', integrations:'integrations',
    totalCash:'TRESORERIE TOTALE', demo:'DEMO', reel:'REEL',
    deadline:'avant 1er sept. 2026', publicSite:'Site public', exportReport:'Exporter rapport',
    mrr:'MRR', solde:'SOLDE TOTAL', creances:'CREANCES EN RETARD', jours:'JOURS AVANT DEADLINE',
    activeClients:'clients actifs', psd2:'comptes PSD2', clients2:'clients', deadlineDGFiP:'Deadline DGFiP',
    cashflow:'CASHFLOW PREVISIONNEL 2026', entrees:'Entrees', previsions:'Previsions', depenses:'Depenses',
    bankAccounts:'COMPTES BANCAIRES', totalConsolidate:'Total consolide',
    conformiteDGFiP:'CONFORMITE DGFIP', alertesRecentes:'ALERTES RECENTES',
    moduleLoading:'MODULE EN COURS DE CHARGEMENT',
    integActives:'INTEGRATIONS ACTIVES', enAttente:'EN ATTENTE', disponibilite:'DISPONIBILITE',
    sur:'Sur', configurees:'configurees', configRequise:'Configuration requise', uptime:'Uptime 30 derniers jours',
    stackOS:'STACK OPEN SOURCE', benchmark:'Benchmark concurrentiel',
    comparatif:'COMPARATIF FONCTIONNEL - SOLUTIONS FINANCIERES PME FRANCE',
    notreOffre:'NOTRE OFFRE', notreAvantage:'Notre avantage', tarifInclus:'Tarif tout inclus', certifications:'Certifications',
    journalAppels:'JOURNAL DES APPELS', transcription:'TRANSCRIPTION', configVocale:'CONFIGURATION VOCALE',
    appelsMois:'APPELS CE MOIS', rdvReserves:'RDV RESERVES', dureeTotale:'DUREE TOTALE', latenceP95:'LATENCE P95',
    totalEntrants:'Total entrants', conversionRate:'67% de conversion', utilisationMensuelle:'Utilisation mensuelle', tempsReponse:'Temps reponse IA',
    config:'Config', connecter:'Connecter', relancer:'Relancer', voir:'Voir', ignorer:'Ignorer',
    envoyer:'Envoyer', annuler:'Annuler', sauvegarder:'Sauvegarder', telecharger:'Telecharger',
    factures:'FACTURES', toutes:'Toutes', attente:'Attente', retard:'Retard', payees:'Payees',
    conformiteTitle:'CONFORMITE DGFIP - FRAMEWORK VANIVERT',
    scoreConformite:'SCORE DE CONFORMITE', jourDeadline:'JOURS AVANT DEADLINE',
    facturesFacturX:'FACTURES FACTUR-X', siretValides:'SIRET VALIDES',
    searchDocs:'Interrogez vos documents en langage naturel (ChromaDB + Mistral 7B)',
    searchPlaceholder:'Ex: Quelles factures sont impayees depuis plus de 30 jours ?',
    interroger:'Interroger', resultats:'RESULTATS',
    prevJ30:'J+30', prevJ60:'J+60', prevJ90:'J+90',
  },
  en:{
    nav:['Overview','Treasury','Invoices','Compliance','Integrations','Alerts','Voice','Documents','Benchmark'],
    allSystems:'All systems active', integrations:'integrations',
    totalCash:'TOTAL CASH', demo:'DEMO', reel:'REAL',
    deadline:'before Sept. 1, 2026', publicSite:'Public site', exportReport:'Export report',
    mrr:'MRR', solde:'TOTAL BALANCE', creances:'OVERDUE DEBTS', jours:'DAYS TO DEADLINE',
    activeClients:'active clients', psd2:'PSD2 accounts', clients2:'clients', deadlineDGFiP:'DGFiP Deadline',
    cashflow:'CASH FLOW FORECAST 2026', entrees:'Entries', previsions:'Forecast', depenses:'Expenses',
    bankAccounts:'BANK ACCOUNTS', totalConsolidate:'Consolidated total',
    conformiteDGFiP:'DGFIP COMPLIANCE', alertesRecentes:'RECENT ALERTS',
    moduleLoading:'MODULE LOADING',
    integActives:'ACTIVE INTEGRATIONS', enAttente:'PENDING', disponibilite:'AVAILABILITY',
    sur:'Out of', configurees:'configured', configRequise:'Configuration required', uptime:'Last 30 days uptime',
    stackOS:'OPEN SOURCE STACK', benchmark:'Competitive benchmark',
    comparatif:'FEATURE COMPARISON - FRENCH SME FINANCIAL SOLUTIONS',
    notreOffre:'OUR OFFER', notreAvantage:'Our advantage', tarifInclus:'All-inclusive pricing', certifications:'Certifications',
    journalAppels:'CALL LOG', transcription:'TRANSCRIPTION', configVocale:'VOICE CONFIGURATION',
    appelsMois:'CALLS THIS MONTH', rdvReserves:'BOOKINGS', dureeTotale:'TOTAL DURATION', latenceP95:'P95 LATENCY',
    totalEntrants:'Total incoming', conversionRate:'67% conversion', utilisationMensuelle:'Monthly usage', tempsReponse:'AI response time',
    config:'Config', connecter:'Connect', relancer:'Follow up', voir:'View', ignorer:'Dismiss',
    envoyer:'Send', annuler:'Cancel', sauvegarder:'Save', telecharger:'Download',
    factures:'INVOICES', toutes:'All', attente:'Pending', retard:'Overdue', payees:'Paid',
    conformiteTitle:'DGFIP COMPLIANCE - VANIVERT FRAMEWORK',
    scoreConformite:'COMPLIANCE SCORE', jourDeadline:'DAYS TO DEADLINE',
    facturesFacturX:'FACTUR-X INVOICES', siretValides:'VALID SIRET',
    searchDocs:'Search your documents in natural language (ChromaDB + Mistral 7B)',
    searchPlaceholder:'Ex: Which invoices are overdue by more than 30 days?',
    interroger:'Search', resultats:'RESULTS',
    prevJ30:'D+30', prevJ60:'D+60', prevJ90:'D+90',
  }
}

/* ── DEMO DATA ── */
const DEMO_CF = [
  {m:'Jan',i:42000,o:28000,f:false},{m:'Fev',i:38000,o:31000,f:false},
  {m:'Mar',i:51000,o:29000,f:false},{m:'Avr',i:47000,o:33000,f:false},
  {m:'Mai',i:63000,o:35000,f:false},{m:'Jun',i:58000,o:31000,f:false},
  {m:'Jul',i:71000,o:38000,f:false},{m:'Aou',i:68000,o:36000,f:true},
  {m:'Sep',i:84000,o:42000,f:true},{m:'Oct',i:91000,o:45000,f:true},
  {m:'Nov',i:88000,o:44000,f:true},{m:'Dec',i:102000,o:48000,f:true},
]
const BANKS = [
  {name:'Qonto',bal:12847,icon:'Q',color:'#1E3A8A',bg:'#1e3a8a22'},
  {name:'BNP Paribas',bal:34200,icon:'B',color:'#166534',bg:'#16653422'},
  {name:'Credit Agricole',bal:8150,icon:'C',color:'#166534',bg:'#15803d22'},
]
const INVOICES = [
  {id:'FAC-2026-089',client:'ABC Distribution',siret:'35231982602570',amount:4200,due:'2026-07-15',status:'overdue',days:12,facturx:true,pa:'Docoon'},
  {id:'FAC-2026-090',client:'Hotel Ker Buhe',siret:'12345678901234',amount:285,due:'2026-07-30',status:'pending',days:-2,facturx:true,pa:'Docoon'},
  {id:'FAC-2026-091',client:'Cabinet Dr. Martin',siret:'98765432109876',amount:228,due:'2026-08-01',status:'pending',days:-4,facturx:false,pa:null},
  {id:'FAC-2026-092',client:'MECA ARMOR SARL',siret:'45678901234567',amount:1200,due:'2026-07-08',status:'paid',days:0,facturx:true,pa:'Docoon'},
  {id:'FAC-2026-093',client:'Oxxius Lannion',siret:'56789012345678',amount:3600,due:'2026-08-15',status:'pending',days:-18,facturx:true,pa:'Docoon'},
]
const COMPLIANCE_ITEMS = [
  {id:'FR-EFACT-001',label:'Enrolement annuaire centralise DGFiP',status:'done',critical:true,detail:'Confirme 15 juin 2026'},
  {id:'FR-EFACT-002',label:'Plateforme Agreee Docoon PA n01',status:'done',critical:true,detail:'Connectee, active'},
  {id:'FR-CIUS-001',label:'Validation SIRET (SIRENE INSEE)',status:'done',critical:false,detail:'100% des factures validees'},
  {id:'FR-EFACT-003',label:'Statuts cycle de vie (Deposee / Encaissee)',status:'done',critical:false,detail:'Retournes en temps reel'},
  {id:'FR-EFACT-004',label:'Format Factur-X (PDF/A-3 + CII XML)',status:'done',critical:false,detail:'Genere automatiquement'},
  {id:'FR-ARCEP-001',label:'Declaration ARCEP operateur telecoms',status:'pending',critical:true,detail:'Dossier depose - J+14 validation'},
  {id:'FR-RGPD-001',label:'Registre des traitements CNIL (Art. 30)',status:'pending',critical:false,detail:'A finaliser cette semaine'},
  {id:'FR-RGPD-002',label:'DPA sous-traitants (Supabase, Hetzner)',status:'done',critical:false,detail:'Signes le 20 juin 2026'},
  {id:'FR-RGPD-003',label:'Consentement vocal RGPD (touche 1)',status:'done',critical:false,detail:'Hardcode, non contournable'},
  {id:'ISO-27001',label:'ISO 27001 Phase 1',status:'todo',critical:false,detail:'Prevu mois 6 post-financement'},
]
const INTEGRATIONS = [
  {name:'Qonto',desc:'Compte bancaire professionnel PSD2',status:'connected',ab:'Q',bg:'#1E3A8A',url:'https://qonto.com'},
  {name:'Bridge API',desc:'Agregateur bancaire open banking',status:'connected',ab:'Br',bg:'#0C4A6E',url:'https://bridgeapi.io'},
  {name:'Pennylane',desc:'Comptabilite et facturation en ligne',status:'connected',ab:'PL',bg:'#1E40AF',url:'https://www.pennylane.com'},
  {name:'Docoon PA',desc:'Signature electronique qualifiee',status:'connected',ab:'Do',bg:'#4C1D95',url:'https://www.docoon.fr'},
  {name:'Chorus Pro',desc:'Portail e-facturation DGFiP officiel',status:'connected',ab:'Ch',bg:'#14532D',url:'https://chorus-pro.gouv.fr'},
  {name:'Doctolib',desc:'Gestion des rendez-vous clients',status:'pending',ab:'Dt',bg:'#7C2D12',url:'https://pro.doctolib.fr'},
  {name:'Google Calendar',desc:'Synchronisation agenda et RDV',status:'connected',ab:'G',bg:'#991B1B',svgType:'google',url:'https://workspace.google.com'},
  {name:'n8n',desc:'Automatisation de workflows no-code',status:'connected',ab:'n8',bg:'#92400E',url:'https://n8n.io'},
  {name:'Stripe',desc:'Paiements en ligne et abonnements',status:'connected',ab:'St',bg:'#3730A3',url:'https://dashboard.stripe.com'},
  {name:'GoCardless',desc:'Prelevements SEPA automatiques',status:'pending',ab:'Gc',bg:'#065F46',url:'https://manage.gocardless.com'},
  {name:'Sage 100',desc:'ERP comptabilite et gestion',status:'connected',ab:'Sg',bg:'#166534',url:'https://www.sage.com'},
  {name:'Cegid XRP',desc:'ERP gestion commerciale et RH',status:'connected',ab:'Cd',bg:'#7C2D12',url:'https://www.cegid.com'},
  {name:'Microsoft 365',desc:'Suite bureautique et Microsoft Teams',status:'connected',ab:'M',bg:'#1E3A8A',svgType:'microsoft',url:'https://admin.microsoft.com'},
  {name:'Salesforce',desc:'CRM et automatisation commerciale',status:'pending',ab:'Sf',bg:'#0C4A6E',url:'https://www.salesforce.com'},
]
const OSS_STACK = [
  {name:'grcx',lic:'MIT',color:'#2563EB',desc:'Backend souverain',url:'https://github.com/grcx-dev/grcx'},
  {name:'Pxtly',lic:'Apache 2.0',color:'#7C3AED',desc:'UI components',url:'https://github.com/Pxtly'},
  {name:'Mistral 7B',lic:'Apache 2.0',color:'#D97706',desc:'LLM local',url:'https://mistral.ai'},
  {name:'faster-whisper',lic:'MIT',color:'#059669',desc:'STT temps reel',url:'https://github.com/SYSTRAN/faster-whisper'},
  {name:'XTTS-v2',lic:'CPML',color:'#14B8A6',desc:'Synthese vocale',url:'https://github.com/coqui-ai/TTS'},
  {name:'Docling',lic:'MIT',color:'#D97706',desc:'Analyse documents',url:'https://github.com/docling-project/docling'},
  {name:'Lago',lic:'AGPL',color:'#8B5CF6',desc:'Facturation usage',url:'https://www.getlago.com'},
  {name:'n8n',lic:'SEE',color:'#F59E0B',desc:'Orchestration',url:'https://n8n.io'},
]
const ALERTS_DATA = [
  {id:'a1',type:'critical',cat:'CRITIQUE',msg:'Facture #FAC-2024-089 en retard - Client ABC Distribution - 2 850 €',time:'Il y a 2h',action:'Relancer',actionUrl:'#invoices'},
  {id:'a2',type:'warning',cat:'MISE A JOUR',msg:'Nouvelle version portail DGFiP - Mise a jour obligatoire avant le 1er sept. 2026',time:'Il y a 6h',action:'Voir',actionUrl:'https://impots.gouv.fr'},
  {id:'a3',type:'info',cat:'PREVISION',msg:'Projection tresorerie sous 30K EUR prevue en octobre - Action recommandee',time:'Hier 08:00',action:'Analyser',actionUrl:'#treasury'},
]
const CALLS_DATA = [
  {id:'c1',num:'+33 6 12 34 56 78',time:'Aujourd\'hui 14:32',dur:'4m 12s',status:'RESERVE',transcript:"Bonjour, je souhaiterais prendre rendez-vous avec votre equipe commerciale pour discuter de vos solutions de gestion financiere. Est-ce possible cette semaine ?",result:'RDV confirme - Mercredi 1er juillet a 14h00'},
  {id:'c2',num:'+33 1 43 67 89 01',time:"Aujourd'hui 11:15",dur:'2m 48s',status:'TRANSFERE',transcript:"Bonjour, j'ai une question urgente concernant ma facturation electronique. Nous avons recu une mise en demeure de la DGFiP.",result:'Transfere au responsable conformite'},
  {id:'c3',num:'+33 6 98 76 54 32',time:'Hier 16:44',dur:'1m 05s',status:'MESSAGE',transcript:"Pouvez-vous me rappeler au sujet de votre offre Voice Starter ? Je suis interesse pour mon cabinet medical.",result:'Message enregistre - Rappel programme'},
  {id:'c4',num:'+33 4 91 23 45 67',time:'Hier 09:20',dur:'5m 33s',status:'RESERVE',transcript:"Bonjour, je dirige un hotel de 45 chambres a Perros-Guirec et je cherche une solution pour gerer les reservations par telephone automatiquement.",result:'RDV confirme - Jeudi 3 juillet a 10h00'},
]
const BENCH_ROWS = [
  {feat:'E-facturation DGFiP',v:true,p:true,a:false,q:false,s:true},
  {feat:'Conformite CIUS-FR auto',v:true,p:false,a:false,q:false,s:false},
  {feat:'Reception vocale IA',v:true,p:false,a:false,q:false,s:false},
  {feat:'Smart CFO previsions',v:true,p:false,a:true,q:true,s:false},
  {feat:'Hebergement souverain EU',v:true,p:false,a:false,q:false,s:false},
  {feat:'Connectivite bancaire PSD2',v:true,p:true,a:true,q:true,s:false},
  {feat:'Integration ERP native',v:true,p:false,a:false,q:false,s:true},
  {feat:'Annuaire DGFiP gestion',v:true,p:false,a:false,q:false,s:false},
  {feat:'OAuth Microsoft Google',v:true,p:true,a:false,q:true,s:false},
  {feat:'Alertes reglementaires',v:true,p:false,a:true,q:false,s:false},
  {feat:'Tarif tout inclus',v:true,p:false,a:false,q:false,s:false},
]

/* ── PRIMITIVES ── */
type Tab='overview'|'treasury'|'invoices'|'compliance'|'integrations'|'alerts'|'voice'|'docs'|'benchmark'
type Lang='fr'|'en'

function fmt(n:number,currency=true) {
  const s=n.toLocaleString('fr-FR',{maximumFractionDigits:0})
  return currency?`${s} €`:s
}

function Dot({c,pulse=false}:{c:string;pulse?:boolean}) {
  return <span style={{width:7,height:7,borderRadius:'50%',background:c,display:'inline-block',flexShrink:0,
    animation:pulse?'pulse 1.8s ease-in-out infinite':undefined}}/>
}

function Badge({status}:{status:string}) {
  const m:Record<string,[string,string]>={
    done:['Conforme',C.grn],paid:['Paye',C.grn],connected:['Connecte',C.grn],
    RESERVE:['RESERVE',C.grn],pending:['En cours',C.gold],TRANSFERE:['TRANSFERE',C.gold],
    overdue:['En retard',C.red],todo:['Planifie',C.g3],MESSAGE:['MESSAGE',C.g3],
    'EN ATTENTE':['EN ATTENTE',C.gold],CONNECTE:['CONNECTE',C.grn],
  }
  const [l,col]=m[status]||[status,C.g3]
  return <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,
    background:`${col}20`,color:col,fontFamily:'monospace',letterSpacing:'0.04em',
    textTransform:'uppercase',whiteSpace:'nowrap'}}>{l}</span>
}

function Card({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 22px',...style}}>{children}</div>
}

function SL({text}:{text:string}) {
  return <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase',
    letterSpacing:'0.12em',color:C.g3,marginBottom:14}}>{text}</div>
}

function KPICard({label,value,sub,color=C.g1,spark,children}:{label:string;value:string;sub?:string;color?:string;spark?:number[];children?:React.ReactNode}) {
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4,ease:E}}
      style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 22px',position:'relative',overflow:'hidden'}}>
      {spark&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:48,opacity:0.25}}><SparkLine d={spark} c={color}/></div>}
      <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.12em',color:C.g3,marginBottom:10}}>{label}</div>
      <div style={{fontFamily:'monospace',fontWeight:700,fontSize:30,letterSpacing:'-0.02em',color,lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:C.g3,marginTop:6}}>{sub}</div>}
      {children}
    </motion.div>
  )
}

function SparkLine({d,c}:{d:number[];c:string}) {
  const max=Math.max(...d),min=Math.min(...d),r=max-min||1
  const pts=d.map((v,i)=>`${(i/(d.length-1))*100},${100-((v-min)/r*80+5)}`).join(' ')
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
    <polyline points={pts} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

function Btn({children,onClick,variant='ghost',href,small=false}:{children:React.ReactNode;onClick?:()=>void;variant?:'primary'|'ghost'|'danger'|'warning';href?:string;small?:boolean}) {
  const styles={
    primary:{background:C.b,color:'#fff',border:`1px solid ${C.b}`},
    ghost:{background:'transparent',color:C.g2,border:`1px solid ${C.border}`},
    danger:{background:C.red2,color:C.red,border:`1px solid rgba(239,68,68,0.3)`},
    warning:{background:C.gold2,color:C.gold,border:`1px solid rgba(245,158,11,0.3)`},
  }
  const s=styles[variant]
  const base={...s,fontFamily:'monospace',fontSize:small?9:11,fontWeight:700,letterSpacing:'0.04em',
    padding:small?'4px 10px':'6px 14px',borderRadius:6,cursor:'pointer',
    textDecoration:'none',display:'inline-flex',alignItems:'center',gap:5,transition:'all 0.15s'}
  if(href) return <a href={href} target="_blank" rel="noreferrer" style={base as React.CSSProperties}>{children}</a>
  return <button onClick={onClick} style={base as React.CSSProperties}>{children}</button>
}

function Toast({msg,ok=true,onDone}:{msg:string;ok?:boolean;onDone:()=>void}) {
  useEffect(()=>{const t=setTimeout(onDone,3000);return()=>clearTimeout(t)},[onDone])
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}}
      style={{position:'fixed',bottom:24,right:24,zIndex:9999,padding:'12px 20px',borderRadius:10,
        background:ok?C.grn:C.red,color:'#fff',fontFamily:'monospace',fontWeight:700,fontSize:13,
        boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
      {ok?'✓':'✗'} {msg}
    </motion.div>
  )
}

function Modal({title,children,onClose}:{title:string;children:React.ReactNode;onClose:()=>void}) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        style={{background:C.card,border:`1px solid ${C.border2}`,borderRadius:16,padding:'28px 32px',width:'100%',maxWidth:520,position:'relative'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:C.g1,fontFamily:'monospace',letterSpacing:'0.04em'}}>{title}</div>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:C.g3,cursor:'pointer',fontSize:18,lineHeight:1}}>x</button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

/* ── CASHFLOW CHART ── */
function CashChart({data}:{data:typeof DEMO_CF}) {
  const [hov,setHov]=useState<number|null>(null)
  const max=Math.max(...data.map(d=>d.i))
  const W=68,H=160
  const y=(v:number)=>H-10-((v/max)*(H-20))
  const pts=data.map((d,i)=>`${i*W+W/2},${y(d.i)}`).join(' ')
  const ptsF=data.filter(d=>d.f).map((d,i)=>`${(data.filter(dd=>!dd.f).length+i)*W+W/2},${y(d.i)}`).join(' ')
  const ptsO=data.map((d,i)=>`${i*W+W/2},${y(d.o)}`).join(' ')
  const totalW=data.length*W
  return (
    <div style={{position:'relative',height:H+20}}>
      <svg viewBox={`0 0 ${totalW} ${H+20}`} style={{width:'100%',height:'100%'}} overflow="visible">
        {[0,25000,50000,75000,100000].map(v=>(
          <g key={v}>
            <line x1="40" y1={y(v)} x2={totalW} y2={y(v)} stroke="rgba(13,13,15,0.04)" strokeWidth="0.8"/>
            <text x="36" y={y(v)+4} textAnchor="end" fill="rgba(13,13,15,0.2)" fontSize="8" fontFamily="monospace">
              {v>=1000?`${v/1000}K`:v===0?'0K':''}
            </text>
          </g>
        ))}
        {/* Actual entries area */}
        <defs>
          <linearGradient id="areafill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.b} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={C.b} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`40,${H} ${data.filter(d=>!d.f).map((d,i)=>`${i*W+W/2},${y(d.i)}`).join(' ')} ${(data.filter(d=>!d.f).length-1)*W+W/2},${H}`} fill="url(#areafill)"/>
        <polyline points={pts} fill="none" stroke={C.b} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.filter(d=>!d.f).length>0&&ptsF&&(
          <polyline points={`${(data.filter(d=>!d.f).length-1)*W+W/2},${y(data.filter(d=>!d.f).slice(-1)[0].i)} ${ptsF}`} fill="none" stroke={C.b} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" opacity="0.7"/>
        )}
        <polyline points={ptsO} fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,4" opacity="0.7"/>
        {data.map((d,i)=>(
          <g key={d.m}>
            <rect x={i*W} y={0} width={W} height={H} fill="transparent" style={{cursor:'pointer'}}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
            {hov===i&&(
              <g>
                <line x1={i*W+W/2} y1={0} x2={i*W+W/2} y2={H} stroke="rgba(13,13,15,0.1)" strokeWidth="1"/>
                <rect x={i*W+W/2-36} y={y(d.i)-52} width={72} height={50} rx={6} fill={C.card2} stroke={C.border2} strokeWidth="0.5"/>
                <text x={i*W+W/2} y={y(d.i)-38} textAnchor="middle" fill={C.g3} fontSize="8" fontFamily="monospace">{d.m} 2026</text>
                <text x={i*W+W/2} y={y(d.i)-26} textAnchor="middle" fill={C.b} fontSize="9" fontFamily="monospace" fontWeight="700">+{(d.i/1000).toFixed(0)}K EUR</text>
                <text x={i*W+W/2} y={y(d.i)-14} textAnchor="middle" fill={C.red} fontSize="9" fontFamily="monospace">-{(d.o/1000).toFixed(0)}K EUR</text>
                <text x={i*W+W/2} y={y(d.i)-2} textAnchor="middle" fill={C.grn} fontSize="8" fontFamily="monospace">={((d.i-d.o)/1000).toFixed(0)}K EUR</text>
              </g>
            )}
            <text x={i*W+W/2} y={H+14} textAnchor="middle" fill={d.f?'rgba(13,13,15,0.2)':'rgba(13,13,15,0.35)'} fontSize="9" fontFamily="monospace">{d.m}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── GOOGLE SVG ── */
function GoogleIcon({size=16}:{size?:number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
}

function MicrosoftIcon({size=16}:{size?:number}) {
  return <svg width={size} height={size} viewBox="0 0 21 21">
    <rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
    <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
}

/* ── SIDEBAR ── */
const NAV_ICONS = ['▣','◻','◧','◯','⊞','◬','◐','◫','◫']
function Sidebar({tab,setTab,demo,setDemo,lang,setLang,t}:{
  tab:Tab;setTab:(t:Tab)=>void;demo:boolean;setDemo:(b:boolean)=>void;lang:Lang;setLang:(l:Lang)=>void;t:typeof T.fr
}) {
  const navIds:Tab[]=['overview','treasury','invoices','compliance','integrations','alerts','voice','docs','benchmark']
  const totalBal=BANKS.reduce((a,b)=>a+b.bal,0)
  return (
    <aside style={{width:220,background:C.sidebar,borderRight:`1px solid ${C.border}`,
      display:'flex',flexDirection:'column',flexShrink:0,height:'100dvh',position:'sticky',top:0}}>
      {/* Logo */}
      <div style={{padding:'20px 18px 16px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:C.b,boxShadow:`0 0 12px ${C.b}`}}/>
          <span style={{fontFamily:'monospace',fontWeight:700,fontSize:18,color:C.w,letterSpacing:'-0.02em'}}>vanivert</span>
        </a>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,letterSpacing:'0.14em',marginTop:2}}>SMART CFO</div>
      </div>
      {/* Status */}
      <div style={{margin:'0 12px 10px',padding:'10px 12px',borderRadius:10,background:C.grn2,border:'1px solid rgba(34,197,94,0.15)'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
          <Dot c={C.grn} pulse/>
          <span style={{fontSize:11,fontWeight:700,color:C.grn,fontFamily:'monospace'}}>{t.allSystems}</span>
        </div>
        <div style={{fontSize:9,color:C.g3,fontFamily:'monospace'}}>12 {t.integrations} - 3 min</div>
      </div>
      {/* Cash */}
      <div style={{padding:'10px 18px 14px',borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,letterSpacing:'0.12em',marginBottom:4}}>{t.totalCash}</div>
        <div style={{fontFamily:'monospace',fontWeight:700,fontSize:20,color:C.b,letterSpacing:'-0.02em'}}>{fmt(totalBal)}</div>
      </div>
      {/* Nav */}
      <nav style={{flex:1,padding:'8px 8px',overflowY:'auto'}}>
        {navIds.map((id,i)=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 10px',
              borderRadius:8,border:'none',cursor:'pointer',fontFamily:'monospace',fontSize:12,
              fontWeight:tab===id?700:400,letterSpacing:'0.02em',
              background:tab===id?C.blo:'transparent',
              color:tab===id?C.b:C.g2,
              borderLeft:`2px solid ${tab===id?C.b:'transparent'}`,
              transition:'all 0.15s',marginBottom:1,textAlign:'left'}}>
            <span style={{fontSize:11,opacity:tab===id?1:0.4}}>{NAV_ICONS[i]}</span>
            {t.nav[i]}
            {id==='alerts'&&<span style={{marginLeft:'auto',width:18,height:18,borderRadius:'50%',background:C.red,color:'#fff',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>2</span>}
          </button>
        ))}
      </nav>
      {/* Bottom controls */}
      <div style={{padding:'10px 12px',borderTop:`1px solid ${C.border}`}}>
        <div style={{display:'flex',gap:6,marginBottom:8}}>
          <button onClick={()=>setDemo(true)}
            style={{flex:1,padding:'6px 0',borderRadius:7,border:`1px solid ${demo?C.purple:C.border}`,
              background:demo?C.purple2:'transparent',color:demo?C.purple:C.g3,
              fontFamily:'monospace',fontSize:10,fontWeight:700,cursor:'pointer',letterSpacing:'0.06em'}}>
            {t.demo}
          </button>
          <button onClick={()=>setDemo(false)}
            style={{flex:1,padding:'6px 0',borderRadius:7,border:`1px solid ${!demo?C.grn:C.border}`,
              background:!demo?C.grn2:'transparent',color:!demo?C.grn:C.g3,
              fontFamily:'monospace',fontSize:10,fontWeight:700,cursor:'pointer',letterSpacing:'0.06em'}}>
            {t.reel}
          </button>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:10}}>
          <button onClick={()=>setLang('fr')}
            style={{flex:1,padding:'5px 0',borderRadius:7,border:`1px solid ${lang==='fr'?C.b:C.border}`,
              background:lang==='fr'?C.blo:'transparent',color:lang==='fr'?C.b:C.g3,
              fontFamily:'monospace',fontSize:10,fontWeight:700,cursor:'pointer'}}>
            FR
          </button>
          <button onClick={()=>setLang('en')}
            style={{flex:1,padding:'5px 0',borderRadius:7,border:`1px solid ${lang==='en'?C.b:C.border}`,
              background:lang==='en'?C.blo:'transparent',color:lang==='en'?C.b:C.g3,
              fontFamily:'monospace',fontSize:10,fontWeight:700,cursor:'pointer'}}>
            EN
          </button>
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {['RGPD','Hetzner DE','Supabase IE','grcx','Pxtly'].map(tag=>(
            <span key={tag} style={{fontSize:8,fontFamily:'monospace',padding:'2px 5px',borderRadius:4,
              background:'rgba(13,13,15,0.04)',border:`1px solid ${C.border}`,color:C.g3}}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ── HEADER ── */
function Header({title,t,onExport}:{title:string;t:typeof T.fr;onExport:()=>void}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
      <div>
        <h1 style={{fontFamily:'monospace',fontWeight:700,fontSize:26,color:C.w,marginBottom:4,marginTop:0,letterSpacing:'-0.01em'}}>{title}</h1>
        <div style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>
          {TODAY.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        </div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'7px 14px',borderRadius:8,background:C.gold2,border:'1px solid rgba(245,158,11,0.25)',
          fontSize:11,fontFamily:'monospace',color:C.gold,display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:C.gold,animation:'pulse 1.8s ease-in-out infinite'}}/>
          {DAYS_LEFT}j {t.deadline}
        </div>
        <a href="/" style={{padding:'7px 14px',borderRadius:8,border:`1px solid ${C.border}`,
          background:'transparent',color:C.g2,fontSize:11,fontFamily:'monospace',textDecoration:'none',
          display:'flex',alignItems:'center',gap:5}}>
          <span>◳</span> {t.publicSite}
        </a>
        <button onClick={onExport}
          style={{padding:'7px 16px',borderRadius:8,background:C.b,color:'#fff',border:'none',
            fontSize:11,fontFamily:'monospace',fontWeight:700,cursor:'pointer',letterSpacing:'0.04em',
            display:'flex',alignItems:'center',gap:5}}>
          <span>↓</span> {t.exportReport}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: OVERVIEW
══════════════════════════════════════════════════ */
function TabOverview({t,demo,toast}:{t:typeof T.fr;demo:boolean;toast:(m:string,ok?:boolean)=>void}) {
  const [leads,setLeads]=useState<{id:string;company_name?:string;created_at:string;exposure_euros?:number;grade?:string}[]>([])
  const [dbAlerts,setDbAlerts]=useState<{id:string;jurisdiction:string;severity:string;summary:string;created_at:string}[]>([])
  const [dismissed,setDismissed]=useState<string[]>([])
  const totalBal=BANKS.reduce((a,b)=>a+b.bal,0)

  useEffect(()=>{
    if(!demo){
      sbGet('calculator_leads').then(d=>setLeads(Array.isArray(d)?d:[]))
      sbGet('regulatory_alerts').then(d=>setDbAlerts(Array.isArray(d)?d:[]))
    }
  },[demo])

  function handleRelancer(client:string) {
    toast(`Email de relance envoye a ${client}`)
  }
  function handleAlert(a:typeof ALERTS_DATA[0]) {
    if(a.actionUrl?.startsWith('http')) window.open(a.actionUrl,'_blank')
    else toast(`Action : ${a.msg.substring(0,40)}...`)
  }

  const visibleAlerts=ALERTS_DATA.filter(a=>!dismissed.includes(a.id))

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      {/* 4 KPI row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label={t.mrr} value={demo?'9 368 €':'-- €'} color={C.b} sub={demo?`19 ${t.activeClients}`:t.activeClients} spark={demo?[5000,6200,7100,8000,9368]:undefined}/>
        <KPICard label={t.solde} value={demo?fmt(totalBal):'-- €'} color={C.grn} sub={demo?`3 ${t.psd2}`:t.psd2} spark={demo?[48000,50000,47000,52000,55197]:undefined}/>
        <KPICard label={t.creances} value={demo?'5 700 €':'-- €'} color={C.red} sub={demo?`2 ${t.clients2}`:t.clients2} spark={demo?[0,800,1500,5700,5700]:undefined}/>
        <KPICard label={t.jours} value={String(DAYS_LEFT)} color={C.gold} sub={t.deadlineDGFiP} spark={[90,85,80,75,DAYS_LEFT]}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:12,marginBottom:12}}>
        {/* Cashflow chart */}
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <SL text={t.cashflow}/>
            <div style={{display:'flex',gap:16,fontSize:10,fontFamily:'monospace',color:C.g3}}>
              <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:20,height:2,background:C.b,display:'inline-block'}}/>{t.entrees}</span>
              <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:20,height:2,background:C.b,display:'inline-block',opacity:0.6,borderTop:'2px dashed'+(C.b)}}/>{t.previsions}</span>
              <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:20,height:2,background:C.red,display:'inline-block',opacity:0.7}}/>{t.depenses}</span>
            </div>
          </div>
          {demo?<CashChart data={DEMO_CF}/>:(
            <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',color:C.g3,fontSize:13,fontFamily:'monospace'}}>
              Connectez votre banque via Bridge PSD2
            </div>
          )}
        </Card>

        {/* Right column */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Card>
            <SL text={t.bankAccounts}/>
            {demo?BANKS.map(b=>(
              <div key={b.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}>
                  <div style={{width:30,height:30,borderRadius:8,background:b.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>
                    {b.icon}
                  </div>
                  <span style={{fontSize:12,color:C.g2,fontFamily:'monospace'}}>{b.name}</span>
                </div>
                <span style={{fontSize:13,fontWeight:700,fontFamily:'monospace',color:C.g1}}>{fmt(b.bal)}</span>
              </div>
            )):<div style={{color:C.g3,fontSize:12,fontFamily:'monospace',padding:'8px 0'}}>Aucun compte connecte</div>}
            {demo&&(
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:10}}>
                <span style={{fontSize:12,fontFamily:'monospace',color:C.g3,fontWeight:600}}>{t.totalConsolidate}</span>
                <span style={{fontSize:14,fontWeight:700,fontFamily:'monospace',color:C.grn}}>{fmt(totalBal)}</span>
              </div>
            )}
          </Card>

          <Card>
            <SL text={t.conformiteDGFiP}/>
            {[
              {l:'Factures Factur-X',v:demo?'5/7':'--',ok:true},
              {l:'SIRET valides',v:'100%',ok:true},
              {l:'Annuaire DGFiP',v:'Enrole',ok:true},
              {l:'Declaration ARCEP',v:'En cours',ok:false},
            ].map(r=>(
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  <Dot c={r.ok?C.grn:C.gold} pulse={!r.ok}/>
                  <span style={{fontSize:11,color:C.g2,fontFamily:'monospace'}}>{r.l}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,fontFamily:'monospace',color:r.ok?C.grn:C.gold}}>{r.v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Alerts */}
      <Card>
        <SL text={t.alertesRecentes}/>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {visibleAlerts.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:8,
              background:'rgba(13,13,15,0.02)',borderLeft:`3px solid ${a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b}`}}>
              <Dot c={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
              <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,
                background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
                color:a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b,
                fontFamily:'monospace',letterSpacing:'0.04em',flexShrink:0}}>
                {a.cat}
              </span>
              <span style={{fontSize:12,color:C.g1,flex:1,fontFamily:'monospace'}}>{a.msg}</span>
              <span style={{fontSize:10,color:C.g3,fontFamily:'monospace',flexShrink:0}}>{a.time}</span>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <Btn onClick={()=>setDismissed(d=>[...d,a.id])} variant="ghost" small>{t.ignorer}</Btn>
                <Btn onClick={()=>handleAlert(a)} variant={a.type==='critical'?'danger':'warning'} small>{a.action}</Btn>
              </div>
            </div>
          ))}
          {visibleAlerts.length===0&&(
            <div style={{textAlign:'center',padding:'20px',color:C.g3,fontSize:12,fontFamily:'monospace'}}>
              Aucune alerte active - tous les systemes sont conformes
            </div>
          )}
        </div>
      </Card>

      {/* Real mode: show live DB leads */}
      {!demo&&leads.length>0&&(
        <Card style={{marginTop:12}}>
          <SL text="LEADS RECENTS (SUPABASE LIVE)"/>
          {leads.slice(0,5).map(l=>(
            <div key={l.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:12,fontFamily:'monospace',color:C.g1}}>{l.company_name||'Entreprise inconnue'}</span>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <span style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{l.created_at?.split('T')[0]}</span>
                <Btn onClick={()=>handleRelancer(l.company_name||'ce lead')} variant="primary" small>{t.relancer}</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: TREASURY (loading state for non-demo as per Figma)
══════════════════════════════════════════════════ */
function TabTreasury({t,demo,toast}:{t:typeof T.fr;demo:boolean;toast:(m:string,ok?:boolean)=>void}) {
  const totalBal=BANKS.reduce((a,b)=>a+b.bal,0)
  const totalIn=DEMO_CF.reduce((a,d)=>a+d.i,0)
  const totalOut=DEMO_CF.reduce((a,d)=>a+d.o,0)
  const [showConnect,setShowConnect]=useState(false)

  if(!demo) return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'60vh',gap:16}}>
      <div style={{fontSize:9,fontFamily:'monospace',letterSpacing:'0.14em',color:C.g3,textTransform:'uppercase'}}>{t.moduleLoading}</div>
      <div style={{fontFamily:'monospace',fontWeight:700,fontSize:32,color:'rgba(13,13,15,0.1)'}}>Tresorerie</div>
      <Btn onClick={()=>setShowConnect(true)} variant="primary">Connecter Bridge PSD2</Btn>
      {showConnect&&(
        <Modal title="CONNEXION BRIDGE API PSD2" onClose={()=>setShowConnect(false)}>
          <div style={{fontSize:13,color:C.g2,fontFamily:'monospace',marginBottom:16,lineHeight:1.7}}>
            Bridge API (PSD2) permet de synchroniser vos comptes bancaires en temps reel. Toutes les donnees restent hebergees en Europe.
          </div>
          <div style={{display:'flex',gap:10}}>
            <Btn onClick={()=>{setShowConnect(false);toast('Redirection vers Bridge API...')}} variant="primary">Connecter mes banques</Btn>
            <Btn onClick={()=>setShowConnect(false)} variant="ghost">Annuler</Btn>
          </div>
        </Modal>
      )}
    </motion.div>
  )

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label="CA 2026" value={fmt(totalIn)} color={C.b} spark={[38000,47000,51000,58000,71000]}/>
        <KPICard label="DEPENSES 2026" value={fmt(totalOut)} color={C.red} spark={[28000,31000,29000,31000,38000]}/>
        <KPICard label="RESULTAT NET" value={fmt(totalIn-totalOut)} color={C.grn} spark={[14000,16000,22000,27000,33000]}/>
        <KPICard label="SOLDE CONSOLIDE" value={fmt(totalBal)} color={C.gold}/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <SL text={t.cashflow}/>
          <div style={{display:'flex',gap:8}}>
            <Btn onClick={()=>toast('Export CSV telecharge')} variant="ghost" small>Export CSV</Btn>
            <Btn onClick={()=>toast('Rapport PDF genere')} variant="ghost" small>Export PDF</Btn>
          </div>
        </div>
        <CashChart data={DEMO_CF}/>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <SL text={`${t.bankAccounts} (Bridge PSD2)`}/>
            <Btn onClick={()=>toast('Synchronisation en cours...')} variant="ghost" small>Sync maintenant</Btn>
          </div>
          {BANKS.map(b=>(
            <div key={b.name} style={{padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}>
                  <div style={{width:34,height:34,borderRadius:9,background:b.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{b.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.g1,fontFamily:'monospace'}}>{b.name}</div>
                    <div style={{fontSize:9,color:C.g3,fontFamily:'monospace'}}>il y a 3 min</div>
                  </div>
                </div>
                <div style={{fontSize:15,fontWeight:700,fontFamily:'monospace',color:C.grn}}>{fmt(b.bal)}</div>
              </div>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:10}}>
            <span style={{fontSize:12,fontFamily:'monospace',color:C.g3,fontWeight:600}}>{t.totalConsolidate}</span>
            <span style={{fontSize:16,fontWeight:700,fontFamily:'monospace',color:C.grn}}>{fmt(totalBal)}</span>
          </div>
        </Card>
        <Card>
          <SL text="PREVISIONS"/>
          {[
            {l:t.prevJ30,a:62400,c:'+8%'},
            {l:t.prevJ60,a:74200,c:'+19%'},
            {l:t.prevJ90,a:89500,c:'+43%'},
          ].map(f=>(
            <div key={f.l} style={{padding:'12px 14px',borderRadius:9,marginBottom:8,background:'rgba(13,13,15,0.02)',border:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,fontFamily:'monospace',color:C.g2}}>{f.l}</span>
                <span style={{fontSize:15,fontWeight:700,fontFamily:'monospace',color:C.b}}>{fmt(f.a)}</span>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:C.grn,fontFamily:'monospace'}}>{f.c} vs J0</span>
            </div>
          ))}
        </Card>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: INVOICES
══════════════════════════════════════════════════ */
function TabInvoices({t,demo,toast}:{t:typeof T.fr;demo:boolean;toast:(m:string,ok?:boolean)=>void}) {
  const [filter,setFilter]=useState('all')
  const [dbInvoices,setDbInvoices]=useState<typeof INVOICES>([])
  const [showModal,setShowModal]=useState<null|typeof INVOICES[0]>(null)
  const inv=demo?INVOICES:dbInvoices
  const filtered=filter==='all'?inv:inv.filter(i=>i.status===filter)
  const overdue=inv.filter(i=>i.status==='overdue')

  async function handleRelancer(inv:typeof INVOICES[0]) {
    toast(`Relance envoyee pour ${inv.id} - ${inv.client}`)
  }
  async function handleGenFacturX(inv:typeof INVOICES[0]) {
    toast(`Factur-X genere pour ${inv.id}`)
  }
  async function handleDownload() {
    const csv=['Reference,Client,SIRET,Montant,Echeance,Statut,Factur-X',
      ...filtered.map(i=>`${i.id},${i.client},${i.siret},${i.amount},${i.due},${i.status},${i.facturx}`)]
    .join('\n')
    const a=document.createElement('a')
    a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
    a.download=`factures-vanivert-${Date.now()}.csv`
    a.click()
    toast('Export CSV telecharge')
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label="EN ATTENTE" value={demo?fmt(inv.filter(i=>i.status==='pending').reduce((a,i)=>a+i.amount,0)):'-- €'} color={C.gold}/>
        <KPICard label="EN RETARD" value={demo?fmt(overdue.reduce((a,i)=>a+i.amount,0)):'-- €'} color={C.red}/>
        <KPICard label="PAYE CE MOIS" value={demo?fmt(inv.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0)):'-- €'} color={C.grn}/>
        <KPICard label="CONFORMITE FACTUR-X" value={demo?`${inv.filter(i=>i.facturx).length}/${inv.length}`:'--'} color={C.b}/>
      </div>
      {demo&&overdue.length>0&&(
        <div style={{padding:'12px 16px',borderRadius:10,marginBottom:12,background:C.red2,
          border:'1px solid rgba(239,68,68,0.25)',display:'flex',alignItems:'center',gap:12}}>
          <Dot c={C.red} pulse/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:700,color:C.red,fontFamily:'monospace'}}>
              {overdue.length} facture(s) impayee(s) - {fmt(overdue.reduce((a,i)=>a+i.amount,0))} a relancer
            </span>
          </div>
          <Btn onClick={()=>overdue.forEach(i=>handleRelancer(i))} variant="danger">Relancer tout</Btn>
        </div>
      )}
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <SL text={t.factures}/>
          <div style={{display:'flex',gap:7,alignItems:'center'}}>
            {['all','pending','overdue','paid'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:`1px solid ${filter===f?C.b:C.border}`,
                  cursor:'pointer',background:filter===f?C.blo:'transparent',color:filter===f?C.b:C.g3,
                  fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                {f==='all'?t.toutes:f==='pending'?t.attente:f==='overdue'?t.retard:t.payees}
              </button>
            ))}
            <Btn onClick={handleDownload} variant="ghost" small>Export CSV</Btn>
          </div>
        </div>
        {!demo&&inv.length===0?(
          <div style={{color:C.g3,fontSize:13,fontFamily:'monospace',padding:'30px 0',textAlign:'center'}}>
            Connectez votre ERP pour voir vos factures en temps reel
          </div>
        ):(
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                {['Reference','Client / SIRET','Montant','Factur-X','PA','Echeance','Statut','Actions'].map(h=>(
                  <th key={h} style={{padding:'7px 10px',textAlign:'left',fontSize:9,fontFamily:'monospace',
                    textTransform:'uppercase',letterSpacing:'0.06em',color:C.g3,
                    borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv=>(
                <tr key={inv.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'9px 10px',fontSize:11,fontFamily:'monospace',color:C.b,fontWeight:700}}>{inv.id}</td>
                  <td style={{padding:'9px 10px'}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.g1,fontFamily:'monospace'}}>{inv.client}</div>
                    <div style={{fontSize:9,fontFamily:'monospace',color:C.g3}}>{inv.siret}</div>
                  </td>
                  <td style={{padding:'9px 10px',fontSize:12,fontWeight:700,fontFamily:'monospace',color:C.g1}}>{fmt(inv.amount)}</td>
                  <td style={{padding:'9px 10px'}}>
                    {inv.facturx?(
                      <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:C.grn2,color:C.grn,fontFamily:'monospace'}}>PDF/A-3</span>
                    ):(
                      <Btn onClick={()=>handleGenFacturX(inv)} variant="warning" small>Generer</Btn>
                    )}
                  </td>
                  <td style={{padding:'9px 10px',fontSize:10,fontFamily:'monospace',color:inv.pa?C.grn:C.g3}}>{inv.pa||'--'}</td>
                  <td style={{padding:'9px 10px'}}>
                    <div style={{fontSize:11,fontFamily:'monospace',color:inv.status==='overdue'?C.red:C.g2}}>{inv.due}</div>
                    {inv.status==='overdue'&&<div style={{fontSize:9,color:C.red,fontFamily:'monospace'}}>+{inv.days}j retard</div>}
                  </td>
                  <td style={{padding:'9px 10px'}}><Badge status={inv.status}/></td>
                  <td style={{padding:'9px 10px'}}>
                    <div style={{display:'flex',gap:5}}>
                      {inv.status==='overdue'&&<Btn onClick={()=>handleRelancer(inv)} variant="danger" small>{t.relancer}</Btn>}
                      <Btn onClick={()=>setShowModal(inv)} variant="ghost" small>{t.voir}</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {showModal&&(
        <Modal title={`FACTURE ${showModal.id}`} onClose={()=>setShowModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[['Client',showModal.client],['SIRET',showModal.siret],['Montant',fmt(showModal.amount)],['Echeance',showModal.due],['Statut',showModal.status],['Factur-X',showModal.facturx?'Genere (PDF/A-3)':'Non genere'],['Plateforme PA',showModal.pa||'Non configure']].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{k}</span>
                <span style={{fontSize:12,fontFamily:'monospace',color:C.g1,fontWeight:600}}>{v}</span>
              </div>
            ))}
            <div style={{display:'flex',gap:8,marginTop:8}}>
              {showModal.status==='overdue'&&<Btn onClick={()=>{handleRelancer(showModal);setShowModal(null)}} variant="danger">{t.relancer}</Btn>}
              {!showModal.facturx&&<Btn onClick={()=>{handleGenFacturX(showModal);setShowModal(null)}} variant="warning">Generer Factur-X</Btn>}
              <Btn onClick={()=>toast(`Facture ${showModal.id} telechargee`)} variant="ghost">Telecharger PDF</Btn>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: COMPLIANCE
══════════════════════════════════════════════════ */
function TabCompliance({t,toast}:{t:typeof T.fr;toast:(m:string,ok?:boolean)=>void}) {
  const done=COMPLIANCE_ITEMS.filter(c=>c.status==='done').length
  const pct=Math.round((done/COMPLIANCE_ITEMS.length)*100)
  const [expand,setExpand]=useState<string|null>(null)

  function handleAction(ctrl:typeof COMPLIANCE_ITEMS[0]) {
    if(ctrl.status==='pending') toast(`Action lancee pour : ${ctrl.label}`)
    else if(ctrl.status==='done') toast(`Controle confirme : ${ctrl.id}`)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label={t.scoreConformite} value={`${pct}%`} color={pct>=80?C.grn:pct>=60?C.gold:C.red}/>
        <KPICard label={t.jourDeadline} value={String(DAYS_LEFT)} color={C.gold}/>
        <KPICard label={t.facturesFacturX} value="5/7" color={C.b}/>
        <KPICard label={t.siretValides} value="100%" color={C.grn}/>
      </div>
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <SL text={t.conformiteTitle}/>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{done}/{COMPLIANCE_ITEMS.length}</span>
            <div style={{width:120,height:5,borderRadius:3,background:'rgba(13,13,15,0.06)'}}>
              <div style={{width:`${pct}%`,height:'100%',borderRadius:3,background:pct>=80?C.grn:C.gold,transition:'width 1s ease'}}/>
            </div>
            <span style={{fontSize:11,fontWeight:700,fontFamily:'monospace',color:pct>=80?C.grn:C.gold}}>{pct}%</span>
            <Btn onClick={()=>toast('Rapport de conformite telecharge')} variant="ghost" small>Exporter</Btn>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {COMPLIANCE_ITEMS.map(ctrl=>(
            <div key={ctrl.id}>
              <div onClick={()=>setExpand(expand===ctrl.id?null:ctrl.id)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:9,cursor:'pointer',
                  background:ctrl.status==='done'?'rgba(34,197,94,0.04)':ctrl.status==='pending'?'rgba(245,158,11,0.04)':'rgba(13,13,15,0.02)',
                  border:`1px solid ${ctrl.status==='done'?'rgba(34,197,94,0.12)':ctrl.status==='pending'?'rgba(245,158,11,0.12)':C.border}`}}>
                <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,
                  background:ctrl.status==='done'?C.grn2:ctrl.status==='pending'?C.gold2:'rgba(13,13,15,0.04)',
                  border:`1.5px solid ${ctrl.status==='done'?C.grn:ctrl.status==='pending'?C.gold:C.g3}`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontFamily:'monospace',color:ctrl.status==='done'?C.grn:ctrl.status==='pending'?C.gold:C.g3}}>
                  {ctrl.status==='done'?'ok':ctrl.status==='pending'?'...':'--'}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:'monospace',color:ctrl.status==='done'?C.g1:ctrl.status==='pending'?C.gold:C.g3,fontWeight:ctrl.critical?700:400}}>
                    {ctrl.label}
                    {ctrl.critical&&<span style={{marginLeft:7,fontSize:8,padding:'1px 5px',borderRadius:3,background:C.red2,color:C.red,fontFamily:'monospace'}}>CRITIQUE</span>}
                  </div>
                  <div style={{fontSize:9,color:C.g3,marginTop:2,fontFamily:'monospace'}}>{ctrl.id}</div>
                </div>
                <Badge status={ctrl.status}/>
                {ctrl.status!=='done'&&<Btn onClick={()=>handleAction(ctrl)} variant={ctrl.status==='pending'?'warning':'ghost'} small>
                  {ctrl.status==='pending'?'Agir':'--'}
                </Btn>}
              </div>
              {expand===ctrl.id&&(
                <div style={{padding:'10px 14px 10px 46px',background:'rgba(13,13,15,0.01)',borderRadius:'0 0 9px 9px',
                  border:`1px solid ${C.border}`,borderTop:'none',marginTop:-1}}>
                  <div style={{fontSize:11,color:C.g2,fontFamily:'monospace',lineHeight:1.7}}>{ctrl.detail}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: INTEGRATIONS
══════════════════════════════════════════════════ */
function TabIntegrations({t,toast}:{t:typeof T.fr;toast:(m:string,ok?:boolean)=>void}) {
  const [configModal,setConfigModal]=useState<null|typeof INTEGRATIONS[0]>(null)
  const connected=INTEGRATIONS.filter(i=>i.status==='connected').length
  const pending=INTEGRATIONS.filter(i=>i.status==='pending').length

  function handleConfig(int:typeof INTEGRATIONS[0]) {
    setConfigModal(int)
  }
  function handleConnect(int:typeof INTEGRATIONS[0]) {
    if(int.url) window.open(int.url,'_blank')
    toast(`Redirection vers ${int.name}...`)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
        <KPICard label={t.integActives} value={String(connected)} color={C.grn} sub={`${t.sur} ${INTEGRATIONS.length} ${t.configurees}`}/>
        <KPICard label={t.enAttente} value={String(pending)} color={C.gold} sub={t.configRequise}/>
        <KPICard label={t.disponibilite} value="99.8%" color={C.b} sub={t.uptime}/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {INTEGRATIONS.map(int=>(
            <div key={int.name} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:10,
              background:int.status==='connected'?'rgba(34,197,94,0.03)':'rgba(13,13,15,0.02)',
              border:`1px solid ${int.status==='connected'?'rgba(34,197,94,0.15)':C.border}`}}>
              <div style={{width:42,height:42,borderRadius:10,background:int.bg+'33',
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {int.svgType==='microsoft'?<MicrosoftIcon size={20}/>
                :int.svgType==='google'?<GoogleIcon size={20}/>
                :<span style={{fontFamily:'monospace',fontWeight:700,fontSize:13,color:'#fff'}}>{int.ab}</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.g1,fontFamily:'monospace'}}>{int.name}</span>
                  <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,
                    background:int.status==='connected'?C.grn2:C.gold2,
                    color:int.status==='connected'?C.grn:C.gold,fontFamily:'monospace',letterSpacing:'0.04em'}}>
                    {int.status==='connected'?'CONNECTE':'EN ATTENTE'}
                  </span>
                </div>
                <div style={{fontSize:11,color:C.g3,fontFamily:'monospace'}}>{int.desc}</div>
              </div>
              {int.status==='connected'?(
                <Btn onClick={()=>handleConfig(int)} variant="ghost" small>{t.config}</Btn>
              ):(
                <Btn onClick={()=>handleConnect(int)} variant="primary" small>{t.connecter}</Btn>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SL text={t.stackOS}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
          {OSS_STACK.map(s=>(
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
              style={{padding:'14px 16px',borderRadius:9,background:'rgba(13,13,15,0.02)',
                border:`1px solid ${C.border}`,textDecoration:'none',display:'block',transition:'all 0.15s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=C.border2}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor=C.border}>
              <div style={{fontSize:13,fontWeight:700,color:s.color,fontFamily:'monospace',marginBottom:3}}>{s.name}</div>
              <div style={{fontSize:9,color:s.color,fontFamily:'monospace',marginBottom:7,opacity:0.7}}>{s.lic}</div>
              <div style={{fontSize:11,color:C.g3,fontFamily:'monospace'}}>{s.desc}</div>
            </a>
          ))}
        </div>
      </Card>

      {configModal&&(
        <Modal title={`CONFIGURATION - ${configModal.name.toUpperCase()}`} onClose={()=>setConfigModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{fontSize:13,color:C.g2,fontFamily:'monospace',lineHeight:1.7}}>
              {configModal.desc}. Integration active et synchronisee.
            </div>
            <div style={{padding:'12px 14px',borderRadius:9,background:'rgba(13,13,15,0.02)',border:`1px solid ${C.border}`}}>
              {[['Statut','Connecte'],['Derniere sync','il y a 3 min'],['Donnees',configModal.desc],['Hebergement','EU - RGPD conforme']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{k}</span>
                  <span style={{fontSize:11,fontFamily:'monospace',color:C.g1,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>{toast(`${configModal.name} synchronise`);setConfigModal(null)}} variant="primary">Synchroniser</Btn>
              <Btn href={configModal.url} variant="ghost">Ouvrir {configModal.name}</Btn>
              <Btn onClick={()=>{toast(`${configModal.name} deconnecte`,false);setConfigModal(null)}} variant="danger">Deconnecter</Btn>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: ALERTS (loading in Figma for non-demo tabs)
══════════════════════════════════════════════════ */
function TabAlerts({t,toast}:{t:typeof T.fr;toast:(m:string,ok?:boolean)=>void}) {
  const [dismissed,setDismissed]=useState<string[]>([])
  const [dbAlerts,setDbAlerts]=useState<{id:string;jurisdiction:string;severity:string;summary:string;source_url?:string;created_at:string}[]>([])
  const visible=ALERTS_DATA.filter(a=>!dismissed.includes(a.id))

  useEffect(()=>{ sbGet('regulatory_alerts').then(d=>setDbAlerts(Array.isArray(d)?d.slice(0,10):[])) },[])

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
        <KPICard label="CRITIQUES" value={String(visible.filter(a=>a.type==='critical').length)} color={C.red} sub="Action immediate"/>
        <KPICard label="AVERTISSEMENTS" value={String(visible.filter(a=>a.type==='warning').length)} color={C.gold} sub="Sous 48 heures"/>
        <KPICard label="INFORMATIONS" value={String(visible.filter(a=>a.type==='info').length)} color={C.b} sub="Veille reglementaire"/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <SL text="ALERTES ACTIVES - grcx + SMART CFO"/>
          <Btn onClick={()=>toast('Toutes les alertes marquees comme lues')} variant="ghost" small>Tout lire</Btn>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {visible.length===0&&(
            <div style={{textAlign:'center',padding:'30px',color:C.g3,fontSize:12,fontFamily:'monospace'}}>
              Aucune alerte active - tous les systemes sont conformes
            </div>
          )}
          {visible.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',borderRadius:9,
              background:'rgba(13,13,15,0.02)',borderLeft:`3px solid ${a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b}`}}>
              <Dot c={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
              <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,flexShrink:0,
                background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
                color:a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b,
                fontFamily:'monospace',letterSpacing:'0.04em'}}>
                {a.cat}
              </span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.g1,fontFamily:'monospace',lineHeight:1.5}}>{a.msg}</div>
                <div style={{fontSize:9,color:C.g3,fontFamily:'monospace',marginTop:3}}>{a.time}</div>
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <Btn onClick={()=>setDismissed(d=>[...d,a.id])} variant="ghost" small>{t.ignorer}</Btn>
                <Btn onClick={()=>{if(a.actionUrl?.startsWith('http'))window.open(a.actionUrl,'_blank');else toast(`Action: ${a.action}`)}} variant={a.type==='critical'?'danger':'warning'} small>{a.action}</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {dbAlerts.length>0&&(
        <Card>
          <SL text="ALERTES REGLEMENTAIRES (grcx LIVE - SUPABASE)"/>
          {dbAlerts.map(a=>(
            <div key={a.id} style={{display:'flex',gap:12,padding:'9px 0',borderBottom:`1px solid ${C.border}`,alignItems:'flex-start'}}>
              <Badge status={a.severity}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontFamily:'monospace',color:C.g1}}>{a.summary}</div>
                <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,marginTop:2}}>{a.jurisdiction} - {a.created_at?.split('T')[0]}</div>
              </div>
              {a.source_url&&<Btn href={a.source_url} variant="ghost" small>{t.voir}</Btn>}
            </div>
          ))}
        </Card>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: VOICE
══════════════════════════════════════════════════ */
function TabVoice({t,toast}:{t:typeof T.fr;toast:(m:string,ok?:boolean)=>void}) {
  const [sel,setSel]=useState('c1')
  const selCall=CALLS_DATA.find(c=>c.id===sel)
  const [showConfig,setShowConfig]=useState(false)
  const [twilio,setTwilio]=useState('+33 1 XX XX XX XX')

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label={t.appelsMois} value="12" color={C.b} sub={t.totalEntrants} spark={[6,7,9,10,12]}/>
        <KPICard label={t.rdvReserves} value="8" color={C.grn} sub={t.conversionRate} spark={[3,4,5,7,8]}/>
        <KPICard label={t.dureeTotale} value="47 min" color={C.gold} sub={t.utilisationMensuelle}/>
        <KPICard label={t.latenceP95} value="<1200ms" color={C.purple} sub={t.tempsReponse}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:12}}>
        <Card>
          <SL text={t.journalAppels}/>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {CALLS_DATA.map(c=>(
              <div key={c.id} onClick={()=>setSel(c.id)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10,cursor:'pointer',
                  background:sel===c.id?C.blo:'rgba(13,13,15,0.02)',
                  border:`1px solid ${sel===c.id?C.b:C.border}`,transition:'all 0.15s'}}>
                <div style={{width:36,height:36,borderRadius:10,background:C.blo,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                  📞
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:'monospace',color:C.g1,fontWeight:600}}>{c.num}</div>
                  <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{c.time}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,fontFamily:'monospace',color:C.g3,marginBottom:3}}>{c.dur}</div>
                  <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,fontFamily:'monospace',
                    background:c.status==='RESERVE'?C.grn2:c.status==='TRANSFERE'?C.gold2:'rgba(13,13,15,0.06)',
                    color:c.status==='RESERVE'?C.grn:c.status==='TRANSFERE'?C.gold:C.g3}}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {selCall&&(
            <Card>
              <SL text={`${t.transcription} - ${selCall.id.toUpperCase()}`}/>
              <div style={{padding:'14px 16px',borderRadius:9,background:'rgba(13,13,15,0.02)',border:`1px solid ${C.border}`,
                fontSize:13,color:C.g2,fontFamily:'monospace',lineHeight:1.7,fontStyle:'italic',marginBottom:12}}>
                "{selCall.transcript}"
              </div>
              <div style={{fontSize:10,fontFamily:'monospace',color:C.g3,marginBottom:4}}>Resultat :</div>
              <div style={{fontSize:12,fontFamily:'monospace',color:C.grn,fontWeight:700}}>{selCall.result}</div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <Btn onClick={()=>toast('Transcript telecharge')} variant="ghost" small>Telecharger</Btn>
                <Btn onClick={()=>toast('Note ajoutee au CRM')} variant="ghost" small>Ajouter note CRM</Btn>
              </div>
            </Card>
          )}
          <Card>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <SL text={t.configVocale}/>
              <Btn onClick={()=>setShowConfig(true)} variant="ghost" small>Modifier</Btn>
            </div>
            {[
              {l:'Numero actif',v:twilio,c:C.gold,warn:true},
              {l:'STT Engine',v:'faster-whisper v3.0',c:C.b},
              {l:'LLM',v:'Mistral 7B Instruct',c:C.purple},
              {l:'TTS',v:'XTTS-v2',c:C.grn},
              {l:'Infra',v:'Hetzner DE - souverain',c:C.teal},
            ].map(s=>(
              <div key={s.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  {s.warn&&<Dot c={C.gold} pulse/>}
                  <span style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{s.l}</span>
                </div>
                <span style={{fontSize:11,fontFamily:'monospace',fontWeight:600,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      {showConfig&&(
        <Modal title="CONFIGURATION VOCALE" onClose={()=>setShowConfig(false)}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <label style={{fontSize:10,fontFamily:'monospace',color:C.g3,display:'block',marginBottom:6}}>NUMERO TWILIO (+33...)</label>
              <input value={twilio} onChange={e=>setTwilio(e.target.value)}
                style={{width:'100%',padding:'10px 12px',background:'rgba(13,13,15,0.05)',border:`1px solid ${C.border2}`,borderRadius:8,color:C.g1,fontFamily:'monospace',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{padding:'10px 14px',borderRadius:8,background:C.gold2,border:'1px solid rgba(245,158,11,0.25)',fontSize:12,color:C.gold,fontFamily:'monospace',lineHeight:1.6}}>
              Obtenez un numero +33 sur twilio.com (1 EUR/mois) puis mettez a jour lib/site.config.ts
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>{toast('Configuration sauvegardee');setShowConfig(false)}} variant="primary">{t.sauvegarder}</Btn>
              <Btn onClick={()=>setShowConfig(false)} variant="ghost">{t.annuler}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: DOCUMENTS (loading state matches Figma)
══════════════════════════════════════════════════ */
function TabDocs({t,demo,toast}:{t:typeof T.fr;demo:boolean;toast:(m:string,ok?:boolean)=>void}) {
  const [query,setQuery]=useState('')
  const [results,setResults]=useState<{text:string;rel:number}[]>([])
  const [loading,setLoading]=useState(false)
  const presets=[
    'Factures impayees depuis plus de 30 jours',
    "Chiffre d'affaires du trimestre",
    'Clients avec retards de paiement',
    'Depenses fixes ce mois',
  ]

  if(!demo) return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'60vh',gap:16}}>
      <div style={{fontSize:9,fontFamily:'monospace',letterSpacing:'0.14em',color:C.g3,textTransform:'uppercase'}}>{t.moduleLoading}</div>
      <div style={{fontFamily:'monospace',fontWeight:700,fontSize:32,color:'rgba(13,13,15,0.1)'}}>Documents</div>
      <Btn onClick={()=>toast('Redirection vers Docling ingestion API...')} variant="primary">Importer des documents</Btn>
    </motion.div>
  )

  async function search(q=query) {
    if(!q.trim()) return
    setQuery(q); setLoading(true)
    await new Promise(r=>setTimeout(r,1000))
    setResults([
      {text:'PROLANN SAS - 3 factures impayees depuis plus de 30 jours (total : 4 200 EUR). Facture FAC-2026-089 du 15 juin 2026 est la plus ancienne (retard : 12 jours).',rel:0.94},
      {text:'Apizee SAS - 1 facture impayee depuis 17 jours (1 500 EUR). Echeance depassee le 5 juillet 2026. Statut Docoon: Deposee non confirmee.',rel:0.87},
    ])
    setLoading(false)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <KPICard label="FACTURES INDEXEES" value="143" color={C.b} sub="ChromaDB"/>
        <KPICard label="CONTRATS" value="12" color={C.purple} sub="Documents juridiques"/>
        <KPICard label="RELEVES BANCAIRES" value="36" color={C.grn} sub="Bridge PSD2"/>
        <KPICard label="DOCUMENTS DGFIP" value="8" color={C.gold} sub="Conformite e-facturation"/>
      </div>
      <Card style={{marginBottom:12}}>
        <SL text={t.searchDocs}/>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
            placeholder={t.searchPlaceholder}
            style={{flex:1,padding:'11px 14px',borderRadius:9,border:`1.5px solid ${C.border}`,
              background:'rgba(13,13,15,0.04)',color:C.g1,fontSize:12,fontFamily:'monospace',outline:'none',
              transition:'border-color 0.2s'}}
            onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
          <Btn onClick={()=>search()} variant="primary">{loading?'...':t.interroger}</Btn>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {presets.map(s=>(
            <button key={s} onClick={()=>search(s)}
              style={{fontSize:10,padding:'4px 10px',borderRadius:6,border:`1px solid ${C.border}`,
                background:'rgba(13,13,15,0.02)',color:C.g3,cursor:'pointer',fontFamily:'monospace'}}>
              {s}
            </button>
          ))}
        </div>
      </Card>
      {results.length>0&&(
        <Card>
          <SL text={`${t.resultats} - ${results.length} document(s) trouve(s)`}/>
          {results.map((r,i)=>(
            <div key={i} style={{padding:'12px 14px',borderRadius:9,background:C.blo,border:'1px solid rgba(37,99,235,0.2)',marginBottom:7}}>
              <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(37,99,235,0.2)',color:C.b,fontFamily:'monospace',flexShrink:0}}>{(r.rel*100).toFixed(0)}%</span>
                <div style={{fontSize:12,color:C.g1,fontFamily:'monospace',lineHeight:1.7}}>{r.text}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TAB: BENCHMARK (exact from Figma screenshot 8)
══════════════════════════════════════════════════ */
function TabBenchmark({t,toast}:{t:typeof T.fr;toast:(m:string,ok?:boolean)=>void}) {
  const cols=['v','p','a','q','s'] as const
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <SL text={t.comparatif}/>
          <Btn onClick={()=>toast('Rapport benchmark telecharge')} variant="ghost" small>Exporter</Btn>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:680}}>
            <thead>
              <tr>
                <th style={{padding:'10px 14px',textAlign:'left',fontSize:10,fontFamily:'monospace',color:C.g3,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',borderBottom:`1px solid ${C.border}`}}>FONCTIONNALITE</th>
                {[
                  {k:'vanivert',label:'Vanivert',sub:t.notreOffre,highlight:true},
                  {k:'pennylane',label:'Pennylane',sub:'',highlight:false},
                  {k:'agicap',label:'Agicap',sub:'',highlight:false},
                  {k:'qonto',label:'Qonto CFO',sub:'',highlight:false},
                  {k:'sage',label:'Sage 100',sub:'',highlight:false},
                ].map(col=>(
                  <th key={col.k} style={{padding:'10px 14px',textAlign:'center',fontSize:12,fontFamily:'monospace',
                    color:col.highlight?C.b:C.g2,fontWeight:700,
                    borderBottom:`1px solid ${C.border}`,
                    background:col.highlight?C.blo:'transparent'}}>
                    {col.label}
                    {col.sub&&<div style={{fontSize:8,color:C.g3,letterSpacing:'0.08em',marginTop:2}}>{col.sub}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCH_ROWS.map((row,i)=>(
                <tr key={row.feat} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(13,13,15,0.01)'}}>
                  <td style={{padding:'10px 14px',fontSize:12,fontFamily:'monospace',color:C.g2,fontWeight:400}}>{row.feat}</td>
                  {cols.map(col=>(
                    <td key={col} style={{padding:'10px 14px',textAlign:'center',background:col==='v'?C.blo:'transparent',
                      borderLeft:col==='v'?`1px solid rgba(37,99,235,0.2)`:undefined,
                      borderRight:col==='v'?`1px solid rgba(37,99,235,0.2)`:undefined}}>
                      {row[col]?(
                        <span style={{color:C.b,fontSize:14,fontWeight:700}}>✓</span>
                      ):(
                        <span style={{color:'rgba(13,13,15,0.15)',fontSize:14}}>✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {[
          {
            title:t.notreAvantage,color:C.b,
            items:['Seule solution 100% souveraine France/EU','IA vocale native pour la reception d\'appels','Conformite CIUS-FR automatisee en temps reel','Hebergement Hetzner DE certifie RGPD']
          },
          {
            title:t.tarifInclus,color:C.grn,
            items:['Aucun module payant en supplement','Integrations bancaires PSD2 incluses','Support prioritaire sans surcoute','Mises a jour reglementaires automatiques']
          },
          {
            title:t.certifications,color:C.gold,
            items:['RGPD article 28 - Conformite totale','Hetzner DE - Donnees hebergees en Allemagne','Supabase IE - GDPR Tier 1','SecNumCloud compatible']
          },
        ].map(s=>(
          <Card key={s.title}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:'monospace',color:s.color,marginBottom:14}}>{s.title}</div>
            {s.items.map(item=>(
              <div key={item} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:9}}>
                <span style={{color:s.color,flexShrink:0,fontSize:12,fontFamily:'monospace'}}>✓</span>
                <span style={{fontSize:11,color:C.g2,fontFamily:'monospace',lineHeight:1.5}}>{item}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════ */
export default function Dashboard() {
  const [tab,setTab]=useState<Tab>('overview')
  const [demo,setDemo]=useState(true)
  const [lang,setLang]=useState<Lang>('fr')
  const [toast,setToast]=useState<{msg:string;ok:boolean}|null>(null)
  const t=T[lang]

  function showToast(msg:string,ok=true) { setToast({msg,ok}) }

  function handleExport() {
    showToast('Rapport genere et telecharge')
    const data={date:new Date().toISOString(),tab,demo,lang}
    const a=document.createElement('a')
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
    a.download=`vanivert-rapport-${Date.now()}.json`
    a.click()
  }

  const titles:Record<Tab,string>={
    overview:'Vue generale',treasury:'Tresorerie',invoices:'Factures',
    compliance:'Conformite',integrations:'Integrations',alerts:'Alertes',
    voice:'Reception Vocale IA',docs:'Documents',benchmark:'Benchmark concurrentiel'
  }

  const tabProps={t,demo,toast:showToast}

  return (
    <div style={{display:'flex',minHeight:'100dvh',background:C.bg,fontFamily:'Inter,monospace,sans-serif',color:C.g1}}>
      <Sidebar tab={tab} setTab={setTab} demo={demo} setDemo={setDemo} lang={lang} setLang={setLang} t={t}/>
      <main style={{flex:1,padding:'24px 28px',overflowY:'auto',overflowX:'hidden',minWidth:0}}>
        <Header title={lang==='fr'?titles[tab]:T.en.nav[['overview','treasury','invoices','compliance','integrations','alerts','voice','docs','benchmark'].indexOf(tab)]} t={t} onExport={handleExport}/>
        <AnimatePresence mode="wait">
          <motion.div key={tab+demo+lang} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.2}}>
            {tab==='overview'&&<TabOverview {...tabProps}/>}
            {tab==='treasury'&&<TabTreasury {...tabProps}/>}
            {tab==='invoices'&&<TabInvoices {...tabProps}/>}
            {tab==='compliance'&&<TabCompliance {...tabProps}/>}
            {tab==='integrations'&&<TabIntegrations {...tabProps}/>}
            {tab==='alerts'&&<TabAlerts {...tabProps}/>}
            {tab==='voice'&&<TabVoice {...tabProps}/>}
            {tab==='docs'&&<TabDocs {...tabProps}/>}
            {tab==='benchmark'&&<TabBenchmark {...tabProps}/>}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {toast&&<Toast msg={toast.msg} ok={toast.ok} onDone={()=>setToast(null)}/>}
      </AnimatePresence>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(13,13,15,0.07);border-radius:2px}
        *{box-sizing:border-box}
        button:active{transform:scale(0.97)}
        input::placeholder{color:rgba(13,13,15,0.2)}
        a{cursor:pointer}
      `}</style>
    </div>
  )
}
