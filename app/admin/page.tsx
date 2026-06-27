'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const C = { bg:'#F7F9FB',w:'#FFFFFF',ink:'#0A090A',g:'#6E6E73',lt:'#E8E8ED',sub:'#F2F2F7',b:'#1F49B0',grn:'#30D158',red:'#FF3B30' }
const E: [number,number,number,number] = [0.16,1,0.3,1]
const vU = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.5,ease:E}} }
const vS = { hidden:{}, visible:{transition:{staggerChildren:0.06}} }

// --- EDITABLE CONTENT STATE ---
const DEFAULT_CONTENT = {
  pricing: { starter:19, business:29, premium:99, starterAnnual:16, businessAnnual:24, premiumAnnual:82 },
  contact: { email:'contact@vanivert.fr', whatsapp:'+33XXXXXXXXX', phone:'+33XXXXXXXXX', address:'Lannion, Côtes d\'Armor, Bretagne' },
  hero: { h1b:'la facture papier', sub:"L'infrastructure financière des grandes entreprises, accessible aux PME françaises." },
  voice: { demoNumber:'+33XXXXXXXXX', setupFee:200, minuteRate:0.08 },
  legal: { siret:'En cours d\'enregistrement', siren:'En cours', rcs:'Lannion', vatNumber:'FR XX XXXXXXXXX' },
}

type Content = typeof DEFAULT_CONTENT
type Tab = 'overview'|'pricing'|'content'|'contact'|'leads'|'legal'|'settings'

const MOCK_LEADS = [
  {id:1,name:'Cabinet Dr. Martin',siret:'35231982602570',grade:'F',exposure:14400,email:'martin@cabinet.fr',date:'2026-06-27',software:'excel'},
  {id:2,name:'MECA ARMOR SARL',siret:'45678901234567',grade:'D',exposure:9600,email:'flecoq@mecaarmor.fr',date:'2026-06-27',software:'sage'},
  {id:3,name:'Salon Tanguy',siret:'12345678901234',grade:'C',exposure:4200,email:'',date:'2026-06-26',software:'autre'},
  {id:4,name:'Hôtel Ker Buhe',siret:'98765432109876',grade:'B',exposure:1800,email:'hotel@kerbuhe.fr',date:'2026-06-26',software:'tiime'},
]

