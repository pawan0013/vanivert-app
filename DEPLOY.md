# Vanivert — Guide de déploiement complet
## De zéro à vanivert.fr en live

---

## ÉTAPE 0 — Prérequis (installer une seule fois)

```bash
# Node.js 20+ requis
node --version   # doit afficher v20 ou plus
npm --version    # doit afficher 10 ou plus

# Installer Git si pas déjà fait
git --version

# Installer Vercel CLI
npm install -g vercel
```

---

## ÉTAPE 1 — Préparer le projet localement

```bash
# Décompresser le zip reçu
unzip vanivert-redesign-full.zip
cd vanivert-redesign

# Installer les dépendances
npm install

# Tester en local (ouvre http://localhost:3000)
npm run dev
```

Vérifier que le site s'affiche correctement avant de continuer.

---

## ÉTAPE 2 — Créer le compte Supabase (base de données)

1. Aller sur https://supabase.com → "Start your project"
2. Créer un projet : nom `vanivert`, région `West EU (Paris)`
3. Attendre ~2 minutes que le projet démarre
4. Aller dans **Settings → API** → copier :
   - `Project URL` (commence par `https://xxxx.supabase.co`)
   - `anon public` key (commence par `eyJh...`)

### Créer les tables SQL

Dans **Supabase → SQL Editor → New Query**, coller et exécuter :

```sql
-- Table pour les demandes de démo (formulaire contact)
CREATE TABLE demo_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text NOT NULL,
  agency_name text,
  agent_count text,
  message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_public" ON demo_requests
  FOR INSERT WITH CHECK (true);

-- Table pour les leads calculateur (si utilisé plus tard)
CREATE TABLE calculator_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  company_name text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE calculator_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_public" ON calculator_leads
  FOR INSERT WITH CHECK (true);
```

---

## ÉTAPE 3 — Configurer les variables d'environnement localement

```bash
# Créer le fichier .env.local à la racine du projet
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...VOTRE-CLÉ-PUBLIQUE
EOF
```

Remplacer les valeurs par celles copiées à l'étape 2.

Test local avec Supabase :
```bash
npm run dev
# Tester le formulaire de contact → vérifier dans Supabase → Table Editor → demo_requests
```

---

## ÉTAPE 4 — Pousser sur GitHub

```bash
# Initialiser Git si pas encore fait
git init
git add -A
git commit -m "initial: vanivert redesign complet"

# Créer un repo sur github.com → "New repository"
# Nommer le repo : vanivert-app (privé recommandé)

# Lier et pousser
git remote add origin https://github.com/VOTRE-USERNAME/vanivert-app.git
git branch -M main
git push -u origin main
```

---

## ÉTAPE 5 — Déployer sur Vercel

### Option A — Via CLI (recommandé)
```bash
# Dans le dossier du projet
vercel

# Répondre aux questions :
# ? Set up and deploy "vanivert-redesign"? Y
# ? Which scope? → choisir votre compte
# ? Link to existing project? N
# ? What's your project's name? vanivert
# ? In which directory is your code located? ./
# → Build Command: next build (déjà détecté)
# → Output Directory: .next (déjà détecté)
# → Install Command: npm install

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
# → coller la valeur → choisir "Production, Preview, Development"

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# → coller la valeur → choisir "Production, Preview, Development"

# Déployer en production
vercel --prod
```

### Option B — Via interface web
1. Aller sur https://vercel.com → "Add New Project"
2. Importer le repo GitHub vanivert-app
3. Framework Preset : **Next.js** (détecté automatiquement)
4. Environment Variables → ajouter :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé publique
5. Cliquer "Deploy"

---

## ÉTAPE 6 — Configurer le domaine vanivert.fr

### Sur Vercel
1. Project → Settings → Domains
2. Ajouter `vanivert.fr` et `www.vanivert.fr`
3. Vercel affiche deux enregistrements DNS à configurer

### Chez votre registrar (OVH, Gandi, etc.)
Ajouter ces enregistrements DNS :
```
Type    Nom    Valeur
A       @      76.76.19.19
CNAME   www    cname.vercel-dns.com.
```

**SSL automatique :** Vercel provisionne automatiquement un certificat Let's Encrypt dès que le DNS est propagé (15-60 minutes). HTTPS est actif sans aucune configuration supplémentaire.

Vérifier : https://www.ssllabs.com/ssltest/analyze.html?d=vanivert.fr (score A attendu)

---

## ÉTAPE 7 — Configurer le panneau admin

1. Aller sur https://vanivert.fr/admin
2. Mot de passe par défaut : `vanivert2026admin`
3. **Immédiatement** : aller dans l'onglet "Paramètres" → changer le mot de passe
4. Tester chaque onglet : Tableau de bord, Contenu site, Blog, Leads

---

## ÉTAPE 8 — Vérifications finales

```bash
# Vérifier les headers de sécurité
curl -I https://vanivert.fr

# Doit afficher :
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# x-frame-options: DENY
# x-content-type-options: nosniff
# x-xss-protection: 1; mode=block
```

Checklist avant lancement :
- [ ] https://vanivert.fr charge en HTTPS (cadenas vert)
- [ ] https://www.vanivert.fr redirige vers vanivert.fr
- [ ] Formulaire de contact → entrée visible dans Supabase
- [ ] /admin accessible avec le mot de passe changé
- [ ] Blog affiche les articles
- [ ] Mobile : tester sur iPhone et Android
- [ ] Google Search Console : ajouter le site et soumettre le sitemap

---

## DÉPLOIEMENTS FUTURS

À chaque modification de contenu ou code :

```bash
git add -A
git commit -m "description de la modification"
git push origin main
# Vercel redéploie automatiquement en ~60 secondes
```

Pour le contenu du site (textes, blog) : utiliser directement /admin — aucun redéploiement nécessaire.

---

## VARIABLES D'ENVIRONNEMENT — Récapitulatif

| Variable | Où la trouver | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Oui (pour formulaires) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Oui (pour formulaires) |

---

## SÉCURITÉ — Points importants

1. **Mot de passe admin** : changer immédiatement après le premier accès
2. **SIRET** : déjà configuré (93429900900019) dans lib/site.config.ts
3. **RGPD** : bannière cookie active, politique de confidentialité à /legal/confidentialite
4. **HSTS** : activé via next.config.ts (preload après soumission à hstspreload.org)
5. **CSP** : Content Security Policy configurée dans next.config.ts
6. **Données EU** : Supabase région Paris + Hetzner Frankfurt

---

## SUPPORT

- Contact : contact@vanivert.fr
- Documentation Next.js : https://nextjs.org/docs
- Documentation Supabase : https://supabase.com/docs
- Documentation Vercel : https://vercel.com/docs
