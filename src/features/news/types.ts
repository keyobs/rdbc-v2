import type { News } from "../../../sanity/sanity.types";

export type NewsCategory = NonNullable<News["category"]>;
export type NewsImage = NonNullable<News["image"]>;
export type NewsCover = NonNullable<News["cover"]>;
export type NewsBody = NonNullable<NonNullable<News["body"]>["fr"]>;
export type NewsBodyMember = NewsBody[number];

export interface NewsPractical {
	dates: string | null;
	time: string | null;
	place: string | null;
	price: string | null;
}

export interface NewsButton {
	label: string;
	href: string;
	/** Pink button, for critical actions (sign-up, tickets…) */
	primary: boolean;
}

interface NewsBase {
	/** Slug: also the anchor of the shareable link (/news#slug) */
	id: string;
	date: string;
	season: string;
	category: NewsCategory;
	title: string;
	author: string;
	button: NewsButton | null;
}

export interface NewsBrief extends NewsBase {
	format: "brief";
	text: string;
	image: NewsImage | null;
}

export interface NewsArticle extends NewsBase {
	format: "article";
	cover: NewsCover;
	lead: string;
	practical: NewsPractical | null;
	body: NewsBody;
	readMinutes: number;
}

export type NewsItem = NewsBrief | NewsArticle;
