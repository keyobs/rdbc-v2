import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { FeedItem, Locale } from "./types";
import { getTheme } from "./themes";
import { formatFeedDate } from "./feedUtils";
import { withBase } from "@utils/urlHandler";
import BloomButton from "@components/buttons/BloomButton";
import "./feedDesktop.css";

interface FeedDesktopProps {
	feeds: FeedItem[];
	locale: Locale;
	autoPlay?: boolean;
	interval?: number;
}

interface FeedCSSProperties extends React.CSSProperties {
	"--feed-text": string;
	"--feed-accent": string;
	"--feed-muted": string;
}

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

const FeedDesktop = ({
	feeds,
	locale,
	autoPlay = true,
	interval = 5000,
}: FeedDesktopProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
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
		if (autoPlay && !isPaused) {
			startTimer();
		} else {
			clearTimer();
		}
		return clearTimer;
	}, [autoPlay, isPaused, startTimer, clearTimer]);

	const handleClick = (index: number) => {
		if (index === activeIndex) return;
		setActiveIndex(index);
		if (autoPlay && !isPaused) startTimer();
	};

	return (
		<section
			className="feed-desktop"
			aria-label="Dernières actualités"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<LayoutGroup>
				{feeds.map((feed, i) => {
					const isActive = i === activeIndex;
					const theme = getTheme(feed.theme);
					const state = isActive
						? "expanded"
						: i < activeIndex
							? "collapsed-left"
							: "collapsed-right";

					const bgStyle = feed.backgroundImage
						? {
								backgroundImage: `url(${feed.backgroundImage})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}
						: {
								background: `linear-gradient(135deg, ${theme.background}, ${theme.backgroundAlt})`,
							};

					return (
						<motion.div
							key={feed.id}
							layout
							transition={SPRING}
							className={`feed-item feed-item--${state}`}
							style={
								{
									...bgStyle,
									"--feed-text": theme.text,
									"--feed-accent": theme.accent,
									"--feed-muted": theme.muted,
								} as FeedCSSProperties
							}
							onClick={() => handleClick(i)}
							role={isActive ? undefined : "button"}
							tabIndex={isActive ? undefined : 0}
							onKeyDown={(e) => {
								if (!isActive && (e.key === "Enter" || e.key === " ")) {
									e.preventDefault();
									handleClick(i);
								}
							}}
							aria-label={isActive ? undefined : feed.title[locale]}
						>
							{feed.backgroundImage && (
								<div className="feed-item__overlay" aria-hidden="true" />
							)}

							<AnimatePresence mode="wait">
								{isActive ? (
									<motion.div
										key="expanded"
										className="feed-item__content feed-item__content--expanded"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2, delay: 0.1 }}
									>
										<time className="feed-item__date">
											{formatFeedDate(feed.date, locale)}
										</time>
										<h3 className="feed-item__title">{feed.title[locale]}</h3>
										<p className="feed-item__description">
											{feed.description[locale]}
										</p>
										{feed.link && (
											<BloomButton
												href={
													feed.link.href.startsWith("http")
														? feed.link.href
														: withBase(feed.link.href)
												}
												borderGradientColor={theme.accent}
												background="transparent"
												fontColor={theme.accent}
												target={
													feed.link.href.startsWith("http")
														? "_blank"
														: undefined
												}
												rel={
													feed.link.href.startsWith("http")
														? "noopener noreferrer"
														: undefined
												}
											>
												{feed.link.label[locale]}
											</BloomButton>
										)}
									</motion.div>
								) : (
									<motion.div
										key="collapsed"
										className="feed-item__content feed-item__content--collapsed"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.15 }}
									>
										<span className="feed-item__title-vertical">
											{feed.title[locale]}
										</span>
										<time className="feed-item__date-small">
											{formatFeedDate(feed.date, locale)}
										</time>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					);
				})}
			</LayoutGroup>
		</section>
	);
};

export default FeedDesktop;
