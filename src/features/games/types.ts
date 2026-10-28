export interface TeamInfo {
	name: string;
	league?: string;
	travelTeam?: "A" | "B" | "home";
	logo: string | null;
	score: number;
}

/** "home" groups the intraleague games between the club's home teams. */
export type TeamKey = "A" | "B" | "home";

export interface GameResult {
	id: string;
	/** Local date-time "YYYY-MM-DDTHH:MM:00", noon when the time is unknown. */
	date: string;
	tournament: string;
	event: string;
	rdbc: TeamInfo;
	hainemy: TeamInfo;
	poster?: string;
	/** Link to the game page, once it exists. */
	detailsHref?: string;
}

export interface UpcomingGame {
	id: string;
	/** Local date-time "YYYY-MM-DDTHH:MM:00", noon when the time is unknown. */
	date: string;
	/** "HH:MM", `null` when not known yet. */
	time: string | null;
	team: TeamKey;
	competition: string;
	/** Games of the same plateau share the same competition and event. */
	event: string;
	venue: string | null;
	isHome: boolean;
	rdbc: Pick<TeamInfo, "name" | "logo">;
	opponent: Pick<TeamInfo, "name" | "league" | "logo">;
	detailsHref?: string;
}

/** The next event of a team: one game, or several for a plateau. */
export interface NextGamesGroup {
	team: TeamKey;
	competition: string;
	event: string;
	venue: string | null;
	games: UpcomingGame[];
}

/** Caption of each team, per season ("2026-2027"). */
export type SeasonCaptions = Record<string, Partial<Record<TeamKey, string>>>;
