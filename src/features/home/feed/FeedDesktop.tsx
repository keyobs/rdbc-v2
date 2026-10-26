import "./feed.css";
import "./feedDesktop.css";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { FeedItem, Locale } from "./types";
import { getTheme } from "./themes";
import {
	getFeedDateParts,
	getFeedLinkProps,
	getFeedShortDate,
} from "./feedUtils";

interface FeedDesktopProps {
	feeds: FeedItem[];
	locale: Locale;
	autoPlay?: boolean;
	interval?: number;
}

interface FeedCSSProperties extends React.CSSProperties {
	"--c0": string;
	"--c1": string;
	"--c2": string;
	"--base": string;
}

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

const FeedDesktop = ({
	feeds,
	locale,
	autoPlay = false,
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

					const dateParts = feed.isPermanent
						? null
						: getFeedDateParts(feed.date, locale);

					// A photo replaces the gradient layer, the theme colours stay as fallback
					const imageStyle = feed.backgroundImage
						? {
								backgroundImage: `url(${feed.backgroundImage})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}
						: undefined;

					return (
						<motion.div
							key={feed.id}
							layout
							transition={SPRING}
							className={`feed-item feed-item--${state}`}
							style={
								{
									...imageStyle,
									"--c0": theme.c0,
									"--c1": theme.c1,
									"--c2": theme.c2,
									"--base": theme.base,
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
										className={`feed-item__content feed-item__content--expanded${dateParts ? "" : " feed-item__content--no-stamp"}`}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2, delay: 0.1 }}
									>
										{dateParts && (
											<time className="feed__stamp" dateTime={feed.date}>
												<span className="feed__stamp-day">{dateParts.day}</span>
												<span className="feed__stamp-month">
													{dateParts.month}
												</span>
											</time>
										)}
										<div className="feed-item__body">
											<h2 className="feed-item__title">{feed.title[locale]}</h2>
											<p className="feed-item__description">
												{feed.description[locale]}
											</p>
											{feed.link && (
												<a
													className="feed__cta"
													{...getFeedLinkProps(feed.link.href)}
												>
													{feed.link.label[locale]}
												</a>
											)}
										</div>
										<div className="feed__bar" aria-hidden="true" />
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
										<time
											className="feed-item__date-small"
											dateTime={feed.isPermanent ? undefined : feed.date}
										>
											{getFeedShortDate(feed, locale)}
										</time>
										<span className="feed-item__title-vertical">
											{feed.mobileTitle?.[locale] ?? feed.title[locale]}
										</span>
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
