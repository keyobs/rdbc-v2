import { getFlatTrackStatsUrl } from "./externalLinks";

export const FLATTRACKSTATS_TEAM_URL =
	"https://flattrackstats.com/teams/roller-derby-bordeaux/";

const WFTDA_RANKINGS_URL = `${FLATTRACKSTATS_TEAM_URL}rankings/wftda/`;
// Row id of the club in the FlatTrackStats rankings table
const TEAM_ROW_ID = "team-7737";
const FETCH_TIMEOUT_MS = 10_000;

/** A missing value (site down, page changed, ranking not published yet) is null. */
export interface TeamRanking {
	europeRank: number | null;
	europeRating: number | null;
	wftdaRank: number | null;
}

async function fetchHtml(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
		// A ranking date not published yet answers 400: never fall back to older data
		if (!response.ok) return null;
		return await response.text();
	} catch {
		return null;
	}
}

/** Rank and rating of the club in the women's European rankings table. */
export function parseEuropeRanking(
	html: string,
): Pick<TeamRanking, "europeRank" | "europeRating"> {
	const row = html.match(
		new RegExp(`<tr id="${TEAM_ROW_ID}">([\\s\\S]*?)</tr>`),
	)?.[1];
	// First two cells: rank, then rating
	const [rank, rating] = [...(row ?? "").matchAll(/data-v="([\d.]+)"/g)].map(
		(match) => Number(match[1]),
	);
	return {
		europeRank: Number.isInteger(rank) ? rank : null,
		europeRating: Number.isFinite(rating) ? rating : null,
	};
}

/** Current WFTDA world rank, shown as "Current: #323" on the team page. */
export function parseWftdaRank(html: string): number | null {
	const rank = html.match(/Current:<\/span>\s*<b[^>]*>#(\d+)<\/b>/)?.[1];
	return rank ? Number(rank) : null;
}

/** Fetched at build time; each value falls back to null on its own. */
export async function getTeamRanking(isoDay: string): Promise<TeamRanking> {
	const [europeHtml, wftdaHtml] = await Promise.all([
		fetchHtml(getFlatTrackStatsUrl(isoDay)),
		fetchHtml(WFTDA_RANKINGS_URL),
	]);
	return {
		...(europeHtml
			? parseEuropeRanking(europeHtml)
			: { europeRank: null, europeRating: null }),
		wftdaRank: wftdaHtml ? parseWftdaRank(wftdaHtml) : null,
	};
}
