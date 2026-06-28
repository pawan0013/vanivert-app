'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

/* ─── DESIGN TOKENS ─── */
const C = {
  bg: '#080909', card: '#0F1011', card2: '#141517',
  border: 'rgba(255,255,255,0.06)', border2: 'rgba(255,255,255,0.10)',
  b: '#2563EB', b2: '#1D4ED8', blo: 'rgba(37,99,235,0.12)', bhi: 'rgba(37,99,235,0.2)',
  w: '#F8FAFC', g1: 'rgba(248,250,252,0.85)', g2: 'rgba(248,250,252,0.45)', g3: 'rgba(248,250,252,0.2)',
  grn: '#22C55E', grn2: 'rgba(34,197,94,0.10)',
  red: '#EF4444', red2: 'rgba(239,68,68,0.10)',
  gold: '#F59E0B', gold2: 'rgba(245,158,11,0.10)',
  purple: '#A78BFA', purple2: 'rgba(167,139,250,0.10)',
  teal: '#2DD4BF', teal2: 'rgba(45,212,191,0.10)',
}
const E: [number,number,number,number] = [0.16,1,0.3,1]
const vUp: Variants = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.55,ease:E}} }
const vS: Variants = { hidden:{}, visible:{transition:{staggerChildren:0.06}} }

/* ─── LIVE DATA (replace fetch calls in production) ─── */
const TODAY = new Date()
const DAYS_LEFT = Math.max(0,Math.ceil((new Date('2026-09-01T00:00:00+02:00').getTime()-TODAY.getTime())/86400000))

const CASHFLOW = [
  {m:'Jan',in:42000,out:28000,forecast:false},{m:'Fév',in:38000,out:31000,forecast:false},
  {m:'Mar',in:51000,out:29000,forecast:false},{m:'Avr',in:47000,out:33000,forecast:false},
  {m:'Mai',in:63000,out:35000,forecast:false},{m:'Jun',in:58000,out:31000,forecast:false},
  {m:'Jul',in:71000,out:38000,forecast:false},{m:'Aoû',in:68000,out:36000,forecast:true},
  {m:'Sep',in:84000,out:42000,forecast:true},{m:'Oct',in:91000,out:45000,forecast:true},
  {m:'Nov',in:88000,out:44000,forecast:true},{m:'Déc',in:102000,out:48000,forecast:true},
]
const BANK_ACCOUNTS = [
  {bank:'Qonto',iban:'FR76 3000 6000 0112 3456 7890 189',balance:12847.32,currency:'EUR',type:'Courant',updated:'il y a 3 min',connected:true,color:'#1A237E'},
  {bank:'BNP Paribas',iban:'FR76 3000 4000 0198 7654 3210 143',balance:34200.00,currency:'EUR',type:'Pro',updated:'il y a 1h',connected:true,color:'#006B3E'},
  {bank:'Crédit Agricole',iban:'FR76 1820 6004 7203 1234 5678 941',balance:8150.45,currency:'EUR',type:'Épargne',updated:'il y a 4h',connected:true,color:'#007036'},
]
const INVOICES = [
  {id:'INV-2026-047',client:'PROLANN SAS',siret:'35231982602570',amount:4200,due:'2026-07-15',issued:'2026-06-15',status:'overdue',days:12,facturx:true,pa:'Docoon'},
  {id:'INV-2026-048',client:'Hôtel Ker Buhe',siret:'12345678901234',amount:285,due:'2026-07-30',issued:'2026-07-01',status:'pending',days:-2,facturx:true,pa:'Docoon'},
  {id:'INV-2026-049',client:'Cabinet Dr. Martin',siret:'98765432109876',amount:228,due:'2026-08-01',issued:'2026-07-02',status:'pending',days:-4,facturx:false,pa:null},
  {id:'INV-2026-050',client:'MECA ARMOR SARL',siret:'45678901234567',amount:1200,due:'2026-07-08',issued:'2026-06-08',status:'paid',days:0,facturx:true,pa:'Docoon'},
  {id:'INV-2026-051',client:'Oxxius Lannion',siret:'56789012345678',amount:3600,due:'2026-08-15',issued:'2026-07-15',status:'pending',days:-18,facturx:true,pa:'Docoon'},
  {id:'INV-2026-052',client:'Apizee SAS',siret:'67890123456789',amount:1500,due:'2026-07-05',issued:'2026-06-05',status:'overdue',days:17,facturx:true,pa:'Docoon'},
  {id:'INV-2026-053',client:'Cristalens',siret:'78901234567890',amount:2400,due:'2026-09-01',issued:'2026-08-01',status:'draft',days:-35,facturx:false,pa:null},
]
const COMPLIANCE = [
  {id:'FR-EFACT-001',label:'Enrôlement annuaire centralisé DGFiP',status:'done',detail:'Confirmé le 15 juin 2026',critical:true},
  {id:'FR-EFACT-002',label:'Plateforme Agréée — Docoon PA n°0001',status:'done',detail:'Connectée, active',critical:true},
  {id:'FR-CIUS-001',label:'Validation SIRET (SIRENE INSEE)',status:'done',detail:'100% des factures validées',critical:false},
  {id:'FR-EFACT-003',label:'Statuts de cycle de vie (Déposée/Rejetée/Encaissée)',status:'done',detail:'Retournés en temps réel ERP',critical:false},
  {id:'FR-EFACT-004',label:'Format Factur-X (PDF/A-3 + CII XML)',status:'done',detail:'Généré automatiquement',critical:false},
  {id:'FR-ARCEP-001',label:'Déclaration ARCEP opérateur télécoms',status:'pending',detail:'Dossier déposé — J+14 pour validation',critical:true},
  {id:'FR-RGPD-001',label:'Registre des traitements CNIL (Art. 30)',status:'pending',detail:'À finaliser cette semaine',critical:false},
  {id:'FR-RGPD-002',label:'DPA sous-traitants (Supabase, Hetzner)',status:'done',detail:'Signés le 20 juin 2026',critical:false},
  {id:'FR-RGPD-003',label:'Consentement vocal (touche 1, log RGPD)',status:'done',detail:'Hardcodé, non contournable',critical:false},
  {id:'FR-CDC-001',label:'Mentions légales CGV (CGI Art. 54)',status:'done',detail:'En ligne sur vanivert.fr',critical:false},
  {id:'FR-PACTE-001',label:'Enregistrement RNE (registre national)',status:'pending',detail:'Lié au SIRET — en cours post-URSSAF',critical:false},
  {id:'ISO-27001',label:'ISO 27001 (Phase 1)',status:'todo',detail:'Prévu mois 6 post-financement',critical:false},
]
const INTEGRATIONS_DATA = [
  {name:'Qonto',cat:'Banque',status:'connected',last:'il y a 3 min',icon:'Q',color:'#1A237E',bg:'#E8EAF6',detail:'Solde live via API PSD2 Bridge'},
  {name:'Bridge API (PSD2)',cat:'Agrégateur bancaire',status:'connected',last:'il y a 3 min',icon:'B',color:'#01579B',bg:'#E1F5FE',detail:'BNP, CA, Qonto synchronisés'},
  {name:'Pennylane',cat:'Comptabilité',status:'connected',last:'il y a 1h',icon:'P',color:'#0052CC',bg:'#EEF5FF',detail:'Journaux + Grand Livre synchronisés'},
  {name:'Docoon PDP',cat:'E-facturation',status:'connected',last:'il y a 2h',icon:'D',color:'#6A1B9A',bg:'#F3E5F5',detail:'PA certifiée DGFiP n°0001 — active'},
  {name:'Chorus Pro',cat:'E-facturation B2G',status:'connected',last:'il y a 1j',icon:'C',color:'#1B5E20',bg:'#E8F5E9',detail:'Factures secteur public'},
  {name:'Doctolib',cat:'Agenda médical',status:'connected',last:'il y a 5 min',icon:'D',color:'#0277BD',bg:'#E3F2FD',detail:'RDV vocal → Doctolib en temps réel'},
  {name:'Google Calendar',cat:'Agenda',status:'connected',last:'il y a 5 min',icon:'G',color:'#C62828',bg:'#FFEBEE',detail:'Fallback agenda pour clients non-Doctolib'},
  {name:'Stripe',cat:'Paiements',status:'pending',last:'À configurer',icon:'S',color:'#4527A0',bg:'#EDE7F6',detail:'Lien paiement sur factures Starter'},
  {name:'GoCardless',cat:'Prélèvements SEPA',status:'pending',last:'À configurer',icon:'G',color:'#00695C',bg:'#E0F2F1',detail:'Prélèvement automatique abonnements'},
  {name:'Sage 100',cat:'ERP',status:'pending',last:'À configurer',icon:'S',color:'#2E7D32',bg:'#E8F5E9',detail:'Export CSV → import Docling + Factur-X'},
  {name:'Cegid XRP',cat:'ERP',status:'pending',last:'À configurer',icon:'C',color:'#E65100',bg:'#FFF3E0',detail:'Webhook REST pour conformité auto'},
  {name:'n8n (automation)',cat:'Workflows',status:'connected',last:'il y a 3 min',icon:'n',color:'#E67E22',bg:'#FFF3E0',detail:'Relances + alertes + rapports auto'},
]
const ALERTS_DATA = [
  {type:'critical',cat:'Facture',msg:'PROLANN SAS — Facture INV-2026-047 impayée depuis 12 jours — 4 200 €',time:'il y a 2h',action:'Relancer'},
  {type:'warning',cat:'Facture',msg:'Apizee SAS — Facture INV-2026-052 impayée depuis 17 jours — 1 500 €',time:'il y a 2h',action:'Relancer'},
  {type:'warning',cat:'DGFiP',msg:'grcx : Mise à jour CIUS-FR v2.3 publiée — vérifier conformité',time:'il y a 6h',action:'Voir'},
  {type:'warning',cat:'Trésorerie',msg:'Prévision J+30 : solde estimé 8% en-dessous du mois dernier',time:'il y a 1j',action:'Analyser'},
  {type:'info',cat:'DGFiP',msg:'Nouvelle PA agréée ajoutée à l\'annuaire DGFiP — aucun impact',time:'il y a 2j',action:'Voir'},
  {type:'info',cat:'ARCEP',msg:'Votre déclaration opérateur ARCEP est en cours de traitement',time:'il y a 3j',action:'Suivre'},
  {type:'info',cat:'CNIL',msg:'Délai de mise à jour du registre des traitements : 5 jours restants',time:'il y a 3j',action:'Agir'},
]
const CALLS = [
  {id:'C-001',caller:'+33 6 12 34 56 78',duration:'2:34',type:'Rendez-vous',result:'Réservé',time:'14:32',transcript:'Bonjour, je souhaite prendre rendez-vous pour une consultation...'},
  {id:'C-002',caller:'+33 2 96 48 12 34',duration:'1:12',type:'Information',result:'Message',time:'13:15',transcript:'Pouvez-vous me rappeler concernant votre offre de conformité...'},
  {id:'C-003',caller:'+33 6 87 65 43 21',duration:'0:45',type:'Urgence',result:'Transféré',time:'11:50',transcript:'J\'ai reçu une lettre de Valeo concernant la facturation électronique...'},
  {id:'C-004',caller:'+33 2 96 37 89 01',duration:'3:21',type:'Rendez-vous',result:'Réservé',time:'10:28',transcript:'Je voudrais savoir si vous avez de la disponibilité pour lundi prochain...'},
  {id:'C-005',caller:'+33 6 55 44 33 22',duration:'1:56',type:'Information',result:'Message',time:'09:14',transcript:'Votre tarif pour la conformité e-facturation, c\'est bien 1200 euros par mois?'},
]

