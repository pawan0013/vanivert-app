'use client'
import { useState } from 'react'

const BG = '#FAFAF8', BG2 = '#F3F2EE', CARD = '#FFFFFF', INK = '#0D0D0F'
const BORDER = 'rgba(13,13,15,0.08)', VI = '#6366F1', GR = '#10B981', EM = '#F59E0B', RED = '#EF4444'
const MUTED = 'rgba(13,13,15,0.50)', SUBTLE = 'rgba(13,13,15,0.32)'
const SERIF = 'Georgia, serif'

function VLogo() {
  return <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill={VI}/><path d="M9 16.5L14 21.5L23 10.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

const INDUSTRIES = [
  {
    id: 'immobilier',
    icon: '🏠',
    name: 'Immobilier & Agences',
    pain: 'Les leads arrivent la nuit et refroidissent avant votre premier appel.',
    fine: 'Amende DGFiP: jusqu\'a 15 000 EUR/an si vos factures fournisseurs ne sont pas conformes au 1er septembre.',
    features: ['CRM leads WhatsApp en temps reel', 'Qualification automatique: budget, zone, type de bien', 'Pipeline de ventes visuel', 'IA vocale en francais qui repond 24h/24 au nom de votre agence', 'Conformite DGFiP factures fournisseurs incluse'],
    demo: {
      title: 'Ce que vos concurrents utilisent deja',
      screens: [
        { label: 'Dashboard', desc: '1 lead entrant, 0 en attente, pipeline a jour en temps reel' },
        { label: 'Inbox WhatsApp', desc: 'Hitesh a ecrit "Bonjour" - reponse automatique envoyee en 3 secondes' },
        { label: 'Leads du jour', desc: '"Qui relancer aujourd\'hui?" - 0 follow-up manque' },
        { label: 'Pipeline kanban', desc: 'New Lead → Qualification → Site Visit → Negotiation → Closed' },
        { label: 'Flow qualification', desc: '10 noeuds: budget, zone, BHK, delai → tag auto → deal cree → vous reprenez la main' },
      ]
    },
    voice: 'Votre IA repond: "Bonjour, Agence Martin, que puis-je faire pour vous?" - prend les infos, qualifie le lead, vous envoie le resume sur WhatsApp dans la minute.',
    cta: 'Demo agence immobiliere'
  },
  {
    id: 'commerce',
    icon: '🏪',
    name: 'Commerces & Supermarches',
    pain: 'Le telephone sonne pendant que vous encaissez. Chaque appel manque est un client chez le voisin.',
    fine: 'Amende DGFiP: jusqu\'a 50 EUR par facture non conforme + 15 000 EUR/an. Vos factures Metro, Transgourmet, Sysco doivent etre conformes au 1er septembre.',
    features: ['Gestion des appels entrants par IA vocale', 'FAQ automatique: horaires, stock, prix', 'Suivi des commandes fournisseurs', 'Conformite DGFiP factures automatique', 'Dashboard stocks et marges'],
    demo: {
      title: 'Le tableau de bord d\'un gerant conforme',
      screens: [
        { label: 'Dashboard', desc: 'Conversations actives, factures en cours, alertes conformite' },
        { label: 'Factures conformes', desc: 'Facture Metro #2026-0142 → Conforme ✓ transmise DGFiP' },
        { label: 'Alertes stock', desc: 'Prix lait Lactel +8% depuis mars → recommendation reorder' },
        { label: 'IA vocale', desc: '"Bonjour Superette Dupont, nos horaires sont 8h-20h. Autre chose?" → SMS de confirmation' },
        { label: 'Conformite', desc: 'DGFiP: Inscrit ✓ | Annuaire: Actif ✓ | Factures: 100% conformes ✓' },
      ]
    },
    voice: 'Votre IA repond pendant que vous encaissez: horaires, stock disponible, prix, reservations. Resume WhatsApp chaque soir.',
    cta: 'Demo commerce / supermarche'
  },
  {
    id: 'artisans',
    icon: '🔧',
    name: 'Artisans & Services',
    pain: 'Devis envoyes, jamais relances. Appels manques pendant les chantiers.',
    fine: 'Amende DGFiP: jusqu\'a 50 EUR par facture non conforme. Vos factures fournisseurs doivent etre recues electroniquement des le 1er septembre.',
    features: ['Relance automatique devis 7 jours apres envoi', 'IA vocale qui repond pendant les interventions', 'Pipeline chantier: devis → accepte → en cours → facture', 'Conformite DGFiP automatique', 'Reconciliation bancaire factures/paiements'],
    demo: {
      title: 'Plus un devis sans suite, plus un appel manque',
      screens: [
        { label: 'Devis pipeline', desc: 'Devis Renovation Martin: envoye il y a 7j → relance polie envoyee automatiquement' },
        { label: 'Appels manques', desc: 'Vous etes sur le chantier → l\'IA repond → SMS recap: "M. Durand veut un devis toiture, rappeler apres 17h"' },
        { label: 'Factures conformes', desc: 'Facture fournisseur photo → OCR → conforme → transmise DGFiP en 72h' },
        { label: 'Rapprochement', desc: 'Facture Leroy Merlin 342 EUR → Paiement CB 342 EUR → Reconcilie ✓' },
        { label: 'Dashboard', desc: 'CA semaine: 3 devis acceptes, 2 en attente, 1 relance a faire' },
      ]
    },
    voice: 'Vous etes sous l\'evier. Votre IA repond: "Bonjour Plomberie Durand, je suis disponible pour un devis, pouvez-vous me donner votre adresse?" Resume sur votre WhatsApp a la fin du chantier.',
    cta: 'Demo artisan / plombier / electricien'
  },
  {
    id: 'sante',
    icon: '🏥',
    name: 'Sante & Bien-etre',
    pain: 'Reservations et rappels no-show devorent vos journees.',
    fine: 'Amende DGFiP: factures fournisseurs (materiels medicaux, medicaments) doivent etre recues electroniquement. Non-conformite = 50 EUR par facture.',
    features: ['Prise de rendez-vous automatique 24h/24', 'Rappels no-show automatiques J-1 et H-2', 'IA vocale en francais, patiente et professionnelle', 'Conformite DGFiP fournisseurs medicaux', 'Liste d\'attente automatique si annulation'],
    demo: {
      title: 'Zero no-show, zero appel manque',
      screens: [
        { label: 'Agenda IA', desc: 'Mme Leroy appelle a 23h → RDV pris pour mardi 14h → SMS confirmation envoy' },
        { label: 'Rappels', desc: 'J-1: "Rappel RDV demain 14h - repondez OUI pour confirmer ou NON pour annuler"' },
        { label: 'Liste attente', desc: 'Annulation → liste d\'attente notifiee automatiquement → RDV repris en 4 minutes' },
        { label: 'Factures conformes', desc: 'Fournisseur materiel → conforme DGFiP → comptabilite propre pour l\'URSSAF' },
        { label: 'Dashboard', desc: 'Taux de presence: 94% (+12 pts) | RDV semaine: 47 | No-shows: 3' },
      ]
    },
    voice: 'Votre IA repond la nuit et le weekend: prend le RDV, verifie les disponibilites dans votre agenda, envoie la confirmation SMS. Vous recevez le recap le matin.',
    cta: 'Demo kine / dentiste / therapeute'
  },
]

function CRMScreen({ label, desc, active }: { label: string; desc: string; active: boolean }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 10, background: active ? VI : CARD, border: `1px solid ${active ? VI : BORDER}`, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#fff' : INK, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.75)' : MUTED, lineHeight: 1.4 }}>{desc}</div>
    </div>
  )
}

