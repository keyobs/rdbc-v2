export interface TeamInfo {
	name: string;
	league?: string;
	travelTeam?: "A" | "B" | "home";
	logo: string | null;
	score: number;
}

export interface GameResult {
	id: string;
	date: string;
	tournament: string;
	event: string;
	rdbc: TeamInfo;
	hainemy: TeamInfo;
	poster?: string;
	photos?: string[];
}
