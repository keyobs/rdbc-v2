import type { Locale } from "@i18n/index";

export type ResultsTeam = "A" | "B";

interface TeamBoard {
	team: ResultsTeam;
	title: string;
	caption: Record<Locale, string>;
}

// Captions are season-specific content: they stay here until they move to Sanity.
export const TEAM_BOARDS: TeamBoard[] = [
	{
		team: "A",
		title: "TTA — Les Petites Morts",
		caption: {
			fr: "La TTA est engagée cette saison dans le Championnat de France niveau Nationale 1.",
			en: "TTA is competing this season in the French Championship at Nationale 1 level.",
		},
	},
	{
		team: "B",
		title: "TTB — La Compagnie Cruelle",
		caption: {
			fr: "[La TTB est engagée cette saison dans … niveau …]",
			en: "[TTB is competing this season in … at … level]",
		},
	},
];
