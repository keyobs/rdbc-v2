export interface FeedTheme {
	background: string;
	backgroundAlt: string;
	text: string;
	accent: string;
	muted: string;
}

export const THEMES: Record<string, FeedTheme> = {
	midnight: {
		background: "#0f1427",
		backgroundAlt: "#141c3c",
		text: "#f4f4f4",
		accent: "#4268f9",
		muted: "#547c93",
	},
	"neon-green": {
		background: "#0a2319",
		backgroundAlt: "#05140f",
		text: "#f4f4f4",
		accent: "#00ff96",
		muted: "#6ec98e",
	},
	crimson: {
		background: "#23080a",
		backgroundAlt: "#320c0f",
		text: "#f4f4f4",
		accent: "#eb1c24",
		muted: "#b45055",
	},
	ocean: {
		background: "#05192d",
		backgroundAlt: "#08233c",
		text: "#f4f4f4",
		accent: "#00b4dc",
		muted: "#5096b4",
	},
	violet: {
		background: "#140a28",
		backgroundAlt: "#230f41",
		text: "#f4f4f4",
		accent: "#b450ff",
		muted: "#8250b4",
	},
	rust: {
		background: "#1e0f05",
		backgroundAlt: "#2d1608",
		text: "#f4f4f4",
		accent: "#dc641e",
		muted: "#a05a32",
	},
	gold: {
		background: "#191205",
		backgroundAlt: "#281c08",
		text: "#f4f4f4",
		accent: "#dcb41e",
		muted: "#a0823c",
	},
	forest: {
		background: "#081c0f",
		backgroundAlt: "#0c2816",
		text: "#f4f4f4",
		accent: "#28b450",
		muted: "#468c5a",
	},
	storm: {
		background: "#14161c",
		backgroundAlt: "#1e212a",
		text: "#f4f4f4",
		accent: "#8ca0c8",
		muted: "#64738c",
	},
	fire: {
		background: "#1e0a05",
		backgroundAlt: "#321208",
		text: "#f4f4f4",
		accent: "#ff5a14",
		muted: "#c86432",
	},
};

export function getTheme(slug: string): FeedTheme {
	return THEMES[slug] ?? THEMES.midnight;
}
