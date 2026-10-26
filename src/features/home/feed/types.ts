import type { Locale } from "@i18n/index";
import type { FeedThemeSlug } from "./themes";

export type { Locale };

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
	theme: FeedThemeSlug;
	backgroundImage?: string | null;
	link?: FeedLink;
}

export interface FeedSettings {
	numberOfSpots: 4;
	spots: string[];
}
