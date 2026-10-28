import Scoreboard, { ScoreDigits } from "@components/scoreboard/Scoreboard";
import type { Locale } from "@i18n/index";
import type { GameResult } from "@features/games/types";
import { formatGameDate } from "@features/games/utils";

interface ResultRowProps {
	game: GameResult;
	locale: Locale;
}

/** One finished game: poster and date on the left, scoreboard on the right. */
const ResultRow = ({ game, locale }: ResultRowProps) => {
	const { rdbc, hainemy } = game;

	return (
		<article className="results-row">
			<div className="results-row__top">
				{game.poster && (
					<img
						className="results-row__poster"
						src={game.poster}
						alt=""
						loading="lazy"
					/>
				)}
				<div className="results-row__meta">
					<time className="results-row__date" dateTime={game.date}>
						{formatGameDate(game.date, locale === "fr" ? "fr-FR" : "en-US")}
					</time>
					{game.event}
				</div>
			</div>

			<Scoreboard
				home={rdbc}
				away={{ ...hainemy, subtitle: hainemy.league }}
				label={`${rdbc.name} ${rdbc.score}, ${hainemy.name} ${hainemy.score}`}
				homeTone={rdbc.travelTeam === "B" ? "green" : "blue"}
			>
				<ScoreDigits homeScore={rdbc.score} awayScore={hainemy.score} />
			</Scoreboard>
		</article>
	);
};

export default ResultRow;
