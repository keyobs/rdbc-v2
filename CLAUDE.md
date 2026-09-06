# CLAUDE.md — rdbc-v2
**Roller Derby Bordeaux Club — Site web v2**

## Stack

| Package | Version installée | Rôle |
|---|---|---|
| `astro` | `^6.3.1` | Framework — output statique |
| `react` / `react-dom` | `^19.2.6` | Islands interactifs |
| `@astrojs/react` | `^5.0.4` | Intégration React dans Astro |
| `@sanity/astro` | `^3.4.0` | Client GROQ au build (pas de Studio embarqué) |
| `sanity` | `^5.24.0` | Studio standalone dans `./sanity/` |
| TypeScript | strict via `astro/tsconfigs/strict` | |
| `@radix-ui/react-dialog` | `^1.1.15` | Interactions (Drawer, Modal…) |
| `framer-motion` | `^12.39.0` | Animations spring |
| `@phosphor-icons/react` | `^2.1.10` | Icônes Bold |
| `@astrojs/sitemap` | ⚠️ non installé | À ajouter — J11 |
| Vitest + Testing Library | ⚠️ non installé | À ajouter — J2 |

- **Styling :** Vanilla CSS uniquement — pas de Tailwinds
- **Deploy :** GitHub Actions → GitHub Pages (recette) + OVH mutualisé FTP (prod)
- **Node :** ≥ 22.12

## Docs de référence

| Fichier | Contenu |
|---|---|
| [devdx/SPECS.md](devdx/SPECS.md) | Cahier des charges complet — pages, fonctionnalités, contraintes |
| [docs/STACK.md](docs/STACK.md) | Choix techniques détaillés, config Astro, schémas Sanity, déploiement |
| [devdx/GUIDELINES-UI.md](devdx/GUIDELINES-UI.md) | Design system — palette, typographie, composants, animations |
| [devdx/ROADMAP.md](devdx/ROADMAP.md) | Planning J1→J15, critères de succès par journée |
| [devdx/INSTRUCTIONS.md](devdx/INSTRUCTIONS.md) | Guide pas à pas — commandes, code de référence, webhook Sanity |

`devdx/` est gitignoré (specs sources en lecture libre pour le contexte, non versionnées).

## Règles non-négociables

**Style**
- Vanilla CSS uniquement — pas de Tailwind, pas de Styled-Components, pas de CSS Modules
- Background : `--color-bitume` (`rgb(15, 20, 39)`)
- Palette source unique : [devdx/GUIDELINES-UI.md](devdx/GUIDELINES-UI.md) section 2
- Conteneurs primaires : `border: 2px solid` neon
- Tous les 3e/4e éléments : `transform: rotate(-1.5deg)` (destructured grid)
- Badges/tags : `outline: 2px solid white` (sticker-look)

**Composants**
- Radix UI pour toute interaction complexe (Drawer, Modal, Accordion, Dialog)
- Phosphor Icons, weight **Bold**, couleur `--color-neon-primary`
- Framer Motion pour toutes les transitions (spring physics, jamais `linear`)

**Boutons — "The 80s Switch"**
- `border-radius: 0` (coins droits)
- `border: 2px solid`
- `box-shadow: 4px 4px 0px var(--color-neon-primary)`
- CTA critiques (Rejoindre…) : `--color-action`
- Effet flicker au clic (opacity jitter keyframes)

**UX / Mobile-First — règle hover**
- Par défaut : `:active` et `:focus` uniquement (mobile)
- Enhancement desktop : `@media (hover: hover)` pour les effets au survol
- Exemple : flip des cards joueuses = tap mobile, survol desktop via `@media (hover: hover)`
- Actions primaires dans les 40% bas de l'écran (thumb zone)
- Navigation : bottom-sheet drawer (Radix + Framer Motion)
- Micro-animations : flicker sur bordures néon (CSS keyframes), transitions drawer spring

**Typographie**
- Display/Titres : Archivo Black, `text-shadow: 0 0 8px var(--color-neon-primary)`
- Body : Geist ou Inter, minimum 16px

**Accessibilité**
- Attributs `alt` sur toutes les images
- Focus states visibles
- Navigation clavier fonctionnelle
- Pas d'effets glitch sur le contenu textuel
- Contrastes WCAG AA minimum

**Architecture**
- Pages et layouts en `.astro` (zéro JS au client par défaut)
- React uniquement pour les îlots interactifs : cards joueuses, drawer nav, formulaire, tableau compétitions
- Module blog (`src/blog/`) conçu autonome — dépend uniquement de Sanity et du layout global
- TypeScript strict sur tout le projet

**Sanity**
- Après toute modification de schéma : `npx sanity typegen generate`
- Webhook : publication Sanity → `repository_dispatch` GitHub → rebuild automatique

## Style de dev

