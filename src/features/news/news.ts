import type { SanityClient } from "sanity";
import { getSeason } from "@features/games/utils";
import type { Locale } from "@i18n/index";
import type { News } from "../../../sanity/sanity.types";
import type { NewsBody, NewsButton, NewsItem, NewsPractical } from "./types";

// Published news only: a news dated in the future shows up from the next build on
const NEWS_QUERY = `*[_type == "news" && defined(slug.current) && date <= now()] | order(date desc)`;

const WORDS_PER_MINUTE = 200;

type Localized<T> = { fr?: T; en?: T } | undefined;

// EN is optional in the Studio: an empty translation falls back to FR
const pick = (value: Localized<string>, locale: Locale): string | null =>
	value?.[locale]?.trim() || value?.fr?.trim() || null;

const pickBody = (value: Localized<NewsBody>, locale: Locale): NewsBody => {
	const translated = value?.[locale];
	return translated?.length ? translated : (value?.fr ?? []);
};

const countWords = (text: string): number =>
	text.split(/\s+/).filter(Boolean).length;

function getReadMinutes(lead: string, body: NewsBody): number {
	const bodyText = body
		.flatMap((member) =>
			member._type === "block"
				? (member.children ?? []).map((child) => child.text ?? "")
				: [],
		)
		.join(" ");
	return Math.max(
		1,
		Math.round(countWords(`${lead} ${bodyText}`) / WORDS_PER_MINUTE),
	);
}

function getPractical(news: News, locale: Locale): NewsPractical | null {
	const practical = {
		dates: pick(news.practical?.dates, locale),
		time: pick(news.practical?.time, locale),
		place: pick(news.practical?.place, locale),
		price: pick(news.practical?.price, locale),
	};
	return Object.values(practical).some(Boolean) ? practical : null;
}

function getButton(news: News, locale: Locale): NewsButton | null {
	const label = pick(news.button?.label, locale);
	const href = news.button?.href;
	if (!label || !href) return null;
	return { label, href, primary: news.button?.primary ?? false };
}

// Incomplete documents (missing required fields) are left out instead of breaking the page
function toNewsItem(news: News, locale: Locale): NewsItem | null {
	const title = pick(news.title, locale);
	const id = news.slug?.current;
	if (!title || !id || !news.date || !news.category || !news.author) {
		return null;
	}

	const base = {
		id,
		date: news.date,
		season: getSeason(news.date),
		category: news.category,
		title,
		author: news.author,
		button: getButton(news, locale),
	};

	if (news.format === "article") {
		const lead = pick(news.lead, locale);
		if (!lead || !news.cover?.asset) return null;
		const body = pickBody(news.body, locale);
		return {
			...base,
			format: "article",
			cover: news.cover,
			lead,
			practical: getPractical(news, locale),
			body,
			readMinutes: getReadMinutes(lead, body),
		};
	}

	const text = pick(news.text, locale);
	if (!text) return null;
	return {
		...base,
		format: "brief",
		text,
		image: news.image?.asset ? news.image : null,
	};
}

export const getNews = async (
	sanityClient: SanityClient,
	locale: Locale,
): Promise<NewsItem[]> => {
	const news = await sanityClient.fetch<News[]>(NEWS_QUERY);
	return news
		.map((item) => toNewsItem(item, locale))
		.filter((item): item is NewsItem => item !== null);
};
