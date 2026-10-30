import type { Translations } from "@i18n/index";
import { NAV_LINKS } from "./navLinks";

const getSectionTitle = (
	pathname: string,
	nav: Translations["nav"],
): string => {
	pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
	if (pathname === "/" || pathname === "") return "Roller Derby Bordeaux";
	// "/" is a prefix of every path: only the home page itself matches it
	const match = NAV_LINKS.find(
		(link) => link.href !== "/" && pathname.startsWith(link.href),
	);
	return match ? nav[match.key] : "Roller Derby Bordeaux";
};

export default getSectionTitle;
