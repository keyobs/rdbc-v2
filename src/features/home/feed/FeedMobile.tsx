import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FeedItem, Locale } from "./types";
import { getTheme } from "./themes";
import { formatFeedDate } from "./feedUtils";
import { withBase } from "@utils/urlHandler";
import BloomButton from "@components/buttons/BloomButton";
import "./feedMobile.css";

interface FeedMobileProps {
	feeds: FeedItem[];
	locale: Locale;
	autoPlay?: boolean;
	interval?: number;
}

interface FeedMobileCSSProperties extends React.CSSProperties {
	"--feed-accent": string;
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

	const activeFeed = feeds[activeIndex];
	const activeTheme = getTheme(activeFeed.theme);

	const bgStyle = activeFeed.backgroundImage
		? {
				backgroundImage: `url(${activeFeed.backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}
		: {
				background: `linear-gradient(160deg, ${activeTheme.background}, ${activeTheme.backgroundAlt})`,
			};

	return (
		<div className="feed-mobile">
			<div className="feed-mobile__card" style={bgStyle}>
				{activeFeed.backgroundImage && (
					<div className="feed-mobile__overlay" aria-hidden="true" />
				)}

				<AnimatePresence mode="wait">
					<motion.div
						key={activeFeed.id}
						className="feed-mobile__content"
						style={
							{
								"--feed-accent": activeTheme.accent,
							} as FeedMobileCSSProperties
						}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={FADE}
					>
						<time
							className="feed-mobile__date"
							style={{ color: activeTheme.muted }}
						>
							{formatFeedDate(activeFeed.date, locale)}
						</time>
						<h3
							className="feed-mobile__title"
							style={{ color: activeTheme.text }}
						>
							{getMobileTitle(activeFeed, locale)}
						</h3>
						<p
							className="feed-mobile__description"
							style={{ color: activeTheme.text }}
						>
							{activeFeed.description[locale]}
						</p>
						{activeFeed.link && (
							<BloomButton
								href={
									activeFeed.link.href.startsWith("http")
										? activeFeed.link.href
										: withBase(activeFeed.link.href)
								}
								borderGradientColor={activeTheme.accent}
								background="transparent"
								fontColor={activeTheme.accent}
								target={
									activeFeed.link.href.startsWith("http") ? "_blank" : undefined
								}
								rel={
									activeFeed.link.href.startsWith("http")
										? "noopener noreferrer"
										: undefined
								}
							>
								{activeFeed.link.label[locale]}
							</BloomButton>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			<div
				className="feed-mobile__pills"
				role="tablist"
				aria-label="Actualités"
			>
				{feeds.map((feed, i) => {
					const theme = getTheme(feed.theme);
					const isActive = i === activeIndex;
					return (
						<motion.button
							key={feed.id}
							role="tab"
							aria-selected={isActive}
							aria-label={feed.title[locale]}
							className="feed-mobile__pill"
							onClick={() => handlePillClick(i)}
							animate={{ opacity: isActive ? 1 : 0.4 }}
							transition={{ type: "spring", stiffness: 300, damping: 28 }}
						>
							<motion.span
								className="feed-mobile__pill-dot"
								animate={{ backgroundColor: theme.accent }}
								transition={{ duration: 0.2 }}
								aria-hidden="true"
							/>
						</motion.button>
					);
				})}
			</div>
		</div>
	);
};

export default FeedMobile;
