export interface FeedTheme {
	background: string;
	backgroundAlt: string;
	text: string;
	accent: string;
	muted: string;
}

export const THEMES: Record<string, FeedTheme> = {
	deepSpace: {
		background: "#0c0128", // Début du gradient (Bleu nuit)
		backgroundAlt: "#1a024a", // Fin du gradient (Violet profond)
		text: "#f4f4f4",
		accent: "#ff13f0", // Rose néon (Bords CTA)
		muted: "#00efff", // Cyan (Titres)
	},

	// 2. NUANCE DE BLEU FONCÉ (Plus clair/lumineux que deepSpace - Extrait de l'horizon céleste)
	nightFade: {
		background: "#1c0654", // Un bleu/violet nocturne plus vibrant
		backgroundAlt: "#2d0b7a", // Fin du gradient, plus électrique
		text: "#f4f4f4", // Reste parfaitement blanc et lisible
		accent: "#00ffea", // Accent cyan de la grille pour trancher
		muted: "#ff13f0", // Titre rose néon
	},

	// 3. LE GRADIENT DE LA SKYLINE (Lumière magenta de la ville)
	neonSkyline: {
		background: "#e8219b",
		backgroundAlt: "#910b5c",
		text: "#f4f4f4",
		accent: "rgb(156, 176, 255)",
		muted: "#00ffea",
	},

	// 3bis. LE GRADIENT DU SOLEIL (Cœur jaune vers orange rétro)
	solarCore: {
		background: "#ffd30f", // Début du gradient (Jaune vif)
		backgroundAlt: "#ff6a00", // Fin du gradient (Orange chaud)
		text: "#0c0128", // Texte sombre car le gradient est lumineux
		accent: "#8e00af", // Rose magenta
		muted: "#3a2a82", // Violet sombre
	},

	// 4. LE GRADIENT CRÉPUSCULAIRE (Orange couchant vers rouge horizon)
	sunsetFade: {
		background: "#ff9c00", // Début du gradient (Orange)
		backgroundAlt: "#b81440", // Fin du gradient (Rouge/rose brique)
		text: "#100018", // Texte sombre
		accent: "#3a2a82", // Violet
		muted: "#0c0128", // Bleu nuit
	},

	// 5. LE SKYLINE CYAN
	cyberNeon: {
		background: "rgb(0, 255, 150)", // Le bleu-vert clair et électrique de la grille
		backgroundAlt: "#22a38b", // Cyan plus profond pour stabiliser le dégradé
		text: "#0c0128", // Texte sombre pour une lisibilité parfaite (WCAG)
		accent: "#ff13f0", // Border CTA : Rose néon flash pour le contraste
		muted: "#2d2063", // Titre : Violet/Bleu profond
	},

	// 6. TA PALETTE RECHERCHÉE : LE GRADIENT DU SOL ET SA GRILLE NÉON
	// Recrée exactement le fondu du sol noir/bleu avec les lignes bleues électriques
	cyberGrid: {
		background: "#100018", // Début du gradient (Le noir/violet du fond du sol)
		backgroundAlt: "#050244", // Fin du gradient (Le bleu marine profond du premier plan)
		text: "#f4f4f4", // Texte blanc
		accent: "#00e0d7", // L'ACCENT : Le cyan/bleu néon vif du quadrillage !
		muted: "#00b3ff", // Le bleu néon plus saturé pour les titres
	},
};

/*
#050244
#3FD2FD
*/

/*
export const THEMES: Record<string, FeedTheme> = {
	gotham: {
		background: "#231785",
		//backgroundAlt: "#857DC8",
		backgroundAlt: "#231785",
		text: "#f4f4f4",
		accent: "#135C9C",
		muted: "#119179",
	},
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
	synthwave: {
		background: "#1e0550",
		backgroundAlt: "#2a0a6e",
		text: "#f4f4f4",
		accent: "#ff2d87",
		muted: "#c060ff",
	},
	outrun: {
		background: "#230032",
		backgroundAlt: "#300046",
		text: "#f4f4f4",
		accent: "#ff6200",
		muted: "#d400c0",
	},
	gta: {
		background: "#00243c",
		backgroundAlt: "#003050",
		text: "#f4f4f4",
		accent: "#ff1a78",
		muted: "#00c8c0",
	},
};
*/

export function getTheme(slug: string): FeedTheme {
	return THEMES[slug] ?? THEMES.deepSpace;
}
