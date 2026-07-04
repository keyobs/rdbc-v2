import type { FeedItem, FeedSettings } from "@features/home/feed/types";

export const FEEDS: FeedItem[] = [
	// ── Dated feeds ──────────────────────────────────────────
	{
		id: "f1",
		name: "Playoffs N2 juin 2026",
		creationDate: "2026-06-10T00:00:00",
		date: "2026-06-13",
		expiryDate: "2026-06-20T00:00:00",
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
		theme: "royalViolet",
		link: {
			href: "/competitions",
			label: { fr: "Voir les matchs", en: "See the games" },
		},
	},
	{
		id: "f2",
		name: "Montée Nationale 1",
		creationDate: "2026-06-13T12:00:00",
		date: "2026-09-13",
		expiryDate: "2026-06-20T00:00:00",
		title: {
			fr: "On monte en Nationale 1 ! 🏆",
			en: "We're promoted to Nationale 1!",
		},
		description: {
			fr: "Suite aux playoffs, les Petites Morts sont promues en Nationale 1 pour la saison 2026-2027.",
			en: "Following the playoffs, Les Petites Morts are promoted to Nationale 1 for the 2026-2027 season.",
		},
		theme: "slateIndigo",
		link: {
			href: "/competitions",
			label: { fr: "Résultats", en: "Results" },
		},
	},
	{
		id: "f3",
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
		theme: "blueEnergy",
		link: {
			href: "/rejoindre",
			label: { fr: "S'inscrire", en: "Register" },
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
		mobileTitle: {
			fr: "Rejoins le club",
			en: "Join the club",
		},
		description: {
			fr: "Débutante ou expérimentée, le RDBC accueille toutes les joueuses. Prochaine practice d'initiation : demande-nous !",
			en: "Beginner or experienced, RDBC welcomes all skaters. Next introductory practice — just ask us!",
		},
		theme: "skySurge",
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
		theme: "pearlAqua",
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
		theme: "aquamarine",
		link: {
			href: "https://instagram.com/rdbcbordeaux",
			label: { fr: "Voir Instagram", en: "See Instagram" },
		},
	},
];

// spots: f1 (expired → fallback p2), f3, f4, p1
export const FEED_SETTINGS: FeedSettings = {
	numberOfSpots: 4,
	spots: ["f1", "f2", "f3", "p1", "p2", "p3"],
};
