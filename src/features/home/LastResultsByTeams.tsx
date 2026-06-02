import useIsMobile from "@hooks/useIsMobile";
import LastResults from "./score/LastResults";
import LastResultsMobile from "./LastResultsMobile";

const LastResultsByTeams = () => {
	const isMobile = useIsMobile();
	if (isMobile === undefined) return null;
	return isMobile ? <LastResultsMobile /> : <LastResults />;
};

export default LastResultsByTeams;
