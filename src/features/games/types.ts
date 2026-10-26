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
	venue: string;
	isHome: boolean;
	rdbc: Pick<TeamInfo, "name" | "logo">;
	opponent: Pick<TeamInfo, "name" | "league" | "logo">;
	detailsHref?: string;
}
