import type { Translations } from "@i18n/index";

export type NavLink = {
	type: "link";
	key: keyof Translations["nav"];
	href: string;
};
export type NavSeparator = { type: "separator"; id: string };
export type NavItem = NavLink | NavSeparator;

export const NAV_ITEMS: NavItem[] = [
	{ type: "link", key: "club", href: "/club" },
	{ type: "link", key: "team", href: "/equipe" },
	{ type: "link", key: "rules", href: "/regles" },
	{ type: "separator", id: "sep-1" },
	{ type: "link", key: "events", href: "/evenements" },
	{ type: "link", key: "competitions", href: "/competitions" },
	{ type: "separator", id: "sep-2" },
	{ type: "link", key: "blog", href: "/blog" },
	{ type: "link", key: "contact", href: "/contact" },
];

export const NAV_LINKS: NavLink[] = NAV_ITEMS.filter(
	(item): item is NavLink => item.type === "link",
);
