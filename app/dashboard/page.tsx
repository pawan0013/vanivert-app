'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── TOKENS ── */
const C = {
  bg:'#07080A', card:'#0E1012', card2:'#141618',
  border:'rgba(255,255,255,0.06)', border2:'rgba(255,255,255,0.10)',
  b:'#2563EB', blo:'rgba(37,99,235,0.12)', bhi:'rgba(37,99,235,0.22)',
  w:'#F8FAFC', g1:'rgba(248,250,252,0.85)', g2:'rgba(248,250,252,0.50)', g3:'rgba(248,250,252,0.25)',
  grn:'#22C55E', grn2:'rgba(34,197,94,0.10)',
  red:'#EF4444', red2:'rgba(239,68,68,0.10)',
  gold:'#F59E0B', gold2:'rgba(245,158,11,0.10)',
  purple:'#A78BFA', purple2:'rgba(167,139,250,0.10)',
  teal:'#2DD4BF',
}
const E: [number,number,number,number] = [0.16,1,0.3,1]
const anim = (d=0) => ({ initial:{opacity:0,y:12}, animate:{opacity:1,y:0}, transition:{duration:0.45,ease:E,delay:d} })
const TODAY = new Date()
const DAYS_LEFT = Math.max(0, Math.ceil((new Date('2026-09-01T00:00:00+02:00').getTime()-TODAY.getTime())/86400000))

/* ── TRANSLATIONS ── */
const T = {
  fr: {
    nav: ['Vue generale','Tresorerie','Factures','Conformite','Integrations','Alertes','Voix','Documents'],
    navIcons: ['◈','◉','◧','◎','⊞','◬','◐','◫'],
    overview:'Vue generale', allSystems:'Tous systemes actifs',
    updated:'mis a jour il y a', minAgo:'3 min',
    totalCash:'Tresorerie totale', accounts:'comptes · Bridge PSD2',
    days:'j avant le 1er sept. 2026', mrr:'MRR',
    activeClients:'clients actifs', totalBalance:'Solde total',
    psd2:'comptes PSD2', overdueDebts:'Creances en retard',
    clients:'clients', daysDeadline:'Jours avant deadline',
    dgfip:'Deadline DGFiP', cashflow:'Flux de tresorerie 2026',
    realForecast:'Reel (Jan-Jul) + Previsions (Aou-Dec)',
    bankAccounts:'Comptes bancaires', bridgePsd2:'Bridge API PSD2',
    entries:'Entrees reelles', forecast:'Entrees (prevision)', expenses:'Depenses',
    recentAlerts:'Alertes recentes', publicSite:'Site public', exportReport:'Exporter rapport',
    demo:'Mode demo', real:'Mode reel', switchToReal:'Passer aux donnees reelles',
    switchToDemo:'Passer en mode demo', lang:'FR',
    compliance:'Conformite DGFiP', invoices:'Factures et PA',
    integrations:'Integrations', alerts:'Alertes', voice:'Reception vocale', docs:'Documents IA',
    treasury:'Tresorerie', benchmark:'Comparatif',
    urgent:'critique', clients2:'2 clients',
  },
  en: {
    nav: ['Overview','Treasury','Invoices','Compliance','Integrations','Alerts','Voice','Documents'],
    navIcons: ['◈','◉','◧','◎','⊞','◬','◐','◫'],
    overview:'Overview', allSystems:'All systems active',
    updated:'updated', minAgo:'3 min ago',
    totalCash:'Total cash', accounts:'accounts · Bridge PSD2',
    days:'days before Sept. 1, 2026', mrr:'MRR',
    activeClients:'active clients', totalBalance:'Total balance',
    psd2:'PSD2 accounts', overdueDebts:'Overdue debts',
    clients:'clients', daysDeadline:'Days to deadline',
    dgfip:'DGFiP Deadline', cashflow:'Cash flow 2026',
    realForecast:'Actual (Jan-Jul) + Forecasts (Aug-Dec)',
    bankAccounts:'Bank accounts', bridgePsd2:'Bridge API PSD2',
    entries:'Actual entries', forecast:'Entries (forecast)', expenses:'Expenses',
    recentAlerts:'Recent alerts', publicSite:'Public site', exportReport:'Export report',
    demo:'Demo mode', real:'Real mode', switchToReal:'Switch to real data',
    switchToDemo:'Switch to demo mode', lang:'EN',
    compliance:'DGFiP Compliance', invoices:'Invoices & PA',
    integrations:'Integrations', alerts:'Alerts', voice:'Voice reception', docs:'AI Documents',
    treasury:'Treasury', benchmark:'Benchmark',
    urgent:'critical', clients2:'2 clients',
  }
}

/* ── DEMO DATA ── */
const DEMO_CASHFLOW = [
  {m:'Jan',i:42000,o:28000,f:false},{m:'Fev',i:38000,o:31000,f:false},
  {m:'Mar',i:51000,o:29000,f:false},{m:'Avr',i:47000,o:33000,f:false},
  {m:'Mai',i:63000,o:35000,f:false},{m:'Jun',i:58000,o:31000,f:false},
  {m:'Jul',i:71000,o:38000,f:false},{m:'Aou',i:68000,o:36000,f:true},
  {m:'Sep',i:84000,o:42000,f:true},{m:'Oct',i:91000,o:45000,f:true},
  {m:'Nov',i:88000,o:44000,f:true},{m:'Dec',i:102000,o:48000,f:true},
]
const REAL_CASHFLOW = DEMO_CASHFLOW.map(d => ({...d, i:0, o:0}))

const DEMO_BANKS = [
  {bank:'Qonto',balance:12847.32,type:'Courant',updated:'il y a 3 min',color:'#1A237E',icon:'Q',connected:true},
  {bank:'BNP Paribas',balance:34200.00,type:'Pro',updated:'il y a 1h',color:'#006B3E',icon:'B',connected:true},
  {bank:'Credit Agricole',balance:8150.45,type:'Epargne',updated:'il y a 4h',color:'#007036',icon:'C',connected:true},
]

const DEMO_INVOICES = [
  {id:'INV-2026-047',client:'PROLANN SAS',siret:'35231982602570',amount:4200,due:'2026-07-15',status:'overdue',days:12,facturx:true,pa:'Docoon'},
  {id:'INV-2026-048',client:'Hotel Ker Buhe',siret:'12345678901234',amount:285,due:'2026-07-30',status:'pending',days:-2,facturx:true,pa:'Docoon'},
  {id:'INV-2026-049',client:'Cabinet Dr. Martin',siret:'98765432109876',amount:228,due:'2026-08-01',status:'pending',days:-4,facturx:false,pa:null},
  {id:'INV-2026-050',client:'MECA ARMOR SARL',siret:'45678901234567',amount:1200,due:'2026-07-08',status:'paid',days:0,facturx:true,pa:'Docoon'},
  {id:'INV-2026-051',client:'Oxxius Lannion',siret:'56789012345678',amount:3600,due:'2026-08-15',status:'pending',days:-18,facturx:true,pa:'Docoon'},
  {id:'INV-2026-052',client:'Apizee SAS',siret:'67890123456789',amount:1500,due:'2026-07-05',status:'overdue',days:17,facturx:true,pa:'Docoon'},
]

