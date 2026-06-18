import type { FeedItem } from "./types";

export function isExpired(feed: FeedItem): boolean {
	if (!feed.expiryDate) return false;
	return new Date() >= new Date(feed.expiryDate);
}

export function getDisplayFeeds(
	allFeeds: FeedItem[],
	spotIds: string[],
): FeedItem[] {
	const permanents = allFeeds.filter(
		(f) => f.isPermanent === true || f.expiryDate === null,
	);
	const usedIds = new Set(spotIds);
	const usedPermanentIds = new Set<string>();

	const results = spotIds.map((id) => {
		const feed = allFeeds.find((f) => f.id === id);
		if (!feed || isExpired(feed)) {
			const fallback =
				permanents.find(
					(p) => !usedIds.has(p.id) && !usedPermanentIds.has(p.id),
				) ?? permanents.find((p) => !usedPermanentIds.has(p.id));
			if (fallback) {
				usedPermanentIds.add(fallback.id);
				return fallback;
			}
			return null;
		}
		return feed;
	});

	return results.filter((f): f is FeedItem => f !== null);
}

export function formatFeedDate(isoDate: string, locale: "fr" | "en"): string {
	return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(isoDate));
}

export function getFeedDateParts(
	isoDate: string,
	locale: "fr" | "en",
): { day: string; month: string } {
	const [yearStr, monthStr, dayStr] = isoDate.split("-");
	// Use 15th at noon UTC to safely extract month name regardless of timezone
	const month = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
		month: "long",
		timeZone: "UTC",
	}).format(new Date(`${yearStr}-${monthStr}-15T12:00:00Z`));
	return { day: String(parseInt(dayStr, 10)), month };
}
