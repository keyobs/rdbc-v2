import type { TeamKey } from "@features/games/types";

export const TEAM_ORDER: TeamKey[] = ["A", "B", "home"];

/** Board titles. `null` for the intraleague: the translated tab label is used. */
export const TEAM_TITLES: Record<TeamKey, string | null> = {
	A: "TTA — Les Petites Morts",
	B: "TTB — La Compagnie Cruelle",
	home: null,
};
