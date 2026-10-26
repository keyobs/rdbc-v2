import { withBase } from "@utils/urlHandler";
import type { FeedItem, Locale } from "./types";

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

/** "dd.MM" for dated feeds, a short label for permanent ones. */
export function getFeedShortDate(feed: FeedItem, locale: Locale): string {
	if (feed.isPermanent) return locale === "fr" ? "Perm." : "Ongoing";
	const [, monthStr, dayStr] = feed.date.split("-");
	return `${dayStr.padStart(2, "0")}.${monthStr}`;
}

interface FeedLinkProps {
	href: string;
	target?: string;
	rel?: string;
}

export function getFeedLinkProps(href: string): FeedLinkProps {
	if (href.startsWith("http")) {
		return { href, target: "_blank", rel: "noopener noreferrer" };
	}
	return { href: withBase(href) };
}
