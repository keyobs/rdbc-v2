import type { Locale } from "@i18n/index";

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
	theme: string;
	backgroundImage?: string | null;
	link?: FeedLink;
}

export interface FeedSettings {
	numberOfSpots: 3 | 4 | 5;
	spots: string[];
}
