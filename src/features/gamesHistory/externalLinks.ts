const FLATTRACKSTATS_RANKINGS = "https://flattrackstats.com/rankings/";

export const MYROLLERDERBY_URL = "https://www.myrollerderby.com/";

export const INTERLEAGUE_EMAIL = "interleague@rollerderbybordeaux.fr";

/** Local calendar day as YYYY-MM-DD. */
export function toIsoDay(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

/** Last Sunday strictly before the given date (a Sunday gives the one a week earlier). */
export function getPreviousSunday(date: Date): Date {
	const sunday = new Date(date);
	sunday.setDate(date.getDate() - (date.getDay() || 7));
	return sunday;
}

/** Women's European rankings as of the given day (YYYY-MM-DD). */
export function getFlatTrackStatsUrl(isoDay: string): string {
	const url = new URL(FLATTRACKSTATS_RANKINGS);
	url.searchParams.set("system", "women");
	url.searchParams.set("region", "europe");
	url.searchParams.set("date", isoDay);
	return url.toString();
}
