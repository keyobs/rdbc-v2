import { RESULTS } from "@mockup/games";
import { GameRecord } from "./GameRecord";
import PhotoStrip from "./PhotoStrip";
import "./lastResults.css";

export interface TeamInfo {
	name: string;
	league?: string;
	travelTeam?: "A" | "B";
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

const LastResults = () => (
	<div className="last-results">
		{RESULTS.map((game) => (
			<OneGame key={game.id} game={game} />
		))}
	</div>
);

export default LastResults;

const OneGame = ({ game }: { game: GameResult }) => (
	<div className="game-line">
		<div className="game-poster">
			<img src={game.poster} alt={game.event} className="game-poster__img" />
		</div>

		<div className="game-date">{game.date}</div>

		<GameRecord
			rdbc={game.rdbc}
			hainemy={game.hainemy}
			rdbcWins={game.rdbc.score > game.hainemy.score}
			date={game.date}
			event={game.event}
		/>

		<PhotoStrip photos={game.photos} />
	</div>
);
