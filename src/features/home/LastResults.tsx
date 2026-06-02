import useIsMobile from "@hooks/useIsMobile";
import GameStrip from "./GamesStrip";
import LastResultsMobile from "./LastResultsMobile";

const LastResults = () => {
	const isMobile = useIsMobile();
	if (isMobile === undefined) return null;
	return isMobile ? <LastResultsMobile /> : <GameStrip />;
};

export default LastResults;