/* ─── PRIMITIVES ─── */
function Dot({color,pulse=false}:{color:string;pulse?:boolean}) {
  return <span style={{width:7,height:7,borderRadius:'50%',background:color,display:'inline-block',flexShrink:0,
    animation:pulse?'dotpulse 1.8s ease-in-out infinite':undefined}}/>
}
function Badge({status}:{status:string}) {
  const map:Record<string,[string,string,string]> = {
    done:['Conforme',C.grn,C.grn2], paid:['Payé',C.grn,C.grn2], connected:['Connecté',C.grn,C.grn2],
    pending:['En cours',C.gold,C.gold2], overdue:['En retard',C.red,C.red2],
    todo:['Planifié',C.g3,'rgba(255,255,255,0.05)'], draft:['Brouillon',C.purple,C.purple2],
  }
  const [label,col,bg]=map[status]||[status,C.g2,'transparent']
  return <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,
    background:bg,color:col,fontFamily:'monospace',letterSpacing:'0.05em',
    textTransform:'uppercase',whiteSpace:'nowrap'}}>{label}</span>
}
function Card({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'22px 24px',...style}}>{children}</div>
}
function SectionLabel({text}:{text:string}) {
  return <div style={{fontSize:10,fontFamily:'monospace',textTransform:'uppercase',
    letterSpacing:'0.1em',color:C.g3,marginBottom:16}}>{text}</div>
}
function KPI({title,value,sub,color=C.b,spark,prefix='',suffix=''}:{title:string;value:number|string;sub?:string;color?:string;spark?:number[];prefix?:string;suffix?:string}) {
  return (
    <motion.div variants={vUp} style={{background:C.card,border:`1px solid ${C.border}`,
      borderRadius:18,padding:'20px 22px',position:'relative',overflow:'hidden'}}>
      {spark && (
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:48,opacity:0.35}}>
          <MiniLine data={spark} color={color}/>
        </div>
      )}
      <div style={{fontSize:11,fontFamily:'monospace',textTransform:'uppercase',
        letterSpacing:'0.08em',color:C.g3,marginBottom:10}}>{title}</div>
      <div style={{fontFamily:'Inter',fontWeight:900,fontSize:28,
        letterSpacing:'-0.04em',color:color,lineHeight:1}}>
        {prefix}{typeof value==='number'?value.toLocaleString('fr-FR'):value}{suffix}
      </div>
      {sub&&<div style={{fontSize:12,color:C.g3,marginTop:6}}>{sub}</div>}
    </motion.div>
  )
}
function MiniLine({data,color}:{data:number[];color:string}) {
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1
  const pts=data.map((v,i)=>`${(i/(data.length-1))*100},${100-((v-min)/range*80+5)}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
      <defs><linearGradient id={`gl${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={`0,100 ${pts} 100,100`} fill={`url(#gl${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── CASHFLOW CHART ─── */
function CashflowChart() {
  const [hover,setHover] = useState<number|null>(null)
  const maxVal = Math.max(...CASHFLOW.map(d=>d.in))
  const W = 60
  return (
    <div style={{position:'relative',height:160}}>
      <svg viewBox={`0 0 ${CASHFLOW.length*W} 160`} style={{width:'100%',height:'100%'}} overflow="visible">
        <defs>
          <linearGradient id="inG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.b} stopOpacity="0.35"/><stop offset="100%" stopColor={C.b} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,33,66,100].map(pct=>(
          <line key={pct} x1="0" y1={pct*1.3+10} x2={CASHFLOW.length*W} y2={pct*1.3+10}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
        ))}
        <polyline
          points={CASHFLOW.map((d,i)=>`${i*W+W/2},${150-((d.in/maxVal)*130)}`).join(' ')}
          fill="none" stroke={C.b} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={CASHFLOW.map((_,i)=>i>=7?'4,3':'none').join(' ')}/>
        <polygon
          points={`${W/2},150 ${CASHFLOW.filter(d=>!d.forecast).map((d,i)=>`${i*W+W/2},${150-((d.in/maxVal)*130)}`).join(' ')} ${(CASHFLOW.filter(d=>!d.forecast).length-1)*W+W/2},150`}
          fill="url(#inG)"/>
        <polyline
          points={CASHFLOW.map((d,i)=>`${i*W+W/2},${150-((d.out/maxVal)*130)}`).join(' ')}
          fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="3,3" opacity="0.6"/>
        {CASHFLOW.map((d,i)=>(
          <g key={d.m}>
            <rect x={i*W} y={0} width={W} height={155} fill="transparent"
              onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{cursor:'pointer'}}/>
            {hover===i && (
              <g>
                <rect x={i*W+4} y={2} width={W-8} height={60} rx={6} fill={C.card2} opacity="0.95"/>
                <text x={i*W+W/2} y={18} textAnchor="middle" fill={C.g2} fontSize="8" fontFamily="monospace">{d.m}</text>
                <text x={i*W+W/2} y={32} textAnchor="middle" fill={C.b} fontSize="9" fontWeight="700">+{(d.in/1000).toFixed(0)}K</text>
                <text x={i*W+W/2} y={46} textAnchor="middle" fill={C.red} fontSize="9">-{(d.out/1000).toFixed(0)}K</text>
                <text x={i*W+W/2} y={58} textAnchor="middle" fill={C.grn} fontSize="8">=+{((d.in-d.out)/1000).toFixed(0)}K</text>
              </g>
            )}
            <text x={i*W+W/2} y={158} textAnchor="middle" fill={d.forecast?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.3)'}
              fontSize="8" fontFamily="monospace">{d.m}</text>
            {d.forecast && <text x={i*W+W/2} y={148} textAnchor="middle" fill={C.g3} fontSize="7">≈</text>}
          </g>
        ))}
      </svg>
      <div style={{display:'flex',gap:16,marginTop:10}}>
        {[[C.b,'Entrées réelles'],[C.b+'88','Entrées (prévision)'],[C.red,'Dépenses']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:C.g3}}>
            <div style={{width:20,height:2,background:c,borderRadius:1}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── SIDEBAR ─── */
const NAV = [
  {id:'overview',label:'Vue d\'ensemble',icon:'⬡'},
  {id:'cashflow',label:'Trésorerie',icon:'◈'},
  {id:'invoices',label:'Factures & PA',icon:'◧'},
  {id:'compliance',label:'Conformité DGFiP',icon:'◎'},
  {id:'integrations',label:'Intégrations',icon:'⊞'},
  {id:'alerts',label:'Alertes',icon:'◬'},
  {id:'voice',label:'Réception vocale',icon:'◐'},
  {id:'documents',label:'Documents IA',icon:'◫'},
]
function Sidebar({active,set}:{active:string;set:(s:string)=>void}) {
  const total=CASHFLOW.reduce((a,d)=>a+(d.in-d.out),0)
  return (
    <aside style={{width:228,background:C.card,borderRight:`1px solid ${C.border}`,
      display:'flex',flexDirection:'column',flexShrink:0,height:'100dvh',position:'sticky',top:0}}>
      <div style={{padding:'20px 18px 14px',borderBottom:`1px solid ${C.border}`}}>
        <a href="/" style={{fontWeight:900,fontSize:17,color:C.w,letterSpacing:'-0.05em',
          display:'flex',alignItems:'center',gap:7,textDecoration:'none'}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:C.b,boxShadow:`0 0 10px ${C.b}`}}/>
          vanivert
        </a>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,letterSpacing:'0.1em',
          textTransform:'uppercase',marginTop:3}}>Smart CFO</div>
      </div>
      <div style={{margin:'12px 12px 0',padding:'10px 12px',borderRadius:12,
        background:C.grn2,border:`1px solid rgba(34,197,94,0.15)`,
        display:'flex',alignItems:'center',gap:8}}>
        <Dot color={C.grn} pulse/>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.grn}}>Tous systèmes actifs</div>
          <div style={{fontSize:9,color:C.g3,fontFamily:'monospace'}}>12 intégrations · mis à jour il y a 3 min</div>
        </div>
      </div>
      <div style={{margin:'10px 12px',padding:'10px 12px',borderRadius:12,
        background:C.blo,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,fontFamily:'monospace',textTransform:'uppercase',
          letterSpacing:'0.08em',color:C.g3,marginBottom:4}}>Trésorerie totale</div>
        <div style={{fontFamily:'monospace',fontWeight:700,fontSize:17,color:C.b,letterSpacing:'-0.02em'}}>
          {total.toLocaleString('fr-FR')} €
        </div>
        <div style={{fontSize:9,color:C.g3,marginTop:2}}>3 comptes · Bridge PSD2</div>
      </div>
      <nav style={{flex:1,padding:'4px 8px',overflowY:'auto'}}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>set(item.id)}
            style={{width:'100%',display:'flex',alignItems:'center',gap:10,
              padding:'9px 10px',borderRadius:10,border:'none',cursor:'pointer',
              fontFamily:'Inter,sans-serif',fontSize:13,
              fontWeight:active===item.id?700:400,
              background:active===item.id?C.blo:'transparent',
              color:active===item.id?C.b:C.g2,
              borderLeft:`2px solid ${active===item.id?C.b:'transparent'}`,
              transition:'all 0.15s',marginBottom:2}}>
            <span style={{fontSize:14,opacity:active===item.id?1:0.5}}>{item.icon}</span>
            {item.label}
            {item.id==='alerts'&&<span style={{marginLeft:'auto',fontSize:9,fontWeight:700,
              padding:'2px 6px',borderRadius:5,background:C.red2,color:C.red}}>2</span>}
          </button>
        ))}
      </nav>
      <div style={{padding:'12px 12px 16px',borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:9,fontFamily:'monospace',color:C.g3,textAlign:'center',
          display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center'}}>
          {['RGPD','Hetzner DE','Supabase IE','grcx','Pxtly'].map(tag=>(
            <span key={tag} style={{padding:'2px 6px',borderRadius:4,
              background:'rgba(255,255,255,0.03)',border:`1px solid ${C.border}`}}>{tag}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════════════════════════ */
function Overview() {
  const mrr = 9368
  const totalBalance = BANK_ACCOUNTS.reduce((a,b)=>a+b.balance,0)
  const overdue = INVOICES.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0)
  const pending = INVOICES.filter(i=>i.status==='pending').reduce((a,i)=>a+i.amount,0)
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="MRR" value={mrr} prefix="" suffix=" €" color={C.b} sub="19 clients actifs" spark={[5000,6200,7100,8000,9368]}/>
        <KPI title="Solde total" value={Math.round(totalBalance)} suffix=" €" color={C.grn} sub="3 comptes PSD2" spark={[48000,50000,47000,52000,55197]}/>
        <KPI title="Créances en retard" value={overdue} suffix=" €" color={C.red} sub="2 clients" spark={[0,800,1500,5700,5700]}/>
        <KPI title="Jours avant Sept. 2026" value={DAYS_LEFT} color={C.gold} sub="Deadline DGFiP" spark={[90,85,80,75,DAYS_LEFT]}/>
      </motion.div>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14,marginBottom:14}}>
        <motion.div variants={vUp}>
          <Card>
            <SectionLabel text="Trésorerie 2026 — Réel + Prévisions"/>
            <CashflowChart/>
          </Card>
        </motion.div>
        <motion.div variants={vUp} style={{display:'flex',flexDirection:'column',gap:14}}>
          <Card>
            <SectionLabel text="Comptes bancaires (Bridge PSD2)"/>
            {BANK_ACCOUNTS.map(acc=>(
              <div key={acc.bank} style={{display:'flex',justifyContent:'space-between',
                alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:acc.color,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:13,fontWeight:700,color:'#fff',flexShrink:0}}>
                    {acc.bank[0]}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:C.g1}}>{acc.bank}</div>
                    <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{acc.type} · {acc.updated}</div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:14,fontWeight:700,fontFamily:'monospace',
                    color:acc.balance>10000?C.grn:acc.balance>5000?C.g1:C.gold}}>
                    {acc.balance.toLocaleString('fr-FR',{minimumFractionDigits:2})} €
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:10}}>
              <span style={{fontSize:12,color:C.g3}}>Total consolidé</span>
              <span style={{fontSize:16,fontWeight:900,fontFamily:'monospace',color:C.grn}}>
                {totalBalance.toLocaleString('fr-FR',{minimumFractionDigits:2})} €
              </span>
            </div>
          </Card>
          <Card>
            <SectionLabel text="Conformité DGFiP"/>
            {[
              {label:'Factures Factur-X émises',val:`${INVOICES.filter(i=>i.facturx).length}/${INVOICES.length}`,ok:true},
              {label:'SIRET validés (SIRENE)',val:'100%',ok:true},
              {label:'Annuaire centralisé',val:'Enrôlé',ok:true},
              {label:'ARCEP déclaration',val:'En cours',ok:false},
            ].map(r=>(
              <div key={r.label} style={{display:'flex',justifyContent:'space-between',
                padding:'8px 0',borderBottom:`1px solid ${C.border}`,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Dot color={r.ok?C.grn:C.gold} pulse={!r.ok}/>
                  <span style={{fontSize:12,color:C.g2}}>{r.label}</span>
                </div>
                <span style={{fontSize:12,fontWeight:600,fontFamily:'monospace',
                  color:r.ok?C.grn:C.gold}}>{r.val}</span>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
      <motion.div variants={vUp}>
        <Card>
          <SectionLabel text="Alertes récentes"/>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {ALERTS_DATA.slice(0,4).map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',
                borderRadius:12,background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
                border:`1px solid ${a.type==='critical'?'rgba(239,68,68,0.2)':a.type==='warning'?'rgba(245,158,11,0.2)':'rgba(37,99,235,0.2)'}`}}>
                <Dot color={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
                <span style={{fontSize:11,fontFamily:'monospace',padding:'2px 7px',borderRadius:5,
                  background:'rgba(255,255,255,0.05)',color:C.g3}}>{a.cat}</span>
                <span style={{fontSize:13,color:C.g1,flex:1}}>{a.msg}</span>
                <span style={{fontSize:10,color:C.g3,fontFamily:'monospace',flexShrink:0}}>{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: CASHFLOW
═══════════════════════════════════════════════════════════ */
function Cashflow() {
  const totalIn = CASHFLOW.reduce((a,d)=>a+d.in,0)
  const totalOut = CASHFLOW.reduce((a,d)=>a+d.out,0)
  const best = CASHFLOW.reduce((a,b)=>b.in>a.in?b:a)
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Chiffre d'affaires 2026" value={totalIn} suffix=" €" color={C.b} sub="Cumulé YTD"/>
        <KPI title="Dépenses 2026" value={totalOut} suffix=" €" color={C.red} sub="Cumulé YTD"/>
        <KPI title="Résultat net 2026" value={totalIn-totalOut} suffix=" €" color={C.grn} sub={`${(((totalIn-totalOut)/totalIn)*100).toFixed(1)}% de marge`}/>
        <KPI title="Meilleur mois" value={best.in} suffix=" €" color={C.gold} sub={best.m}/>
      </motion.div>
      <motion.div variants={vUp} style={{marginBottom:14}}>
        <Card>
          <SectionLabel text="Flux de trésorerie 2026 — Réel (Jan-Jul) + Prévisions (Aoû-Déc)"/>
          <CashflowChart/>
        </Card>
      </motion.div>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Card>
          <SectionLabel text="Comptes bancaires (Bridge API PSD2)"/>
          {BANK_ACCOUNTS.map(acc=>(
            <div key={acc.bank} style={{padding:'14px 0',borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:9,background:acc.color,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,color:'#fff'}}>
                    {acc.bank[0]}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.g1}}>{acc.bank}</div>
                    <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{acc.type}</div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:16,fontWeight:900,fontFamily:'monospace',color:C.grn}}>
                    {acc.balance.toLocaleString('fr-FR',{minimumFractionDigits:2})} €
                  </div>
                  <div style={{fontSize:9,color:C.g3}}>{acc.updated}</div>
                </div>
              </div>
              <div style={{fontSize:10,fontFamily:'monospace',color:C.g3,
                padding:'6px 8px',borderRadius:7,background:'rgba(255,255,255,0.02)',
                border:`1px solid ${C.border}`}}>{acc.iban}</div>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
            paddingTop:12,marginTop:4}}>
            <span style={{fontSize:12,color:C.g3,fontWeight:600}}>Total 3 comptes</span>
            <span style={{fontSize:18,fontWeight:900,fontFamily:'monospace',color:C.grn}}>
              {BANK_ACCOUNTS.reduce((a,b)=>a+b.balance,0).toLocaleString('fr-FR',{minimumFractionDigits:2})} €
            </span>
          </div>
        </Card>
        <Card>
          <SectionLabel text="Prévisions J+30 / J+60 / J+90"/>
          {[
            {label:'J+30',amount:62400,change:+8,basis:'Contrats signés + abonnements'},
            {label:'J+60',amount:74200,change:+19,basis:'Pipeline commercial actuel'},
            {label:'J+90',amount:89500,change:+43,basis:'Objectif 10K MRR atteint'},
          ].map(f=>(
            <div key={f.label} style={{padding:'14px 16px',borderRadius:12,marginBottom:10,
              background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:700,fontFamily:'monospace',color:C.g2}}>{f.label}</span>
                <span style={{fontSize:16,fontWeight:900,fontFamily:'monospace',color:C.b}}>
                  {f.amount.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:11,color:C.g3}}>{f.basis}</span>
                <span style={{fontSize:11,fontWeight:700,
                  color:f.change>0?C.grn:C.red}}>+{f.change}% vs J0</span>
              </div>
            </div>
          ))}
          <div style={{padding:'12px 14px',borderRadius:12,
            background:C.blo,border:`1px solid rgba(37,99,235,0.2)`,marginTop:4}}>
            <div style={{fontSize:11,color:C.g3,marginBottom:4}}>Moteur de prévision</div>
            <div style={{fontSize:12,color:C.g2}}>FinGPT + données Bridge PSD2 · Horizon 90 jours · Confiance 78%</div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: INVOICES
═══════════════════════════════════════════════════════════ */
function Invoices() {
  const [filter,setFilter] = useState('all')
  const filtered = filter==='all' ? INVOICES : INVOICES.filter(i=>i.status===filter)
  const overdue = INVOICES.filter(i=>i.status==='overdue')
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Total en attente" value={INVOICES.filter(i=>i.status==='pending').reduce((a,i)=>a+i.amount,0)} suffix=" €" color={C.gold} sub={`${INVOICES.filter(i=>i.status==='pending').length} factures`}/>
        <KPI title="En retard" value={INVOICES.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0)} suffix=" €" color={C.red} sub={`${overdue.length} clients`}/>
        <KPI title="Payé ce mois" value={INVOICES.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0)} suffix=" €" color={C.grn} sub="Encaissé"/>
        <KPI title="Conformité Factur-X" value={`${INVOICES.filter(i=>i.facturx).length}/${INVOICES.length}`} color={C.b} sub="Formats DGFiP valides"/>
      </motion.div>
      {overdue.length>0&&(
        <motion.div variants={vUp} style={{padding:'14px 18px',borderRadius:14,marginBottom:14,
          background:C.red2,border:'1px solid rgba(239,68,68,0.25)',
          display:'flex',alignItems:'center',gap:14}}>
          <Dot color={C.red} pulse/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:700,color:C.red}}>
              {overdue.length} facture(s) impayée(s) — {overdue.reduce((a,i)=>a+i.amount,0).toLocaleString('fr-FR')} € à relancer
            </span>
            <span style={{fontSize:12,color:C.g3,display:'block',marginTop:2}}>
              Relance automatique disponible via Vanivert — 1 clic
            </span>
          </div>
          <button style={{padding:'8px 18px',borderRadius:9,border:'none',
            background:C.red,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',
            fontFamily:'Inter,sans-serif'}}>
            Relancer tout →
          </button>
        </motion.div>
      )}
      <motion.div variants={vUp}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <SectionLabel text="Factures — Pipeline e-facturation DGFiP"/>
            <div style={{display:'flex',gap:6}}>
              {['all','pending','overdue','paid','draft'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{fontSize:10,padding:'4px 10px',borderRadius:7,
                    border:`1px solid ${filter===f?C.b:C.border}`,cursor:'pointer',
                    background:filter===f?C.blo:'transparent',
                    color:filter===f?C.b:C.g3,fontFamily:'monospace',
                    textTransform:'uppercase',letterSpacing:'0.04em'}}>
                  {f==='all'?'Toutes':f==='pending'?'En attente':f==='overdue'?'Retard':f==='paid'?'Payées':'Brouillons'}
                </button>
              ))}
            </div>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>
              {['Référence','Client / SIRET','Montant','Factur-X','Plateforme PA','Échéance','Statut','Action'].map(h=>(
                <th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:10,
                  fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.05em',
                  color:C.g3,borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(inv=>(
                <tr key={inv.id} style={{borderBottom:`1px solid ${C.border}`,
                  background:inv.status==='overdue'?'rgba(239,68,68,0.03)':'transparent'}}>
                  <td style={{padding:'12px 12px',fontSize:12,fontFamily:'monospace',color:C.b,fontWeight:600}}>{inv.id}</td>
                  <td style={{padding:'12px 12px'}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.g1}}>{inv.client}</div>
                    <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{inv.siret}</div>
                  </td>
                  <td style={{padding:'12px 12px',fontSize:14,fontWeight:700,
                    fontFamily:'monospace',color:C.g1}}>
                    {inv.amount.toLocaleString('fr-FR')} €
                  </td>
                  <td style={{padding:'12px 12px'}}>
                    <span style={{fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:6,
                      background:inv.facturx?C.grn2:C.red2,
                      color:inv.facturx?C.grn:C.red,fontFamily:'monospace'}}>
                      {inv.facturx?'✓ PDF/A-3':'✗ À générer'}
                    </span>
                  </td>
                  <td style={{padding:'12px 12px',fontSize:11,color:inv.pa?C.grn:C.g3,
                    fontFamily:'monospace'}}>{inv.pa||'—'}</td>
                  <td style={{padding:'12px 12px'}}>
                    <div style={{fontSize:12,fontFamily:'monospace',
                      color:inv.status==='overdue'?C.red:C.g2}}>{inv.due}</div>
                    {inv.status==='overdue'&&(
                      <div style={{fontSize:10,color:C.red}}>+{inv.days}j de retard</div>
                    )}
                  </td>
                  <td style={{padding:'12px 12px'}}><Badge status={inv.status}/></td>
                  <td style={{padding:'12px 12px'}}>
                    <button style={{fontSize:11,padding:'5px 12px',borderRadius:8,
                      border:`1px solid ${inv.status==='overdue'?C.red:C.border}`,
                      cursor:'pointer',background:inv.status==='overdue'?C.red2:'transparent',
                      color:inv.status==='overdue'?C.red:C.g3,fontFamily:'monospace',
                      fontWeight:inv.status==='overdue'?700:400}}>
                      {inv.status==='overdue'?'Relancer':inv.status==='draft'?'Envoyer':'Voir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: COMPLIANCE
═══════════════════════════════════════════════════════════ */
function Compliance() {
  const done=COMPLIANCE.filter(c=>c.status==='done').length
  const pct=Math.round((done/COMPLIANCE.length)*100)
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Score de conformité" value={`${pct}%`} color={pct>=80?C.grn:pct>=60?C.gold:C.red} sub={`${done}/${COMPLIANCE.length} contrôles`}/>
        <KPI title="Jours avant deadline" value={DAYS_LEFT} color={C.gold} sub="1er septembre 2026"/>
        <KPI title="Factures Factur-X" value={`${INVOICES.filter(i=>i.facturx).length}/${INVOICES.length}`} color={C.b} sub="Format légal DGFiP"/>
        <KPI title="SIRET validés" value="100%" color={C.grn} sub="Via API SIRENE INSEE"/>
      </motion.div>
      <motion.div variants={vUp} style={{marginBottom:14}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <SectionLabel text="Checklist conformité DGFiP — Framework vanivert_fr"/>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:13,fontFamily:'monospace',color:C.g3}}>
                {done}/{COMPLIANCE.length} contrôles
              </div>
              <div style={{width:120,height:6,borderRadius:3,background:'rgba(255,255,255,0.07)'}}>
                <div style={{width:`${pct}%`,height:'100%',borderRadius:3,
                  background:pct>=80?C.grn:pct>=60?C.gold:C.red,transition:'width 1s ease'}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:pct>=80?C.grn:C.gold}}>{pct}%</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {COMPLIANCE.map(ctrl=>(
              <div key={ctrl.id} style={{display:'flex',alignItems:'center',gap:14,
                padding:'12px 16px',borderRadius:12,
                background:ctrl.status==='done'?'rgba(34,197,94,0.04)':ctrl.status==='pending'?'rgba(245,158,11,0.04)':'rgba(255,255,255,0.02)',
                border:`1px solid ${ctrl.status==='done'?'rgba(34,197,94,0.12)':ctrl.status==='pending'?'rgba(245,158,11,0.12)':C.border}`}}>
                <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,
                  background:ctrl.status==='done'?C.grn2:ctrl.status==='pending'?C.gold2:'rgba(255,255,255,0.05)',
                  border:`1.5px solid ${ctrl.status==='done'?C.grn:ctrl.status==='pending'?C.gold:C.g3}`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>
                  {ctrl.status==='done'?'✓':ctrl.status==='pending'?'…':'○'}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:ctrl.status==='done'?C.g1:ctrl.status==='pending'?C.gold:C.g3,
                    fontWeight:ctrl.critical?700:400}}>
                    {ctrl.label}
                    {ctrl.critical&&<span style={{marginLeft:8,fontSize:9,padding:'2px 6px',
                      borderRadius:4,background:C.red2,color:C.red,fontFamily:'monospace'}}>CRITIQUE</span>}
                  </div>
                  <div style={{fontSize:11,color:C.g3,marginTop:2,fontFamily:'monospace'}}>{ctrl.id} · {ctrl.detail}</div>
                </div>
                <Badge status={ctrl.status}/>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
      <motion.div variants={vUp}>
        <Card>
          <SectionLabel text="Piste d'audit cryptographique (SHA-256 chaîné — grcx)"/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[
              {ts:'2026-06-15T09:32:14Z',ev:'resolver.assessment',j:'DGFIP',s:'info',hash:'a3f7b2c1d9e4f812'},
              {ts:'2026-06-20T14:17:33Z',ev:'regulatory.new_publication',j:'CNIL',s:'warning',hash:'b8e2a7f4c9d1e356'},
              {ts:'2026-06-25T11:05:42Z',ev:'resolver.assessment',j:'ARCEP',s:'info',hash:'c4d9b3e8f1a2c745'},
              {ts:'2026-06-27T08:21:09Z',ev:'grcx.started',j:'—',s:'info',hash:'d7a4c2b9e5f3d128'},
            ].map((e,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',
                borderRadius:10,background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`,
                fontFamily:'monospace',fontSize:11}}>
                <Dot color={e.s==='warning'?C.gold:C.grn}/>
                <span style={{color:C.g3,flexShrink:0,width:180}}>{e.ts}</span>
                <span style={{color:C.b,flexShrink:0,width:200}}>{e.ev}</span>
                <span style={{color:C.g3,flexShrink:0,width:60}}>{e.j}</span>
                <span style={{color:C.g3,marginLeft:'auto',fontSize:10,opacity:0.6}}>{e.hash}...</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: INTEGRATIONS
═══════════════════════════════════════════════════════════ */
function Integrations() {
  const connected=INTEGRATIONS_DATA.filter(i=>i.status==='connected').length
  const cats=['Banque','Comptabilité','E-facturation','Agenda','Paiements','ERP','Workflows']
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Intégrations actives" value={connected} sub={`sur ${INTEGRATIONS_DATA.length} disponibles`} color={C.grn}/>
        <KPI title="Sync en temps réel" value="PSD2 + Webhook" color={C.b} sub="Bridge API + n8n"/>
        <KPI title="Dernière sync" value="il y a 3 min" color={C.g2} sub="Qonto + Bridge API"/>
      </motion.div>
      <motion.div variants={vUp} style={{marginBottom:14}}>
        <Card>
          <SectionLabel text="Toutes les intégrations"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
            {INTEGRATIONS_DATA.map(int=>(
              <div key={int.name} style={{display:'flex',alignItems:'center',gap:14,
                padding:'16px 18px',borderRadius:14,
                background:int.status==='connected'?'rgba(34,197,94,0.04)':'rgba(255,255,255,0.02)',
                border:`1px solid ${int.status==='connected'?'rgba(34,197,94,0.15)':C.border}`,
                transition:'all 0.2s'}}>
                <div style={{width:40,height:40,borderRadius:10,background:int.bg,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:16,fontWeight:900,color:int.color,flexShrink:0}}>
                  {int.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.g1}}>{int.name}</span>
                    <Badge status={int.status}/>
                  </div>
                  <div style={{fontSize:11,color:C.g3,marginBottom:2}}>{int.detail}</div>
                  <div style={{fontSize:10,fontFamily:'monospace',color:C.g3}}>{int.last}</div>
                </div>
                <button style={{fontSize:11,padding:'6px 14px',borderRadius:8,flexShrink:0,
                  border:`1px solid ${int.status==='connected'?C.border:'rgba(37,99,235,0.4)'}`,
                  cursor:'pointer',background:int.status==='pending'?C.blo:'transparent',
                  color:int.status==='pending'?C.b:C.g3,fontFamily:'monospace',fontWeight:int.status==='pending'?700:400}}>
                  {int.status==='connected'?'Config':'Connecter'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
      <motion.div variants={vUp}>
        <Card>
          <SectionLabel text="Stack IA souveraine (open source)"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {[
              {n:'grcx',r:'Radar réglementaire DGFiP/CNIL',tag:'MIT',c:C.b,stars:'6 ⭐'},
              {n:'Pxtly',r:'ChromaDB + AML + ZK-KYC',tag:'Apache 2.0',c:C.purple,stars:'9 ⭐'},
              {n:'Mistral 7B (AWQ)',r:'LLM souverain · Hetzner Frankfurt',tag:'Apache 2.0',c:C.gold,stars:'32K ⭐'},
              {n:'faster-whisper',r:'STT vocal FR · P95 <400ms',tag:'MIT',c:C.grn,stars:'16K ⭐'},
              {n:'XTTS-v2 (Coqui)',r:'TTS voix naturelle française',tag:'MPL 2.0',c:C.teal,stars:'11K ⭐'},
              {n:'Docling (IBM)',r:'Parse PDF/Word/Excel/images',tag:'MIT',c:C.gold,stars:'28K ⭐'},
              {n:'Lago',r:'Facturation usage · minutes vocales',tag:'AGPL',c:C.purple,stars:'7K ⭐'},
              {n:'n8n',r:'Workflows · alertes · relances auto',tag:'Fair-code',c:C.grn,stars:'50K ⭐'},
            ].map(s=>(
              <div key={s.n} style={{padding:'14px 16px',borderRadius:12,
                background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`}}>
                <div style={{fontSize:13,fontWeight:700,color:s.c,marginBottom:4}}>{s.n}</div>
                <div style={{fontSize:11,color:C.g3,marginBottom:8,lineHeight:1.4}}>{s.r}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:9,fontFamily:'monospace',padding:'2px 6px',
                    borderRadius:4,background:'rgba(255,255,255,0.05)',color:C.g3}}>{s.tag}</span>
                  <span style={{fontSize:10,color:C.g3}}>{s.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: ALERTS
═══════════════════════════════════════════════════════════ */
function Alerts() {
  const [dismissed,setDismissed] = useState<number[]>([])
  const visible = ALERTS_DATA.filter((_,i)=>!dismissed.includes(i))
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Critiques" value={visible.filter(a=>a.type==='critical').length} color={C.red} sub="Action immédiate"/>
        <KPI title="Avertissements" value={visible.filter(a=>a.type==='warning').length} color={C.gold} sub="Sous 48 heures"/>
        <KPI title="Informations" value={visible.filter(a=>a.type==='info').length} color={C.b} sub="Veille réglementaire"/>
      </motion.div>
      <motion.div variants={vUp}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <SectionLabel text="Centre d'alertes — grcx + Smart CFO + Trésorerie"/>
            <span style={{fontSize:11,color:C.g3,fontFamily:'monospace'}}>{visible.length} alertes actives</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {visible.length===0&&(
              <div style={{textAlign:'center',padding:'40px',color:C.g3,fontSize:14}}>
                ✓ Aucune alerte active — tous les systèmes sont conformes
              </div>
            )}
            {visible.map((a,i)=>(
              <motion.div key={i} layout initial={{opacity:0}} animate={{opacity:1}}
                style={{display:'flex',alignItems:'flex-start',gap:14,padding:'14px 16px',
                  borderRadius:14,
                  background:a.type==='critical'?C.red2:a.type==='warning'?C.gold2:C.blo,
                  border:`1px solid ${a.type==='critical'?'rgba(239,68,68,0.25)':a.type==='warning'?'rgba(245,158,11,0.25)':'rgba(37,99,235,0.2)'}`}}>
                <Dot color={a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b} pulse={a.type==='critical'}/>
                <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,
                  background:'rgba(255,255,255,0.06)',color:C.g3,fontFamily:'monospace',
                  flexShrink:0,whiteSpace:'nowrap'}}>{a.cat}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:C.g1,lineHeight:1.5}}>{a.msg}</div>
                  <div style={{fontSize:10,color:C.g3,marginTop:4,fontFamily:'monospace'}}>{a.time}</div>
                </div>
                <div style={{display:'flex',gap:7,flexShrink:0}}>
                  <button onClick={()=>setDismissed(d=>[...d,ALERTS_DATA.indexOf(a)])}
                    style={{fontSize:11,padding:'5px 10px',borderRadius:8,border:`1px solid ${C.border}`,
                      cursor:'pointer',background:'transparent',color:C.g3,fontFamily:'monospace'}}>
                    Ignorer
                  </button>
                  <button style={{fontSize:11,padding:'5px 12px',borderRadius:8,border:'none',
                    cursor:'pointer',background:a.type==='critical'?C.red:a.type==='warning'?C.gold:C.b,
                    color:'#fff',fontFamily:'monospace',fontWeight:700}}>
                    {a.action} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: VOICE
═══════════════════════════════════════════════════════════ */
function Voice() {
  const [selected,setSelected] = useState<string|null>(null)
  const sel = CALLS.find(c=>c.id===selected)
  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Appels aujourd'hui" value={12} color={C.b} sub="+20% vs hier" spark={[6,7,9,10,12]}/>
        <KPI title="RDV réservés via IA" value={8} color={C.grn} sub="67% de conversion"/>
        <KPI title="Minutes utilisées" value="47 min" color={C.gold} sub="200 incluses/mois"/>
        <KPI title="Latence P95" value="<1 200ms" color={C.purple} sub="STT+LLM+TTS"/>
      </motion.div>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14}}>
        <motion.div variants={vUp}>
          <Card>
            <SectionLabel text="Journal des appels — Aujourd'hui"/>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {CALLS.map(c=>(
                <div key={c.id} onClick={()=>setSelected(selected===c.id?null:c.id)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                    borderRadius:12,cursor:'pointer',transition:'all 0.15s',
                    background:selected===c.id?C.blo:C.card2,
                    border:`1px solid ${selected===c.id?C.b:C.border}`}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:C.blo,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:16,flexShrink:0}}>📞</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontFamily:'monospace',color:C.g2}}>{c.caller}</div>
                    <div style={{fontSize:11,color:C.g3}}>{c.type} · {c.time}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:11,fontFamily:'monospace',color:C.g3}}>{c.duration}</div>
                    <span style={{fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:5,
                      background:c.result==='Réservé'?C.grn2:c.result==='Transféré'?C.gold2:'rgba(255,255,255,0.05)',
                      color:c.result==='Réservé'?C.grn:c.result==='Transféré'?C.gold:C.g3,
                      fontFamily:'monospace'}}>{c.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        <motion.div variants={vUp} style={{display:'flex',flexDirection:'column',gap:14}}>
          {sel ? (
            <Card>
              <SectionLabel text={`Transcription — ${sel.id}`}/>
              <div style={{padding:'14px 16px',borderRadius:12,
                background:C.card2,border:`1px solid ${C.border}`,
                fontSize:13,color:C.g2,lineHeight:1.7,fontStyle:'italic'}}>
                "{sel.transcript}"
              </div>
              <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
                {[['Durée',sel.duration],['Type',sel.type],['Résultat',sel.result],['Heure',sel.time]].map(([k,v])=>(
                  <div key={k} style={{padding:'6px 10px',borderRadius:8,background:C.blo,
                    border:`1px solid ${C.border}`}}>
                    <span style={{fontSize:9,color:C.g3,fontFamily:'monospace',textTransform:'uppercase',display:'block'}}>{k}</span>
                    <span style={{fontSize:12,fontWeight:600,color:C.b}}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card style={{textAlign:'center',padding:'32px 24px'}}>
              <div style={{fontSize:32,marginBottom:12}}>◐</div>
              <div style={{fontSize:13,color:C.g3}}>Cliquez sur un appel pour voir la transcription</div>
            </Card>
          )}
          <Card>
            <SectionLabel text="Configuration vocale"/>
            {[
              {l:'Numéro actif',v:'+33 X XX XX XX XX',c:C.g2,warn:true},
              {l:'STT Engine',v:'faster-whisper',c:C.b},
              {l:'LLM',v:'Mistral 7B · Hetzner DE',c:C.purple},
              {l:'TTS',v:'XTTS-v2 (Coqui)',c:C.grn},
              {l:'VAD',v:'Silero · 30ms',c:C.teal},
              {l:'Infra',v:'Hetzner AX41 Frankfurt',c:C.gold},
            ].map(s=>(
              <div key={s.l} style={{display:'flex',justifyContent:'space-between',
                alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.g3}}>{s.l}</span>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  {s.warn&&<Dot color={C.gold} pulse/>}
                  <span style={{fontSize:12,fontWeight:600,fontFamily:'monospace',color:s.c}}>{s.v}</span>
                </div>
              </div>
            ))}
            {true && (
              <div style={{marginTop:12,padding:'10px 14px',borderRadius:10,
                background:C.gold2,border:'1px solid rgba(245,158,11,0.25)',
                fontSize:12,color:C.gold}}>
                ⚠ Configurez votre numéro Twilio dans site.config.ts
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB: DOCUMENTS IA
═══════════════════════════════════════════════════════════ */
function Documents() {
  const [query,setQuery] = useState('')
  const [results,setResults] = useState<Array<{text:string;relevance:number}>>([])
  const [loading,setLoading] = useState(false)
  const [indexed] = useState({invoices:143,contracts:12,bank:36,dgfip:8})

  const presets = [
    'Factures impayées depuis plus de 30 jours',
    'Chiffre d\'affaires du trimestre',
    'Clients avec retards de paiement',
    'Dépenses fixes ce mois-ci',
    'Conformité DGFiP — documents manquants',
  ]

  async function search(q:string=query) {
    if(!q.trim()) return
    setQuery(q)
    setLoading(true)
    await new Promise(r=>setTimeout(r,1100))
    const mock = [
      {text:`PROLANN SAS — 3 factures impayées depuis >30 jours (total : 4 200 €). Facture INV-2026-047 du 15 juin 2026 est la plus ancienne (retard : 12 jours). Recommandation : relancer par email + appel Vanivert vocal.`,relevance:0.94},
      {text:`Apizee SAS — 1 facture impayée depuis 17 jours (1 500 €). Échéance dépassée le 5 juillet 2026. Statut Docoon : "Déposée" mais non confirmée "Encaissée".`,relevance:0.87},
      {text:`Cabinet Dr. Martin — compte à jour. Dernier paiement reçu le 30 juin 2026 (228 €). 0 facture impayée.`,relevance:0.71},
    ]
    setResults(mock)
    setLoading(false)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={vS}>
      <motion.div variants={vUp} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <KPI title="Factures indexées" value={indexed.invoices} color={C.b} sub="ChromaDB"/>
        <KPI title="Contrats" value={indexed.contracts} color={C.purple} sub="Documents juridiques"/>
        <KPI title="Relevés bancaires" value={indexed.bank} color={C.grn} sub="PSD2 + Bridge API"/>
        <KPI title="Documents DGFiP" value={indexed.dgfip} color={C.gold} sub="Conformité e-facturation"/>
      </motion.div>
      <motion.div variants={vUp} style={{marginBottom:14}}>
        <Card>
          <SectionLabel text="Interrogez vos documents en langage naturel (ChromaDB + Mistral 7B)"/>
          <div style={{display:'flex',gap:10,marginBottom:12}}>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder="Ex: Quelles factures sont impayées depuis plus de 30 jours?"
              style={{flex:1,padding:'13px 16px',borderRadius:12,
                border:`1.5px solid ${C.border}`,background:'rgba(255,255,255,0.03)',
                color:C.g1,fontSize:14,fontFamily:'Inter,sans-serif',outline:'none',
                transition:'border-color 0.2s'}}
              onFocus={e=>(e.target.style.borderColor=C.b)}
              onBlur={e=>(e.target.style.borderColor=C.border)}/>
            <button onClick={()=>search()}
              style={{padding:'13px 24px',borderRadius:12,border:'none',
                background:C.b,color:'#fff',fontWeight:700,fontSize:14,
                cursor:'pointer',fontFamily:'Inter,sans-serif',flexShrink:0,
                opacity:loading?0.7:1}}>
              {loading?'…':'Interroger'}
            </button>
          </div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {presets.map(s=>(
              <button key={s} onClick={()=>search(s)}
                style={{fontSize:11,padding:'5px 12px',borderRadius:8,
                  border:`1px solid ${C.border}`,background:'rgba(255,255,255,0.02)',
                  color:C.g3,cursor:'pointer',fontFamily:'monospace',transition:'all 0.15s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.b;(e.currentTarget as HTMLElement).style.color=C.b}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;(e.currentTarget as HTMLElement).style.color=C.g3}}>
                {s}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
      {results.length>0&&(
        <motion.div variants={vUp} style={{marginBottom:14}} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
          <Card>
            <SectionLabel text={`Résultats — ${results.length} document(s) trouvé(s)`}/>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {results.map((r,i)=>(
                <div key={i} style={{padding:'14px 16px',borderRadius:12,
                  background:C.blo,border:`1px solid rgba(37,99,235,0.2)`}}>
                  <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                    <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,
                      background:'rgba(37,99,235,0.2)',color:C.b,fontFamily:'monospace',flexShrink:0}}>
                      {(r.relevance*100).toFixed(0)}% pertinent
                    </span>
                    <div style={{fontSize:13,color:C.g1,lineHeight:1.7}}>{r.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
      <motion.div variants={vUp}>
        <Card>
          <SectionLabel text="Architecture Document Intelligence (Pxtly ChromaDB)"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[
              {title:'Ingestion',desc:'Docling (IBM) parse PDF, Word, Excel, images scannées en texte structuré',icon:'◧',color:C.gold},
              {title:'Vectorisation',desc:'ChromaDB HNSW (m=16, ef=64) avec embeddings MiniLM-L6 — cosine similarity',icon:'◈',color:C.b},
              {title:'Recherche',desc:'Mistral 7B génère les réponses contextuelles à partir des chunks les plus pertinents',icon:'◫',color:C.purple},
            ].map(s=>(
              <div key={s.title} style={{padding:'16px 18px',borderRadius:14,
                background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`}}>
                <div style={{fontSize:22,color:s.color,marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.g1,marginBottom:6}}>{s.title}</div>
                <div style={{fontSize:12,color:C.g3,lineHeight:1.6}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════ */
const TABS:Record<string,React.ComponentType> = {
  overview:Overview, cashflow:Cashflow, invoices:Invoices,
  compliance:Compliance, integrations:Integrations,
  alerts:Alerts, voice:Voice, documents:Documents,
}

export default function Dashboard() {
  const [active,setActive] = useState('overview')
  const Tab = TABS[active]||Overview

  return (
    <div style={{display:'flex',minHeight:'100dvh',background:C.bg,
      fontFamily:'Inter, Helvetica Neue, sans-serif',color:C.g1}}>
      <Sidebar active={active} set={setActive}/>
      <main style={{flex:1,padding:'28px 32px',overflowY:'auto',overflowX:'hidden',minWidth:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <div>
            <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:24,
              letterSpacing:'-0.04em',color:C.w,marginBottom:4,marginTop:0}}>
              {NAV.find(n=>n.id===active)?.label}
            </h1>
            <div style={{fontSize:12,fontFamily:'monospace',color:C.g3}}>
              Vanivert Smart CFO · {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            </div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={{padding:'7px 14px',borderRadius:10,border:`1px solid ${C.border}`,
              fontSize:11,fontFamily:'monospace',color:C.gold,background:C.gold2,
              display:'flex',alignItems:'center',gap:7}}>
              <Dot color={C.gold} pulse/>
              {DAYS_LEFT}j avant le 1er sept. 2026
            </div>
            <a href="/" style={{padding:'9px 18px',borderRadius:10,border:`1px solid ${C.border}`,
              background:'transparent',color:C.g2,fontSize:13,fontWeight:600,
              cursor:'pointer',fontFamily:'Inter,sans-serif',textDecoration:'none',display:'block'}}>
              ← Site public
            </a>
            <button style={{padding:'9px 18px',borderRadius:10,border:'none',
              background:C.b,color:'#fff',fontSize:13,fontWeight:700,
              cursor:'pointer',fontFamily:'Inter,sans-serif'}}>
              Exporter rapport
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            transition={{duration:0.25,ease:E}}>
            <Tab/>
          </motion.div>
        </AnimatePresence>
      </main>
      <style>{`
        @keyframes dotpulse{0%,100%{opacity:1}50%{opacity:0.3}}
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
