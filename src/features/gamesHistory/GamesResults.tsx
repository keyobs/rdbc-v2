import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import type { Locale, Translations } from "@i18n/index";
import type { GameResult, SeasonCaptions } from "@features/games/types";
import { formatGameDate, getGameTeam, getSeason } from "@features/games/utils";
import { withBase } from "@utils/urlHandler";
import Scoreboard, { ScoreDigits } from "@components/scoreboard/Scoreboard";
import { TEAM_ORDER, TEAM_TITLES } from "./teams";
import "./gamesResults.css";

/** Only the displayed fields reach the island. */
export type ResultRow = Omit<GameResult, "poster" | "tournament">;

interface GamesResultsProps {
	games: ResultRow[];
	/** Captions written in the Studio, per season and team. */
	captions: SeasonCaptions;
	locale: Locale;
	currentSeason: string;
	labels: Translations["games"];
}

function getSeasons(games: ResultRow[], currentSeason: string): string[] {
	const seasons = new Set([
		currentSeason,
		...games.map((g) => getSeason(g.date)),
	]);
	return [...seasons].sort().reverse();
}

const GamesResults = ({
	games,
	captions,
	locale,
	currentSeason,
	labels,
}: GamesResultsProps) => {
	const seasons = getSeasons(games, currentSeason);
	// The three latest seasons start open. Shared by the three team panels:
	// the open seasons stay open when the team changes.
	const [openSeasons, setOpenSeasons] = useState<string[]>(seasons.slice(0, 3));

	return (
		<Tabs.Root className="games-results" defaultValue="A">
			<Tabs.List className="games-results__tabs" aria-label={labels.teamsLabel}>
				{TEAM_ORDER.map((team) => (
					<Tabs.Trigger key={team} value={team} className="games-tab">
						{labels.tabs[team]}
					</Tabs.Trigger>
				))}
			</Tabs.List>

			{TEAM_ORDER.map((team) => (
				<Tabs.Content key={team} value={team}>
					<Accordion.Root
						type="multiple"
						value={openSeasons}
						onValueChange={setOpenSeasons}
					>
						{seasons.map((season) => {
							const seasonGames = games
								.filter(
									(g) =>
										getGameTeam(g) === team && getSeason(g.date) === season,
								)
								.sort((a, b) => b.date.localeCompare(a.date));
							const isCurrent = season === currentSeason;
							const count = seasonGames.length;
							const caption = captions[season]?.[team];
							const summary = (
								<>
									<span className="season__name">
										{labels.season} {season}
									</span>
									<span className="season__meta">
										{isCurrent && (
											<span className="games-badge">
												{labels.currentSeason}
											</span>
										)}
										<span className="season__count">
											{count} {count > 1 ? labels.matchMany : labels.matchOne}
										</span>
									</span>
								</>
							);

							// Nothing to unfold: a plain row
							if (count === 0) {
								return (
									<div key={season} className="season">
										<div className="season__trigger is-static">
											{summary}
											{/* Empty slot: keeps the count aligned with the other rows */}
											<span className="season__chevron" aria-hidden="true" />
										</div>
									</div>
								);
							}

							return (
								<Accordion.Item key={season} value={season} className="season">
									<Accordion.Header className="season__header">
										<Accordion.Trigger className="season__trigger">
											{summary}
											<CaretDownIcon
												className="season__chevron"
												weight="bold"
												aria-hidden="true"
											/>
										</Accordion.Trigger>
									</Accordion.Header>

									<Accordion.Content className="season__content">
										<div className="games-board">
											<div className="games-board__band">
												{TEAM_TITLES[team] ?? labels.tabs[team]}
											</div>
											{caption && (
												<p className="games-board__caption">{caption}</p>
											)}

											{seasonGames.map((game) => (
												<GameRow
													key={game.id}
													game={game}
													locale={locale}
													detailsLabel={labels.details}
												/>
											))}
										</div>
									</Accordion.Content>
								</Accordion.Item>
							);
						})}
					</Accordion.Root>
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
};

export default GamesResults;

interface GameRowProps {
	game: ResultRow;
	locale: Locale;
	detailsLabel: string;
}

const GameRow = ({ game, locale, detailsLabel }: GameRowProps) => {
	const { rdbc, hainemy } = game;

	return (
		<article className="games-row">
			<div className="games-row__meta">
				<time className="games-row__date" dateTime={game.date}>
					{formatGameDate(game.date, locale === "fr" ? "fr-FR" : "en-US")}
				</time>
				<span className="games-row__stage">{game.event}</span>
				{game.detailsHref && (
					<a className="games-row__more" href={withBase(game.detailsHref)}>
						{detailsLabel}
					</a>
				)}
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
