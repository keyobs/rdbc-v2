import useIsMobile from "@hooks/useIsMobile";
import type { Translations } from "@i18n/index";
import Navbar from "./Navbar";
import MobileNavDrawer from "./mobile/MobileNavDrawer";

interface NavigationProps {
	t: Translations["nav"];
}

const Navigation = ({ t }: NavigationProps) => {
	const isMobile = useIsMobile();

	if (isMobile === undefined) return null;

	return isMobile ? <MobileNavDrawer t={t} /> : <Navbar t={t} />;
};

export default Navigation;
