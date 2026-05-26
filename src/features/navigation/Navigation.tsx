import useIsMobile from "@hooks/useIsMobile";
import type { Translations } from "@i18n/index";
import Navbar from "./Navbar";
import BottomNav from "./mobile/BottomNav";

interface NavigationProps {
	t: Translations["nav"];
	pathname: string;
}

const Navigation = ({ t, pathname }: NavigationProps) => {
	const isMobile = useIsMobile();

	if (isMobile === undefined) return null;

	return isMobile ? <BottomNav t={t} pathname={pathname} /> : <Navbar t={t} />;
};

export default Navigation;
