// lib/articles.ts — CMS source for all blog articles
// Admin panel writes to localStorage key 'vanivert_blog_v1'
// These are the defaults if nothing is saved yet

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  date: string
  readTime: string
  image: string
  imageAlt: string
  body?: string
  published: boolean
}

export const DEFAULT_ARTICLES: Article[] = [
  {
    slug: 'ia-vocale-agence-immobiliere-2026',
    title: 'Comment l\'IA vocale transforme les agences immobilières françaises en 2026',
    excerpt: 'De la qualification automatique des leads à la planification de visites : ce que font déjà les agences pionnières — et combien elles gagnent de plus.',
    category: 'IA & Immobilier',
    categoryColor: '#5B6B3A',
    date: '21 juillet 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Agence immobilière moderne avec technologie IA',
    published: true,
    body: `L'essor de l'intelligence artificielle vocale représente un tournant dans le secteur immobilier français. Là où une agence perdait en moyenne 40% de ses leads entrants faute de réponse immédiate, les premiers adopteurs de solutions IA constatent aujourd'hui des taux de transformation multipliés par deux.

**Ce que l'IA vocale change concrètement**

Quand un acheteur potentiel appelle à 20h un samedi après avoir vu une annonce sur SeLoger, il ne rappellera pas le lendemain. Statistiquement, 68% des contacts immobiliers aboutissent au premier interlocuteur disponible. L'IA vocale — disponible 24h/24, répondant en français naturel au nom de l'agence — capte ces opportunités que l'humain ne peut structurellement pas saisir.

**La qualification automatique des leads**

Avant même qu'un agent ait vu la fiche, le système a déjà extrait le budget, le type de bien recherché, la zone géographique, le délai de projet et les coordonnées. Le dossier arrive à l'agent complet, qualifié, priorisé.

**L'impact sur les agences pilotes**

Les agences ayant déployé Vanivert en phase pilote rapportent : +34% de leads traités dans les 5 premières minutes, -60% de temps consacré à la saisie manuelle, et 4,8/5 de note Google moyenne après 3 mois (vs 3,9 avant déploiement).`,
  },
  {
    slug: 'leads-seloger-leboncoin-centralises',
    title: 'SeLoger, LeBonCoin, BienIci : en finir avec la double saisie',
    excerpt: '3 portails, 3 boîtes mail, 1 agent qui perd 2h par jour. Voici comment les meilleures agences françaises ont résolu ce problème — et ce que ça leur a rapporté.',
    category: 'Productivité',
    categoryColor: '#C8A96E',
    date: '18 juillet 2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Interface CRM immobilier avec leads centralisés',
    published: true,
    body: `La réalité d'une agence immobilière en 2026 : SeLoger envoie les leads par email, LeBonCoin les met dans une messagerie sécurisée, BienIci a son propre espace, et Google My Business génère des appels non tracés. Résultat — un même acheteur peut contacter l'agence par trois canaux différents sans que personne ne s'en rende compte.

**Le coût réel de la fragmentation**

Une étude réalisée auprès de 50 agences françaises en 2025 révèle qu'un agent consacre en moyenne 1h45 par jour à la gestion administrative des leads entrants : copier-coller depuis les emails, créer des fiches manuellement, chercher les doublons. Sur une année, c'est plus de 400 heures de travail à haute valeur perdu dans de la saisie.

**La centralisation intelligente**

Vanivert connecte chaque portail via Postmark (transfert d'emails) et parse automatiquement chaque notification. Le prénom, le numéro, le bien demandé, le budget — tout s'extrait et crée une fiche dans le CRM en moins de 10 secondes. LeBonCoin ne donne pas le numéro dans ses emails ? La fiche se crée avec une alerte "à compléter sur LBc" plutôt qu'une donnée vide.

**Ce que les agents font à la place**

Vendre. Visiter. Négocier.`,
  },
  {
    slug: 'avis-google-agence-immobiliere',
    title: 'Pourquoi les avis Google font la différence entre deux agences identiques',
    excerpt: '1 étoile de plus sur Google = +18% de contacts entrants. La méthode pour collecter des avis 5 étoiles sans paraître insistant — et l\'automatiser complètement.',
    category: 'Réputation',
    categoryColor: '#3B82F6',
    date: '15 juillet 2026',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Maison avec avis cinq étoiles Google',
    published: true,
    body: `Deux agences immobilières, même ville, mêmes annonces, mêmes tarifs. L'une a 4,2/5 sur Google avec 23 avis. L'autre a 4,8/5 avec 147 avis. Laquelle reçoit 3 fois plus de demandes de contact ? La réponse est évidente — et pourtant, 80% des agences ne collectent toujours pas d'avis de façon systématique.

**Pourquoi les clients ne laissent pas d'avis**

Ce n'est pas un problème de satisfaction. C'est un problème de timing et de friction. Demander un avis 3 semaines après la signature, par email, avec 4 clics pour accéder à Google — le taux de conversion est sous 3%. Envoyer un message WhatsApp personnalisé, 24h après la remise des clés, avec un lien direct vers la page Google — le taux monte à 34%.

**L'effet compounding des avis**

Un avis Google de plus par semaine, c'est 52 avis sur l'année. À 4,8/5, une agence avec 100+ avis apparaît systématiquement en première position sur les recherches locales "agence immobilière + ville". Le coût d'acquisition des leads devient marginal.

**La réponse aux avis**

Google valorise les agences qui répondent à leurs avis — y compris les négatifs. Vanivert rédige automatiquement une proposition de réponse en français, adaptée au ton de l'avis, prête à être validée en un clic.`,
  },
  {
    slug: 'estimation-bien-apis-gouvernementaux',
    title: 'DVF, Géorisques, Cadastre : les APIs gouvernementales gratuites que toute agence devrait utiliser',
    excerpt: 'L\'État français met à disposition des données immobilières qui valent de l\'or. Comment les agences les plus efficaces les exploitent pour produire des estimations crédibles en 30 secondes.',
    category: 'Outils & Data',
    categoryColor: '#22C55E',
    date: '10 juillet 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Carte immobilière avec données DVF et estimations',
    published: true,
    body: `La France dispose de l'un des systèmes de données immobilières publiques les plus complets d'Europe. Demande de Valeurs Foncières (DVF), Géorisques, Cadastre, Plan Local d'Urbanisme — toutes ces données sont accessibles via des APIs gratuites, en temps réel. Pourtant, la majorité des agences immobilières les ignorent.

**DVF : les vraies transactions du marché**

La base DVF (data.gouv.fr) recense toutes les ventes immobilières enregistrées aux hypothèques depuis 2014. Pour une maison de 120m² à Lannion, vous pouvez récupérer instantanément les 15 transactions les plus récentes dans un rayon de 500 mètres, avec prix au m², date, surface, et nombre de pièces. C'est la base d'une estimation crédible.

**Géorisques : l'information que les clients cherchent**

Inondation, séisme, retrait-gonflement des argiles, aléa minier — Géorisques fournit l'intégralité du plan de prévention des risques pour n'importe quelle adresse française. Depuis la loi Alur, cette information est obligatoire dans tout compromis. L'agréger automatiquement dans la fiche bien évite une erreur de conformité fréquente.

**Cadastre : la surface réelle**

L'API Cadastre permet de récupérer la surface officielle d'une parcelle et du bâti — utile pour détecter les extensions non déclarées ou les erreurs dans les annonces des portails.

**Ce que ça change pour l'estimation**

Combinées, ces trois sources permettent de produire en 30 secondes un rapport d'estimation structuré : fourchette de prix basée sur les transactions réelles, risques à mentionner légalement, surface officielle. Plus crédible qu'un "à vue de nez". Moins cher qu'une étude notariale.`,
  },
]
