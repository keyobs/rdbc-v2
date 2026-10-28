import { withBase } from "@utils/urlHandler";
import type { DisplayedFeed, FeedItem, FeedSpot } from "./types";

/** `expiryDate` is a "YYYY-MM-DD" day: the feed stays until the next local midnight. */
export function isExpired(feed: FeedItem, now = new Date()): boolean {
	if (!feed.expiryDate) return false;
	const [year, month, day] = feed.expiryDate.split("-").map(Number);
	return now >= new Date(year, month - 1, day + 1);
}

/**
 * Feeds to display, each with the colours of its spot (or its own forced colours).
 * `allFeeds` is expected in fallback order (see `feedData.ts`): permanent feeds are
 * used in that order, and a permanent feed is never displayed twice.
 */
export function getDisplayFeeds(
	allFeeds: FeedItem[],
	spots: FeedSpot[],
	now = new Date(),
): DisplayedFeed[] {
	const placedIds = new Set(spots.map((spot) => spot.feedId));
	const availablePermanents = allFeeds.filter(
		(feed) => feed.isPermanent && !placedIds.has(feed.id),
	);

	const display = (feed: FeedItem, spot: FeedSpot): DisplayedFeed => ({
		...feed,
		theme: feed.forcedTheme ?? spot.theme,
	});

	const fillWithPermanent = (spot: FeedSpot): DisplayedFeed | null => {
		const permanent = availablePermanents.shift();
		return permanent ? display(permanent, spot) : null;
	};

	const filledSpots = spots.filter((spot) => spot.feedId !== null);
	// No feed placed by the editors: permanent feeds fill every spot
	const results =
		filledSpots.length === 0
			? spots.map(fillWithPermanent)
			: filledSpots.map((spot) => {
					const feed = allFeeds.find(({ id }) => id === spot.feedId);
					return feed && !isExpired(feed, now)
						? display(feed, spot)
						: fillWithPermanent(spot);
				});

	return results.filter((feed): feed is DisplayedFeed => feed !== null);
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

/** "dd.MM" from a "YYYY-MM-DD" day. */
export function getFeedShortDate(isoDate: string): string {
	const [, monthStr, dayStr] = isoDate.split("-");
	return `${dayStr.padStart(2, "0")}.${monthStr}`;
}

interface FeedLinkProps {
	href: string;
	target?: string;
	rel?: string;
}

export function getFeedLinkProps(href: string): FeedLinkProps {
	if (href.startsWith("/")) return { href: withBase(href) };
	if (href.startsWith("http")) {
		return { href, target: "_blank", rel: "noopener noreferrer" };
	}
	// mailto: and other schemes
	return { href };
}