### Git workflow
- Branches : `feature/nom` depuis `develop` → merge dans `develop` → release vers `main`
- `develop` → GitHub Pages recette (`.github/workflows/preview.yml`)
- `main` → OVH prod (`.github/workflows/deploy.yml`) + webhook Sanity (`sanity-update`)
- Ne jamais committer directement sur `main` ni `develop`

### Profil
- Senior React — clean architecture, code simple et direct
- Toujours demander avant de coder, même pour les petits détails
- En cas d'ambiguïté dans les specs : poser la question, pas d'hypothèse implicite
- **Commentaires dans le code : toujours en anglais**
- **Fichiers : toujours lire (`Read`) l'état courant avant toute modification** — ne jamais supposer que la mémoire de session est à jour. Utiliser `Edit` ciblé, jamais `Write` sur un fichier existant. Respecter les modifications du développeur.

### Références & versions
- Toujours vérifier `package.json` avant de répondre à une question sur une dépendance
- Docs en priorité : [docs/](docs/), [devdx/](devdx/) du projet, puis **Context7** pour la doc officielle des libs
- Toujours cibler la **dernière version** des dépendances (Context7 + GitHub releases)
- Pour les APIs Sanity, Astro, Radix, Framer : se référer à la doc officielle, pas à la mémoire d'entraînement

### Architecture
- **Colocation** : tous les fichiers d'une feature ensemble dans son dossier
- **`src/components/`** : composants génériques, dumb, ou réutilisables tels quels (ex: `Button`, `Icon`, `Card`) — pas de logique métier
- **Modules** : chaque feature a son dossier autonome (ex: `src/blog/`, `src/equipe/`)
- **Pas d'abstraction prématurée** — 3 lignes similaires ne justifient pas un helper

### TypeScript
- Types et interfaces explicites sur tout — pas de `any`, pas de `unknown` sans narrowing immédiat
- Props des composants React : interface nommée (ex: `interface PlayerCardProps`)
- Types Sanity : générés via `sanity typegen generate`, jamais écrits à la main

### Composants
Composants fonctionnels uniquement — pas de class components
Imports React : hooks nommés individuellement — import { useState, useEffect } from 'react'
Imports : chemin direct par composant pour toutes les libs tant que possible — import Drawer from '@mui/material/Drawer' plutôt que import { Drawer } from '@mui/material'

### State management
- `useState` / `useReducer` pour l'état local au composant
- Context React uniquement pour les valeurs quasi-statiques partagées (locale i18n)
- Pas de store externe (Zustand…) — site vitrine, pas besoin

### Nommage & fichiers
- Composants React `.tsx` : **PascalCase** — `PlayerCard.tsx`
- Hooks `.ts` : **camelCase** — `useTranslations.ts`, `usePlayerData.ts`
- Fichiers `.css`, `.ts` non-hook : **camelCase** — `playerCard.css`, `scoreFormatter.ts`
- Fichiers test : **camelCase** — `playerCard.test.tsx`, `scoreFormatter.test.ts`
- Dossiers : **camelCase** — `src/playerCard/`, `src/blog/`
- Un composant = un dossier si il a des fichiers associés (CSS, test, types)

### Tests
- **Vitest + Testing Library** — couverture minimale, objectif 20%
- Composants : vérifier que le rendu ne plante pas (`renders without crashing`)
- Utils : tester que les fonctions pures retournent les bonnes valeurs (ex: `useTranslations`, formatters de score)
- Pas de tests d'interaction complexe pour V1

### Performance (cible Lighthouse mobile)
- Score ≥ 85 pour V1 (référence : ROADMAP.md)
- Zéro JS au client sauf îlots React (`client:load` ou `client:visible`)
- Images via `@astrojs/image`

---

## Structure
```
rdbc-v2/
├── src/
│   ├── pages/          # Routes Astro — .astro
│   │   └── en/         # Routes anglaises
│   ├── components/     # Composants React .tsx + Astro .astro
│   ├── layouts/        # Layout.astro principal
│   ├── styles/
│   │   ├── tokens.css      # Variables CSS (palette, espacement, typo)
│   │   ├── global.css      # Reset + styles de base
│   │   └── animations.css  # Keyframes (flicker…)
│   ├── blog/           # Module blog autonome
│   └── i18n/           # fr.ts, en.ts, index.ts
├── sanity/
│   ├── schemaTypes/    # joueuse, match, evenement, article
│   └── sanity.config.ts
├── docs/               # Docs projet (voir tableau ci-dessus)
└── .github/workflows/  # CI/CD GitHub Actions
```

## Commandes
```bash
# Développement
yarn dev                           # Astro → localhost:4321
cd sanity && yarn dev              # Studio → localhost:3333

# Build & déploiement
yarn build                         # génère /dist
yarn sanity schema extract && yarn sanity typegen generate  # régénérer types après modif schémas
cd sanity && yarn deploy           # déployer le Studio

# Git — pousse et déclenche le deploy
git push origin main
```
