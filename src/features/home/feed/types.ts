import type { Locale } from "@i18n/index";
import type { Feed } from "../../../../sanity/sanity.types";
import type { FeedThemeSlug } from "./themes";

export type { Locale };

export type FeedIconKey = NonNullable<Feed["icon"]>;

/** A spot of the home feed: its colours, and the feed the editors placed there */
export interface FeedSpot {
	theme: FeedThemeSlug;
	feedId: string | null;
}

export interface LocalizedString {
	fr: string;
	en: string;
}

export interface FeedLink {
	href: string;
	label: LocalizedString;
}

export interface FeedItem {
	id: string;
	name: string;
	creationDate: string;
	date: string;
	expiryDate: string | null;
	isPermanent?: boolean;
	title: LocalizedString;
	mobileTitle?: LocalizedString;
	description: LocalizedString;
	/** Permanent feeds only: shown in place of the date */
	icon: FeedIconKey | null;
	/** Permanent feeds only: overrides the colours of the spot */
	forcedTheme: FeedThemeSlug | null;
	backgroundImage?: string | null;
	link?: FeedLink;
}

/** A feed as displayed: the colours of its spot are resolved */
export interface DisplayedFeed extends FeedItem {
	theme: FeedThemeSlug;
}
