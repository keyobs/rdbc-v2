UI Guideline: Cyber-Glow (Riot Grrrl x Retro-Futurism)
Focus: Mobile-First, Inclusive, High-Contrast
1. Design Vision

Core Concept: A fusion of 80s/90s "GLOW" energy (vibrancy, grit) and "Cyberpunk" urban aesthetics (dark surfaces, neon lights, social rebellion).   


Persona: Badass, feminist, community-driven, DIY-spirit.   


Visual Logic: High-contrast for outdoor readability, "bricolo" but structured.   

2. Color Palette (Extracted from RDBC-color-palette.gpl)
CSS
:root {
  /* Surfaces - The Urban Grit */
  --color-bitume: rgb(15, 20, 39);      /* Deep midnight blue-black  */
  --color-surface: rgb(43, 67, 154);    /* Mid-tone blue for containers  */
  --color-border: rgb(84, 124, 147);    /* Muted industrial border  */

  /* Accents - The Glow & Action */
  --color-neon-primary: rgb(110, 201, 142);  /* Mint Riot  */
  --color-neon-secondary: rgb(184, 228, 180); /* Acid glow  */
  --color-action: rgb(235, 28, 36);          /* Aggressive Derby Red  */

  /* Typography & Utility */
  --color-text-main: rgb(244, 244, 244);     /* Off-white  */
  --color-white: rgb(255, 255, 255);         /* Pure white  */
}
3. Typography Rules

Primary (Body/Lists): Sans-Serif (e.g., Inter or Geist).   


Size: 16px minimum for accessibility.   


Display (Headings): Bold, heavy weights (e.g., Archivo Black).   


Effect: text-shadow: 0 0 8px var(--color-neon-primary).   

4. UI Components & UX (Mobile-First)
A. Navigation & Interaction

Thumb-Zone UX: All primary actions in the bottom 40% of the screen.   


Drawers: Use Radix UI primitives for bottom-sheet navigation.   


No Hover: Rely exclusively on :active and :focus states.   

B. Buttons: "The 80s Switch"

Style: Rectangular, 2px solid border, no border-radius.   


Interaction: Use --color-action for critical buttons.   


Shadow: Hard drop shadow: box-shadow: 4px 4px 0px var(--color-neon-primary).   

C. The "Destructured" Grid
Controlled Chaos: Text remains strictly aligned. Decorative elements use transform: rotate(-1.5deg) and overlap container edges.   


Sticker-look: Use outline: 2px solid white on small badges.   

5. Micro-Animations

Flicker: Subtle opacity jitter on neon-colored borders using CSS keyframes.   


Snappy Physics: Use Framer Motion for spring-based drawer transitions.   


Haptics: Color inversion on click/tap for immediate visual feedback.   

6. Development Stack & Agent Instructions

Logic: Use Radix UI (Primitives) for Drawers, Dialogs, and Modals.   


Styling: Vanilla CSS only.   


Icons: Phosphor Icons (Weight: Bold).   


Animations: Framer Motion.   

"Code using React and Vanilla CSS. Follow Radix UI patterns.
Apply the palette: --color-bitume as the main background.
Buttons must be tactile with sharp corners and hard shadows.
Use Phosphor Bold icons in --color-neon-primary.
Tilt every 3rd container using rotate to maintain the Riot Grrrl/DIY aesthetic."