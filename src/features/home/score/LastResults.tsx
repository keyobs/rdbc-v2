import { RESULTS } from "@mockup/games";
import { GameRecord } from "./GameRecord";
import PhotoStrip from "./PhotoStrip";
import TeamHeader, { ORDER, TEAM_HEADERS } from "./TeamHeader";
import { formatGameDate } from "./utils";
import "./lastResults.css";

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
	poster: string;
	tournament: string;
	event: string;
	rdbc: TeamInfo;
	hainemy: TeamInfo;
	photos: string[];
}

const LastResults = () => {
	const grouped = Object.fromEntries(
		ORDER.map((team) => [
			team,
			RESULTS.filter((g) => (g.rdbc.travelTeam ?? "home") === team).sort(
				(a, b) => b.date.localeCompare(a.date),
			),
		]),
	) as Record<"A" | "B" | "home", GameResult[]>;

	return (
		<div className="last-results">
			{ORDER.map((team) => {
				const games = grouped[team];
				if (!games.length) return null;
				return (
					<div key={team} className="last-results__group">
						<TeamHeader title={TEAM_HEADERS[team]} team={team} />
						{games.map((game) => (
							<OneGame key={game.id} game={game} />
						))}
					</div>
				);
			})}
		</div>
	);
};

export default LastResults;

const OneGame = ({ game }: { game: GameResult }) => (
	<div className="game-line">
		<div className="game-poster">
			<img src={game.poster} alt={game.event} className="game-poster__img" />
		</div>
		<div className="game-date">{formatGameDate(game.date)}</div>

		<GameRecord
			rdbc={game.rdbc}
			hainemy={game.hainemy}
			rdbcWins={game.rdbc.score > game.hainemy.score}
			date={formatGameDate(game.date)}
			event={game.event}
		/>

		<PhotoStrip photos={game.photos} />
	</div>
);
