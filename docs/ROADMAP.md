# ROADMAP.md — Planning 2 semaines
## Roller Derby Bordeaux Club — Site web v2

> Version 1.0 — Mai 2025  
> Deadline : J+15

---

## Légende

| Tag | Domaine |
|---|---|
| `[INFRA]` | Infrastructure, CI/CD, configuration |
| `[CMS]` | Sanity — schémas, Studio, contenu |
| `[FRONT]` | Astro, React, CSS |
| `[CONTENT]` | Saisie et import de contenu |
| `[INTEG]` | Intégrations (webhook, FormSubmit, i18n) |
| `[QA]` | Tests, SEO, accessibilité |
| `[DEPLOY]` | Déploiement |

---

## Semaine 1 — Fondations

### ✅ J1 — Setup & Infrastructure

- ✅ `[INFRA]` Initialisation repo GitHub, branches `main` / `dev`
- ✅ `[INFRA]` Projet Astro opérationnel (`npm run dev` → localhost:4321)
- ✅ `[INFRA]` TypeScript strict configuré (`astro/tsconfigs/strict`)
- ✅ `[INFRA]` GitHub Actions — workflow build + deploy GitHub Pages
- ✅ `[CMS]` Sanity Studio opérationnel (`cd sanity && yarn dev` → localhost:3333)
- ✅ `[CMS]` Premier deploy Studio (`yarn deploy` → `rdbc-v2.sanity.studio`)

**Critère de succès J1 :** pipeline CI/CD fonctionnel, push sur `main` → site visible sur GitHub Pages

---

### ✅ J2 — Schémas Sanity & Design System

- ✅ `[CMS]` Schéma `player` (derby_name, photo, role, season, first_season, misc)
- ✅ `[CMS]` Schéma `club` (réutilisable — opponent dans game)
- ✅ `[CMS]` Schéma `game` (date, location, team, opponent, scores, tournament)
- ✅ `[CMS]` Schéma `event` (title, date, location, description, link)
- ✅ `[CMS]` Schéma `article` (title, slug, date, author, image, excerpt, body)
- ✅ `[INFRA]` `sanity typegen generate` → `sanity.types.ts`
- ✅ `[FRONT]` Design system : `tokens.css`, `global.css`, `animations.css`
- ✅ `[FRONT]` Variables CSS palette complète (bitume, neon-primary, action, etc.)

**Critère de succès J2 :** 4 schémas validés dans Studio, design tokens disponibles

---

### J3 — Layout global & Navigation

- `[FRONT]` Layout principal (`src/layouts/Layout.astro`)
- `[FRONT]` Header — logo, navigation desktop
- `[FRONT]` Navigation mobile — bottom drawer (Radix UI + Framer Motion)
- `[FRONT]` Footer
- `[INTEG]` Structure i18n — `src/i18n/fr.ts`, `src/i18n/en.ts`, `useTranslations()`
- `[FRONT]` Routing Astro i18n configuré (`/` FR, `/en/` EN)

**Critère de succès J3 :** navigation fonctionnelle mobile et desktop, switch FR/EN opérationnel

---

### J4 — Page Accueil & Connexion Sanity

- `[FRONT]` Page Accueil — hero section avec accroche
- `[FRONT]` Section countdown (prochain match / événement)
- `[FRONT]` Section derniers résultats (données Sanity)
- `[FRONT]` Section prochains événements (données Sanity)
- `[FRONT]` CTA "Rejoindre"
- `[INTEG]` Connexion Astro ↔ Sanity (`useSanityClient`, premières requêtes GROQ)

**Critère de succès J4 :** page accueil affiche des données réelles depuis Sanity

---

### J5 — Pages statiques & Contenu

- `[FRONT]` Page Présentation du club
- `[FRONT]` Page Rejoindre (rôles, tarifs, lien HelloAsso)
- `[FRONT]` Page Règles du jeu (statique, glossaire)
- `[CONTENT]` Import contenu existant dans Sanity (textes, photos)
- `[CONTENT]` Saisie données de test : 3 joueuses, 3 matchs, 2 événements

**Critère de succès J5 :** pages statiques en ligne, contenu de test visible

---

### Milestone Semaine 1

> Pipeline CI/CD opérationnel — pages fondations en ligne sur GitHub Pages — Studio accessible sur `rdbc-v2.sanity.studio` — schémas validés

---

## Semaine 2 — Features & Finitions

### J8 — Feature Cards Joueuses