const BENCHMARK_DATA = [
  {
    feature:'E-facturation DGFiP',
    vanivert:'Inclus (Docoon PDP n01)',
    pennylane:'Supplement 30EUR/mois',
    agicap:'Non inclus',
    qonto:'Partenariat PA uniquement',
    sage:'Module separe 1500EUR',
  },
  {
    feature:'Conformite CIUS-FR auto',
    vanivert:'100% automatique',
    pennylane:'Manuel + verification',
    agicap:'Non disponible',
    qonto:'Non disponible',
    sage:'Semi-automatique',
  },
  {
    feature:'Reception vocale IA',
    vanivert:'Inclus (19EUR/mois)',
    pennylane:'Non disponible',
    agicap:'Non disponible',
    qonto:'Non disponible',
    sage:'Non disponible',
  },
  {
    feature:'Smart CFO / Previsions',
    vanivert:'Inclus (FinGPT)',
    pennylane:'Basique',
    agicap:'Avance (core product)',
    qonto:'Basique',
    sage:'Module Analytics 990EUR',
  },
  {
    feature:'Hebergement donnees',
    vanivert:'EU souverain (Hetzner DE)',
    pennylane:'AWS Paris',
    agicap:'AWS Frankfurt',
    qonto:'AWS Frankfurt',
    sage:'Multi-region',
  },
  {
    feature:'Connectivite bancaire',
    vanivert:'Bridge API PSD2',
    pennylane:'Bridge API PSD2',
    agicap:'Salt Edge PSD2',
    qonto:'Natif',
    sage:'Bankin (partenaire)',
  },
  {
    feature:'Integration ERP',
    vanivert:'Sage, Cegid, SAP (middleware)',
    pennylane:'Natif Sage, FEC',
    agicap:'Natif multi-ERP',
    qonto:'API uniquement',
    sage:'Natif',
  },
  {
    feature:'Annuaire DGFiP gestion',
    vanivert:'Gere par Vanivert',
    pennylane:'Client responsable',
    agicap:'Non disponible',
    qonto:'Non disponible',
    sage:'Client responsable',
  },
  {
    feature:'OAuth Microsoft / Google',
    vanivert:'Inclus',
    pennylane:'Google uniquement',
    agicap:'Google uniquement',
    qonto:'Non disponible',
    sage:'Microsoft uniquement',
  },
  {
    feature:'Alertes reglementaires',
    vanivert:'grcx (DGFiP, CNIL, AMF, ACPR)',
    pennylane:'Email newsletter',
    agicap:'Non disponible',
    qonto:'Non disponible',
    sage:'Bulletin mensuel',
  },
  {
    feature:'Tarif tout inclus / mois',
    vanivert:'19 a 1200 EUR',
    pennylane:'A partir de 29 EUR',
    agicap:'A partir de 499 EUR',
    qonto:'A partir de 29 EUR + PA',
    sage:'A partir de 990 EUR',
  },
]

const INTEGRATIONS_LIST = [
  {name:'Qonto',cat:'Banque',status:'connected',detail:'Solde live PSD2',bg:'#E8EAF6',fg:'#1A237E',icon:'Q'},
  {name:'Bridge API',cat:'PSD2',status:'connected',detail:'3 banques synchronisees',bg:'#E1F5FE',fg:'#01579B',icon:'B'},
  {name:'Pennylane',cat:'Comptabilite',status:'connected',detail:'Journaux synchronises',bg:'#EEF5FF',fg:'#0052CC',icon:'P'},
  {name:'Docoon',cat:'E-facturation PA',status:'connected',detail:'PA n01 DGFiP active',bg:'#F3E5F5',fg:'#6A1B9A',icon:'D'},
  {name:'Chorus Pro',cat:'Facturation B2G',status:'connected',detail:'Secteur public',bg:'#E8F5E9',fg:'#1B5E20',icon:'C'},
  {name:'Doctolib',cat:'Agenda medical',status:'connected',detail:'RDV vocal en temps reel',bg:'#E3F2FD',fg:'#0277BD',icon:'D'},
  {name:'Google Calendar',cat:'Agenda',status:'connected',detail:'Fallback agenda',bg:'#FFEBEE',fg:'#C62828',icon:'G'},
  {name:'n8n',cat:'Automation',status:'connected',detail:'Relances + alertes auto',bg:'#FFF3E0',fg:'#E65100',icon:'n'},
  {name:'Stripe',cat:'Paiements',status:'pending',detail:'Lien paiement sur factures',bg:'#EDE7F6',fg:'#4527A0',icon:'S'},
  {name:'GoCardless',cat:'SEPA',status:'pending',detail:'Prelevement automatique',bg:'#E0F2F1',fg:'#00695C',icon:'G'},
  {name:'Sage 100',cat:'ERP',status:'pending',detail:'Export CSV vers Docling',bg:'#E8F5E9',fg:'#2E7D32',icon:'S'},
  {name:'Cegid XRP',cat:'ERP',status:'pending',detail:'Webhook REST conformite',bg:'#FFF3E0',fg:'#E65100',icon:'C'},
  {name:'Microsoft 365',cat:'Productivite',status:'pending',detail:'OAuth + Teams alerts',bg:'#E3F2FD',fg:'#0078D4',icon:'M'},
  {name:'Salesforce',cat:'CRM',status:'pending',detail:'Sync opportunites clients',bg:'#E1F5FE',fg:'#00A1E0',icon:'S'},
]

const CALLS_DATA = [
  {id:'C-001',caller:'+33 6 12 34 56 78',duration:'2:34',type:'Rendez-vous',result:'Reserve',time:'14:32',transcript:'Bonjour, je souhaite prendre rendez-vous pour une consultation...'},
  {id:'C-002',caller:'+33 2 96 48 12 34',duration:'1:12',type:'Information',result:'Message',time:'13:15',transcript:'Pouvez-vous me rappeler concernant votre offre de conformite ?'},
  {id:'C-003',caller:'+33 6 87 65 43 21',duration:'0:45',type:'Urgence',result:'Transfere',time:'11:50',transcript:'J\'ai recu une lettre de Valeo concernant la facturation electronique...'},
  {id:'C-004',caller:'+33 2 96 37 89 01',duration:'3:21',type:'Rendez-vous',result:'Reserve',time:'10:28',transcript:'Je voudrais savoir si vous avez de la disponibilite pour lundi prochain...'},
]

const COMPLIANCE_DATA = [
  {id:'FR-EFACT-001',label:'Enrolement annuaire centralise DGFiP',status:'done',critical:true,detail:'Confirme le 15 juin 2026'},
  {id:'FR-EFACT-002',label:'Plateforme Agreee Docoon PA n01',status:'done',critical:true,detail:'Connectee, active'},
  {id:'FR-CIUS-001',label:'Validation SIRET (SIRENE INSEE)',status:'done',critical:false,detail:'100% des factures validees'},
  {id:'FR-EFACT-003',label:'Statuts cycle de vie (Deposee / Encaissee)',status:'done',critical:false,detail:'Retournes en temps reel'},
  {id:'FR-EFACT-004',label:'Format Factur-X (PDF/A-3 + CII XML)',status:'done',critical:false,detail:'Genere automatiquement'},
  {id:'FR-ARCEP-001',label:'Declaration ARCEP operateur telecoms',status:'pending',critical:true,detail:'Dossier depose - J+14 validation'},
  {id:'FR-RGPD-001',label:'Registre des traitements CNIL (Art. 30)',status:'pending',critical:false,detail:'A finaliser cette semaine'},
  {id:'FR-RGPD-002',label:'DPA sous-traitants (Supabase, Hetzner)',status:'done',critical:false,detail:'Signes le 20 juin 2026'},
  {id:'FR-RGPD-003',label:'Consentement vocal RGPD (touche 1)',status:'done',critical:false,detail:'Hardcode, non contournable'},
  {id:'FR-CDC-001',label:'Mentions legales CGV (CGI Art. 54)',status:'done',critical:false,detail:'En ligne sur vanivert.fr'},
  {id:'ISO-27001',label:'ISO 27001 Phase 1',status:'todo',critical:false,detail:'Prevu mois 6 post-financement'},
]

