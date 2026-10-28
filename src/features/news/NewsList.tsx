import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import type { Locale, Translations } from "@i18n/index";
import NewsEntry from "./NewsEntry";
import type { NewsCategory, NewsItem } from "./types";

interface NewsListProps {
	/** Most recent first */
	items: NewsItem[];
	currentSeason: string;
	locale: Locale;
	labels: Translations["news"];
}

type Filter = NewsCategory | "all";

const NewsList = ({ items, currentSeason, locale, labels }: NewsListProps) => {
	// The most recent news starts open, the others closed
	const [openIds, setOpenIds] = useState<string[]>(
		items[0] ? [items[0].id] : [],
	);
	const [filter, setFilter] = useState<Filter>("all");
	const [showPast, setShowPast] = useState(false);

	// Shared link (/news#slug): open that news, reveal its season and scroll to it
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		const target = items.find((item) => item.id === id);
		if (!target) return;
		setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
		if (target.season !== currentSeason) setShowPast(true);
		requestAnimationFrame(() =>
			document.getElementById(id)?.scrollIntoView({ block: "start" }),
		);
	}, [items, currentSeason]);

	// Only the categories that have news are offered as filters
	const categories = (Object.keys(labels.categories) as NewsCategory[]).filter(
		(category) => items.some((item) => item.category === category),
	);
	const filters: Filter[] = ["all", ...categories];

	const seasons = [
		...new Set([currentSeason, ...items.map((item) => item.season)]),
	]
		.sort()
		.reverse();
	const visibleSeasons = showPast ? seasons : [currentSeason];
	const filtered = items.filter(
		(item) => filter === "all" || item.category === filter,
	);

	return (
		<div className="news-list">
			{categories.length > 1 && (
				<fieldset className="filters">
					<legend className="sr-only">{labels.filterLabel}</legend>
					{filters.map((key) => (
						<button
							key={key}
							type="button"
							className="chip"
							aria-pressed={filter === key}
							onClick={() => setFilter(key)}
						>
							{key === "all" ? labels.all : labels.categories[key]}
						</button>
					))}
				</fieldset>
			)}

			<Accordion.Root
				className="seasons"
				type="multiple"
				value={openIds}
				onValueChange={setOpenIds}
			>
				{visibleSeasons.map((season) => {
					const seasonItems = filtered.filter((item) => item.season === season);
					return (
						<section
							key={season}
							className="season"
							aria-labelledby={`season-${season}`}
						>
							<h2 className="season-title" id={`season-${season}`}>
								{labels.season} {season}
							</h2>
							{seasonItems.length === 0 ? (
								<p className="empty">
									{filter === "all" ? labels.emptySeason : labels.emptyCategory}
								</p>
							) : (
								seasonItems.map((item) => (
									<NewsEntry
										key={item.id}
										item={item}
										locale={locale}
										labels={labels}
									/>
								))
							)}
						</section>
					);
				})}
			</Accordion.Root>

			{seasons.length > 1 && (
				<button
					type="button"
					className="past"
					aria-expanded={showPast}
					onClick={() => setShowPast((shown) => !shown)}
				>
					{showPast ? labels.hidePastSeasons : labels.pastSeasons}
				</button>
			)}
		</div>
	);
};

export default NewsList;
