import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FeedItem, Locale } from "./types";
import { getTheme } from "./themes";
import { getFeedDateParts, getFeedLinkProps } from "./feedUtils";
import "./feed.css";
import "./feedMobile.css";

interface FeedMobileProps {
	feeds: FeedItem[];
	locale: Locale;
	autoPlay?: boolean;
	interval?: number;
}

interface FeedMobileCSSProperties extends React.CSSProperties {
	"--c0": string;
	"--c1": string;
	"--c2": string;
	"--base": string;
}

const FADE = { duration: 0.2 } as const;

const MOBILE_TITLE_MAX = 80;

function getMobileTitle(feed: FeedItem, locale: Locale): string {
	const raw = feed.mobileTitle?.[locale] ?? feed.title[locale];
	return raw.length > MOBILE_TITLE_MAX
		? `${raw.slice(0, MOBILE_TITLE_MAX)}…`
		: raw;
}

const FeedMobile = ({
	feeds,
	locale,
	autoPlay = true,
	interval = 5000,
}: FeedMobileProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const touchStartX = useRef(0);
	const touchStartY = useRef(0);

	const clearTimer = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const startTimer = useCallback(() => {
		clearTimer();
		intervalRef.current = setInterval(() => {
			setActiveIndex((i) => (i + 1) % feeds.length);
		}, interval);
	}, [clearTimer, feeds.length, interval]);

	useEffect(() => {
		if (autoPlay) startTimer();
		return clearTimer;
	}, [autoPlay, startTimer, clearTimer]);

	const handlePillClick = (index: number) => {
		setActiveIndex(index);
		if (autoPlay) startTimer();
	};

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			touchStartX.current = e.clientX;
			touchStartY.current = e.clientY;
			clearTimer();
		},
		[clearTimer],
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const dx = e.clientX - touchStartX.current;
			const dy = e.clientY - touchStartY.current;
			if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
				setActiveIndex((i) =>
					dx < 0
						? (i + 1) % feeds.length
						: (i - 1 + feeds.length) % feeds.length,
				);
			}
			if (autoPlay) startTimer();
		},
		[autoPlay, feeds.length, startTimer],
	);

	const handlePointerCancel = useCallback(() => {
		if (autoPlay) startTimer();
	}, [autoPlay, startTimer]);

	const activeFeed = feeds[activeIndex];
	const activeTheme = getTheme(activeFeed.theme);

	// A photo replaces the gradient layer, the theme colours stay as fallback
	const cardStyle = {
		...(activeFeed.backgroundImage && {
			backgroundImage: `url(${activeFeed.backgroundImage})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
		}),
		"--c0": activeTheme.c0,
		"--c1": activeTheme.c1,
		"--c2": activeTheme.c2,
		"--base": activeTheme.base,
	} as FeedMobileCSSProperties;

	const dateParts = activeFeed.isPermanent
		? null
		: getFeedDateParts(activeFeed.date, locale);

	return (
		<div className="feed-mobile">
			<div
				className="feed-mobile__card"
				style={cardStyle}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerCancel}
			>
				{activeFeed.backgroundImage && (
					<div className="feed-mobile__overlay" aria-hidden="true" />
				)}

				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={activeFeed.id}
						className={`feed-mobile__content${dateParts ? "" : " feed-mobile__content--no-stamp"}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={FADE}
					>
						{dateParts && (
							<time className="feed__stamp" dateTime={activeFeed.date}>
								<span className="feed__stamp-day">{dateParts.day}</span>
								<span className="feed__stamp-month">{dateParts.month}</span>
							</time>
						)}
						<h2 className="feed-mobile__title">
							{getMobileTitle(activeFeed, locale)}
						</h2>
						<p className="feed-mobile__description">
							{activeFeed.description[locale]}
						</p>
						{activeFeed.link && (
							<a
								className="feed__cta"
								{...getFeedLinkProps(activeFeed.link.href)}
							>
								{activeFeed.link.label[locale]}
							</a>
						)}
					</motion.div>
				</AnimatePresence>
				<div className="feed__bar" aria-hidden="true" />
			</div>

			<ul className="feed-mobile__dots" aria-label="Actualités">
				{feeds.map((feed, i) => {
					const theme = getTheme(feed.theme);
					const isActive = i === activeIndex;
					return (
						<li key={feed.id}>
							<button
								type="button"
								aria-label={getMobileTitle(feed, locale)}
								aria-current={isActive ? "true" : undefined}
								className="feed-mobile__dot"
								onClick={() => handlePillClick(i)}
							>
								<motion.span
									className="feed-mobile__dot-mark"
									animate={{
										backgroundColor: theme.c0,
										scale: isActive ? 1.5 : 1,
										opacity: isActive ? 1 : 0.45,
									}}
									transition={{ type: "spring", stiffness: 300, damping: 28 }}
									aria-hidden="true"
								/>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default FeedMobile;
