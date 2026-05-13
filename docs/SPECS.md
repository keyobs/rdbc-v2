# SPECS.md — Cahier des charges
## Roller Derby Bordeaux Club — Site web v2

> Version 1.0 — Mai 2025

---

## 1. Contexte

Le Roller Derby Bordeaux Club (RDBC) est une association de bénévoles pratiquant le roller derby à Bordeaux. Le site actuel est obsolète et ne s'affiche plus correctement. Ce document définit le cahier des charges de la refonte complète.

**Deadline V1 : 15 jours**

---

## 2. Objectifs

### 2.1 Objectifs principaux

- **Informer** — planning, tarifs, règles du jeu, formulaire de contact
- **Valoriser** — site soigné, résultats des matchs, journal de bord
- **Attirer** — annonces d'événements, recrutement de joueuses et d'arbitres

### 2.2 Objectifs secondaires

- Permettre aux non-développeuses de gérer le contenu de manière autonome
- Poser les bases d'une architecture évolutive (V2, migration CMS possible)

---

## 3. Utilisateurs

| Profil | Description | Interaction avec le site |
|---|---|---|
| Visiteuse lambda | Curieuse, potentielle future joueuse | Consultation, 80% sur mobile |
| Joueuse / membre | Consulte planning, résultats | Consultation |
| Non-dev du comité | Publie contenu, entre les scores | Backoffice Sanity Studio |
| Développeuse | Maintenance et évolutions | Codebase GitHub |

---

## 4. Périmètre V1

### 4.1 Pages

| Page | URL (FR) | URL (EN) | Priorité |
|---|---|---|---|
| Accueil | `/` | `/en/` | P0 |
| Présentation du club | `/club` | `/en/club` | P0 |
| Rejoindre | `/rejoindre` | `/en/join` | P0 |
| Règles du jeu | `/regles` | `/en/rules` | P1 |
| L'équipe | `/equipe` | `/en/team` | P1 |
| Compétitions | `/competitions` | `/en/competitions` | P1 |
| Événements | `/evenements` | `/en/events` | P1 |
| Blog | `/blog` | `/en/blog` | P1 |
| Article de blog | `/blog/[slug]` | `/en/blog/[slug]` | P1 |
| Contact | `/contact` | `/en/contact` | P0 |
| Studio Sanity | `/studio` | — | interne |

### 4.2 Fonctionnalités

#### Accueil
- Hero section avec accroche forte
- Countdown vers le prochain match ou événement
- Section derniers résultats
- Section prochains événements
- CTA "Rejoindre le club" visible et accessible

#### Présentation du club
- Histoire du club
- Valeurs et esprit Roller Derby
- Photos d'ambiance

#### Rejoindre
- Présentation des rôles : joueuse, pivot, jammer, arbitre, NSO
- Tarifs d'adhésion
- Lien vers HelloAsso pour le paiement (externe, pas de transaction sur le site)
- Formulaire de contact simplifié

#### Règles du jeu
- Explication des règles en langage accessible
- Glossaire des termes Roller Derby
- Page statique, pas de contenu CMS

#### L'équipe — feature phare
Cards joueuses avec effet flip :
- **Recto** — photo (mugshot), nom de derby
- **Verso** (au survol / au tap) — nom de derby, âge, nombre de saisons, poste favori, anecdote (champ libre "misc")
- Contenu géré dans Sanity

#### Compétitions
- Tableau des matchs (date, adversaire, lieu, score)
- Saisie manuelle dans Sanity par le comité
- Pas d'API externe, pas de données d'autres clubs
- Affichage matchs passés + matchs à venir

#### Événements / Annonces
- Liste des événements à venir
- Détail d'un événement (date, lieu, description, lien éventuel)
- Géré dans Sanity

#### Blog — module détachable
- Liste des articles avec vignette, titre, date, extrait
- Page article complète
- Articles signés par le club (pas de profil auteur individuel)
- Module conçu comme autonome et indépendant (`src/blog/`)
- Partage le header/footer/style du site principal
- Conçu pour pouvoir migrer vers une autre technologie sans impacter le reste

#### Formulaire de contact
- Champs : nom, email, message, sujet (liste déroulante)
- Envoi via FormSubmit (pas de backend)
- Pas de newsletter, pas de liste de contacts

### 4.3 Hors périmètre V1

- Paiement en ligne (HelloAsso gère les transactions)
- Profils joueuses avec stats de matchs
- Live scoring
- Carte interactive des événements
- Espace membre / authentification
- Notifications push

---

## 5. Internationalisation

- **Langues** : Français (défaut) + Anglais
- **Stratégie** : Option A — routes séparées (`/` FR, `/en/` EN)
- **Implémentation** : Astro i18n natif, `prefixDefaultLocale: false`
- **Fichiers de traduction** : `src/i18n/fr.ts` et `src/i18n/en.ts`
- **V1** : Pages françaises complètes, pages anglaises en placeholder "coming soon"
- **Slugs** : traduits (`/equipe` → `/en/team`, `/regles` → `/en/rules`)

---

## 6. Identité visuelle

### 6.1 Direction artistique

**"Cyber-Glow — Riot Grrrl x Retro-Futurism"**

