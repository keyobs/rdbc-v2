const FR_TO_EN: Record<string, string> = {
	"/": "/en/",
	"/club": "/en/club",
	"/rejoindre": "/en/join",
	"/regles": "/en/rules",
	"/equipe": "/en/team",
	"/competitions": "/en/competitions",
	"/competitions/equipes": "/en/competitions/teams",
	"/news": "/en/news",
	"/blog": "/en/blog",
	"/contact": "/en/contact",
};

const EN_TO_FR: Record<string, string> = Object.fromEntries(
	Object.entries(FR_TO_EN).map(([fr, en]) => [en, fr]),
);

export function isEnglish(pathname: string): boolean {
	return pathname.startsWith("/en");
}

export function getLocale(pathname: string): import("./index").Locale {
	if (pathname.startsWith("/en")) return "en";
	return "fr";
}

/** Navigation items use French paths; keep their links in the current locale. */
export function getLocalizedHref(
	href: string,
	locale: import("./index").Locale,
): string {
	if (locale === "fr") return href;
	const [path, hash] = href.split("#");
	return `${FR_TO_EN[path] ?? path}${hash === undefined ? "" : `#${hash}`}`;
}

export function getAlternateHref(pathname: string): string {
	const en = isEnglish(pathname);
	const map = en ? EN_TO_FR : FR_TO_EN;
	const normalized =
		pathname.endsWith("/") && pathname.length > 1
			? pathname.slice(0, -1)
			: pathname;
	return map[normalized] ?? (en ? "/" : "/en/");
}
