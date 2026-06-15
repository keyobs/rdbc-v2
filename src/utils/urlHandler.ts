const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string): string {
	return `${base}${path}`;
}

// Strips the base prefix from Astro.url.pathname so downstream
// comparisons work against plain paths (e.g. "/competitions").
export function stripBase(pathname: string): string {
	if (!base || !pathname.startsWith(base)) return pathname;
	return pathname.slice(base.length) || "/";
}
