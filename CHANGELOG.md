## [0.2.0] - 2026-05-20

### Added
Design System
- `src/styles/tokens.css` — CSS variables (palette, typography, button tokens)
- `src/styles/global.css` — reset + base styles
- `src/styles/animations.css` — flicker keyframes
- Self-hosted fonts via `@fontsource`: Archivo Black + Inter

Sanity Schemas
- `player` — derby_name, photo, role(s), season, first_season, misc
- `club` — reusable opponent reference
- `game` — date, location, team, opponent, scores, tournament (optional)
- `event` — title, date, location, description, link (optional)
- `article` — title, slug, date, author, image, excerpt, body (Portable Text)
- TypeScript types generated via `sanity typegen`

---

## [0.1.0] - 2026-05-20

### Added
Base Config
- Stack config = Astro 6 + React 19 + Sanity 5 project initialized
- Quality DX = Biome 2, Husky, commitlint, lint-staged, dx-flow
- GitHub Packages auth (`@keyobs/dx-flow`) via `KEYOBS_PACKAGES_TOKEN`
Deploy
- GitHub Actions CI/CD = `test.yml`, `build.yml`, `preview.yml`, `deploy.yml`
- Automatic preview `develop` → GitHub Pages
- Production deploy `main` → OVH via FTP
- Sanity Studio deployed to `rdbc-v2.sanity.studio`
