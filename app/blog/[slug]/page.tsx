import { notFound } from 'next/navigation'
import { ARTICLES } from '@/lib/articles'

const C = { bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73', lt:'#E8E8ED', b:'#1F49B0' }

/* ── Article content ─────────────────────────────────────────────────── */
function Article1() {
  return (
    <>
      <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
        Le 1er septembre 2026, la facturation électronique devient obligatoire pour toutes les entreprises françaises assujetties à la TVA. Voici exactement ce que cela signifie pour les PME et TPE des Côtes d'Armor.
      </p>
      <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{fontSize:40,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>15 000 €</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Amende maximale par an pour non-conformité</div>
          <div style={{fontSize:13,color:'#B45309'}}>Plus 50 € par facture non conforme émise. Pour une PME émettant 500 factures par an, le calcul devient vite douloureux.</div>
        </div>
      </div>
      <h2>Ce qui change au 1er septembre 2026</h2>
      <p>Contrairement à ce que beaucoup pensent, <strong>toutes les entreprises</strong> sont concernées dès le 1er septembre 2026, pas uniquement les grandes. La distinction est la suivante :</p>
      {[
        {date:'1er septembre 2026',label:'Toutes les entreprises assujetties à la TVA',detail:"Obligation de recevoir les factures électroniques via une plateforme agréée (PA ou PDP). Aucune exception.",urgent:true},
        {date:'1er septembre 2026',label:'Grandes entreprises et ETI (+250 salariés)',detail:"Obligation d'émettre et d'envoyer les données d'e-reporting à la DGFiP.",urgent:true},
        {date:'1er septembre 2027',label:'PME et TPE — toutes tailles',detail:"Obligation d'émettre les factures en format structuré (Factur-X, UBL 2.1 ou CII).",urgent:false},
      ].map(item => (
        <div key={item.label} style={{padding:'16px 20px',borderRadius:12,marginBottom:10,background:item.urgent?'#EFF6FF':'#F9FAFB',border:`1px solid ${item.urgent?'#BFDBFE':'#E5E7EB'}`}}>
          <div style={{fontSize:11,fontFamily:'monospace',fontWeight:700,color:item.urgent?'#1D4ED8':'#6B7280',marginBottom:6,textTransform:'uppercase' as const,letterSpacing:'0.06em'}}>{item.date}</div>
          <div style={{fontSize:14,fontWeight:700,color:item.urgent?'#1E40AF':'#111827',marginBottom:4}}>{item.label}</div>
          <div style={{fontSize:13,color:item.urgent?'#3B82F6':'#6B7280'}}>{item.detail}</div>
        </div>
      ))}
      <h2>Le piège de l'annuaire centralisé DGFiP</h2>
      <p>Ce que très peu de comptables expliquent clairement : <strong>signer avec une plateforme agréée (PA) ne suffit pas.</strong> Vous devez également vous enregistrer dans <strong>l'annuaire centralisé DGFiP</strong>. Sans cela, personne ne peut vous envoyer de facture électronique.</p>
      <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:14,padding:'18px 22px',margin:'20px 0 28px'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#991B1B',marginBottom:8}}>⚠ Le délai que personne ne vous dit</div>
        <p style={{fontSize:14,color:'#7F1D1D',margin:0,lineHeight:1.7}}>L'enregistrement dans l'annuaire prend <strong>2 à 4 semaines</strong>. Une entreprise qui signe avec une PA le 15 août 2026 ne sera conforme qu'autour du 5-10 septembre — <strong>après la date limite.</strong></p>
      </div>
      <h2>Les formats obligatoires</h2>
      <p>Votre logiciel doit produire au moins un de ces formats :</p>
      <ul>
        <li><strong>Factur-X</strong> — PDF avec XML intégré (le plus simple pour les PME)</li>
        <li><strong>UBL 2.1</strong> — XML standard européen (échanges internationaux)</li>
        <li><strong>CII</strong> — Cross Industry Invoice, format UNCEFACT (recommandé DGFiP)</li>
      </ul>
      <p>Les factures PDF simples, Word ou Excel ne sont <strong>plus acceptées</strong> entre assujettis à la TVA dès septembre 2026.</p>
      <h2>Que faire maintenant ?</h2>
      <ol>
        <li><strong>Choisissez une PA sur la liste officielle DGFiP</strong> — plus de 100 plateformes agréées disponibles</li>
        <li><strong>Commencez l'enrôlement immédiatement</strong> — ne pas attendre août 2026</li>
        <li><strong>Exigez la confirmation de votre PA</strong> que votre SIRET est bien dans l'annuaire centralisé</li>
        <li><strong>Testez la réception</strong> d'une facture électronique avant le 15 août</li>
      </ol>
      <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#1E40AF',marginBottom:10}}>Calculez votre exposition en 2 minutes</div>
        <p style={{fontSize:14,color:'#1D4ED8',margin:'0 0 16px',lineHeight:1.7}}>Notre outil gratuit analyse votre situation et vous donne un score de risque personnalisé avec les recommandations adaptées.</p>
        <a href="/calculateur" style={{display:'inline-block',background:'#1F49B0',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Calculer mon risque →</a>
      </div>
    </>
  )
}

function Article2() {
  return (
    <>
      <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
        Vous êtes plombier, électricien, kinésithérapeute ou coiffeur. Vous êtes en pleine intervention. Votre téléphone sonne. Vous ne pouvez pas décrocher. L'appelant raccroche et appelle le concurrent. Ce scénario se répète plusieurs fois par jour — et personne ne vous a jamais dit ce que ça vous coûte vraiment.
      </p>
      <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{fontSize:40,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>18 000 €</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Perdus par an pour 3 appels manqués par semaine</div>
          <div style={{fontSize:13,color:'#B45309'}}>Calcul conservateur pour un artisan avec un panier moyen de 350 €. Dans certains secteurs (dentaire, médical), le chiffre dépasse les 40 000 € annuels.</div>
        </div>
      </div>
      <h2>Le calcul qui fait froid dans le dos</h2>
      <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:14,padding:'20px 24px',margin:'20px 0 28px'}}>
        {[
          ['Appels manqués par semaine','3 à 5 (pendant les interventions)'],
          ['Taux d\'abandon sur répondeur','62 % ne rappellent pas (BVA 2026)'],
          ['Clients perdus par semaine','2 à 3 nouveaux clients potentiels'],
          ['Panier moyen d\'une intervention','350 €'],
          ['Perte hebdomadaire','700 à 1 050 €'],
          ['Perte annuelle (50 semaines)','35 000 à 52 500 €'],
        ].map(([k,v],i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #E5E7EB'}}>
            <span style={{fontSize:13,color:'#6B7280'}}>{k}</span>
            <span style={{fontSize:13,fontWeight:700,color:'#111827'}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:12,padding:'10px 14px',background:'#FEE2E2',borderRadius:8,fontSize:13,fontWeight:700,color:'#991B1B',textAlign:'center' as const}}>
          Même divisé par 5 : 7 000 à 10 000 € de CA perdu chaque année
        </div>
      </div>
      <h2>Pourquoi le répondeur ne suffit pas</h2>
      <ul>
        <li><strong>85 % des appelants raccrochent sans laisser de message</strong> (Ifop 2025)</li>
        <li>Les 15 % qui laissent un message ont souvent trouvé quelqu'un d'autre avant votre rappel</li>
        <li>En haute saison touristique (juillet-août en Bretagne), chaque appel non décroché est une réservation perdue définitivement</li>
      </ul>
      <h2>Les secteurs les plus touchés en Bretagne</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,margin:'20px 0 28px'}}>
        {[
          {sector:'Kinésithérapie',loss:'12 000 – 24 000 €/an',reason:'Séances de 45 min, téléphone inaccessible en permanence'},
          {sector:'Dentistes',loss:'15 000 – 35 000 €/an',reason:'Soins continus, secrétaire absente le midi et le soir'},
          {sector:'Plombiers-chauffagistes',loss:'8 000 – 18 000 €/an',reason:'Interventions terrain, mains occupées, bruit ambiant'},
          {sector:'Hôtels côtiers (haute saison)',loss:'20 000 – 60 000 €/an',reason:'Juillet-août : 50+ appels/jour, un seul réceptionniste'},
        ].map(s => (
          <div key={s.sector} style={{padding:'14px 16px',borderRadius:12,background:'#F9FAFB',border:'1px solid #E5E7EB'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#111827',marginBottom:4}}>{s.sector}</div>
            <div style={{fontSize:16,fontWeight:900,color:'#DC2626',letterSpacing:'-0.02em',marginBottom:4}}>{s.loss}</div>
            <div style={{fontSize:11,color:'#6B7280',lineHeight:1.4}}>{s.reason}</div>
          </div>
        ))}
      </div>
      <h2>La solution à 19 euros par mois</h2>
      <p>Vanivert répond à vos appels 24h/24 en français naturel — prend les rendez-vous dans votre agenda, laisse des messages structurés, informe l'appelant en temps réel.</p>
      <p><strong>ROI immédiat :</strong> un seul rendez-vous récupéré de plus par semaine à 45 € = 2 340 € de CA supplémentaire par an. L'abonnement Vanivert coûte 228 € par an.</p>
      <div style={{background:'#EDE9FE',border:'1px solid #C4B5FD',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#4C1D95',marginBottom:10}}>Essayez gratuitement pendant 30 jours</div>
        <p style={{fontSize:14,color:'#5B21B6',margin:'0 0 16px',lineHeight:1.7}}>Aucune carte bancaire requise. Configuration en 10 minutes. Si vous ne récupérez pas au moins un client supplémentaire en 30 jours, vous ne payez rien.</p>
        <a href="/demo" style={{display:'inline-block',background:'#7C3AED',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Démarrer l'essai gratuit →</a>
      </div>
    </>
  )
}

function Article3() {
  return (
    <>
      <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
        Dans toutes les newsletters sur la réforme e-facturation 2026, on parle de choisir une plateforme agréée. C'est exact. Mais presque personne ne mentionne l'étape suivante — celle qui fait rater la deadline à 90 % des entreprises qui pensaient être en règle.
      </p>
      <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{fontSize:36,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>2–4 sem.</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Délai de traitement de l'enrôlement annuaire</div>
          <div style={{fontSize:13,color:'#B45309'}}>Une entreprise qui signe avec une PA le 15 août 2026 ne sera conforme qu'autour du 5-10 septembre — après la deadline.</div>
        </div>
      </div>
      <h2>C'est quoi, l'annuaire centralisé DGFiP ?</h2>
      <p>Chaque entreprise assujettie à la TVA doit être répertoriée dans un <strong>annuaire centralisé géré par la DGFiP</strong> qui indique sa plateforme agréée, le format électronique accepté et ses coordonnées de routage. Sans cet enregistrement, <strong>personne ne peut vous envoyer de facture électronique</strong> — même si vous avez signé avec la meilleure PA du marché.</p>
      <h2>Le scénario catastrophe — très fréquent</h2>
      <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:14,padding:'18px 22px',margin:'20px 0 28px'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#991B1B',marginBottom:12}}>Exemple — PME industrielle, Guingamp</div>
        {[
          ['1er août','Valeo envoie une lettre : factures électroniques obligatoires à partir du 1er septembre.'],
          ['10 août','Signature avec une PA. Le commercial dit que c\'est opérationnel "en quelques jours".'],
          ['1er septembre','La PME reçoit une facture de Valeo. Elle est rejetée : la PME n\'est pas dans l\'annuaire centralisé.'],
          ['3 septembre','L\'annuaire traite l\'enrôlement. 3 jours de non-conformité. 50 € par facture reçue non traitée.'],
        ].map(([date, event]) => (
          <div key={date} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:10}}>
            <div style={{fontSize:11,fontFamily:'monospace',fontWeight:700,color:'#DC2626',flexShrink:0,width:80}}>{date}</div>
            <div style={{fontSize:13,color:'#7F1D1D',lineHeight:1.5}}>{event}</div>
          </div>
        ))}
      </div>
      <h2>Comment éviter ce piège en 3 étapes</h2>
      <ol>
        <li><strong>Choisissez votre PA maintenant</strong> — pas en août. Vanivert travaille avec Docoon (PA n°0001 sur la liste DGFiP).</li>
        <li><strong>Demandez confirmation écrite</strong> de votre PA que votre SIRET est bien inscrit dans l'annuaire centralisé, avec la date de confirmation.</li>
        <li><strong>Testez avant le 15 août</strong> — demandez une facture test. Si vous la recevez correctement, vous êtes conforme.</li>
      </ol>
      <h2>La pression vient aussi de vos clients grands comptes</h2>
      <p>Les grandes entreprises (Valeo, Orange, Thales, Ekinops…) envoient déjà des lettres à leurs fournisseurs PME pour exiger la conformité dès septembre 2026 — même pour les PME dont l'obligation légale d'émission est en 2027. Si vous êtes fournisseur d'un grand groupe et n'êtes pas dans leur liste de fournisseurs e-facture conformes, vous risquez des délais de paiement allongés.</p>
      <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#92400E',marginBottom:10}}>⚡ Agissez avant le 15 août</div>
        <p style={{fontSize:14,color:'#B45309',margin:'0 0 16px',lineHeight:1.7}}>Vanivert gère l'enrôlement dans l'annuaire centralisé pour le compte de ses clients — inclus dans le service conformité à 1 200 €/mois, sans frais d'installation.</p>
        <a href="/calculateur" style={{display:'inline-block',background:'#D97706',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Vérifier ma conformité →</a>
      </div>
    </>
  )
}

const CONTENT: Record<string, React.ComponentType> = {
  'e-facturation-2026-guide-bretagne': Article1,
  'appels-manques-artisans-bretagne': Article2,
  'annuaire-centralise-dgfip-piege': Article3,
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  if (!article) return { title: 'Article introuvable' }
  return {
    title: `${article.title} — Vanivert`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.image] },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  const ArticleContent = CONTENT[params.slug]
  if (!article || !ArticleContent) notFound()

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, fontFamily:'Inter, sans-serif' }}>
      <nav style={{ padding:'16px 40px', display:'flex', alignItems:'center',
        justifyContent:'space-between', background:C.w, borderBottom:`1px solid ${C.lt}`,
        position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ fontWeight:800, fontSize:17, color:C.ink, textDecoration:'none',
          letterSpacing:'-0.04em', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.b }}/>vanivert
        </a>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <a href="/blog" style={{ fontSize:13, color:C.g, textDecoration:'none' }}>← Blog</a>
          <a href="/calculateur" style={{ background:C.b, color:'#fff', fontSize:13,
            fontWeight:700, borderRadius:980, padding:'8px 18px', textDecoration:'none' }}>
            Calculer mon risque
          </a>
        </div>
      </nav>

      {/* Hero image */}
      <div style={{ height:320, overflow:'hidden', position:'relative', background:'#E5E7EB' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.imageAlt}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}/>
        <div style={{ position:'absolute', bottom:24, left:40,
          background:C.w, borderRadius:8, padding:'5px 14px',
          fontSize:12, fontWeight:700, color:article.categoryColor }}>
          {article.category}
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth:720, margin:'0 auto', padding:'44px 32px 80px' }}>
        <div style={{ display:'flex', gap:14, fontSize:12, color:C.g,
          fontFamily:'monospace', marginBottom:18, paddingBottom:18, borderBottom:`1px solid ${C.lt}` }}>
          <span>{article.date}</span><span>·</span>
          <span>{article.readTime} de lecture</span><span>·</span>
          <span>Par l'équipe Vanivert</span>
        </div>

        <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:34,
          letterSpacing:'-0.04em', color:C.ink, lineHeight:1.1,
          marginBottom:32, marginTop:0 }}>{article.title}</h1>

        <div style={{ fontSize:15, lineHeight:1.8, color:C.ink }}>
          <style>{`
            h2{font-size:21px;font-weight:800;letter-spacing:-0.025em;color:#0A090A;margin:32px 0 12px;font-family:Inter,sans-serif}
            p{color:#374151;line-height:1.8;margin-bottom:16px}
            ul,ol{color:#374151;padding-left:22px;margin-bottom:16px}
            li{margin-bottom:7px;line-height:1.7}
            strong{color:#0A090A}
            a{color:#1F49B0}
          `}</style>
          <ArticleContent />
        </div>

        {/* Author */}
        <div style={{ marginTop:44, paddingTop:24, borderTop:`1px solid ${C.lt}`,
          display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'#EEF2FF',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🧑‍💼</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink }}>Pawan Kumar</div>
            <div style={{ fontSize:12, color:C.g }}>Co-fondateur & CTO, Vanivert · EDHEC MiM Finance</div>
          </div>
        </div>

        <div style={{ marginTop:28, display:'flex', gap:10, flexWrap:'wrap' as const }}>
          <a href="/blog" style={{ fontSize:13, fontWeight:600, padding:'8px 18px',
            borderRadius:9, border:`1px solid ${C.lt}`, color:C.ink, textDecoration:'none', background:C.bg }}>
            ← Tous les articles
          </a>
          <a href="/calculateur" style={{ fontSize:13, fontWeight:700, padding:'8px 18px',
            borderRadius:9, background:C.b, color:'#fff', textDecoration:'none' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
