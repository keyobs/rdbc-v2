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
