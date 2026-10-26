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
	date: string;
	tournament: string;
	event: string;
	rdbc: TeamInfo;
	hainemy: TeamInfo;
	poster?: string;
	photos?: string[];
	/** Link to the game page, once it exists. */
	detailsHref?: string;
}

export interface UpcomingGame {
	id: string;
	date: string;
	team: TeamKey;
	competition: string;
	/** Games of the same plateau share the same competition and event. */
	event: string;
	venue: string;
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
	venue: string;
	games: UpcomingGame[];
}