const ALERTS_DATA = [
  {type:'critical',cat:'Facture',msg:'PROLANN SAS - Facture INV-2026-047 impayee depuis 12 jours - 4 200 EUR',time:'il y a 2h',action:'Relancer'},
  {type:'warning',cat:'DGFiP',msg:'grcx : Mise a jour CIUS-FR v2.3 publiee - verifier conformite',time:'il y a 6h',action:'Voir'},
  {type:'warning',cat:'Tresorerie',msg:'Prevision J+30 : solde estime 8% en dessous du mois dernier',time:'il y a 1j',action:'Analyser'},
  {type:'info',cat:'DGFiP',msg:'Nouvelle PA agreee ajoutee a l\'annuaire DGFiP - aucun impact',time:'il y a 2j',action:'Voir'},
  {type:'info',cat:'CNIL',msg:'Delai mise a jour du registre des traitements : 5 jours restants',time:'il y a 3j',action:'Agir'},
]

/* ── PRIMITIVES ── */
function Dot({color,pulse=false}:{color:string;pulse?:boolean}) {
  return <span style={{width:7,height:7,borderRadius:'50%',background:color,display:'inline-block',flexShrink:0,animation:pulse?'pulse 1.8s ease-in-out infinite':undefined}}/>
}

function StatusBadge({status}:{status:string}) {
  const m: Record<string,[string,string]> = {
    done:['Conforme',C.grn],paid:['Paye',C.grn],connected:['Connecte',C.grn],
    pending:['En cours',C.gold],overdue:['En retard',C.red],
    todo:['Planifie',C.g3],draft:['Brouillon',C.purple],
  }
  const [l,c]=m[status]||[status,C.g2]
  return <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,
    background:`${c}18`,color:c,fontFamily:'monospace',letterSpacing:'0.04em',
    textTransform:'uppercase',whiteSpace:'nowrap'}}>{l}</span>
}

function Card({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:'20px 22px',...style}}>{children}</div>
}

function SL({text}:{text:string}) {
  return <div style={{fontSize:10,fontFamily:'monospace',textTransform:'uppercase',
    letterSpacing:'0.10em',color:C.g3,marginBottom:14}}>{text}</div>
}

