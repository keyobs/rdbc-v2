import type { FeedItem, FeedSettings } from "@features/home/feed/types";

export const FEEDS: FeedItem[] = [
	// ── Dated feeds ──────────────────────────────────────────
	{
		id: "f1",
		name: "Playoffs N2 juin 2026",
		creationDate: "2026-06-10T00:00:00",
		date: "2026-06-12",
		expiryDate: "2026-06-13T00:00:00",
		title: {
			fr: "Playoffs Nationale 2",
			en: "Nationale 2 Playoffs",
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
		expiryDate: "2026-06-14T00:00:00",
		title: {
			fr: "On monte en Nationale 1 ! 🏆",
			en: "We're promoted to Nationale 1!",
		},
		description: {
			fr: "Suite aux playoffs, les Petites Morts sont promues en Nationale 1 pour la saison 2026-2027.",
			en: "Following the playoffs, Les Petites Morts are promoted to Nationale 1 for the 2026-2027 season.",
		},
		theme: "neon-green",
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
			fr: "Practice ouverte recrutement",
			en: "Open recruitment practice",
		},
		description: {
			fr: "Tu veux essayer le roller derby ? Rejoins-nous pour une practice d'initiation ouverte à tous, patins fournis.",
			en: "Want to try roller derby? Join us for an open introductory practice, skates provided.",
		},
		theme: "ocean",
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
		description: {
			fr: "4 équipes de la région se retrouvent pour un tournoi amical. Entrée libre, buvette sur place.",
			en: "4 regional teams compete in a friendly tournament. Free entry, refreshments available.",
		},
		theme: "violet",
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
		description: {
			fr: "La nouvelle saison démarre fin août. Inscriptions ouvertes pour les membres existants et les nouvelles recrues.",
			en: "The new season starts at the end of August. Registrations open for existing members and new recruits.",
		},
		theme: "rust",
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
		theme: "gold",
		link: {
			href: "/competitions",
			label: { fr: "Voir les matchs", en: "See the games" },
		},
	},

	// ── Permanent feeds ───────────────────────────────────────
	{
		id: "p1",
		name: "Rejoindre le club",
		creationDate: "2026-01-01T00:00:00",
		date: "2026-01-01",
		expiryDate: null,
		isPermanent: true,
		title: {
			fr: "Rejoins les Petites Morts",
			en: "Join Les Petites Morts",
		},
		description: {
			fr: "Débutante ou expérimentée, le RDBC accueille toutes les joueuses. Prochaine practice d'initiation : demande-nous !",
			en: "Beginner or experienced, RDBC welcomes all skaters. Next introductory practice — just ask us!",
		},
		theme: "midnight",
		link: {
			href: "/rejoindre",
			label: { fr: "Rejoindre le club", en: "Join the club" },
		},
	},
	{
		id: "p2",
		name: "Practice du mercredi",
		creationDate: "2026-01-01T00:00:00",
		date: "2026-01-01",
		expiryDate: null,
		isPermanent: true,
		title: {
			fr: "Practice tous les mercredis",
			en: "Practice every Wednesday",
		},
		description: {
			fr: "Entraînement hebdomadaire ouvert à toutes les membres. Gymnase Camille Claudel, 20h–22h.",
			en: "Weekly training open to all members. Gymnase Camille Claudel, 8–10 PM.",
		},
		theme: "storm",
		link: {
			href: "/club",
			label: { fr: "Découvrir le club", en: "Discover the club" },
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
	spots: ["f1", "f3", "f4", "p1"],
};
