# STACK.md — Stack technique
## Roller Derby Bordeaux Club — Site web v2

> Version 1.0 — Mai 2025

---

## Vue d'ensemble

```
GitHub (repo)
    │
    ├── Astro (site statique)          ← code source
    │     ├── React (composants UI)
    │     ├── TypeScript (strict)
    │     └── Vanilla CSS
    │
    ├── Sanity Studio (backoffice)     ← sous /sanity
    │     └── Sanity Content Lake      ← données hébergées chez Sanity
    │
    └── GitHub Actions (CI/CD)
          ├── Build Astro
          ├── Deploy GitHub Pages       ← dev / recette
          └── Deploy OVH via FTP        ← production
```

---

## 1. Framework — Astro

**Version** : `^6.x`  
**Pourquoi Astro et pas autre chose :**

- Génère du HTML statique par défaut — SEO natif sans configuration
- Supporte React nativement via intégration officielle (`@astrojs/react`)
- Modèle hybride : pages statiques + React islands pour les parties interactives uniquement
- Routing basé sur les fichiers — simple, prévisible, pas opinionâtre
- i18n natif depuis v3 — parfait pour FR/EN
- Compatible GitHub Pages et OVH mutualisé (output statique)
- Pas de lock-in — le framework ne dicte pas l'architecture

**Pourquoi pas Next.js :**  
Trop opinionâtre, impose des conventions strictes. L'équipe veut rester libre et légère.

**Pourquoi pas Gatsby :**  
En perte de vitesse depuis le rachat par Netlify. Communauté réduite, support incertain.

**Configuration :**
```ts
// astro.config.ts
export default defineConfig({
  output: 'static',
  site: 'https://rollerderbybordeaux.fr',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  integrations: [
    react(),
    sanity({
      projectId: 'y8v3re1a',
      dataset: 'production',
      // Pas de studioBasePath — Studio standalone sur rdbc-v2.sanity.studio
      useCdn: false,
      apiVersion: '2025-05-12',
    }),
    sitemap(),
  ],
})
```

---

## 2. UI — React + TypeScript

**Version React** : `^19.x`  
**TypeScript** : strict mode (`astro/tsconfigs/strict`)

React est utilisé uniquement pour les composants interactifs (islands) :
- Cards joueuses avec flip effect
- Navigation mobile (drawer)
- Formulaire de contact
- Tableau des compétitions

Les pages et layouts sont en `.astro` (zéro JS envoyé au client par défaut).

**Génération des types Sanity :**
```bash
npx sanity typegen generate
# → génère sanity.types.ts
# → données CMS entièrement typées dans le projet
```

---

## 3. Styling — Vanilla CSS

Pas de Tailwind, pas de CSS-in-JS, pas de CSS Modules.  
**Vanilla CSS uniquement**, conformément aux guidelines UI du projet.

Organisation :
```
src/styles/
├── global.css          # reset, variables CSS, typographie de base
├── tokens.css          # palette, espacements, breakpoints
└── animations.css      # keyframes (flicker, etc.)
```

Les variables CSS sont définies dans `tokens.css` et correspondent exactement à la palette définie dans `GUIDELINES-UI.md`.

---

## 4. Librairies UI

| Librairie | Usage | Raison |
|---|---|---|
| **Radix UI** | Drawers, Dialogs, Modals | Primitives accessibles, headless, stylées en Vanilla CSS |
| **Framer Motion** | Animations spring (drawers, transitions) | Physique naturelle, API simple |
| **Phosphor Icons** | Icônes — weight Bold | Cohérent avec l'esthétique, complet |

---

## 5. CMS — Sanity

**Version** : `^5.x`  
**Plan** : Free (suffisant pour le club)

| Paramètre | Valeur |
|---|---|
| Project ID | `y8v3re1a` |
| Dataset | `production` |
| API Version | `2025-05-12` |
| Studio URL (prod) | `rdbc-v2.sanity.studio` |

**Pourquoi Sanity :**
- Backoffice React intuitif — non-dev autonomes rapidement
- Schémas définis en TypeScript — dans le repo, versionnés avec le code
- `sanity typegen` — types générés automatiquement
- Plan gratuit : 10 utilisateurs, 500k requêtes API/mois — largement suffisant
- Studio déployable gratuitement sur `*.sanity.studio`

**Architecture monorepo :**
```
rdbc-v2/
├── package.json         ← projet Astro
├── astro.config.ts
└── sanity/              ← projet Sanity Studio autonome
    ├── package.json
    ├── sanity.config.ts
    └── schemaTypes/
```

