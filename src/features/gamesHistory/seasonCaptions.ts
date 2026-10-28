import type { Locale } from "@i18n/index";
import type { TeamKey } from "@features/games/types";

type Caption = Record<Locale, string>;

// Season-specific content: kept in code until it moves to Sanity.
// Past seasons are written in the past tense.
const CAPTIONS: Record<string, Record<TeamKey, Caption>> = {
	"2026-2027": {
		A: {
			fr: "La TTA est engagée dans le Championnat de France niveau Nationale 1.",
			en: "TTA is competing this season in the French Championship at Nationale 1 level.",
		},
		B: {
			fr: "[La TTB est engagée dans le Championnat de France niveau Nationale 3]",
			en: "[TTB is competing this season in … at … level]",
		},
		home: {
			fr: "[Légende des matchs intraligue]",
			en: "[Intraleague games caption]",
		},
	},
	"2025-2026": {
		A: {
			fr: "En 2025-2026, la TTA était engagée dans le Championnat de France niveau Nationale 2.",
			en: "In 2025-2026, TTA competed in the French Championship at Nationale 2 level.",
		},
		B: {
			fr: "[En 2025-2026, la TTB était engagée dans … niveau …]",
			en: "[In 2025-2026, TTB competed in … at … level]",
		},
		home: {
			fr: "[Légende des matchs intraligue 2025-2026]",
			en: "[Intraleague games caption 2025-2026]",
		},
	},
};

export function getSeasonCaption(
	season: string,
	team: TeamKey,
	locale: Locale,
): string | undefined {
	return CAPTIONS[season]?.[team]?.[locale];
}
