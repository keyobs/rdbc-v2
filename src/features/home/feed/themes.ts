export type FeedThemeSlug = "sunset" | "vice-city" | "heatwave" | "neon-drift";

/** Default colours of the 4 spots, until the editors set their own */
export const THEME_ORDER: FeedThemeSlug[] = [
	"sunset",
	"vice-city",
	"heatwave",
	"neon-drift",
];

/**
 * Radial gradient stops of a feed card, from the brightest (center of the glow)
 * to the darkest. `c0` doubles as the accent colour (CTA, date, progress bar).
 */
export interface FeedTheme {
	c0: string;
	c1: string;
	c2: string;
	base: string;
}

export const THEMES: Record<FeedThemeSlug, FeedTheme> = {
	sunset: {
		c0: "oklch(0.94 0.16 110)",
		c1: "oklch(0.78 0.24 60)",
		c2: "oklch(0.45 0.22 25)",
		base: "oklch(0.18 0.08 350)",
	},
	"vice-city": {
		c0: "oklch(0.92 0.13 85)",
		c1: "oklch(0.72 0.27 18)",
		c2: "oklch(0.42 0.18 320)",
		base: "oklch(0.18 0.06 280)",
	},
	heatwave: {
		c0: "oklch(0.93 0.14 320)",
		c1: "oklch(0.7 0.28 340)",
		c2: "oklch(0.38 0.22 295)",
		base: "oklch(0.15 0.08 290)",
	},
	"neon-drift": {
		c0: "oklch(0.95 0.12 200)",
		c1: "oklch(0.75 0.25 220)",
		c2: "oklch(0.4 0.2 280)",
		base: "oklch(0.15 0.08 260)",
	},
};

export function getTheme(slug: string): FeedTheme {
	return THEMES[slug as FeedThemeSlug] ?? THEMES.sunset;
}