Fusion de l'énergie 80s/90s (vibrance, brut) et de l'esthétique cyberpunk urbaine (surfaces sombres, néons, rébellion sociale). Esprit fanzine photocopié dans un garage, DIY punk, sans tomber dans le prétentieux.

- Persona : Badass, féministe, communautaire, esprit DIY
- Logique visuelle : fort contraste pour lisibilité extérieure, "bricolo" mais structuré
- Mobile-first, enrichi sur desktop

### 6.2 Palette de couleurs

> Source unique : [docs/GUIDELINES-UI.md](GUIDELINES-UI.md) — section 2. Ne pas dupliquer ici.

Variables CSS de référence (définies dans `src/styles/tokens.css`) :

| Variable | Valeur | Usage |
|---|---|---|
| `--color-bitume` | `#141618` | Fond principal |
| `--color-surface` | `#1F2226` | Fond des cards/containers |
| `--color-border` | `#33383E` | Bordures discrètes |
| `--color-neon-pink` | `#FF00FF` | Accent primaire — Riot Grrrl signature |
| `--color-neon-cyan` | `#00F0FF` | Accent secondaire — Tech/Cyberpunk |
| `--color-neon-purple` | `#9400FF` | Accent tertiaire — electric purple |
| `--color-acid-green` | `#BFFF00` | Contraste & Warning |
| `--color-text-main` | `#FDFDFD` | Texte principal |
| `--color-text-muted` | `#9CA3AF` | Texte secondaire |

### 6.3 Typographie

- **Display / Titres** : Archivo Black — bold, lourd, percutant
- **Body / Listes** : Geist ou Inter — lisible, accessible, 16px minimum
- **Effet néon** : `text-shadow: 0 0 8px var(--color-neon-pink)` sur les titres

### 6.4 Composants UI

**Boutons — "The 80s Switch"**
- Coins droits (pas de border-radius)
- `border: 2px solid`
- `box-shadow: 4px 4px 0px var(--color-neon-cyan)`
- `--color-neon-pink` pour les actions critiques (CTA "Rejoindre")

**Grille — "Destructured Grid"**
- Texte strictement aligné
- Éléments décoratifs avec `transform: rotate(-1.5deg)` qui débordent des containers
- Badges avec `outline: 2px solid white` (sticker-look)

**Navigation mobile**
- Thumb-zone UX : actions principales dans les 40% bas de l'écran
- Bottom-sheet navigation via Radix UI
- **Mobile-first hover** : par défaut `:active` et `:focus` uniquement — hover enrichi via `@media (hover: hover)` pour desktop (ex: flip des cards joueuses)

### 6.5 Micro-animations

- **Flicker** : jitter d'opacité subtil sur les bordures néon (CSS keyframes)
- **Drawers** : transitions spring via Framer Motion
- **Haptics** : inversion de couleur au tap pour feedback immédiat

### 6.6 Icônes

Phosphor Icons — weight Bold — couleur `--color-neon-primary`

---

## 7. Contenu

### 7.1 Contenu existant

- Textes du site actuel récupérables
- Photos des joueuses (mugshots) disponibles
- Photos d'action disponibles
- Résultats de matchs passés à ressaisir manuellement

### 7.2 Contenu Sanity (géré par le comité)

| Type | Champs principaux |
|---|---|
| `joueuse` | nom de derby, photo, âge, saisons, poste, misc |
| `match` | date, adversaire, lieu, score, domicile/extérieur |
| `evenement` | titre, date, lieu, description, lien |
| `article` | titre, slug, date, corps (Portable Text), image |

### 7.3 Contenu statique (dans le code)

- Règles du jeu
- Présentation des rôles
- Tarifs
- Textes de présentation du club

---

## 8. SEO

- HTML pré-rendu (statique) — indexable par défaut
- Balises `<meta>` description par page
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- `hreflang` FR/EN géré par Astro i18n
- `sitemap.xml` généré automatiquement (`@astrojs/sitemap`)
- URLs propres et lisibles

---

## 9. Accessibilité

- Contrastes WCAG AA minimum (favorisé par la palette haute-contraste)
- Taille de texte minimum 16px
- Attributs `alt` sur toutes les images
- Navigation au clavier fonctionnelle
- Focus states visibles

---

## 10. Performance

- Site statique — temps de chargement minimal
- Images optimisées via `@astrojs/image`
- Zéro JS envoyé au client sauf pour les composants interactifs (React islands)
- Score Lighthouse cible : 90+ sur mobile

---

## 11. Contraintes

- Hébergement mutualisé OVH — pas de Node.js en production
- Pas de base de données côté site (Sanity Content Lake)
- Pas de transaction financière sur le site
- Deadline 15 jours
- Équipe de bénévoles — maintenance légère requise

---

## 12. Évolutions V2 (hors périmètre)

| Feature | Prérequis |
|---|---|
| Migration CMS vers Strapi | VPS OVH — souveraineté des données |
| Profils joueuses avec stats | Stabilisation du contenu V1 |
| Live scoring | Architecture dynamique (VPS) |
| Carte interactive des events | OpenStreetMap / Leaflet |
| Espace membre | Authentification |
| Pages anglaises complètes | Traductions disponibles |