function IndustryCard({ industry, onSelect, selected }: { industry: typeof INDUSTRIES[0]; onSelect: () => void; selected: boolean }) {
  return (
    <div onClick={onSelect} style={{ background: selected ? `${VI}08` : CARD, border: `1.5px solid ${selected ? VI : BORDER}`, borderRadius: 16, padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{industry.icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 6 }}>{industry.name}</h3>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 12 }}>{industry.pain}</p>
      <div style={{ fontSize: 11, color: RED, fontWeight: 500, padding: '6px 10px', background: `${RED}08`, borderRadius: 8, border: `1px solid ${RED}20` }}>
        ⚠ {industry.fine.split(':')[0]}
      </div>
    </div>
  )
}

export default function Organisations() {
  const [selected, setSelected] = useState(0)
  const [activeScreen, setActiveScreen] = useState(0)
  const [callStarted, setCallStarted] = useState(false)
  const [callStep, setCallStep] = useState(0)
  const industry = INDUSTRIES[selected]

  const CALL_STEPS = [
    '📞 Appel entrant sur votre ligne...',
    `🤖 "Bonjour, ${industry.id === 'immobilier' ? 'Agence Martin' : industry.id === 'commerce' ? 'Superette Dupont' : industry.id === 'artisans' ? 'Plomberie Durand' : 'Cabinet Dr. Martin'}, que puis-je faire pour vous?"`,
    '👤 Client: "Je voudrais prendre rendez-vous / avoir un devis / connaitre vos horaires"',
    '🤖 IA: collecte les informations, repond a la question...',
    '✅ Resume WhatsApp envoye sur votre telephone dans la minute.',
    `📋 Fiche creee dans votre CRM: nom, besoin, disponibilite, coordonnees.`,
  ]

  function startCall() {
    setCallStarted(true)
    setCallStep(0)
    const interval = setInterval(() => {
      setCallStep(prev => {
        if (prev >= CALL_STEPS.length - 1) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 1200)
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, fontFamily: 'system-ui,-apple-system,sans-serif', color: INK }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}@media(max-width:768px){.org-grid{grid-template-columns:1fr 1fr!important}.demo-layout{grid-template-columns:1fr!important}.screen-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Nav */}
      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(16px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}><VLogo /><span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 17, color: INK }}>vanivert</span></a>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/audit" style={{ fontSize: 13, color: MUTED, textDecoration: 'none', padding: '7px 14px', borderRadius: 980, border: `1px solid ${BORDER}` }}>Audit conformite</a>
          <a href="/demo" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 980, background: INK }}>Reserver une demo</a>
        </div>
      </nav>

      {/* Urgency bar */}
      <div style={{ background: `${RED}10`, borderBottom: `1px solid ${RED}20`, padding: '10px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: RED }}>1er septembre 2026 - J-54 - Jusqu\'a 15 000 EUR d\'amende pour non-conformite DGFiP</span>
        <a href="/calculateur" style={{ fontSize: 12, color: RED, fontWeight: 700, textDecoration: 'none', padding: '4px 12px', borderRadius: 980, border: `1px solid ${RED}40`, background: `${RED}08` }}>Calculer mon risque →</a>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>SOLUTIONS PAR METIER</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(26px,4vw,44px)', color: INK, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
          Chaque metier a ses outils. Voici les votres.
        </h1>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          CRM WhatsApp, IA vocale en francais, conformite DGFiP automatique. Tout en un. Selectionnez votre secteur ci-dessous.
        </p>
      </section>

      {/* Industry picker */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 48px' }}>
        <div className="org-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {INDUSTRIES.map((ind, i) => <IndustryCard key={ind.id} industry={ind} selected={selected === i} onSelect={() => { setSelected(i); setActiveScreen(0); setCallStarted(false); setCallStep(0) }} />)}
        </div>
      </section>

      {/* Selected industry detail */}
      <section style={{ background: BG2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '64px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{industry.icon}</span>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(22px,3vw,34px)', color: INK }}>{industry.name}</h2>
          </div>
          <div style={{ background: `${RED}10`, border: `1px solid ${RED}25`, borderRadius: 12, padding: '12px 18px', marginBottom: 32, fontSize: 13, color: '#991B1B', fontWeight: 500 }}>
            ⚠ {industry.fine}
          </div>

          <div className="demo-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40 }}>
            {/* Features */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 16 }}>Ce qu&apos;on installe pour vous</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {industry.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: CARD, borderRadius: 10, border: `1px solid ${BORDER}` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 13l4 4L19 7" stroke={GR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: 13, color: INK, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live CRM demo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: INK }}>{industry.demo.title}</h3>
                <span style={{ fontSize: 11, color: GR, fontWeight: 600, padding: '3px 10px', borderRadius: 980, border: `1px solid ${GR}30`, background: `${GR}10` }}>Demo reelle</span>
              </div>
              <div className="screen-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {industry.demo.screens.map((screen, i) => (
                  <div key={i} onClick={() => setActiveScreen(i)}>
                    <CRMScreen label={screen.label} desc={screen.desc} active={activeScreen === i} />
                  </div>
                ))}
              </div>
              {/* Active screen preview */}
              <div style={{ marginTop: 12, padding: '16px 18px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: SUBTLE, marginBottom: 6 }}>Apercu: {industry.demo.screens[activeScreen].label}</div>
                <div style={{ fontSize: 14, color: INK, lineHeight: 1.6 }}>{industry.demo.screens[activeScreen].desc}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: VI, fontWeight: 500 }}>Donnees reelles de la demo → visible lors de votre appel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice AI demo - interactive */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{ fontSize: 11, color: SUBTLE, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>IA VOCALE EN FRANCAIS</p>
          <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(20px,2.8vw,32px)', color: INK, marginBottom: 12 }}>
            Elle repond en votre nom. Vous recevez le resume.
          </h2>
          <p style={{ fontSize: 14, color: MUTED, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>{industry.voice}</p>
        </div>

        {/* Interactive call simulation */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '32px', textAlign: 'center' }}>
          {!callStarted ? (
            <>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${GR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>📞</div>
              <p style={{ fontSize: 15, color: INK, fontWeight: 500, marginBottom: 8 }}>Simulez un appel entrant</p>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Voyez exactement comment votre IA repond a vos clients, etape par etape.</p>
              <button onClick={startCall} style={{ padding: '13px 28px', borderRadius: 980, background: GR, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Lancer la simulation d&apos;appel
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
              <div style={{ fontSize: 12, color: SUBTLE, marginBottom: 16, textAlign: 'center' }}>Simulation en cours...</div>
              {CALL_STEPS.slice(0, callStep + 1).map((step, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: i === callStep ? `${VI}10` : BG2, border: `1px solid ${i === callStep ? VI : BORDER}`, marginBottom: 8, fontSize: 13, color: INK, lineHeight: 1.5, transition: 'all 0.3s' }}>
                  {step}
                </div>
              ))}
              {callStep === CALL_STEPS.length - 1 && (
                <div style={{ marginTop: 16, padding: '14px', background: `${GR}10`, border: `1px solid ${GR}30`, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#065F46', fontWeight: 600, marginBottom: 8 }}>✅ Appel traite sans que vous ayez rien fait.</div>
                  <button onClick={() => { setCallStarted(false); setCallStep(0) }} style={{ fontSize: 12, color: GR, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Relancer la simulation</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: INK, padding: '64px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(22px,3vw,36px)', color: '#fff', marginBottom: 12 }}>
          Votre demo en 20 minutes, sur VOTRE situation reelle.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
          On vous montre le CRM configure pour votre metier, l&apos;IA vocale avec votre nom d&apos;enseigne, et le plan de conformite DGFiP. Aucun engagement.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/demo?offer=organisation&industry=${industry.id}`} style={{ padding: '13px 28px', borderRadius: 980, background: '#fff', color: INK, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            {industry.cta} →
          </a>
          <a href="/audit" style={{ padding: '13px 24px', borderRadius: 980, border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
            Commencer par l&apos;audit conformite
          </a>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 16 }}>Sans engagement. Reponse sous 24h ouvrees.</p>
      </section>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px 32px', textAlign: 'center', background: BG2 }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: MUTED }}>
          <a href="/" style={{ color: MUTED, textDecoration: 'none' }}>Accueil</a>
          <a href="/audit" style={{ color: MUTED, textDecoration: 'none' }}>Audit & Conformite</a>
          <a href="/calculateur" style={{ color: MUTED, textDecoration: 'none' }}>Calculateur</a>
          <a href="/blog" style={{ color: MUTED, textDecoration: 'none' }}>Blog</a>
        </div>
        <p style={{ fontSize: 12, color: SUBTLE, marginTop: 12 }}>© 2026 Vanivert. Lannion, Bretagne. Hebergement 100% UE.</p>
      </footer>
    </div>
  )
}
