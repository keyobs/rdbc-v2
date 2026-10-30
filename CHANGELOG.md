## [0.5.0]  - 2026-10-30

### Added
Teams
- Teams pages (`/competitions/equipes`, `/en/competitions/teams`), linked from Games, with TTA, TTB, Intraleague, Officials, Staff and Hall of Fame tabs
- Flippable member cards with portrait, jersey number or role, optional generation, calculated seasons and anecdote; five columns on desktop and two on mobile
- Separate travel-team and intraleague affiliations; standby members grouped below the current roster, except in Hall of Fame
- French Sanity member fields and toggles for standby, Hall of Fame and current-roster visibility; optional last season and English anecdote
- `test:teams` checks roster filtering, dual affiliations, Hall of Fame, season counts and language routes

Sanity
- Dry-run utility to abbreviate division names to N1/N2 in competition and event fields, with an explicit apply option

Join
- Join page (`/rejoindre`, `/en/join`): values banner, hero and three role cards (player, referee, volunteer) with tags, a looping video slot and a CTA
- Role card CTA pre-fills the contact form: matching interest checked and a ready-made message
- Sign-up block and contact form extracted into `src/components`, shared by the club and join pages, printed on a fanzine paper sheet
- Flyer-style CTA-ALT buttons: yellow price tag for the sign-up forms, inverted dark-blue tag for HelloAsso, cut-out coupon for "Send"
- `--color-ink` token for the paper sheet ink

Contact
- "Interleague" interest, pre-checked when coming from the games page "Write to us" button (`/club?interest=interleague#contact`)
- Messages routed by interest: play / try / referee to recrutement@, come watch / volunteer / say hi to the club Gmail, interleague to interleague@; club Gmail when nothing is checked
- Club e-mail address shown under "Contact us", interleague address under the games page challenge

Club
- Training location color (green / yellow) as a Sanity field, used for agenda sessions and swatches in front of the map links

### Changed
Teams
- Card names and height rulers removed from the display because names are already included in the portraits; accessible names retained
- Existing member fields preserved; the old manual season count is hidden and replaced on the site by a calculation from the first season

Visual style
- Mobile text glow uses a bright 2px core and a softer 8px halo; scoreboard, bottom navigation and background halos attenuated on mobile while desktop styling is preserved
- Scoreboard panel and centre-bar halos softened

Club
- Agenda rows are fixed time slots (before 13:00, 13–17, 17–19, after 19:00); sessions sharing a slot stack one after the other
- Agenda labels larger and bold, Saturday cell centered, "View on Maps" text removed from the location links
- Demo Saturday schedule: Starters 11:00, TTA 13:00, Playschools 15:00

Contact form
- Field order: interests, name, e-mail, message; name and e-mail side by side (1/3 – 2/3)
- "First name" becomes "Name" and is optional
- Taller message box, single scissors on the coupon's dashed line instead of the cut lines
- Fallback address on sending failure is the club Gmail

Sport
- Notion cards become a swipe slider on mobile
- Track diagram full width on mobile, arrows in its bottom corners, section header above it
- Officials follow the action in situations 6 to 8 (jammer refs level with their jammer, inside and outside refs placed from the pack and engagement zone) and glide along the track
- Skater and official discs 20% larger

Games
- FlatTrackStats rankings link uses the previous Sunday instead of today

Navigation
- Mobile bottom nav: border bump around the logo; "Contact" points to the club contact form

### Fixed
- Navigation links retain the current language, and the Games section stays active on the English Teams page
- Notion cards overlapping the "Les bases" header on mobile
- Bottom nav border showing under the logo bump on some phones
- Animated blocks (club, join, home feed) invisible when JavaScript loads late or fails: content is now visible in the server HTML and only off-screen blocks wait for their reveal
- Games page "Write to us" button pointing to a missing `/contact` page

### Notes
- Redeploy the Sanity Studio for the new member fields, then fill in team affiliations and roster settings to populate the Teams pages
- Redeploy the Sanity Studio (`cd sanity && yarn deploy`) to get the location color field
- `send.php` routing still needs a real test e-mail per address on the hosting

---

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
