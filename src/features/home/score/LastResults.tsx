import type { GameResult } from "./types";
import { RESULTS } from "./resultsData";
import { GameRecord } from "./GameRecord";
import PhotoStrip from "./PhotoStrip";
import TeamHeader, { ORDER, TEAM_HEADERS } from "./TeamHeader";
import { formatGameDate, getGroupedResults } from "./utils";
import "./lastResults.css";

const LastResults = () => {
	const grouped = getGroupedResults(RESULTS, true);

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
		{game.poster && (
			<div className="game-poster">
				<img src={game.poster} alt={game.event} className="game-poster__img" />
			</div>
		)}
		<div className="game-date">{formatGameDate(game.date)}</div>

		<GameRecord
			rdbc={game.rdbc}
			hainemy={game.hainemy}
			rdbcWins={game.rdbc.score > game.hainemy.score}
			date={formatGameDate(game.date)}
			event={game.event}
		/>

		{game.photos && game.photos.length > 0 && (
			<PhotoStrip photos={game.photos} />
		)}
	</div>
);
