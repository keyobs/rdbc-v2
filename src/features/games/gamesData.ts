import type { SanityClient } from "sanity";
import type { Locale } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import type { Club, Competition, Season } from "../../../sanity/sanity.types";
import { HOME_TEAM_NAMES, RDBC_LOGO, TRAVEL_TEAM_NAMES } from "./rdbcTeams";
import type {
	GameResult,
	SeasonCaptions,
	TeamInfo,
	UpcomingGame,
} from "./types";

export interface GamesData {
	results: GameResult[];
	upcoming: UpcomingGame[];
	captions: SeasonCaptions;
}

type CompetitionGame = NonNullable<Competition["games"]>[number];

const COMPETITIONS_QUERY = `*[_type == "competition"]`;
const CLUBS_QUERY = `*[_type == "club"]`;
const SEASONS_QUERY = `*[_type == "season" && defined(name)]`;

// Displayed sizes: 2.375rem logo, 7.5rem × 4.75rem poster (×2 for sharp screens)
const LOGO_SIZE = 96;
const POSTER_WIDTH = 240;
const POSTER_HEIGHT = 152;

type Localized = { fr?: string; en?: string } | undefined;

// EN is optional in the Studio: an empty translation falls back to FR
const pick = (value: Localized, locale: Locale): string =>
	value?.[locale]?.trim() || value?.fr?.trim() || "";

/** Local date-time: noon when the time is unknown, so the day never shifts across time zones. */
const toLocalDateTime = (date: string, time?: string): string =>
	`${date}T${time ?? "12:00"}:00`;

const isPlayed = (game: CompetitionGame): boolean =>
	game.rdbcScore !== undefined && game.opponentScore !== undefined;

function toOpponent(club: Club | undefined): Omit<TeamInfo, "score"> | null {
	if (!club?.name) return null;
	return {
		name: club.name,
		// Clubs without a team name repeat the league: no need to show it twice
		league: club.league && club.league !== club.name ? club.league : undefined,
		logo: club.logo?.asset
			? urlFor(club.logo)
					.width(LOGO_SIZE)
					.height(LOGO_SIZE)
					.fit("max")
					.auto("format")
					.url()
			: null,
	};
}

/** Both sides of a game, `null` when the document is incomplete. */
function getSides(
	competition: Competition,
	game: CompetitionGame,
	clubs: Map<string, Club>,
): { rdbc: Omit<TeamInfo, "score">; opponent: Omit<TeamInfo, "score"> } | null {
	if (competition.team === "home") {
		if (!game.homeTeam || !game.awayTeam) return null;
		return {
			rdbc: {
				name: HOME_TEAM_NAMES[game.homeTeam],
				travelTeam: "home",
				logo: RDBC_LOGO,
			},
			opponent: { name: HOME_TEAM_NAMES[game.awayTeam], logo: RDBC_LOGO },
		};
	}
	if (competition.team !== "A" && competition.team !== "B") return null;
	const opponent = toOpponent(clubs.get(game.opponent?._ref ?? ""));
	if (!opponent) return null;
	return {
		rdbc: {
			name: TRAVEL_TEAM_NAMES[competition.team],
			travelTeam: competition.team,
			logo: RDBC_LOGO,
		},
		opponent,
	};
}

function getCaptions(seasons: Season[], locale: Locale): SeasonCaptions {
	return Object.fromEntries(
		seasons.map((season) => [
			season.name,
			{
				A: pick(season.captionA, locale) || undefined,
				B: pick(season.captionB, locale) || undefined,
				home: pick(season.captionHome, locale) || undefined,
			},
		]),
	);
}

// Incomplete documents and games (missing team, opponent or date) are left out
export const getGamesData = async (
	sanityClient: SanityClient,
	locale: Locale,
	now = new Date(),
): Promise<GamesData> => {
	const [competitions, clubList, seasons] = await Promise.all([
		sanityClient.fetch<Competition[]>(COMPETITIONS_QUERY),
		sanityClient.fetch<Club[]>(CLUBS_QUERY),
		sanityClient.fetch<Season[]>(SEASONS_QUERY),
	]);
	const clubs = new Map(clubList.map((club) => [club._id, club]));
	const today = toLocalDateTime(now.toLocaleDateString("sv-SE"), "00:00");

	const results: GameResult[] = [];
	const upcoming: UpcomingGame[] = [];

	for (const competition of competitions) {
		// Empty outside the championship and WFTDA games: nothing is shown next to the game
		const competitionName = pick(competition.competition, locale);
		const eventName = pick(competition.event, locale);
		if (!competition.team) continue;

		const poster = competition.poster?.asset
			? urlFor(competition.poster)
					.width(POSTER_WIDTH)
					.height(POSTER_HEIGHT)
					.fit("crop")
					.auto("format")
					.url()
			: undefined;

		for (const game of competition.games ?? []) {
			const sides = getSides(competition, game, clubs);
			if (!game.date || !sides) continue;
			const id = `${competition._id}-${game._key}`;
			const date = toLocalDateTime(game.date, game.time);

			if (isPlayed(game)) {
				results.push({
					id,
					date,
					tournament: competitionName,
					event: eventName,
					rdbc: { ...sides.rdbc, score: game.rdbcScore ?? 0 },
					hainemy: { ...sides.opponent, score: game.opponentScore ?? 0 },
					poster,
				});
			} else if (date >= today) {
				// A game without scores whose day is over is not shown at all
				upcoming.push({
					id,
					date,
					time: game.time ?? null,
					team: competition.team,
					competition: competitionName,
					event: eventName,
					venue: competition.venue ?? null,
					isHome:
						competition.team === "home" || competition.location === "home",
					rdbc: sides.rdbc,
					opponent: sides.opponent,
				});
			}
		}
	}

	return { results, upcoming, captions: getCaptions(seasons, locale) };
};
