import type { FeedItem, FeedSettings } from "@features/home/feed/types";

export const FEEDS: FeedItem[] = [
	// ── Dated feeds ──────────────────────────────────────────
	{
		id: "f1",
		name: "Playoffs Nationale 2 juin 2026",
		creationDate: "2026-06-10T00:00:00",
		date: "2026-06-13",
		expiryDate: "2026-06-13T00:00:00",
		title: {
			fr: "Playoffs Nationale 2",
			en: "Nationale 2 Playoffs",
		},
		mobileTitle: {
			fr: "Playoffs N2",
			en: "N2 Playoffs",
		},
		description: {
			fr: "Les Petites Morts jouent les playoffs de Nationale 2 ce week-end à Bordeaux. Venez nous soutenir !",
			en: "Les Petites Morts play in the Nationale 2 playoffs this weekend in Bordeaux. Come support us!",
		},
		theme: "crimson",
		link: {
			href: "/competitions",
			label: { fr: "Voir les matchs", en: "See the games" },
		},
	},
	{
		id: "f2",
		name: "Montée Nationale 1",
		creationDate: "2026-06-13T12:00:00",
		date: "2026-06-13",
		expiryDate: "2026-08-31T00:00:00",
		title: {
			fr: "Les Petites Morts montent en Nationale 1 ! 🏆",
			en: "Petites Morts are promoted to Nationale 1!",
		},
		description: {
			fr: "Après le tournoi des Playoffs N2, les Petites Morts montent en Nationale 1 la saison prochaine 2026-2027.",
			en: "Following the Playoffs N2, Les Petites Morts are promoted to Nationale 1 for the 2026-2027 season.",
		},
		theme: "indigoBloom",
		link: {
			href: "/competitions",
			label: { fr: "Résultats", en: "Results" },
		},
	},
	{
		id: "f3",
		name: "Practice recrutement juin",
		creationDate: "2026-06-14T00:00:00",
		date: "2026-06-21",
		expiryDate: "2026-06-22T00:00:00",
		title: {
			fr: "Les Petites Morts à Barcelone",
			en: "Petites Morts goes to Barcelona",
		},
		description: {
			fr: "Tu veux essayer le roller derby ? Rejoins-nous pour une practice d'initiation ouverte à tous, patins fournis.",
			en: "Want to try roller derby? Join us for an open introductory practice, skates provided.",
		},
		theme: "blueEnergy",
		link: {
			href: "/rejoindre",
			label: { fr: "En savoir plus", en: "Learn more" },
		},
	},
	{
		id: "f4",
		name: "Tournoi amical juillet",
		creationDate: "2026-06-15T00:00:00",
		date: "2026-07-05",
		expiryDate: "2026-07-06T00:00:00",
		title: {
			fr: "Tournoi amical inter-ligues",
			en: "Friendly inter-league tournament",
		},
		mobileTitle: {
			fr: "Tournoi amical",
			en: "Friendly tournament",
		},
		description: {
			fr: "4 équipes de la région se retrouvent pour un tournoi amical. Entrée libre, buvette sur place.",
			en: "4 regional teams compete in a friendly tournament. Free entry, refreshments available.",
		},
		theme: "freshSky",
		link: {
			href: "/evenements",
			label: { fr: "Voir l'événement", en: "See the event" },
		},
	},
	{
		id: "f5",
		name: "Reprise saison automne",
		creationDate: "2026-06-15T00:00:00",
		date: "2026-08-30",
		expiryDate: "2026-08-31T00:00:00",
		title: {
			fr: "Reprise de saison — automne 2026",
			en: "Season kickoff — autumn 2026",
		},
		mobileTitle: {
			fr: "Reprise automne 2026",
			en: "Autumn 2026 kickoff",
		},
		description: {
			fr: "La nouvelle saison démarre fin août. Inscriptions ouvertes pour les membres existants et les nouvelles recrues.",
			en: "The new season starts at the end of August. Registrations open for existing members and new recruits.",
		},
		theme: "skySurge",
		link: {
			href: "/rejoindre",
			label: { fr: "S'inscrire", en: "Register" },
		},
	},
	{
		id: "f6",
		name: "Championnat N1 premiere journee",
		creationDate: "2026-07-01T00:00:00",
		date: "2026-09-15",
		expiryDate: "2026-09-16T00:00:00",
		title: {
			fr: "1ère journée Nationale 1",
			en: "Nationale 1 — Round 1",
		},
		description: {
			fr: "Première journée de championnat en Nationale 1 pour les Petites Morts. Une nouvelle aventure commence !",
			en: "First championship round in Nationale 1 for Les Petites Morts. A new adventure begins!",
		},
		theme: "strongCyan",
		link: {
			href: "/competitions",
			label: { fr: "Voir les matchs", en: "See the games" },
		},
	},
	{
		id: "f7",
		name: "Championnat N2 - Résultat",
		creationDate: "2026-06-14T00:00:00",
		date: "2026-06-14",
		expiryDate: "2026-09-01T00:00:00",
		title: {
			fr: "Nationale 2 - Résultats",
			en: "Nationale 2 — Results",
		},
		description: {
			fr: "A l'issue des Playoffs, les Petites Morts montent en Nationale 1 la saison prochaine. Une nouvelle aventure commence !",
			en: "National 1 next season for Les Petites Morts. A new adventure begins!",
		},
		theme: "slateIndigo",
		link: {
			href: "/competitions",
			label: { fr: "Voir les matchs", en: "See the games" },
		},
	},

	// ── Permanent feeds ───────────────────────────────────────
	{
		id: "p1",
		name: "Rejoindre le club",
		creationDate: "2026-06-17T00:00:00",
		date: "2026-06-17",
		expiryDate: null,
		isPermanent: true,
		title: {
			fr: "Rejoins les Petites Morts",
			en: "Join Les Petites Morts",
		},
		mobileTitle: {
			fr: "Rejoins le club",
			en: "Join the club",
		},
		description: {
			fr: "Débutante ou expérimentée, le RDBC accueille toutes les joueuses. Prochaine practice d'initiation : demande-nous !",
			en: "Beginner or experienced, RDBC welcomes all skaters. Next introductory practice — just ask us!",
		},
		theme: "pearlAqua",
		link: {
			href: "/rejoindre",
			label: { fr: "Rejoindre le club", en: "Join the club" },
		},
	},
	{
		id: "p2",
		name: "Summer Sessions",
		creationDate: "2026-06-01T00:00:00",
		date: "2026-06-01",
		expiryDate: null,
		isPermanent: true,
		title: {
			fr: "Summer Sessions: initiation au roller derby",
			en: "Summer Sessions: try roller derby",
		},
		description: {
			fr: "Sessions d'initiation au roller et au roller derby. Le Dépôt, Darwin, 10:30h–13h00",
			en: "Introductory Sessions on Inline Skating and Roller Derby. Le Dépôt, Darwin, 10:30AM–1:00PM.",
		},
		theme: "turquoise",
		link: {
			href: "/club",
			label: { fr: "Summer sessions", en: "Summer sessions" },
		},
	},
	{
		id: "p3",
		name: "Réseaux sociaux",
		creationDate: "2026-01-01T00:00:00",
		date: "2026-01-01",
		expiryDate: null,
		isPermanent: true,
		title: {
			fr: "Suivez-nous sur les réseaux",
			en: "Follow us on social media",
		},
		description: {
			fr: "Photos, vidéos, résultats en direct : retrouvez toute l'actualité du RDBC sur Instagram et Facebook.",
			en: "Photos, videos, live results: find all RDBC news on Instagram and Facebook.",
		},
		theme: "forest",
		link: {
			href: "https://instagram.com/rdbcbordeaux",
			label: { fr: "Voir Instagram", en: "See Instagram" },
		},
	},
];

// spots: f1 (expired → fallback p2), f3, f4, p1
export const FEED_SETTINGS: FeedSettings = {
	numberOfSpots: 4,
	spots: ["f7", "f3", "f4", "p1"],
};
