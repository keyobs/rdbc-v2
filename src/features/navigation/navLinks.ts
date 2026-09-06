import type { Translations } from "@i18n/index";

export type NavLink = {
	type: "link";
	key: keyof Translations["nav"];
	href: string;
	display?: boolean;
};
export type NavSeparator = { type: "separator"; id: string };
export type NavItem = NavLink | NavSeparator;

/*
home / le sport / club / matchs / events / REJOINDRE CTA 
*/

export const NAV_ITEMS: NavItem[] = [
	{ type: "link", key: "home", href: "/", display: true },
	{ type: "link", key: "sport", href: "/le-sport", display: true },
	{ type: "link", key: "club", href: "/club", display: true },
	{ type: "link", key: "competitions", href: "/competitions", display: true },
	{ type: "link", key: "events", href: "/evenements", display: true },

	{ type: "link", key: "blog", href: "/blog" },
	{ type: "link", key: "contact", href: "/contact" },

	{ type: "separator", id: "sep-1" },
	{ type: "separator", id: "sep-2" },
];

export const NAV_LINKS: NavLink[] = NAV_ITEMS.filter(
	(item): item is NavLink => item.type === "link",
);

export const DISPLAYED_NAV_LINKS: NavLink[] = NAV_ITEMS.filter(
	(item): item is NavLink => item.type === "link" && item.display === true,
);
