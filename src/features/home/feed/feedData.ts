import type { SanityClient } from "sanity";
import { urlFor } from "@utils/sanityImage";
import type { Feed, FeedSettings } from "../../../../sanity/sanity.types";
import { THEME_ORDER } from "./themes";
import type { FeedItem, FeedSpot, LocalizedString } from "./types";

export interface FeedData {
	feeds: FeedItem[];
	/** The 4 spots, in display order */
	spots: FeedSpot[];
}

// Spot names match sanity/schemaTypes/feedSettings.ts
const SPOT_NAMES = ["spot1", "spot2", "spot3", "spot4"] as const;

const SETTINGS_QUERY = `*[_id == "feedSettings"][0]`;

// Placed feeds plus every permanent one, newest first: the fallback for expired spots
const FEEDS_QUERY = `*[_type == "feed" && (isPermanent == true || _id in $placedIds)] | order(_createdAt desc)`;

// Fallback order of permanent feeds: priority 1 first, no priority last, then newest first
const byPriority = (a: Feed, b: Feed): number =>
	(a.priority ?? Number.POSITIVE_INFINITY) -
	(b.priority ?? Number.POSITIVE_INFINITY);

const BACKGROUND_WIDTH = 1600;

type Localized = { fr?: string; en?: string } | undefined;

// EN is optional in the Studio: an empty translation falls back to FR
const localize = (value: Localized): LocalizedString | null => {
	const fr = value?.fr?.trim();
	if (!fr) return null;
	return { fr, en: value?.en?.trim() || fr };
};

// Incomplete documents (missing required fields) are left out instead of breaking the feed
function toFeedItem(feed: Feed): FeedItem | null {
	const title = localize(feed.title);
	const description = localize(feed.description);
	const isPermanent = feed.isPermanent === true;
	if (!feed.name || !title || !description) return null;
	if (isPermanent ? !feed.icon : !feed.date || !feed.expiryDate) return null;

	const linkLabel = localize(feed.link?.label);
	return {
		id: feed._id,
		name: feed.name,
		creationDate: feed._createdAt,
		// Hidden fields may keep an old value: only the fields of the feed kind count
		date: isPermanent ? "" : (feed.date ?? ""),
		expiryDate: isPermanent ? null : (feed.expiryDate ?? null),
		isPermanent,
		title,
		mobileTitle: localize(feed.mobileTitle) ?? undefined,
		description,
		icon: isPermanent ? (feed.icon ?? null) : null,
		forcedTheme: isPermanent ? (feed.forcedTheme ?? null) : null,
		backgroundImage: feed.backgroundImage?.asset
			? urlFor(feed.backgroundImage)
					.width(BACKGROUND_WIDTH)
					.fit("max")
					.auto("format")
					.url()
			: null,
		link:
			linkLabel && feed.link?.href
				? { href: feed.link.href, label: linkLabel }
				: undefined,
	};
}

export const getFeedData = async (
	sanityClient: SanityClient,
): Promise<FeedData> => {
	const settings = await sanityClient.fetch<FeedSettings | null>(
		SETTINGS_QUERY,
	);
	const spots = SPOT_NAMES.map((name, index) => ({
		theme: settings?.[name]?.theme ?? THEME_ORDER[index],
		feedId: settings?.[name]?.feed?._ref ?? null,
	}));
	const placedIds = spots.flatMap(({ feedId }) => (feedId ? [feedId] : []));
	const feeds = await sanityClient.fetch<Feed[]>(FEEDS_QUERY, { placedIds });
	return {
		spots,
		feeds: feeds
			.toSorted(byPriority)
			.map(toFeedItem)
			.filter((feed): feed is FeedItem => feed !== null),
	};
};
