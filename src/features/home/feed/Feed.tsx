import useIsMobile from "@hooks/useIsMobile";
import { FEEDS, FEED_SETTINGS } from "@mockup/feeds";
import { getDisplayFeeds } from "./feedUtils";
import FeedDesktop from "./FeedDesktop";
import FeedMobile from "./FeedMobile";
import type { Locale } from "./types";

interface FeedProps {
	locale: Locale;
}

const Feed = ({ locale }: FeedProps) => {
	const isMobile = useIsMobile();
	if (isMobile === undefined) return null;

	const feeds = getDisplayFeeds(FEEDS, FEED_SETTINGS.spots);

	if (isMobile) return <FeedMobile feeds={feeds} locale={locale} />;
	return <FeedDesktop feeds={feeds} locale={locale} />;
};

export default Feed;
