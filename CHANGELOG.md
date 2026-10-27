## [0.4.0] - 2026-10-27

### Added
Sport
- Track slider in the "Le track" section: 8 WFTDA game situations (track, in bounds, referees, pack, engagement zone, jammers outside the pack, jammers in and out of the engagement zone), diagram on the left, legend on the right
- `TheTrack` SVG diagram drawn from the official WFTDA layout (inside and outside arcs, pivot and jammer lines, 10-foot markers), with the safety zone, the direction of play and blinking start lines
- Pack computed from the blockers only (largest group no more than 3 m apart), engagement zone 6 m in front of and behind it
- Spring transitions between situations with Motion, disabled with reduced motion
- Navigation by arrows over the diagram, dots, "up next" card, swipe and keyboard; fixed legend height
- Credit to the MagneticBoard by Wonder Zebra
- `--color-zone` token for the pack and engagement zone

Join
- Join page scaffold and viewers guide documents

### Changed
- Framer Motion replaced by Motion 14 (`motion/react`)
- Club life copy refreshed (WFTDA membership), English copy aligned with French
- Skating session moved to Tuesday 20:30–22:30
- Sport page section padding and intro copy
- Sport advanced rules commented out until the content is ready
- Agents and design folders ignored by git, `useEffect` guideline added to CLAUDE.md

---

## [0.3.0] - 2026-10-27

### Added
Layout & Navigation
- Header and footer components, home layout with an animated halo background
- Desktop navbar as an Astro component, pill spotlight on hover, 3.75rem minimum click area
- Mobile bottom navigation styled like a standalone app, with a Radix + Motion drawer
- Shiny button as the main CTA, ghost and bloom buttons
- Dedicated social link components
- `useIsMobile` hook and responsive breakpoint constants

i18n & Routing
- French and English routes, translation keys, language switch
- `withBase` route handler for local, preview, production and language versions

Home
- Hero with a 3-picture frame (desktop and mobile), fed by Sanity
- News feed (desktop and mobile) with four oklch themes, date stamp layout and swipe
- Latest results, limited to the last 3 games or the last tournament, using the shared scoreboard
- Alert banner between the feed and the hero (Sanity document)
- Join block with icon list and shiny hover on the cards

Games & Competitions
- Games page with scoreboard, team tabs, seasons and next games per team
- Competition page for the two-game tournament in Paris
- Scoreboard extracted as a shared component, single swap point for the future scraper

Club
- Club pages: club life, play derby, sign-up block with links and membership fees
- Contact form sent for real through a PHP mail endpoint, with an optional copy to the visitor

Sport
- Sport page layout with flippable notion cards and advanced rules (hidden until ready)

Join
- Join landing section and page layout

Sanity
- Feed, home alert banner and home joining documents
- Signup links and membership fees on the club page

Tooling
- Path aliases, stricter type checking, Biome on Astro files
- Husky: lint at commit and at push
- Claude agents (architect, deploy, quality, release, test)

### Changed
- Neon primary token set to `rgb(0, 255, 150)`
- Global title styles reworked, home styles sized in rem
- Navbar home link enlarged to 1.2rem
- Node engine requirement bumped to 24, CI forced on Node 24 with a base path
- dx-flow updated to 3.1.3

### Fixed
- Logo and font loading (no flash of unstyled content)
- Base path and language routing
- Home link no longer matches every page title, bottom nav active state
- Responsive breakpoints of the score rows
- FTP deploy action

---

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
