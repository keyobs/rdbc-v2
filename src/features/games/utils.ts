import type {
	GameResult,
	NextGamesGroup,
	TeamKey,
	UpcomingGame,
} from "./types";

const TEAMS: TeamKey[] = ["A", "B", "home"];

export function getGameTeam(game: Pick<GameResult, "rdbc">): TeamKey {
	return game.rdbc.travelTeam ?? "home";
}

/** For each team that has an upcoming game: its next event (all the games of the plateau). */
export function getNextGamesByTeam(
	games: UpcomingGame[],
	now: Date,
): NextGamesGroup[] {
	const upcoming = games
		.filter((game) => new Date(game.date) >= now)
		.sort((a, b) => a.date.localeCompare(b.date));

	return TEAMS.flatMap((team) => {
		const teamGames = upcoming.filter((game) => game.team === team);
		const first = teamGames[0];
		if (!first) return [];
		return [
			{
				team,
				competition: first.competition,
				event: first.event,
				venue: first.venue,
				games: teamGames.filter(
					(game) =>
						game.competition === first.competition &&
						game.event === first.event,
				),
			},
		];
	});
}

/** A season runs from September to August, e.g. "2025-2026". */
export function getSeason(isoDate: string): string {
	const date = new Date(isoDate);
	const startYear =
		date.getMonth() >= 8 ? date.getFullYear() : date.getFullYear() - 1;
	return `${startYear}-${startYear + 1}`;
}

export function formatGameDateShort(isoDate: string, locale = "fr-FR"): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
	}).format(new Date(isoDate));
}

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
