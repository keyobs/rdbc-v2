import type { GameResult } from "./types";

export function getGroupedResults(
	results: GameResult[],
	slice = false,
): Record<"A" | "B" | "home", GameResult[]> {
	const teams: ("A" | "B" | "home")[] = ["A", "B", "home"];
	return Object.fromEntries(
		teams.map((team) => {
			const filtered = results
				.filter((g) => (g.rdbc.travelTeam ?? "home") === team)
				.sort((a, b) => b.date.localeCompare(a.date));
			return [team, slice ? getRecentGames(filtered) : filtered];
		}),
	) as Record<"A" | "B" | "home", GameResult[]>;
}

export function formatGameDate(isoDate: string, locale = "fr-FR"): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(isoDate));
}

export function formatGameTime(isoDate: string, locale = "fr-FR"): string {
	return new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(isoDate));
}

export function getRecentGames<T extends { date: string }>(games: T[]): T[] {
	if (games.length === 0) return [];

	const toDay = (iso: string) => iso.slice(0, 10);
	const days = [...new Set(games.map((g) => toDay(g.date)))];

	if (days.length < 2) return games;

	const diff =
		(new Date(days[0]).getTime() - new Date(days[1]).getTime()) / 86_400_000;

	if (diff === 1) {
		return games.filter(
			(g) => g.date.slice(0, 10) === days[0] || g.date.slice(0, 10) === days[1],
		);
	}

	return games.slice(0, 3);
}
