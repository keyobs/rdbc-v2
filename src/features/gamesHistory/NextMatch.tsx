import type { Locale, Translations } from "@i18n/index";
import type { UpcomingGame } from "@features/games/types";
import { formatGameDateShort, formatGameTime } from "@features/games/utils";
import { withBase } from "@utils/urlHandler";
import Scoreboard from "./Scoreboard";
import "./nextMatch.css";

interface NextMatchProps {
	game?: UpcomingGame;
	locale: Locale;
	labels: Translations["games"];
}

const NextMatch = ({ game, locale, labels }: NextMatchProps) => {
	const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

	return (
		<section className="next-match" aria-labelledby="next-match-title">
			<h2 className="games-title" id="next-match-title">
				{labels.nextMatch}
			</h2>

			{game ? (
				<>
					<Scoreboard
						size="next"
						home={game.rdbc}
						away={game.opponent}
						label={`${game.rdbc.name} / ${game.opponent.name}`}
					>
						<time className="scoreboard__text" dateTime={game.date}>
							{formatGameDateShort(game.date, dateLocale)}
						</time>
						<span className="scoreboard__chip">
							{game.isHome ? labels.homeChip : labels.awayChip}
						</span>
						<time className="scoreboard__text" dateTime={game.date}>
							{formatGameTime(game.date, dateLocale)}
						</time>
					</Scoreboard>

					<div className="next-match__foot">
						<div>
							<span className="games-badge">
								{game.isHome ? labels.home : labels.away}
							</span>
							<p className="next-match__meta">
								{game.competition} · {game.venue}
							</p>
						</div>
						{game.detailsHref && (
							<a className="games-cta" href={withBase(game.detailsHref)}>
								{labels.moreInfo}
							</a>
						)}
					</div>
				</>
			) : (
				<p className="next-match__empty">{labels.noNextMatch}</p>
			)}
		</section>
	);
};

export default NextMatch;
