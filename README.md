# RDBC v2 — Roller Derby Bordeaux Club

Site web du Roller Derby Bordeaux Club. Stack : Astro 6 + React 19 + Sanity 5.

## Prérequis

- Node.js 26 (`nvm install && nvm use`)
- Yarn 4.18.1 via Corepack (`npm install -g corepack && corepack enable yarn`)

## Installation

```bash
export KEYOBS_PACKAGES_TOKEN="<jeton GitHub avec accès read:packages>"
yarn install
cd sanity && yarn install
```

Le jeton donne accès à `@keyobs/dx-flow`. Il reste dans l'environnement local ; en CI, il provient du secret `KEYOBS_PACKAGES_TOKEN`. Les deux projets conservent `node_modules` et leur propre lockfile.

## Développement

```bash
# Site Astro → localhost:4321
yarn dev

# Sanity Studio → localhost:3333
cd sanity && yarn dev
```

## Build

```bash
yarn build
```

## Sanity

```bash
# Régénérer les types après modification des schémas
yarn sanity typegen generate

# Déployer le Studio
cd sanity && yarn deploy
```

## Structure

```
rdbc-v2/
├── src/
│   ├── pages/        # Routes Astro
│   ├── components/   # Composants React + Astro
│   ├── layouts/      # Layout principal
│   ├── styles/       # tokens.css, global.css, animations.css
│   ├── blog/         # Module blog autonome
│   └── i18n/         # Traductions fr/en
├── sanity/           # Studio standalone
├── docs/             # Specs, guidelines, roadmap
└── .github/workflows/
    ├── preview.yml   # develop → GitHub Pages
    └── deploy.yml    # main → OVH
```

## Git workflow

```bash
# Créer une feature branch
git checkout -b feature/nom-feature

# Pousser → déclenche le preview sur GitHub Pages
git push origin develop

# Release → déploiement OVH
git push origin main
```

## Docs

- [Specs](docs/SPECS.md)
- [Stack technique](docs/STACK.md)
- [Design system](docs/GUIDELINES-UI.md)
- [Roadmap](docs/ROADMAP.md)
- [Guide pas à pas](docs/INSTRUCTIONS.md)
