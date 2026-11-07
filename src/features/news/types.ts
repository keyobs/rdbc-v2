import type { Article } from "../../../sanity/sanity.types";

export type NewsCategory = NonNullable<Article["category"]>;
export type NewsImage = NonNullable<Article["image"]>;
export type NewsCover = NonNullable<Article["cover"]>;
export type NewsBody = NonNullable<NonNullable<Article["body"]>["fr"]>;
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
	/** Slug: also the anchor of the shareable link (/derbylife#slug) */
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