export default function Admin() {
  const [tab,setTab]=useState<Tab>('overview')
  const [content,setContent]=useState<Content>(DEFAULT_CONTENT)
  const [saved,setSaved]=useState(false)
  const [authed,setAuthed]=useState(false)
  const [pw,setPw]=useState('')

  function save() {
    // TODO: POST to /api/admin/content with Supabase auth
    setSaved(true)
    setTimeout(()=>setSaved(false),2500)
  }

  function update(section:keyof Content,key:string,val:string|number) {
    setContent(c=>({...c,[section]:{...c[section],[key]:val}}))
  }

  if(!authed) return (
    <div style={{minHeight:'100dvh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter, sans-serif'}}>
      <div style={{background:C.w,borderRadius:20,padding:36,width:360,boxShadow:'0 4px 32px rgba(0,0,0,0.06)',border:`1px solid ${C.lt}`}}>
        <div style={{fontFamily:'monospace',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase' as const,color:C.g,marginBottom:16}}>Vanivert Admin</div>
        <h2 style={{fontFamily:'Inter',fontWeight:900,fontSize:22,letterSpacing:'-0.03em',color:C.ink,marginBottom:20,marginTop:0}}>Accès restreint</h2>
        <input type="password" placeholder="Mot de passe admin" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&pw==='vanivert2026')setAuthed(true)}}
          style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,marginBottom:12}}/>
        <button onClick={()=>{if(pw==='vanivert2026')setAuthed(true)}}
          style={{width:'100%',background:C.b,color:'#fff',fontWeight:700,fontSize:15,border:'none',borderRadius:980,padding:'12px',cursor:'pointer',fontFamily:'Inter'}}>
          Entrer →
        </button>
        <p style={{fontSize:11,color:C.g,marginTop:12,textAlign:'center'}}>Mot de passe par défaut: vanivert2026 — à changer immédiatement</p>
      </div>
    </div>
  )

  const tabs:Array<{id:Tab,label:string,icon:string}> = [
    {id:'overview',label:'Vue d\'ensemble',icon:'📊'},
    {id:'leads',label:'Leads',icon:'👥'},
    {id:'pricing',label:'Tarifs',icon:'💶'},
    {id:'content',label:'Contenu',icon:'✏️'},
    {id:'contact',label:'Contact',icon:'📞'},
    {id:'legal',label:'Légal',icon:'⚖️'},
    {id:'settings',label:'Paramètres',icon:'⚙️'},
  ]

  return (
    <div style={{minHeight:'100dvh',background:C.bg,fontFamily:'Inter, sans-serif',display:'flex'}}>
      {/* Sidebar */}
      <aside style={{width:220,background:C.w,borderRight:`1px solid ${C.lt}`,padding:'20px 0',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'0 20px 20px',borderBottom:`1px solid ${C.lt}`,marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:16,color:C.ink,letterSpacing:'-0.04em',display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:C.b}}/>vanivert
          </div>
          <div style={{fontSize:10,fontFamily:'monospace',color:C.g,letterSpacing:'0.08em',textTransform:'uppercase' as const,marginTop:4}}>Admin Panel</div>
        </div>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',border:'none',background:tab===t.id?C.sub:'transparent',cursor:'pointer',fontFamily:'Inter',fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?C.ink:C.g,textAlign:'left',width:'100%',transition:'all 0.15s',borderLeft:`3px solid ${tab===t.id?C.b:'transparent'}`}}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{marginTop:'auto',padding:'16px 20px',borderTop:`1px solid ${C.lt}`}}>
          <button onClick={()=>setAuthed(false)}
            style={{fontSize:12,color:C.g,background:'none',border:'none',cursor:'pointer',fontFamily:'Inter',padding:0}}>
            Déconnexion →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1,padding:'32px 40px',overflow:'auto'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <div>
            <h1 style={{fontFamily:'Inter',fontWeight:900,fontSize:24,letterSpacing:'-0.03em',color:C.ink,marginBottom:4,marginTop:0}}>
              {tabs.find(t=>t.id===tab)?.label}
            </h1>
            <div style={{fontSize:12,fontFamily:'monospace',color:C.g}}>Vanivert Admin · {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
          {['pricing','content','contact','legal'].includes(tab)&&(
            <button onClick={save}
              style={{background:saved?C.grn:C.b,color:'#fff',fontWeight:700,fontSize:13,border:'none',borderRadius:980,padding:'10px 24px',cursor:'pointer',fontFamily:'Inter',transition:'background 0.3s'}}>
              {saved?'✓ Sauvegardé':'Sauvegarder les modifications'}
            </button>
          )}
          {tab==='overview'&&<a href="/" target="_blank" style={{fontSize:13,color:C.b,fontWeight:600,textDecoration:'none'}}>Voir le site →</a>}
        </div>

        <motion.div key={tab} initial="hidden" animate="visible" variants={vS}>

          {/* OVERVIEW */}
          {tab==='overview'&&(
            <div>
              <motion.div variants={vU} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
                {[{l:'Leads total',v:'4',c:C.ink},{l:'Emails capturés',v:'3',c:C.b},{l:'Grade F/D',v:'2',c:C.red},{l:'MRR',v:'€0',c:C.grn}].map(m=>(
                  <div key={m.l} style={{background:C.w,borderRadius:16,padding:'20px 22px',border:`1px solid ${C.lt}`,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                    <div style={{fontSize:11,fontFamily:'monospace',textTransform:'uppercase' as const,letterSpacing:'0.08em',color:C.g,marginBottom:8}}>{m.l}</div>
                    <div style={{fontFamily:'Inter',fontWeight:900,fontSize:32,color:m.c,letterSpacing:'-0.04em'}}>{m.v}</div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={vU} style={{background:C.w,borderRadius:16,border:`1px solid ${C.lt}`,overflow:'hidden'}}>
                <div style={{padding:'16px 22px',borderBottom:`1px solid ${C.lt}`,fontWeight:700,fontSize:14,color:C.ink}}>Derniers leads du calculateur</div>
                <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                  <thead><tr>{['Entreprise','SIRET','Grade','Exposition','Email','Date'].map(h=>(
                    <th key={h} style={{padding:'10px 16px',textAlign:'left' as const,fontSize:11,fontFamily:'monospace',textTransform:'uppercase' as const,letterSpacing:'0.06em',color:C.g,borderBottom:`1px solid ${C.lt}`,fontWeight:600}}>{h}</th>
                  ))}</tr></thead>
                  <tbody>{MOCK_LEADS.slice(0,3).map(l=>(
                    <tr key={l.id} style={{borderBottom:`1px solid ${C.lt}`}}>
                      <td style={{padding:'12px 16px',fontSize:13,fontWeight:600,color:C.ink}}>{l.name}</td>
                      <td style={{padding:'12px 16px',fontSize:12,fontFamily:'monospace',color:C.g}}>{l.siret}</td>
                      <td style={{padding:'12px 16px'}}><span style={{fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:6,background:{F:'#FFF1F0',D:'#FFF7E6',C:'#FFFBE6',B:'#F6FFED',A:'#F0FDF4'}[l.grade],color:{F:'#CF1322',D:'#D46B08',C:'#AD8B00',B:'#389E0D',A:'#0A3622'}[l.grade]}}>{l.grade}</span></td>
                      <td style={{padding:'12px 16px',fontSize:13,fontWeight:600,color:l.exposure>10000?C.red:C.ink}}>{l.exposure.toLocaleString('fr-FR')} €</td>
                      <td style={{padding:'12px 16px',fontSize:12,color:C.g}}>{l.email||'—'}</td>
                      <td style={{padding:'12px 16px',fontSize:12,fontFamily:'monospace',color:C.g}}>{l.date}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </motion.div>
            </div>
          )}

          {/* LEADS */}
          {tab==='leads'&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:16,border:`1px solid ${C.lt}`,overflow:'hidden'}}>
              <div style={{padding:'16px 22px',borderBottom:`1px solid ${C.lt}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:700,fontSize:14,color:C.ink}}>Tous les leads ({MOCK_LEADS.length})</span>
                <button style={{fontSize:12,background:C.b,color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',cursor:'pointer',fontFamily:'Inter',fontWeight:600}}>Exporter CSV</button>
              </div>
              <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                <thead><tr>{['Entreprise','SIRET','Logiciel','Grade','Exposition','Email','Date','Action'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'left' as const,fontSize:11,fontFamily:'monospace',textTransform:'uppercase' as const,letterSpacing:'0.06em',color:C.g,borderBottom:`1px solid ${C.lt}`,fontWeight:600}}>{h}</th>
                ))}</tr></thead>
                <tbody>{MOCK_LEADS.map(l=>(
                  <tr key={l.id} style={{borderBottom:`1px solid ${C.lt}`}}>
                    <td style={{padding:'12px 14px',fontSize:13,fontWeight:600,color:C.ink}}>{l.name}</td>
                    <td style={{padding:'12px 14px',fontSize:11,fontFamily:'monospace',color:C.g}}>{l.siret}</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:C.g}}>{l.software}</td>
                    <td style={{padding:'12px 14px'}}><span style={{fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:6,background:{F:'#FFF1F0',D:'#FFF7E6',C:'#FFFBE6',B:'#F6FFED',A:'#F0FDF4'}[l.grade],color:{F:'#CF1322',D:'#D46B08',C:'#AD8B00',B:'#389E0D',A:'#0A3622'}[l.grade]}}>{l.grade}</span></td>
                    <td style={{padding:'12px 14px',fontSize:13,fontWeight:600,color:l.exposure>10000?C.red:C.ink}}>{l.exposure.toLocaleString('fr-FR')} €</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:l.email?C.ink:C.g}}>{l.email||'Non renseigné'}</td>
                    <td style={{padding:'12px 14px',fontSize:12,fontFamily:'monospace',color:C.g}}>{l.date}</td>
                    <td style={{padding:'12px 14px'}}>
                      {l.email&&<a href={`mailto:${l.email}?subject=Votre conformité e-facturation&body=Bonjour,%0A%0AJ'ai vu que votre entreprise a un score ${l.grade} sur notre calculateur...`}
                        style={{fontSize:11,background:C.b,color:'#fff',borderRadius:6,padding:'4px 10px',textDecoration:'none',fontWeight:600}}>Contacter</a>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </motion.div>
          )}

          {/* PRICING */}
          {tab==='pricing'&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {(['starter','business','premium'] as const).map(plan=>(
                <motion.div key={plan} variants={vU} style={{background:C.w,borderRadius:16,padding:24,border:`1px solid ${C.lt}`}}>
                  <div style={{fontFamily:'monospace',fontSize:11,textTransform:'uppercase' as const,letterSpacing:'0.1em',color:C.g,marginBottom:16}}>{plan}</div>
                  {[{label:'Prix mensuel (€)',key:`${plan}` as keyof typeof content.pricing},{label:'Prix annuel (€)',key:`${plan}Annual` as keyof typeof content.pricing}].map(field=>(
                    <div key={field.label} style={{marginBottom:14}}>
                      <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{field.label}</label>
                      <input type="number" value={content.pricing[field.key]}
                        onChange={e=>update('pricing',field.key,+e.target.value)}
                        style={{width:'100%',padding:'10px 14px',border:`1.5px solid ${C.lt}`,borderRadius:10,fontSize:18,fontWeight:700,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,color:C.ink}}
                        onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                    </div>
                  ))}
                </motion.div>
              ))}
              <motion.div variants={vU} style={{gridColumn:'span 3',background:C.sub,borderRadius:14,padding:'16px 20px',fontSize:13,color:C.g}}>
                💡 Les modifications de prix s'appliquent immédiatement sur la page d'accueil. Les clients existants ne sont pas affectés.
              </motion.div>
            </div>
          )}

          {/* CONTENT */}
          {tab==='content'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {[{section:'hero' as const,label:'Héro — Texte',fields:[{k:'h1b',l:'Texte bleu du titre'},{k:'sub',l:'Sous-titre'}]},{section:'voice' as const,label:'Réception vocale',fields:[{k:'demoNumber',l:'Numéro de démonstration'},{k:'minuteRate',l:'Tarif à la minute (€)'},{k:'setupFee',l:'Frais d\'installation (€)'}]}].map(sec=>(
                <motion.div key={sec.label} variants={vU} style={{background:C.w,borderRadius:16,padding:24,border:`1px solid ${C.lt}`}}>
                  <div style={{fontWeight:700,fontSize:15,color:C.ink,marginBottom:18}}>{sec.label}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {sec.fields.map(field=>(
                      <div key={field.k}>
                        <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{field.l}</label>
                        <input value={String((content[sec.section] as Record<string,string|number>)[field.k])}
                          onChange={e=>update(sec.section,field.k,e.target.value)}
                          style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                          onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CONTACT */}
          {tab==='contact'&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:16,padding:32,border:`1px solid ${C.lt}`,maxWidth:560}}>
              <div style={{fontWeight:700,fontSize:15,color:C.ink,marginBottom:20}}>Coordonnées affichées sur le site</div>
              {[{k:'email',l:'Email de contact',t:'email'},{k:'whatsapp',l:'Numéro WhatsApp',t:'text'},{k:'phone',l:'Numéro téléphone démo',t:'text'},{k:'address',l:'Adresse (footer)',t:'text'}].map(field=>(
                <div key={field.k} style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{field.l}</label>
                  <input type={field.t} value={content.contact[field.k as keyof typeof content.contact]}
                    onChange={e=>update('contact',field.k,e.target.value)}
                    style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
              ))}
            </motion.div>
          )}

          {/* LEGAL */}
          {tab==='legal'&&(
            <motion.div variants={vU} style={{background:C.w,borderRadius:16,padding:32,border:`1px solid ${C.lt}`,maxWidth:560}}>
              <div style={{fontWeight:700,fontSize:15,color:C.ink,marginBottom:20}}>Informations légales</div>
              {[{k:'siret',l:'SIRET'},{k:'siren',l:'SIREN'},{k:'rcs',l:'RCS (ville)'},{k:'vatNumber',l:'Numéro de TVA intracommunautaire'}].map(field=>(
                <div key={field.k} style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.g,display:'block',marginBottom:5}}>{field.l}</label>
                  <input value={content.legal[field.k as keyof typeof content.legal]}
                    onChange={e=>update('legal',field.k,e.target.value)}
                    style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${C.lt}`,borderRadius:12,fontSize:14,fontFamily:'Inter',outline:'none',background:C.sub,boxSizing:'border-box' as const,fontFamily:'monospace'}}
                    onFocus={e=>(e.target.style.borderColor=C.b)} onBlur={e=>(e.target.style.borderColor=C.lt)}/>
                </div>
              ))}
              <div style={{marginTop:20,padding:'14px 18px',background:'#FFF7E6',border:'1px solid #FFD591',borderRadius:12,fontSize:13,color:'#AD6800'}}>
                ⚠️ Le SIRET sera disponible 1-3 semaines après votre inscription URSSAF à autoentrepreneur.urssaf.fr
              </div>
            </motion.div>
          )}

          {/* SETTINGS */}
          {tab==='settings'&&(
            <motion.div variants={vU} style={{display:'flex',flexDirection:'column',gap:16,maxWidth:500}}>
              {[{l:'Changer le mot de passe admin',btn:'Modifier',danger:false},{l:'Exporter toutes les données leads (CSV)',btn:'Exporter',danger:false},{l:'Vider les données de test',btn:'Supprimer',danger:true}].map(s=>(
                <div key={s.l} style={{background:C.w,borderRadius:14,padding:'18px 22px',border:`1px solid ${C.lt}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:14,color:C.ink}}>{s.l}</span>
                  <button style={{fontSize:12,fontWeight:700,background:s.danger?'#FFF1F0':'transparent',color:s.danger?C.red:C.b,border:`1.5px solid ${s.danger?'#FFCCC7':C.lt}`,borderRadius:8,padding:'7px 16px',cursor:'pointer',fontFamily:'Inter'}}>
                    {s.btn}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