**Schémas de contenu :**

```ts
// Joueuse
{
  name: 'joueuse',
  fields: [
    { name: 'nomDerby', type: 'string' },
    { name: 'photo', type: 'image' },
    { name: 'age', type: 'number' },
    { name: 'saisons', type: 'number' },
    { name: 'poste', type: 'string', options: { list: ['Jammer', 'Blocker', 'Pivot'] } },
    { name: 'misc', type: 'text' },
  ]
}

// Match
{
  name: 'match',
  fields: [
    { name: 'date', type: 'datetime' },
    { name: 'adversaire', type: 'string' },
    { name: 'lieu', type: 'string' },
    { name: 'scoreRdbc', type: 'number' },
    { name: 'scoreAdversaire', type: 'number' },
    { name: 'domicile', type: 'boolean' },
  ]
}

// Événement
{
  name: 'evenement',
  fields: [
    { name: 'titre', type: 'string' },
    { name: 'date', type: 'datetime' },
    { name: 'lieu', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'lien', type: 'url' },
  ]
}

// Article de blog
{
  name: 'article',
  fields: [
    { name: 'titre', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'titre' } },
    { name: 'date', type: 'datetime' },
    { name: 'image', type: 'image' },
    { name: 'extrait', type: 'text' },
    { name: 'corps', type: 'array', of: [{ type: 'block' }] }, // Portable Text
  ]
}
```

---

## 6. Internationalisation

**Stratégie** : Option A — routes séparées  
**Implémentation** : Astro i18n natif

```
src/
├── pages/
│   ├── index.astro          # / (français, défaut)
│   ├── equipe.astro         # /equipe
│   └── en/
│       ├── index.astro      # /en/
│       └── team.astro       # /en/team (placeholder V1)
└── i18n/
    ├── fr.ts                # toutes les chaînes FR
    ├── en.ts                # toutes les chaînes EN
    └── index.ts             # helper useTranslations()
```

---

## 7. Formulaire de contact

**Service** : FormSubmit (https://formsubmit.co)  
**Raison** : zéro backend, zéro configuration serveur, compatible OVH mutualisé

```html
<form action="https://formsubmit.co/contact@rollerderbybordeaux.fr" method="POST">
  <input type="hidden" name="_subject" value="Contact RDBC">
  <input type="hidden" name="_captcha" value="false">
  <input type="text" name="nom" required>
  <input type="email" name="email" required>
  <select name="sujet">...</select>
  <textarea name="message" required></textarea>
  <button type="submit">Envoyer</button>
</form>
```

---

## 8. Déploiement

### 8.1 GitHub Pages (dev / recette)

- Déclencheur : push sur `main` ou webhook Sanity
- Build Astro → dossier `dist/`
- Publication sur GitHub Pages via action officielle

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  repository_dispatch:
    types: [sanity-update]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
```

### 8.2 OVH mutualisé (production)

- Même workflow, étape FTP en plus
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` en GitHub Secrets

```yaml
- name: Deploy to OVH
  uses: SamKirkland/FTP-Deploy-Action@v4
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./dist/
    server-dir: /www/
```

### 8.3 Webhook Sanity → rebuild automatique

Quand le comité publie dans Sanity Studio, un rebuild est déclenché automatiquement.

Dans Sanity : Settings → API → Webhooks  
URL : `https://api.github.com/repos/[org]/rdbc-v2/dispatches`  
Event : `sanity-update`

Délai entre publication et mise en ligne : **2 à 5 minutes**.

### 8.4 Sanity Studio (prod)

```bash
cd sanity && npm run deploy
# → accessible sur rdbc-v2.sanity.studio
# → accès pour toutes les non-dev sans installation
```

---

## 9. Domaines

| Domaine | Usage |
|---|---|
| `rollerderbybordeaux.fr` | Principal |
| `rollerderbybordeaux.com` | Redirection vers `.fr` |

---

## 10. Versions et prérequis

| Outil | Version minimale |
|---|---|
| Node.js | `>=22.12.0` |
| npm | `>=10.x` |
| Astro | `^6.x` |
| React | `^19.x` |
| Sanity | `^5.x` |
| TypeScript | `^5.x` |

---

## 11. Évolutions V2

| Évolution | Impact stack |
|---|---|
| Migration Sanity → Strapi | VPS OVH requis, front Astro inchangé |
| Pages EN complètes | Fichiers `en.ts` à compléter, zéro refacto |
| Dynamic rendering | Passage à un adapter Astro (Node/Cloudflare) |