- `[FRONT]` Page Équipe (`/equipe`)
- `[FRONT]` Composant `PlayerCard.tsx` — effet flip recto/verso
  - Recto : photo, nom de derby
  - Verso : âge, saisons, poste, misc
  - Mobile : flip au tap
  - Desktop : flip au survol
- `[FRONT]` Micro-animation flicker sur bordures néon
- `[CONTENT]` Saisie données complètes de toutes les joueuses dans Sanity

**Critère de succès J8 :** cards joueuses fonctionnelles mobile + desktop

---

### J9 — Blog & Webhook

- `[FRONT]` Module blog (`src/blog/`) — structure autonome
- `[FRONT]` Page liste articles (`/blog`)
- `[FRONT]` Page article (`/blog/[slug]`) — rendu Portable Text
- `[INTEG]` Webhook Sanity → `repository_dispatch` GitHub Actions → rebuild automatique
- `[CONTENT]` Saisie 2 articles de test dans Sanity

**Critère de succès J9 :** publication dans Sanity → rebuild automatique → article visible en 5 min

---

### J10 — Compétitions, Événements & Contact

- `[FRONT]` Page Compétitions — tableau matchs passés + à venir
- `[FRONT]` Page Événements / Annonces
- `[FRONT]` Page Contact — formulaire FormSubmit
- `[INTEG]` Configuration FormSubmit (email destination, anti-spam)
- `[CONTENT]` Saisie historique des matchs dans Sanity

**Critère de succès J10 :** formulaire de contact fonctionnel, réception email confirmée

---

### J11 — i18n, SEO & Accessibilité

- `[FRONT]` Pages EN placeholders (`/en/` avec "coming soon")
- `[INTEG]` `@astrojs/sitemap` — génération `sitemap.xml`
- `[QA]` Balises `<meta>` description sur toutes les pages
- `[QA]` Open Graph tags (`og:title`, `og:description`, `og:image`)
- `[QA]` `hreflang` FR/EN vérifié
- `[QA]` Audit accessibilité — attributs `alt`, focus states, contrastes

**Critère de succès J11 :** score Lighthouse mobile ≥ 85

---

### J12 — Audit Mobile & Tests

- `[QA]` Tests cross-browser (Chrome, Firefox, Safari)
- `[QA]` Tests mobile (iOS Safari, Android Chrome)
- `[QA]` Thumb-zone UX vérifié — toutes les actions primaires dans les 40% bas
- `[QA]` Relecture contenu par le comité
- `[QA]` Corrections suite relecture
- `[DEPLOY]` Déploiement prod OVH — configuration FTP GitHub Actions

**Critère de succès J12 :** site validé par le comité, déployé sur OVH

---

### J15 — Go Live

- `[QA]` Vérifications finales en production
- `[DEPLOY]` Configuration DNS — `rollerderbybordeaux.fr` → OVH
- `[DEPLOY]` Redirection `rollerderbybordeaux.com` → `.fr`
- `[DEPLOY]` HTTPS vérifié
- `[DEPLOY]` Webhook Sanity configuré sur l'URL de production OVH

**Critère de succès J15 :** 🎉 site en production, accessible sur `rollerderbybordeaux.fr`

---

## Vue synthétique

```
S1  J1  ████ INFRA — CI/CD, GitHub Actions, Sanity Studio
    J2  ████ CMS — Schémas + Design System
    J3  ████ FRONT — Layout, Navigation, i18n
    J4  ████ FRONT — Accueil + Sanity connecté
    J5  ████ FRONT — Pages statiques + import contenu

S2  J8  ████ FRONT — Feature Cards Joueuses
    J9  ████ FRONT — Blog + Webhook rebuild
    J10 ████ FRONT — Compétitions + Événements + Contact
    J11 ████ QA — i18n + SEO + Accessibilité
    J12 ████ QA — Tests + Prod OVH
    J15 ████ DEPLOY — Go Live
```

---

## Risques identifiés

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Webhook Sanity → GitHub Actions complexe à configurer | Moyenne | Moyen | Prévoir 3h sur J9, doc détaillée dans INSTRUCTIONS.md |
| FTP OVH — permissions ou chemins incorrects | Moyenne | Élevé | Tester dès J1 avec un fichier HTML basique |
| Contenu insuffisant pour les tests | Faible | Faible | Données fictives en fallback |
| Retard relecture comité | Moyenne | Moyen | Envoyer lien GitHub Pages dès J5 |