function KPICard({title,value,sub,color=C.b,spark}:{title:string;value:string|number;sub?:string;color?:string;spark?:number[]}) {
  return (
    <motion.div {...anim()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden'}}>
      {spark&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:44,opacity:0.3}}><Spark d={spark} c={color}/></div>}
      <div style={{fontSize:10,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.08em',color:C.g3,marginBottom:8}}>{title}</div>
      <div style={{fontFamily:'Inter',fontWeight:900,fontSize:26,letterSpacing:'-0.04em',color,lineHeight:1}}>
        {typeof value==='number'?value.toLocaleString('fr-FR'):value}
      </div>
      {sub&&<div style={{fontSize:11,color:C.g3,marginTop:5}}>{sub}</div>}
    </motion.div>
  )
}

function Spark({d,c}:{d:number[];c:string}) {
  const max=Math.max(...d),min=Math.min(...d),r=max-min||1
  const pts=d.map((v,i)=>`${(i/(d.length-1))*100},${100-((v-min)/r*80+5)}`).join(' ')
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
    <polyline points={pts} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

function CashChart({data}:{data:typeof DEMO_CASHFLOW}) {
  const [hover,setHover]=useState<number|null>(null)
  const max=Math.max(...data.map(d=>d.i))
  const W=60
  return (
    <div style={{position:'relative',height:160}}>
      <svg viewBox={`0 0 ${data.length*W} 160`} style={{width:'100%',height:'100%'}} overflow="visible">
        {[0,33,66,100].map(p=>(
          <line key={p} x1="0" y1={p*1.3+10} x2={data.length*W} y2={p*1.3+10} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
        ))}
        <polyline
          points={data.map((d,i)=>`${i*W+W/2},${150-((d.i/max)*130)}`).join(' ')}
          fill="none" stroke={C.b} strokeWidth="2" strokeLinecap="round"/>
        <polyline
          points={data.map((d,i)=>`${i*W+W/2},${150-((d.o/max)*130)}`).join(' ')}
          fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,3" opacity="0.6"/>
        {data.map((d,i)=>(
          <g key={d.m}>
            <rect x={i*W} y={0} width={W} height={155} fill="transparent"
              onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{cursor:'pointer'}}/>
            {hover===i&&(
              <g>
                <rect x={i*W+2} y={2} width={W-4} height={64} rx={6} fill={C.card2} opacity="0.95"/>
                <text x={i*W+W/2} y={18} textAnchor="middle" fill={C.g2} fontSize="8" fontFamily="monospace">{d.m}</text>
                <text x={i*W+W/2} y={32} textAnchor="middle" fill={C.b} fontSize="9" fontWeight="700">+{(d.i/1000).toFixed(0)}K</text>
                <text x={i*W+W/2} y={46} textAnchor="middle" fill={C.red} fontSize="9">-{(d.o/1000).toFixed(0)}K</text>
                <text x={i*W+W/2} y={60} textAnchor="middle" fill={C.grn} fontSize="8">={((d.i-d.o)/1000).toFixed(0)}K</text>
              </g>
            )}
            <text x={i*W+W/2} y={158} textAnchor="middle" fill={d.f?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.3)'} fontSize="8" fontFamily="monospace">{d.m}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── SIDEBAR ── */
type Tab = 'overview'|'treasury'|'invoices'|'compliance'|'integrations'|'alerts'|'voice'|'docs'|'benchmark'

const NAV_IDS: Tab[] = ['overview','treasury','invoices','compliance','integrations','alerts','voice','docs']

function Sidebar({active,set,t,demo,setDemo,lang,setLang}:{
  active:Tab; set:(t:Tab)=>void;
  t:typeof T.fr; demo:boolean; setDemo:(b:boolean)=>void;
  lang:'fr'|'en'; setLang:(l:'fr'|'en')=>void;
}) {
  const totalCash=DEMO_BANKS.reduce((a,b)=>a+b.balance,0)
  const navLabels=[...t.nav,'Benchmark']
  const navIds: Tab[]=[...NAV_IDS,'benchmark']
  return (
    <aside style={{width:224,background:C.card,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',flexShrink:0,height:'100dvh',position:'sticky',top:0}}>
      <div style={{padding:'18px 16px 14px',borderBottom:`1px solid ${C.border}`}}>
        <a href="/" style={{fontWeight:900,fontSize:17,color:C.w,letterSpacing:'-0.05em',display:'flex',alignItems:'center',gap:7,textDecoration:'none'}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.b,boxShadow:`0 0 10px ${C.b}`}}/>
          vanivert
        </a>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,letterSpacing:'0.1em',textTransform:'uppercase',marginTop:3}}>Smart CFO</div>
      </div>

      {/* Demo/Real toggle */}
      <div style={{margin:'10px 12px',padding:'10px 12px',borderRadius:10,
        background:demo?C.purple2:C.grn2,border:`1px solid ${demo?'rgba(167,139,250,0.2)':'rgba(34,197,94,0.15)'}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div style={{fontSize:11,fontWeight:700,color:demo?C.purple:C.grn}}>{demo?t.demo:t.real}</div>
          <button onClick={()=>setDemo(!demo)}
            style={{fontSize:9,padding:'2px 8px',borderRadius:6,border:`1px solid ${demo?C.purple:C.grn}`,
              background:'transparent',color:demo?C.purple:C.grn,cursor:'pointer',fontFamily:'monospace'}}>
            {demo?'DEMO':'REEL'}
          </button>
        </div>
        <div style={{fontSize:9,color:C.g3,fontFamily:'monospace'}}>{demo?t.switchToReal:t.switchToDemo}</div>
      </div>

      {/* Cash summary */}
      {demo&&<div style={{margin:'0 12px 8px',padding:'10px 12px',borderRadius:10,background:C.blo,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.08em',color:C.g3,marginBottom:4}}>{t.totalCash}</div>
        <div style={{fontFamily:'monospace',fontWeight:700,fontSize:16,color:C.b,letterSpacing:'-0.02em'}}>
          {totalCash.toLocaleString('fr-FR',{minimumFractionDigits:2})} EUR
        </div>
        <div style={{fontSize:9,color:C.g3,marginTop:2}}>3 {t.accounts}</div>
      </div>}

      <nav style={{flex:1,padding:'4px 8px',overflowY:'auto'}}>
        {navIds.map((id,i)=>(
          <button key={id} onClick={()=>set(id)}
            style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:10,
              border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',fontSize:12,
              fontWeight:active===id?700:400,
              background:active===id?C.blo:'transparent',
              color:active===id?C.b:C.g2,
              borderLeft:`2px solid ${active===id?C.b:'transparent'}`,
              transition:'all 0.15s',marginBottom:2,textAlign:'left'}}>
            <span style={{fontSize:13,opacity:active===id?1:0.5}}>{i<8?t.navIcons[i]:'⊡'}</span>
            {navLabels[i]}
            {id==='alerts'&&<span style={{marginLeft:'auto',fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:C.red2,color:C.red}}>2</span>}
          </button>
        ))}
      </nav>

      <div style={{padding:'10px 12px 14px',borderBottom:`1px solid ${C.border}`}}>
        {/* Language toggle */}
        <div style={{display:'flex',gap:6,marginBottom:10}}>
          {(['fr','en'] as const).map(l=>(
            <button key={l} onClick={()=>setLang(l)}
              style={{flex:1,padding:'5px',borderRadius:7,border:`1px solid ${lang===l?C.b:C.border}`,
                background:lang===l?C.blo:'transparent',color:lang===l?C.b:C.g3,
                fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'monospace',
                textTransform:'uppercase',letterSpacing:'0.06em'}}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'10px 12px 14px'}}>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,textAlign:'center',display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>
          {['RGPD','Hetzner DE','Supabase IE','grcx','Pxtly'].map(t=>(
            <span key={t} style={{padding:'2px 5px',borderRadius:4,background:'rgba(255,255,255,0.03)',border:`1px solid ${C.border}`}}>{t}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ── TAB: OVERVIEW ── */
function TabOverview({t,demo}:{t:typeof T.fr;demo:boolean}) {
  const cf=demo?DEMO_CASHFLOW:REAL_CASHFLOW
  const totalIn=cf.reduce((a,d)=>a+d.i,0)
  const banks=demo?DEMO_BANKS:[]
  const totalBal=banks.reduce((a,b)=>a+b.balance,0)
  const overdue=demo?5700:0
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title={t.mrr} value={demo?"9 368 EUR":"-- EUR"} color={C.b} sub={demo?`19 ${t.activeClients}`:t.activeClients} spark={demo?[5000,6200,7100,8000,9368]:undefined}/>
        <KPICard title={t.totalBalance} value={demo?`${totalBal.toLocaleString('fr-FR',{maximumFractionDigits:0})} EUR`:"-- EUR"} color={C.grn} sub={demo?`3 ${t.psd2}`:t.psd2} spark={demo?[48000,50000,47000,52000,55197]:undefined}/>
        <KPICard title={t.overdueDebts} value={demo?`${overdue.toLocaleString('fr-FR')} EUR`:"-- EUR"} color={C.red} sub={demo?`2 ${t.clients}`:t.clients} spark={demo?[0,800,1500,5700,5700]:undefined}/>
        <KPICard title={t.daysDeadline} value={DAYS_LEFT} color={C.gold} sub={t.dgfip} spark={[90,85,80,75,DAYS_LEFT]}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:12,marginBottom:12}}>
        <Card>
          <SL text={`${t.cashflow} - ${t.realForecast}`}/>
          {demo?<CashChart data={cf}/>:<div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',color:C.g3,fontSize:13}}>Connectez votre banque via Bridge PSD2 pour voir vos donnees</div>}
          <div style={{display:'flex',gap:14,marginTop:10}}>
            {[[C.b,t.entries],[C.b+'88',t.forecast],[C.red,t.expenses]].map(([c,l])=>(
              <div key={l as string} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.g3}}>
                <div style={{width:16,height:2,background:c as string,borderRadius:1}}/>{l}
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Card>
            <SL text={`${t.bankAccounts} (${t.bridgePsd2})`}/>
            {demo?banks.map(acc=>(
              <div key={acc.bank} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:28,height:28,borderRadius:7,background:acc.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{acc.icon}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:C.g1}}>{acc.bank}</div>
                    <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{acc.type} · {acc.updated}</div>
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:700,fontFamily:'monospace',color:acc.balance>10000?C.grn:C.gold}}>
                  {acc.balance.toLocaleString('fr-FR',{minimumFractionDigits:2})} EUR
                </div>
              </div>
            )):<div style={{color:C.g3,fontSize:13,padding:'12px 0'}}>Aucun compte connecte</div>}
          </Card>
          <Card>
            <SL text={t.compliance}/>
            {[
              {l:'Factures Factur-X',v:demo?'5/7':'--',ok:true},
              {l:'SIRET valides SIRENE',v:'100%',ok:true},
              {l:'Annuaire DGFiP',v:'Enrole',ok:true},
              {l:'ARCEP declaration',v:'En cours',ok:false},
            ].map(r=>(
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${C.border}`,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  <Dot color={r.ok?C.grn:C.gold} pulse={!r.ok}/>
                  <span style={{fontSize:12,color:C.g2}}>{r.l}</span>
                </div>
                <span style={{fontSize:12,fontWeight:600,fontFamily:'monospace',color:r.ok?C.grn:C.gold}}>{r.v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Card>
        <SL text={t.recentAlerts}/>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {ALERTS_DATA.slice(0,3).map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,
              background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
              border:`1px solid ${a.type==='critical'?'rgba(239,68,68,0.2)':a.type==='warning'?'rgba(245,158,11,0.2)':'rgba(37,99,235,0.2)'}`}}>
              <Dot color={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
              <span style={{fontSize:10,fontFamily:'monospace',padding:'2px 6px',borderRadius:4,background:'rgba(255,255,255,0.05)',color:C.g3}}>{a.cat}</span>
              <span style={{fontSize:12,color:C.g1,flex:1}}>{a.msg}</span>
              <span style={{fontSize:10,color:C.g3,fontFamily:'monospace',flexShrink:0}}>{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

/* ── TAB: INVOICES ── */
function TabInvoices({t,demo}:{t:typeof T.fr;demo:boolean}) {
  const [filter,setFilter]=useState('all')
  const inv=demo?DEMO_INVOICES:[]
  const filtered=filter==='all'?inv:inv.filter(i=>i.status===filter)
  const overdue=inv.filter(i=>i.status==='overdue')
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="En attente" value={demo?`${inv.filter(i=>i.status==='pending').reduce((a,i)=>a+i.amount,0).toLocaleString('fr-FR')} EUR`:"--"} color={C.gold}/>
        <KPICard title="En retard" value={demo?`${overdue.reduce((a,i)=>a+i.amount,0).toLocaleString('fr-FR')} EUR`:"--"} color={C.red}/>
        <KPICard title="Paye ce mois" value={demo?`${inv.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0).toLocaleString('fr-FR')} EUR`:"--"} color={C.grn}/>
        <KPICard title="Conformite Factur-X" value={demo?`${inv.filter(i=>i.facturx).length}/${inv.length}`:"--"} color={C.b}/>
      </div>
      {demo&&overdue.length>0&&(
        <div style={{padding:'12px 16px',borderRadius:12,marginBottom:14,background:C.red2,border:'1px solid rgba(239,68,68,0.25)',display:'flex',alignItems:'center',gap:12}}>
          <Dot color={C.red} pulse/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:700,color:C.red}}>{overdue.length} facture(s) impayee(s) - {overdue.reduce((a,i)=>a+i.amount,0).toLocaleString('fr-FR')} EUR a relancer</span>
            <span style={{fontSize:12,color:C.g3,display:'block',marginTop:2}}>Relance automatique disponible via Vanivert</span>
          </div>
          <button style={{padding:'7px 16px',borderRadius:8,border:'none',background:C.red,color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'Inter'}}>Relancer tout</button>
        </div>
      )}
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <SL text="Factures - Pipeline e-facturation DGFiP"/>
          <div style={{display:'flex',gap:5}}>
            {['all','pending','overdue','paid'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{fontSize:10,padding:'3px 9px',borderRadius:6,border:`1px solid ${filter===f?C.b:C.border}`,cursor:'pointer',
                  background:filter===f?C.blo:'transparent',color:filter===f?C.b:C.g3,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                {f==='all'?'Toutes':f==='pending'?'Attente':f==='overdue'?'Retard':'Payees'}
              </button>
            ))}
          </div>
        </div>
        {!demo?<div style={{color:C.g3,fontSize:13,padding:'20px 0',textAlign:'center'}}>Connectez votre ERP ou importez vos factures pour commencer</div>:(
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>
            {['Reference','Client / SIRET','Montant','Factur-X','PA','Echeance','Statut','Action'].map(h=>(
              <th key={h} style={{padding:'7px 10px',textAlign:'left',fontSize:10,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.05em',color:C.g3,borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(inv=>(
              <tr key={inv.id} style={{borderBottom:`1px solid ${C.border}`,background:inv.status==='overdue'?'rgba(239,68,68,0.02)':'transparent'}}>
                <td style={{padding:'10px 10px',fontSize:11,fontFamily:'monospace',color:C.b,fontWeight:600}}>{inv.id}</td>
                <td style={{padding:'10px 10px'}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.g1}}>{inv.client}</div>
                  <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{inv.siret}</div>
                </td>
                <td style={{padding:'10px 10px',fontSize:13,fontWeight:700,fontFamily:'monospace',color:C.g1}}>{inv.amount.toLocaleString('fr-FR')} EUR</td>
                <td style={{padding:'10px 10px'}}>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:5,background:inv.facturx?C.grn2:C.red2,color:inv.facturx?C.grn:C.red,fontFamily:'monospace'}}>
                    {inv.facturx?'OK PDF/A-3':'A generer'}
                  </span>
                </td>
                <td style={{padding:'10px 10px',fontSize:11,color:inv.pa?C.grn:C.g3,fontFamily:'monospace'}}>{inv.pa||'--'}</td>
                <td style={{padding:'10px 10px'}}>
                  <div style={{fontSize:12,fontFamily:'monospace',color:inv.status==='overdue'?C.red:C.g2}}>{inv.due}</div>
                  {inv.status==='overdue'&&<div style={{fontSize:10,color:C.red}}>+{inv.days}j retard</div>}
                </td>
                <td style={{padding:'10px 10px'}}><StatusBadge status={inv.status}/></td>
                <td style={{padding:'10px 10px'}}>
                  <button style={{fontSize:10,padding:'4px 10px',borderRadius:6,border:`1px solid ${inv.status==='overdue'?C.red:C.border}`,cursor:'pointer',background:inv.status==='overdue'?C.red2:'transparent',color:inv.status==='overdue'?C.red:C.g3,fontFamily:'monospace',fontWeight:inv.status==='overdue'?700:400}}>
                    {inv.status==='overdue'?'Relancer':'Voir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </Card>
    </motion.div>
  )
}

/* ── TAB: COMPLIANCE ── */
function TabCompliance({t}:{t:typeof T.fr}) {
  const done=COMPLIANCE_DATA.filter(c=>c.status==='done').length
  const pct=Math.round((done/COMPLIANCE_DATA.length)*100)
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="Score de conformite" value={`${pct}%`} color={pct>=80?C.grn:pct>=60?C.gold:C.red}/>
        <KPICard title="Jours avant deadline" value={DAYS_LEFT} color={C.gold}/>
        <KPICard title="Factures Factur-X" value="5/7" color={C.b}/>
        <KPICard title="SIRET valides" value="100%" color={C.grn}/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <SL text="Checklist conformite DGFiP - Framework vanivert_fr"/>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:12,fontFamily:'monospace',color:C.g3}}>{done}/{COMPLIANCE_DATA.length}</span>
            <div style={{width:100,height:5,borderRadius:3,background:'rgba(255,255,255,0.07)'}}>
              <div style={{width:`${pct}%`,height:'100%',borderRadius:3,background:pct>=80?C.grn:C.gold,transition:'width 1s ease'}}/>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:pct>=80?C.grn:C.gold}}>{pct}%</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {COMPLIANCE_DATA.map(ctrl=>(
            <div key={ctrl.id} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:10,
              background:ctrl.status==='done'?'rgba(34,197,94,0.04)':ctrl.status==='pending'?'rgba(245,158,11,0.04)':'rgba(255,255,255,0.02)',
              border:`1px solid ${ctrl.status==='done'?'rgba(34,197,94,0.12)':ctrl.status==='pending'?'rgba(245,158,11,0.12)':C.border}`}}>
              <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,
                background:ctrl.status==='done'?C.grn2:ctrl.status==='pending'?C.gold2:'rgba(255,255,255,0.05)',
                border:`1.5px solid ${ctrl.status==='done'?C.grn:ctrl.status==='pending'?C.gold:C.g3}`,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:10}}>
                {ctrl.status==='done'?'ok':ctrl.status==='pending'?'...':'o'}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:ctrl.status==='done'?C.g1:ctrl.status==='pending'?C.gold:C.g3,fontWeight:ctrl.critical?700:400}}>
                  {ctrl.label}
                  {ctrl.critical&&<span style={{marginLeft:7,fontSize:9,padding:'2px 5px',borderRadius:4,background:C.red2,color:C.red,fontFamily:'monospace'}}>CRITIQUE</span>}
                </div>
                <div style={{fontSize:10,color:C.g3,marginTop:2,fontFamily:'monospace'}}>{ctrl.id} - {ctrl.detail}</div>
              </div>
              <StatusBadge status={ctrl.status}/>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

/* ── TAB: INTEGRATIONS ── */
function TabIntegrations({t}:{t:typeof T.fr}) {
  const connected=INTEGRATIONS_LIST.filter(i=>i.status==='connected').length
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="Integrations actives" value={connected} sub={`sur ${INTEGRATIONS_LIST.length} disponibles`} color={C.grn}/>
        <KPICard title="Sync en temps reel" value="PSD2 + Webhook" color={C.b} sub="Bridge API + n8n"/>
        <KPICard title="Derniere sync" value="il y a 3 min" color={C.g2} sub="Qonto + Bridge API"/>
      </div>
      <Card style={{marginBottom:12}}>
        <SL text="Toutes les integrations disponibles"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:9}}>
          {INTEGRATIONS_LIST.map(int=>(
            <div key={int.name} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:12,
              background:int.status==='connected'?'rgba(34,197,94,0.04)':'rgba(255,255,255,0.02)',
              border:`1px solid ${int.status==='connected'?'rgba(34,197,94,0.15)':C.border}`}}>
              <div style={{width:36,height:36,borderRadius:9,background:int.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:int.fg,flexShrink:0}}>
                {int.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.g1}}>{int.name}</span>
                  <StatusBadge status={int.status}/>
                </div>
                <div style={{fontSize:11,color:C.g3}}>{int.cat} - {int.detail}</div>
              </div>
              <button style={{fontSize:10,padding:'5px 11px',borderRadius:7,flexShrink:0,
                border:`1px solid ${int.status==='connected'?C.border:'rgba(37,99,235,0.4)'}`,
                cursor:'pointer',background:int.status==='pending'?C.blo:'transparent',
                color:int.status==='pending'?C.b:C.g3,fontFamily:'monospace',fontWeight:int.status==='pending'?700:400}}>
                {int.status==='connected'?'Config':'Connecter'}
              </button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SL text="Stack IA souveraine (open source)"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
          {[
            {n:'grcx',r:'Radar reglementaire',tag:'MIT',c:C.b},
            {n:'Pxtly',r:'ChromaDB + AML + ZKP',tag:'Apache 2.0',c:C.purple},
            {n:'Mistral 7B',r:'LLM souverain Hetzner',tag:'Apache 2.0',c:C.gold},
            {n:'faster-whisper',r:'STT vocal FR',tag:'MIT',c:C.grn},
            {n:'XTTS-v2',r:'TTS voix naturelle',tag:'MPL 2.0',c:C.teal},
            {n:'Docling',r:'Parse PDF Word Excel',tag:'MIT',c:C.gold},
            {n:'Lago',r:'Facturation usage',tag:'AGPL',c:C.purple},
            {n:'n8n',r:'Workflows automatises',tag:'Fair-code',c:C.grn},
          ].map(s=>(
            <div key={s.n} style={{padding:'12px 14px',borderRadius:10,background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,fontWeight:700,color:s.c,marginBottom:3}}>{s.n}</div>
              <div style={{fontSize:11,color:C.g3,marginBottom:7,lineHeight:1.4}}>{s.r}</div>
              <span style={{fontSize:9,fontFamily:'monospace',padding:'2px 5px',borderRadius:4,background:'rgba(255,255,255,0.05)',color:C.g3}}>{s.tag}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

/* ── TAB: ALERTS ── */
function TabAlerts() {
  const [dismissed,setDismissed]=useState<number[]>([])
  const visible=ALERTS_DATA.filter((_,i)=>!dismissed.includes(i))
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="Critiques" value={visible.filter(a=>a.type==='critical').length} color={C.red} sub="Action immediate"/>
        <KPICard title="Avertissements" value={visible.filter(a=>a.type==='warning').length} color={C.gold} sub="Sous 48 heures"/>
        <KPICard title="Informations" value={visible.filter(a=>a.type==='info').length} color={C.b} sub="Veille reglementaire"/>
      </div>
      <Card>
        <SL text="Centre d'alertes - grcx + Smart CFO + Tresorerie"/>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {visible.length===0&&<div style={{textAlign:'center',padding:'30px',color:C.g3,fontSize:13}}>Aucune alerte active - tous les systemes sont conformes</div>}
          {visible.map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',borderRadius:12,
              background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
              border:`1px solid ${a.type==='critical'?'rgba(239,68,68,0.25)':a.type==='warning'?'rgba(245,158,11,0.25)':'rgba(37,99,235,0.2)'}`}}>
              <Dot color={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
              <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(255,255,255,0.06)',color:C.g3,fontFamily:'monospace',flexShrink:0,whiteSpace:'nowrap'}}>{a.cat}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.g1,lineHeight:1.5}}>{a.msg}</div>
                <div style={{fontSize:10,color:C.g3,marginTop:3,fontFamily:'monospace'}}>{a.time}</div>
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <button onClick={()=>setDismissed(d=>[...d,ALERTS_DATA.indexOf(a)])}
                  style={{fontSize:10,padding:'4px 9px',borderRadius:7,border:`1px solid ${C.border}`,cursor:'pointer',background:'transparent',color:C.g3,fontFamily:'monospace'}}>
                  Ignorer
                </button>
                <button style={{fontSize:10,padding:'4px 10px',borderRadius:7,border:'none',cursor:'pointer',
                  background:a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b,color:'#fff',fontFamily:'monospace',fontWeight:700}}>
                  {a.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

/* ── TAB: VOICE ── */
function TabVoice() {
  const [sel,setSel]=useState<string|null>(null)
  const s=CALLS_DATA.find(c=>c.id===sel)
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="Appels aujourd'hui" value={12} color={C.b} sub="+20% vs hier" spark={[6,7,9,10,12]}/>
        <KPICard title="RDV reserves via IA" value={8} color={C.grn} sub="67% de conversion"/>
        <KPICard title="Minutes utilisees" value="47 min" color={C.gold} sub="200 incluses/mois"/>
        <KPICard title="Latence P95" value="<1 200ms" color={C.purple} sub="STT+LLM+TTS"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:12}}>
        <Card>
          <SL text="Journal des appels - Aujourd'hui"/>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {CALLS_DATA.map(c=>(
              <div key={c.id} onClick={()=>setSel(sel===c.id?null:c.id)}
                style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,cursor:'pointer',
                  background:sel===c.id?C.blo:C.card2,border:`1px solid ${sel===c.id?C.b:C.border}`}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:C.blo,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>▶</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:'monospace',color:C.g2}}>{c.caller}</div>
                  <div style={{fontSize:11,color:C.g3}}>{c.type} - {c.time}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{c.duration}</div>
                  <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:4,
                    background:c.result==='Reserve'?C.grn2:c.result==='Transfere'?C.gold2:'rgba(255,255,255,0.05)',
                    color:c.result==='Reserve'?C.grn:c.result==='Transfere'?C.gold:C.g3,fontFamily:'monospace'}}>{c.result}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {s?(
            <Card>
              <SL text={`Transcription - ${s.id}`}/>
              <div style={{padding:'12px 14px',borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,fontSize:13,color:C.g2,lineHeight:1.7,fontStyle:'italic'}}>
                "{s.transcript}"
              </div>
              <div style={{marginTop:10,display:'flex',gap:6,flexWrap:'wrap'}}>
                {[['Duree',s.duration],['Type',s.type],['Resultat',s.result],['Heure',s.time]].map(([k,v])=>(
                  <div key={k} style={{padding:'5px 9px',borderRadius:7,background:C.blo,border:`1px solid ${C.border}`}}>
                    <span style={{fontSize:9,color:C.g3,fontFamily:'monospace',textTransform:'uppercase',display:'block'}}>{k}</span>
                    <span style={{fontSize:11,fontWeight:600,color:C.b}}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ):(
            <Card style={{textAlign:'center',padding:'28px 22px'}}>
              <div style={{fontSize:28,marginBottom:10}}>◐</div>
              <div style={{fontSize:13,color:C.g3}}>Cliquez sur un appel pour voir la transcription</div>
            </Card>
          )}
          <Card>
            <SL text="Configuration vocale"/>
            {[
              {l:'Numero actif',v:'+33 X XX XX XX XX',c:C.g2,warn:true},
              {l:'STT Engine',v:'faster-whisper',c:C.b},
              {l:'LLM',v:'Mistral 7B Hetzner DE',c:C.purple},
              {l:'TTS',v:'XTTS-v2 (Coqui)',c:C.grn},
              {l:'Infra',v:'Hetzner AX41 Frankfurt',c:C.gold},
            ].map(s=>(
              <div key={s.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.g3}}>{s.l}</span>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  {s.warn&&<Dot color={C.gold} pulse/>}
                  <span style={{fontSize:12,fontWeight:600,fontFamily:'monospace',color:s.c}}>{s.v}</span>
                </div>
              </div>
            ))}
            {true&&<div style={{marginTop:10,padding:'9px 12px',borderRadius:9,background:C.gold2,border:'1px solid rgba(245,158,11,0.25)',fontSize:12,color:C.gold}}>
              Configurez votre numero Twilio dans site.config.ts
            </div>}
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

/* ── TAB: DOCS ── */
function TabDocs() {
  const [query,setQuery]=useState('')
  const [results,setResults]=useState<{text:string;rel:number}[]>([])
  const [loading,setLoading]=useState(false)
  const presets=['Factures impayees depuis plus de 30 jours','Chiffre d\'affaires du trimestre','Clients avec retards de paiement','Depenses fixes ce mois']
  async function search(q=query) {
    if(!q.trim()) return
    setQuery(q); setLoading(true)
    await new Promise(r=>setTimeout(r,1000))
    setResults([
      {text:'PROLANN SAS - 3 factures impayees depuis plus de 30 jours (total : 4 200 EUR). Facture INV-2026-047 du 15 juin 2026 est la plus ancienne (retard : 12 jours). Recommandation : relancer par email + appel Vanivert vocal.',rel:0.94},
      {text:'Apizee SAS - 1 facture impayee depuis 17 jours (1 500 EUR). Echeance depassee le 5 juillet 2026.',rel:0.87},
    ])
    setLoading(false)
  }
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="Factures indexees" value={143} color={C.b} sub="ChromaDB"/>
        <KPICard title="Contrats" value={12} color={C.purple} sub="Documents juridiques"/>
        <KPICard title="Releves bancaires" value={36} color={C.grn} sub="PSD2 + Bridge API"/>
        <KPICard title="Documents DGFiP" value={8} color={C.gold} sub="Conformite e-facturation"/>
      </div>
      <Card style={{marginBottom:12}}>
        <SL text="Interrogez vos documents en langage naturel (ChromaDB + Mistral 7B)"/>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
            placeholder="Ex: Quelles factures sont impayees depuis plus de 30 jours ?"
            style={{flex:1,padding:'11px 14px',borderRadius:10,border:`1.5px solid ${C.border}`,background:'rgba(255,255,255,0.03)',color:C.g1,fontSize:13,fontFamily:'Inter,sans-serif',outline:'none'}}
            onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
          <button onClick={()=>search()} style={{padding:'11px 20px',borderRadius:10,border:'none',background:C.b,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'Inter',opacity:loading?0.7:1}}>
            {loading?'...':'Interroger'}
          </button>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {presets.map(s=>(
            <button key={s} onClick={()=>search(s)} style={{fontSize:10,padding:'4px 10px',borderRadius:7,border:`1px solid ${C.border}`,background:'rgba(255,255,255,0.02)',color:C.g3,cursor:'pointer',fontFamily:'monospace'}}>
              {s}
            </button>
          ))}
        </div>
      </Card>
      {results.length>0&&(
        <Card style={{marginBottom:12}}>
          <SL text={`Resultats - ${results.length} document(s) trouve(s)`}/>
          {results.map((r,i)=>(
            <div key={i} style={{padding:'12px 14px',borderRadius:10,background:C.blo,border:'1px solid rgba(37,99,235,0.2)',marginBottom:7}}>
              <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'rgba(37,99,235,0.2)',color:C.b,fontFamily:'monospace',flexShrink:0}}>{(r.rel*100).toFixed(0)}%</span>
                <div style={{fontSize:12,color:C.g1,lineHeight:1.7}}>{r.text}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </motion.div>
  )
}

/* ── TAB: BENCHMARK ── */
function TabBenchmark({t}:{t:typeof T.fr}) {
  const competitors=['Vanivert','Pennylane','Agicap','Qonto CFO','Sage 100']
  const cols: (keyof typeof BENCHMARK_DATA[0])[]=['feature','vanivert','pennylane','agicap','qonto','sage']
  return (
    <motion.div {...anim()}>
      <div style={{marginBottom:16,padding:'14px 18px',borderRadius:12,background:C.blo,border:`1px solid rgba(37,99,235,0.2)`}}>
        <div style={{fontSize:13,fontWeight:700,color:C.b,marginBottom:4}}>Comparatif concurrentiel - Juin 2026</div>
        <div style={{fontSize:12,color:C.g3}}>Vanivert vs Pennylane, Agicap, Qonto CFO, Sage 100 - Positionnement conformite e-facturation DGFiP 2026</div>
      </div>
      <Card>
        <SL text="Comparaison fonctionnalites - Toutes offres incluses"/>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
            <thead>
              <tr>
                {['Fonctionnalite',...competitors].map((h,i)=>(
                  <th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:11,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em',
                    color:i===1?C.b:C.g3,borderBottom:`1px solid ${C.border}`,fontWeight:i===1?700:600,
                    background:i===1?C.blo:'transparent'}}>
                    {h}{i===1?' ✓':''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARK_DATA.map((row,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  {cols.map((col,j)=>(
                    <td key={col} style={{padding:'10px 12px',fontSize:12,
                      color:j===0?C.g1:j===1?C.b:C.g3,
                      fontWeight:j===1?600:j===0?600:400,
                      background:j===1?C.blo:'transparent',
                      borderLeft:j===1?`1px solid rgba(37,99,235,0.2)`:undefined,
                      borderRight:j===1?`1px solid rgba(37,99,235,0.2)`:undefined,
                    }}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:12}}>
        {[
          {title:'Notre avantage cle',items:['Seul a integrer e-facturation DGFiP + IA vocale + Smart CFO','Hebergement EU souverain inclus (RGPD natif)','Enrolement annuaire DGFiP gere par Vanivert']},
          {title:'Tarif tout inclus',items:['Voice Starter : 19 EUR/mois','Voice Business : 29 EUR/mois','Smart CFO + Conformite : 1 200 EUR/mois']},
          {title:'Certifications',items:['PA DGFiP via Docoon n01','ARCEP declaration en cours','ISO 27001 Phase 1 prevue M6']},
        ].map(s=>(
          <Card key={s.title}>
            <SL text={s.title}/>
            {s.items.map(item=>(
              <div key={item} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
                <span style={{color:C.grn,flexShrink:0,marginTop:2}}>ok</span>
                <span style={{fontSize:12,color:C.g2,lineHeight:1.5}}>{item}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

/* ── TAB: TREASURY ── */
function TabTreasury({t,demo}:{t:typeof T.fr;demo:boolean}) {
  const cf=demo?DEMO_CASHFLOW:REAL_CASHFLOW
  const banks=demo?DEMO_BANKS:[]
  const totalBal=banks.reduce((a,b)=>a+b.balance,0)
  const totalIn=cf.reduce((a,d)=>a+d.i,0)
  const totalOut=cf.reduce((a,d)=>a+d.o,0)
  return (
    <motion.div {...anim()}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
        <KPICard title="CA 2026" value={demo?`${totalIn.toLocaleString('fr-FR')} EUR`:"--"} color={C.b}/>
        <KPICard title="Depenses 2026" value={demo?`${totalOut.toLocaleString('fr-FR')} EUR`:"--"} color={C.red}/>
        <KPICard title="Resultat net 2026" value={demo?`${(totalIn-totalOut).toLocaleString('fr-FR')} EUR`:"--"} color={C.grn}/>
        <KPICard title="Solde consolide" value={demo?`${totalBal.toLocaleString('fr-FR',{minimumFractionDigits:2})} EUR`:"--"} color={C.gold}/>
      </div>
      <div style={{marginBottom:12}}>
        <Card>
          <SL text={`${t.cashflow} - ${t.realForecast}`}/>
          {demo?<CashChart data={cf}/>:<div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',color:C.g3,fontSize:13}}>Connectez votre banque via Bridge PSD2</div>}
        </Card>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Card>
          <SL text={`${t.bankAccounts} (${t.bridgePsd2})`}/>
          {demo?banks.map(acc=>(
            <div key={acc.bank} style={{padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}>
                  <div style={{width:32,height:32,borderRadius:8,background:acc.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{acc.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.g1}}>{acc.bank}</div>
                    <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{acc.type}</div>
                  </div>
                </div>
                <div style={{fontSize:15,fontWeight:900,fontFamily:'monospace',color:C.grn}}>
                  {acc.balance.toLocaleString('fr-FR',{minimumFractionDigits:2})} EUR
                </div>
              </div>
            </div>
          )):<div style={{color:C.g3,fontSize:13,padding:'12px 0'}}>Aucun compte connecte</div>}
        </Card>
        <Card>
          <SL text="Previsions J+30 / J+60 / J+90"/>
          {demo?[
            {l:'J+30',a:62400,c:'+8%',b:'Contrats signes + abonnements'},
            {l:'J+60',a:74200,c:'+19%',b:'Pipeline commercial actuel'},
            {l:'J+90',a:89500,c:'+43%',b:'Objectif 10K MRR atteint'},
          ].map(f=>(
            <div key={f.l} style={{padding:'12px 14px',borderRadius:10,marginBottom:8,background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,fontFamily:'monospace',color:C.g2}}>{f.l}</span>
                <span style={{fontSize:15,fontWeight:900,fontFamily:'monospace',color:C.b}}>{f.a.toLocaleString('fr-FR')} EUR</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:11,color:C.g3}}>{f.b}</span>
                <span style={{fontSize:11,fontWeight:700,color:C.grn}}>{f.c} vs J0</span>
              </div>
            </div>
          )):<div style={{color:C.g3,fontSize:13}}>Disponible apres connexion bancaire</div>}
        </Card>
      </div>
    </motion.div>
  )
}

/* ── MAIN ── */
type LangKey = 'fr'|'en'
const TABS: Record<Tab, React.ComponentType<{t:typeof T.fr;demo:boolean}>> = {
  overview: TabOverview,
  treasury: TabTreasury,
  invoices: TabInvoices,
  compliance: ({t})=><TabCompliance t={t}/>,
  integrations: ({t})=><TabIntegrations t={t}/>,
  alerts: ()=><TabAlerts/>,
  voice: ()=><TabVoice/>,
  docs: ()=><TabDocs/>,
  benchmark: ({t})=><TabBenchmark t={t}/>,
}

export default function Dashboard() {
  const [active,setActive]=useState<Tab>('overview')
  const [demo,setDemo]=useState(true)
  const [lang,setLang]=useState<LangKey>('fr')
  const t=T[lang]
  const Tab=TABS[active]
  const navLabels=[...t.nav,'Benchmark']
  const activeLabel=active==='benchmark'?'Benchmark':navLabels[NAV_IDS.indexOf(active as typeof NAV_IDS[0])]||'Benchmark'

  return (
    <div style={{display:'flex',minHeight:'100dvh',background:C.bg,fontFamily:'Inter, Helvetica Neue, sans-serif',color:C.g1}}>
      <Sidebar active={active} set={setActive} t={t} demo={demo} setDemo={setDemo} lang={lang} setLang={setLang}/>
      <main style={{flex:1,padding:'24px 28px',overflowY:'auto',overflowX:'hidden',minWidth:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:22,letterSpacing:'-0.03em',color:C.w,marginBottom:3,marginTop:0}}>{activeLabel}</h1>
            <div style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>
              Vanivert Smart CFO - {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            </div>
          </div>
          <div style={{display:'flex',gap:9,alignItems:'center'}}>
            <div style={{padding:'6px 12px',borderRadius:9,border:`1px solid ${C.border}`,fontSize:10,fontFamily:'monospace',color:C.gold,background:C.gold2,display:'flex',alignItems:'center',gap:6}}>
              <Dot color={C.gold} pulse/>
              {DAYS_LEFT}j avant le 1er sept. 2026
            </div>
            {!demo&&<div style={{padding:'6px 12px',borderRadius:9,border:`1px solid rgba(167,139,250,0.3)`,fontSize:10,fontFamily:'monospace',color:C.purple,background:C.purple2}}>
              Donnees client reelles
            </div>}
            <a href="/" style={{padding:'7px 14px',borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',color:C.g2,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Inter',textDecoration:'none'}}>
              {t.publicSite}
            </a>
            <button style={{padding:'8px 16px',borderRadius:9,border:'none',background:C.b,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Inter'}}>
              {t.exportReport}
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active+demo+lang}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
            transition={{duration:0.22,ease:E}}>
            <Tab t={t} demo={demo}/>
          </motion.div>
        </AnimatePresence>
      </main>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
        *{box-sizing:border-box}
        button:active{transform:scale(0.97)}
        input::placeholder{color:rgba(248,250,252,0.2)}
      `}</style>
    </div>
  )
}
