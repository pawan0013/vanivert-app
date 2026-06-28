import { notFound } from 'next/navigation'
import { ARTICLES } from '../page'

const C = { bg:'#F7F9FB', w:'#FFFFFF', ink:'#0A090A', g:'#6E6E73', lt:'#E8E8ED', b:'#1F49B0' }

const CONTENT: Record<string, { body: React.ReactNode; image: string; imageAlt: string }> = {

  // ── ARTICLE 1 ─────────────────────────────────────────────────────────────
  'e-facturation-2026-guide-bretagne': {
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Documents comptables et factures sur un bureau professionnel',
    body: (
      <>
        <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
          Le 1er septembre 2026, la facturation électronique devient obligatoire pour toutes les entreprises françaises assujetties à la TVA. Voici exactement ce que cela signifie pour les PME et TPE des Côtes d'Armor — et comment ne pas rater l'échéance.
        </p>

        {/* Key stat */}
        <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
          <div style={{fontSize:40,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>15 000 €</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Amende maximale par an pour non-conformité</div>
            <div style={{fontSize:13,color:'#B45309'}}>Plus 50 € par facture non conforme émise. Le calcul devient vite douloureux pour une PME émettant 500 factures par an.</div>
          </div>
        </div>

        <h2>Ce qui change au 1er septembre 2026</h2>
        <p>Contrairement à ce que beaucoup croient, <strong>toutes les entreprises</strong> sont concernées dès le 1er septembre 2026 — pas uniquement les grandes. La distinction est la suivante :</p>

        <div style={{display:'grid',gap:12,margin:'20px 0 28px'}}>
          {[
            {date:'1er septembre 2026',label:'Toutes les entreprises assujetties à la TVA',detail:'Obligation de recevoir les factures électroniques via une plateforme agréée (PA ou PDP). Aucune exception.',urgent:true},
            {date:'1er septembre 2026',label:'Grandes entreprises et ETI (+250 salariés)',detail:'Obligation d\'émettre et d\'envoyer les données d\'e-reporting à la DGFiP.',urgent:true},
            {date:'1er septembre 2027',label:'PME et TPE — toutes tailles',detail:'Obligation d\'émettre les factures en format structuré (Factur-X, UBL 2.1 ou CII).',urgent:false},
          ].map(item => (
            <div key={item.date+item.label} style={{padding:'16px 20px',borderRadius:12,background:item.urgent?'#EFF6FF':'#F9FAFB',border:`1px solid ${item.urgent?'#BFDBFE':'#E5E7EB'}`}}>
              <div style={{fontSize:11,fontFamily:'monospace',fontWeight:700,color:item.urgent?'#1D4ED8':'#6B7280',marginBottom:6,textTransform:'uppercase' as const,letterSpacing:'0.06em'}}>{item.date}</div>
              <div style={{fontSize:14,fontWeight:700,color:item.urgent?'#1E40AF':'#111827',marginBottom:4}}>{item.label}</div>
              <div style={{fontSize:13,color:item.urgent?'#3B82F6':'#6B7280'}}>{item.detail}</div>
            </div>
          ))}
        </div>

        <h2>Le piège de l'annuaire centralisé DGFiP</h2>
        <p>Ce que très peu de comptables expliquent clairement à leurs clients : <strong>signer avec une plateforme agréée (PA) ne suffit pas.</strong></p>
        <p>Vous devez également vous enregistrer dans <strong>l'annuaire centralisé DGFiP</strong> — un répertoire officiel qui référence votre entreprise et votre PA. Sans cet enregistrement, vos fournisseurs ne peuvent pas vous envoyer de factures électroniques même s'ils sont eux-mêmes conformes.</p>

        <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:14,padding:'18px 22px',margin:'20px 0 28px'}}>
          <div style={{fontSize:14,fontWeight:700,color:'#991B1B',marginBottom:8}}>⚠ Le délai que personne ne vous dit</div>
          <p style={{fontSize:14,color:'#7F1D1D',margin:0,lineHeight:1.7}}>L'enregistrement dans l'annuaire centralisé prend <strong>2 à 4 semaines</strong> à être traité et validé par la DGFiP. Une entreprise qui signe avec une PA le 15 août 2026 ne sera donc conforme qu'autour du 5-10 septembre — <strong>après la date limite.</strong></p>
        </div>

        <h2>Les formats obligatoires : ce que votre logiciel doit produire</h2>
        <p>La DGFiP impose trois formats légaux acceptés. Votre logiciel de facturation doit en produire au moins un :</p>
        <ul>
          <li><strong>Factur-X</strong> — un PDF classique avec un fichier XML intégré (le plus simple à adopter pour les PME)</li>
          <li><strong>UBL 2.1</strong> — format XML standard européen (pour les échanges internationaux)</li>
          <li><strong>CII</strong> — Cross Industry Invoice, format XML UNCEFACT (recommandé par la DGFiP)</li>
        </ul>
        <p>Les factures PDF simples, les factures Word, les factures Excel ne sont <strong>plus acceptées entre assujettis à la TVA</strong> dès septembre 2026.</p>

        <h2>Que faire maintenant, concrètement ?</h2>
        <ol>
          <li><strong>Choisissez une PA sur la liste officielle DGFiP</strong> — plus de 100 plateformes agréées. Critères : compatibilité avec votre logiciel actuel, prix, support français.</li>
          <li><strong>Signez et commencez l'enrôlement immédiatement</strong> — ne pas attendre août.</li>
          <li><strong>Vérifiez votre annuaire centralisé</strong> — votre PA doit confirmer que l'enrôlement est finalisé avant le 1er septembre.</li>
          <li><strong>Testez la réception d'une facture électronique</strong> — envoyez-vous une facture test via votre PA pour valider le circuit complet.</li>
        </ol>

        <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
          <div style={{fontSize:15,fontWeight:700,color:'#1E40AF',marginBottom:10}}>Calculez votre exposition en 2 minutes</div>
          <p style={{fontSize:14,color:'#1D4ED8',margin:'0 0 16px',lineHeight:1.7}}>Notre outil gratuit analyse votre situation et vous donne un score de risque personnalisé avec les recommandations adaptées à votre entreprise.</p>
          <a href="/calculateur" style={{display:'inline-block',background:'#1F49B0',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Calculer mon risque →</a>
        </div>
      </>
    )
  },

  // ── ARTICLE 2 ─────────────────────────────────────────────────────────────
  'appels-manques-artisans-bretagne': {
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Artisan plombier au travail, les mains occupées, téléphone inaccessible',
    body: (
      <>
        <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
          Vous êtes plombier, électricien, kinésithérapeute ou coiffeur. Vous êtes en pleine intervention. Votre téléphone sonne. Vous ne pouvez pas décrocher. L'appelant raccroche. Il appelle le concurrent. Ce scénario se répète plusieurs fois par jour — et personne ne vous a jamais dit ce que ça vous coûte vraiment.
        </p>

        <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
          <div style={{fontSize:40,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>18 000 €</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Perdus par an pour 3 appels manqués par semaine</div>
            <div style={{fontSize:13,color:'#B45309'}}>Calcul conservateur pour un artisan avec un panier moyen de 350 €. Dans certains secteurs (dentaire, immobilier), le chiffre dépasse les 40 000 € annuels.</div>
          </div>
        </div>

        <h2>Le calcul qui fait froid dans le dos</h2>
        <p>Faisons le calcul ensemble, pas à pas, pour un artisan type à Lannion ou Perros-Guirec :</p>

        <div style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:14,padding:'20px 24px',margin:'20px 0 28px'}}>
          <div style={{display:'flex',flexDirection:'column' as const,gap:10}}>
            {[
              ['Appels manqués par semaine','3 à 5 appels (pendant les interventions)'],
              ['Taux d\'abandon sur répondeur','62 % ne rappellent pas (source BVA 2026)'],
              ['Clients perdus par semaine','2 à 3 nouveaux clients potentiels'],
              ['Panier moyen d\'une intervention','350 €'],
              ['Perte hebdomadaire','700 à 1 050 €'],
              ['Perte annuelle (50 semaines)','35 000 à 52 500 €'],
            ].map(([k,v], i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #E5E7EB'}}>
                <span style={{fontSize:13,color:'#6B7280'}}>{k}</span>
                <span style={{fontSize:13,fontWeight:700,color:'#111827',textAlign:'right' as const,maxWidth:'55%'}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,padding:'10px 14px',background:'#FEE2E2',borderRadius:8,fontSize:13,fontWeight:700,color:'#991B1B',textAlign:'center' as const}}>
            Même en divisant par 5 pour rester très conservateur : 7 000 à 10 000 € de CA perdu chaque année
          </div>
        </div>

        <h2>Pourquoi le répondeur ne suffit pas</h2>
        <p>La réponse instinctive est d'activer la messagerie vocale. C'est mieux que rien — mais à peine. Voici pourquoi :</p>
        <ul>
          <li><strong>85 % des appelants raccrochent sans laisser de message</strong> quand ils tombent sur un répondeur (étude Ifop 2025)</li>
          <li>Les 15 % qui laissent un message ont souvent trouvé quelqu'un d'autre le temps que vous rappeliez</li>
          <li>Un patient qui cherche un kinésithérapeute disponible ne vous attend pas — il appelle le suivant sur Google Maps</li>
          <li>En haute saison touristique (juillet-août en Bretagne), chaque appel non décroché est une réservation perdue définitivement</li>
        </ul>

        <h2>Les secteurs les plus touchés en Bretagne</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,margin:'20px 0 28px'}}>
          {[
            {sector:'Kinésithérapie',loss:'12 000 – 24 000 €/an',reason:'Séances de 45 min, téléphone inaccessible en permanence'},
            {sector:'Dentistes',loss:'15 000 – 35 000 €/an',reason:'Soins continus, secrétaire absente le midi et le soir'},
            {sector:'Plombiers-chauffagistes',loss:'8 000 – 18 000 €/an',reason:'Interventions terrain, mains occupées, bruit ambiant'},
            {sector:'Hôtels côtiers (haute saison)',loss:'20 000 – 60 000 €/an',reason:'Juillet-août : 50+ appels/jour, un seul réceptionniste'},
            {sector:'Salons de coiffure',loss:'5 000 – 12 000 €/an',reason:'Mains occupées pendant 6-8h par jour'},
            {sector:'Ostéopathes',loss:'10 000 – 20 000 €/an',reason:'Consultations 1h, souvent en solo'},
          ].map(s => (
            <div key={s.sector} style={{padding:'14px 16px',borderRadius:12,background:'#F9FAFB',border:'1px solid #E5E7EB'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#111827',marginBottom:4}}>{s.sector}</div>
              <div style={{fontSize:16,fontWeight:900,color:'#DC2626',letterSpacing:'-0.02em',marginBottom:4}}>{s.loss}</div>
              <div style={{fontSize:11,color:'#6B7280',lineHeight:1.4}}>{s.reason}</div>
            </div>
          ))}
        </div>

        <h2>La solution à 19 euros par mois</h2>
        <p>Vanivert répond à vos appels 24h/24, 7j/7, en français naturel. L'IA vocale :</p>
        <ul>
          <li>Répond avec le nom de votre cabinet ou entreprise</li>
          <li>Prend les rendez-vous directement dans votre agenda (Doctolib, Google Calendar)</li>
          <li>Informe l'appelant des disponibilités en temps réel</li>
          <li>Laisse un message structuré pour les demandes spécifiques</li>
          <li>Ne révèle jamais que c'est un système automatisé — sauf si on lui pose directement la question (obligation RGPD)</li>
        </ul>
        <p><strong>ROI immédiat :</strong> un seul rendez-vous récupéré en plus par semaine à 45 € = 2 340 € de CA supplémentaire par an. Votre abonnement Vanivert coûte 228 € par an. Le reste, c'est du bénéfice net.</p>

        <div style={{background:'#EDE9FE',border:'1px solid #C4B5FD',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
          <div style={{fontSize:15,fontWeight:700,color:'#4C1D95',marginBottom:10}}>Essayez gratuitement pendant 30 jours</div>
          <p style={{fontSize:14,color:'#5B21B6',margin:'0 0 16px',lineHeight:1.7}}>Aucune carte bancaire requise. Configuration en 10 minutes. Si vous n'avez pas récupéré au moins un client supplémentaire en 30 jours, vous ne payez rien.</p>
          <a href="/demo" style={{display:'inline-block',background:'#7C3AED',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Démarrer l'essai gratuit →</a>
        </div>
      </>
    )
  },

  // ── ARTICLE 3 ─────────────────────────────────────────────────────────────
  'annuaire-centralise-dgfip-piege': {
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Calendrier avec date butoir importante, délai réglementaire DGFiP',
    body: (
      <>
        <p style={{fontSize:17,color:'#374151',lineHeight:1.8,fontWeight:500,marginBottom:28}}>
          Dans les réunions d'experts-comptables, dans les newsletters de la CCI, dans tous les articles sur la réforme e-facturation 2026, on parle de choisir une plateforme agréée. C'est exact. Mais presque personne ne parle de l'étape suivante — celle qui fait rater la deadline à 90 % des entreprises qui pensaient être en règle.
        </p>

        <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'20px 24px',marginBottom:32,display:'flex',gap:20,alignItems:'center'}}>
          <div style={{fontSize:40,fontWeight:900,color:'#D97706',letterSpacing:'-0.04em',flexShrink:0}}>2–4 sem.</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#92400E',marginBottom:4}}>Délai de traitement de l'enrôlement annuaire</div>
            <div style={{fontSize:13,color:'#B45309'}}>Une entreprise qui signe avec une PA le 15 août 2026 ne sera donc conforme qu'autour du 5-10 septembre — après la deadline du 1er septembre.</div>
          </div>
        </div>

        <h2>C'est quoi, l'annuaire centralisé DGFiP ?</h2>
        <p>Quand la réforme e-facturation entre en vigueur, chaque entreprise française assujettie à la TVA doit être <strong>répertoriée dans un annuaire centralisé géré par la DGFiP</strong>. Cet annuaire indique, pour chaque entreprise (identifiée par son SIRET) :</p>
        <ul>
          <li>Sa plateforme agréée de rattachement (PA ou PDP)</li>
          <li>Le format électronique qu'elle accepte</li>
          <li>Ses coordonnées de routage électronique</li>
        </ul>
        <p>Sans être dans cet annuaire, <strong>personne ne peut vous envoyer de facture électronique</strong>, même si vous avez signé avec la meilleure PA du marché. Et si vos clients ou fournisseurs ne peuvent pas vous envoyer leurs factures conformément, c'est <em>leur</em> non-conformité — et <em>vos</em> relations commerciales qui en pâtissent.</p>

        <h2>Le scénario catastrophe — et il est très fréquent</h2>
        <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:14,padding:'18px 22px',margin:'20px 0 28px'}}>
          <div style={{fontSize:14,fontWeight:700,color:'#991B1B',marginBottom:12}}>Exemple concret — MECA ARMOR SARL, Guingamp</div>
          <div style={{display:'flex',flexDirection:'column' as const,gap:8}}>
            {[
              ['1er août 2026','Valeo envoie une lettre : "Toutes les factures fournisseurs devront être électroniques à partir du 1er septembre."'],
              ['5 août','Le gérant appelle son comptable. Le comptable dit : "On va s\'en occuper."'],
              ['10 août','Signature avec une PA. Le commercial dit que ça prend "quelques jours" pour être opérationnel.'],
              ['1er septembre','MECA ARMOR reçoit une facture électronique de Valeo. Elle est rejetée : MECA ARMOR n\'est pas dans l\'annuaire centralisé.'],
              ['3 septembre','L\'annuaire traite enfin l\'enrôlement. 3 jours de non-conformité. 50 € par facture reçue non traitée.'],
            ].map(([date, event]) => (
              <div key={date} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <div style={{fontSize:11,fontFamily:'monospace',fontWeight:700,color:'#DC2626',flexShrink:0,width:80,paddingTop:1}}>{date}</div>
                <div style={{fontSize:13,color:'#7F1D1D',lineHeight:1.5}}>{event}</div>
              </div>
            ))}
          </div>
        </div>

        <h2>Comment éviter ce piège en 3 étapes</h2>
        <ol>
          <li>
            <strong>Choisissez votre PA maintenant</strong> — pas en août, maintenant. La liste officielle est sur impots.gouv.fr. Vanivert travaille avec Docoon (PA immatriculée n°0001 sur la liste DGFiP).
          </li>
          <li>
            <strong>Demandez confirmation de l'enrôlement annuaire</strong> — exigez un écrit de votre PA confirmant que votre SIRET est bien inscrit dans l'annuaire centralisé, avec la date de confirmation.
          </li>
          <li>
            <strong>Testez avant le 15 août</strong> — demandez à votre PA de vous envoyer une facture test. Si vous la recevez correctement dans votre système, vous êtes conforme. Sinon, il vous reste 2 semaines pour corriger.
          </li>
        </ol>

        <h2>La pression vient aussi de vos clients, pas seulement de la DGFiP</h2>
        <p>Ce que beaucoup de PME ignorent : les grandes entreprises (Valeo, Orange, Thales, Ekinops, Lumibird…) ont commencé à envoyer des lettres à leurs fournisseurs PME pour leur demander d'être conformes <strong>dès septembre 2026</strong> — même pour les PME dont l'obligation d'émission est en 2027.</p>
        <p>La raison : ces grandes entreprises doivent elles-mêmes tracer et archiver toutes leurs factures reçues dans leur système électronique. Elles ne veulent plus gérer des PDF manuellement. Si vous êtes fournisseur d'un grand groupe et que vous n'êtes pas dans leur liste de fournisseurs e-facture conformes, vous risquez des délais de paiement ou pire.</p>

        <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:16,padding:'22px 26px',margin:'32px 0'}}>
          <div style={{fontSize:15,fontWeight:700,color:'#92400E',marginBottom:10}}>⚡ Agissez avant le 15 août</div>
          <p style={{fontSize:14,color:'#B45309',margin:'0 0 16px',lineHeight:1.7}}>Vanivert gère l'enrôlement dans l'annuaire centralisé pour le compte de ses clients — c'est inclus dans le service conformité à 1 200 €/mois, sans frais d'installation. Vérifiez votre score de risque en 2 minutes.</p>
          <a href="/calculateur" style={{display:'inline-block',background:'#D97706',color:'#fff',fontWeight:700,fontSize:14,borderRadius:980,padding:'11px 24px',textDecoration:'none'}}>Vérifier ma conformité →</a>
        </div>
      </>
    )
  },
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug)
  if (!article) notFound()
  const c = CONTENT[params.slug]

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: C.w, borderBottom: `1px solid ${C.lt}`,
        position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 17, color: C.ink, textDecoration: 'none',
          letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.b }} />
          vanivert
        </a>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="/blog" style={{ fontSize: 13, color: C.g, textDecoration: 'none' }}>← Blog</a>
          <a href="/calculateur" style={{ background: C.b, color: '#fff', fontSize: 13,
            fontWeight: 700, borderRadius: 980, padding: '8px 18px', textDecoration: 'none' }}>
            Calculer mon risque
          </a>
        </div>
      </nav>

      {/* Hero image */}
      <div style={{ height: 340, overflow: 'hidden', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt={c.imageAlt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }}/>
        {/* Category */}
        <div style={{ position: 'absolute', bottom: 24, left: 40,
          background: C.w, borderRadius: 8, padding: '5px 14px',
          fontSize: 12, fontWeight: 700, color: article!.categoryColor }}>
          {article!.category}
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: C.g,
          fontFamily: 'monospace', marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.lt}` }}>
          <span>{article!.date}</span>
          <span>·</span>
          <span>{article!.readTime} de lecture</span>
          <span>·</span>
          <span>Par l'équipe Vanivert</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 36,
          letterSpacing: '-0.04em', color: C.ink, lineHeight: 1.1,
          marginBottom: 32, marginTop: 0 }}>
          {article!.title}
        </h1>

        {/* Content */}
        <div style={{ fontSize: 15, lineHeight: 1.8, color: C.ink }}>
          <style>{`
            article h2 { font-size:22px; font-weight:800; letter-spacing:-0.025em; color:#0A090A; margin:36px 0 14px; font-family:Inter,sans-serif }
            article p { color:#374151; line-height:1.8; margin-bottom:18px }
            article ul, article ol { color:#374151; padding-left:24px; margin-bottom:18px }
            article li { margin-bottom:8px; line-height:1.7 }
            article strong { color:#0A090A }
            article a { color:#1F49B0 }
          `}</style>
          <article>{c.body}</article>
        </div>

        {/* Author */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${C.lt}`,
          display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0 }}>🧑‍💼</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Pawan Kumar</div>
            <div style={{ fontSize: 12, color: C.g }}>Co-fondateur & CTO, Vanivert · EDHEC MiM Finance · Ex-Synergy Marine Group</div>
          </div>
        </div>

        {/* Share / back */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
          <a href="/blog" style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px',
            borderRadius: 9, border: `1px solid ${C.lt}`, color: C.ink,
            textDecoration: 'none', background: C.bg }}>
            ← Tous les articles
          </a>
          <a href="/calculateur" style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px',
            borderRadius: 9, background: C.b, color: '#fff', textDecoration: 'none' }}>
            Calculer mon risque →
          </a>
        </div>
      </div>
    </div>
  )
}
