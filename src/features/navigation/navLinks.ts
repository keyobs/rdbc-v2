import type { Translations } from "@i18n/index";

export interface NavLink {
	key: keyof Translations["nav"];
	href: string;
}

export const NAV_LINKS: NavLink[] = [
	{ key: "club", href: "/club" },
	{ key: "team", href: "/equipe" },
	{ key: "rules", href: "/regles" },
	{ key: "competitions", href: "/competitions" },
	{ key: "events", href: "/evenements" },
	{ key: "blog", href: "/blog" },
	{ key: "contact", href: "/contact" },
];
