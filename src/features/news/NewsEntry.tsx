import * as Accordion from "@radix-ui/react-accordion";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { MapPinIcon } from "@phosphor-icons/react/dist/csr/MapPin";
import { TicketIcon } from "@phosphor-icons/react/dist/csr/Ticket";
import { useState } from "react";
import type { Locale, Translations } from "@i18n/index";
import { urlFor } from "@utils/sanityImage";
import NewsBody from "./NewsBody";
import type { NewsArticle, NewsBrief, NewsItem } from "./types";

interface NewsEntryProps {
	item: NewsItem;
	locale: Locale;
	labels: Translations["news"];
}

const getDateLocale = (locale: Locale): string =>
	locale === "fr" ? "fr-FR" : "en-US";

const NewsEntry = ({ item, locale, labels }: NewsEntryProps) => {
	const [copied, setCopied] = useState(false);
	const isArticle = item.format === "article";

	const copyLink = async () => {
		const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
		await navigator.clipboard.writeText(url);
		setCopied(true);
	};

	return (
		<Accordion.Item
			value={item.id}
			id={item.id}
			className={isArticle ? "entry article" : "entry brief"}
		>
			<Accordion.Header className="entry-header">
				<Accordion.Trigger className="trigger">
					{item.format === "article" ? (
						<ArticleHeading item={item} locale={locale} labels={labels} />
					) : (
						<BriefHeading item={item} locale={locale} labels={labels} />
					)}
					<CaretDownIcon className="caret" weight="bold" aria-hidden="true" />
				</Accordion.Trigger>
			</Accordion.Header>

			{/* Always rendered: closed news stay in the static HTML (indexing, no-JS) */}
			<Accordion.Content className="entry-content" forceMount>
				<div className="inner">
					{item.format === "article" ? (
						<ArticleContent item={item} labels={labels} />
					) : (
						<BriefContent item={item} />
					)}

					{item.button && (
						<a
							className={item.button.primary ? "cta primary" : "cta"}
							href={item.button.href}
						>
							{item.button.label}
						</a>
					)}

					<footer className="entry-footer">
						<span>{item.author}</span>
						<button type="button" className="share" onClick={copyLink}>
							{copied ? (
								<CheckIcon weight="bold" aria-hidden="true" />
							) : (
								<LinkSimpleIcon weight="bold" aria-hidden="true" />
							)}
							<span aria-live="polite">
								{copied ? labels.linkCopied : labels.copyLink}
							</span>
						</button>
					</footer>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	);
};

export default NewsEntry;

interface BriefHeadingProps {
	item: NewsBrief;
	locale: Locale;
	labels: Translations["news"];
}

const BriefHeading = ({ item, locale, labels }: BriefHeadingProps) => {
	const date = new Date(item.date);
	const dateLocale = getDateLocale(locale);

	return (
		<>
			<time className="date" dateTime={item.date}>
				<span className="day">
					{new Intl.DateTimeFormat(dateLocale, { day: "2-digit" }).format(date)}
				</span>
				<span className="month">
					{new Intl.DateTimeFormat(dateLocale, {
						month: "short",
						year: "numeric",
					}).format(date)}
				</span>
			</time>
			<span className="heading">
				<span className="meta">
					<span className="sticker">{labels.categories[item.category]}</span>
					<span className="kind">{labels.brief}</span>
				</span>
				<span className="title">{item.title}</span>
			</span>
		</>
	);
};

interface ArticleHeadingProps {
	item: NewsArticle;
	locale: Locale;
	labels: Translations["news"];
}

const ArticleHeading = ({ item, locale, labels }: ArticleHeadingProps) => (
	<>
		{/* Decorative: the title next to it names the news */}
		<img
			className="thumb"
			src={urlFor(item.cover)
				.width(192)
				.height(192)
				.fit("crop")
				.auto("format")
				.url()}
			alt=""
			width={96}
			height={96}
		/>
		<span className="heading">
			<span className="meta">
				<time dateTime={item.date}>
					{new Intl.DateTimeFormat(getDateLocale(locale), {
						day: "numeric",
						month: "short",
						year: "numeric",
					}).format(new Date(item.date))}
				</time>
				<span className="sticker">{labels.categories[item.category]}</span>
				<span className="kind">
					{item.readMinutes} {labels.readTime}
				</span>
			</span>
			<span className="title">{item.title}</span>
		</span>
	</>
);

interface BriefContentProps {
	item: NewsBrief;
}

const BriefContent = ({ item }: BriefContentProps) => (
	<>
		<p className="text">{item.text}</p>
		{item.image && (
			<img
				className="image"
				src={urlFor(item.image).width(900).fit("max").auto("format").url()}
				alt={item.image.alt ?? ""}
				loading="lazy"
			/>
		)}
	</>
);

interface ArticleContentProps {
	item: NewsArticle;
	labels: Translations["news"];
}

const ArticleContent = ({ item, labels }: ArticleContentProps) => {
	const { practical } = item;

	return (
		<>
			<p className="lead">{item.lead}</p>

			{practical && (
				<section className="practical" aria-label={labels.practical}>
					<span className="sticker">{labels.practical}</span>
					<dl>
						{practical.dates && (
							<div>
								<dt>
									<CalendarBlankIcon weight="bold" aria-hidden="true" />
									<span className="sr-only">{labels.dates}</span>
								</dt>
								<dd>{practical.dates}</dd>
							</div>
						)}
						{practical.time && (
							<div>
								<dt>
									<ClockIcon weight="bold" aria-hidden="true" />
									<span className="sr-only">{labels.time}</span>
								</dt>
								<dd>{practical.time}</dd>
							</div>
						)}
						{practical.place && (
							<div>
								<dt>
									<MapPinIcon weight="bold" aria-hidden="true" />
									<span className="sr-only">{labels.place}</span>
								</dt>
								<dd>{practical.place}</dd>
							</div>
						)}
						{practical.price && (
							<div>
								<dt>
									<TicketIcon weight="bold" aria-hidden="true" />
									<span className="sr-only">{labels.price}</span>
								</dt>
								<dd>{practical.price}</dd>
							</div>
						)}
					</dl>
				</section>
			)}

			{item.body.length > 0 && <NewsBody value={item.body} labels={labels} />}
		</>
	);
};
