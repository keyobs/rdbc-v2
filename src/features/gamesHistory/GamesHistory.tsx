import useIsMobile from "@hooks/useIsMobile";
import GamesHistoryDesktop from "./GamesHistoryDesktop";
import GamesHistoryMobile from "./GamesHistoryMobile";

const GamesHistory = () => {
	const isMobile = useIsMobile();
	if (isMobile === undefined) return null;
	return isMobile ? <GamesHistoryMobile /> : <GamesHistoryDesktop />;
};

export default GamesHistory;
