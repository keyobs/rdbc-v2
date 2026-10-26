import type { Locale, Translations } from "@i18n/index";
import type { NextGamesGroup } from "@features/games/types";
import { formatGameDateShort, formatGameTime } from "@features/games/utils";
import Scoreboard from "@components/scoreboard/Scoreboard";
import { TEAM_TITLES } from "./teams";
import "./nextGames.css";

interface NextGamesProps {
	groups: NextGamesGroup[];
	locale: Locale;
	labels: Translations["games"];
}

/** One board per team that has an upcoming game, with all the games of its next event. */
const NextGames = ({ groups, locale, labels }: NextGamesProps) => {
	const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

	return (
		<section className="next-games" aria-labelledby="next-games-title">
			<h2 className="games-title" id="next-games-title">
				{labels.nextGames}
			</h2>

			{groups.length === 0 && (
				<p className="next-games__empty">{labels.noNextMatch}</p>
			)}

			{groups.map((group) => (
				<div className="games-board" key={group.team}>
					<div className="games-board__band">
						{TEAM_TITLES[group.team] ?? labels.tabs[group.team]}
					</div>
					<p className="games-board__caption">
						{group.competition} — {group.event} · {group.venue}
					</p>

					{group.games.map((game) => (
						<div className="next-row" key={game.id}>
							<Scoreboard
								home={game.rdbc}
								away={{ ...game.opponent, subtitle: game.opponent.league }}
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
						</div>
					))}
				</div>
			))}
		</section>
	);
};

export default NextGames;
