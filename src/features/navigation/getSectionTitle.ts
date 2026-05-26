import type { Translations } from "@i18n/index";
import { NAV_LINKS } from "./navLinks";

const getSectionTitle = (
	pathname: string,
	nav: Translations["nav"],
): string => {
	if (pathname === "/" || pathname === "") return "RDBC";
	const match = NAV_LINKS.find((link) => pathname.startsWith(link.href));
	return match ? nav[match.key] : "RDBC";
};

export default getSectionTitle;
