import FeedIcon from "./FeedIcon";
import { getFeedDateParts } from "./feedUtils";
import type { DisplayedFeed, Locale } from "./types";

interface FeedStampProps {
	feed: DisplayedFeed;
	locale: Locale;
}

/** Date of a dated feed; a permanent feed shows its icon in the same box. */
const FeedStamp = ({ feed, locale }: FeedStampProps) => {
	if (feed.icon) {
		return (
			<span className="feed__stamp feed__stamp--icon">
				<FeedIcon icon={feed.icon} className="feed__glyph" />
			</span>
		);
	}

	const { day, month } = getFeedDateParts(feed.date, locale);
	return (
		<time className="feed__stamp" dateTime={feed.date}>
			<span className="feed__stamp-day">{day}</span>
			<span className="feed__stamp-month">{month}</span>
		</time>
	);
};

export default FeedStamp;
