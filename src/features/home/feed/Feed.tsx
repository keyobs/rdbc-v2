import useIsMobile from "@hooks/useIsMobile";
import { getDisplayFeeds } from "./feedUtils";
import FeedDesktop from "./FeedDesktop";
import FeedMobile from "./FeedMobile";
import type { FeedItem, FeedSpot, Locale } from "./types";

interface FeedProps {
	feeds: FeedItem[];
	spots: FeedSpot[];
	locale: Locale;
}

const Feed = ({ feeds: allFeeds, spots, locale }: FeedProps) => {
	const isMobile = useIsMobile();
	if (isMobile === undefined) return null;

	// Runs in the browser: feeds expire on the visitor's day, not at build time
	const feeds = getDisplayFeeds(allFeeds, spots);
	if (feeds.length === 0) return null;

	if (isMobile) return <FeedMobile feeds={feeds} locale={locale} />;
	return <FeedDesktop feeds={feeds} locale={locale} />;
};

export default Feed;
