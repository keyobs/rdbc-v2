import type { GameResult, UpcomingGame } from "@features/games/types";
import photo1 from "../assets/hero/match_misty_1-3.jpg";
import photo2 from "../assets/hero/match_peak_1-1.jpg";
import photo3 from "../assets/hero/train_kiwi_block.jpeg";
import mummy from "../assets/mummy.png";

export const RESULTS: GameResult[] = [
	{
		id: "1",
		date: "2026-05-10T10:00:00",
		poster: photo1.src,
		tournament: "Championnat de France 2026",
		event: "Nationale 2 — Plateau 2",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 215,
		},
		hainemy: {
			name: "Valient Biitchiiz",
			league: "Roller Derby Côte Basque (Anglet)",
			logo: null,
			score: 75,
		},
		photos: [photo2.src, photo3.src],
	},
	{
		id: "2",
		date: "2026-05-09T14:30:00",
		poster: photo2.src,
		tournament: "Championnat de France 2026",
		event: "Nationale 2 — Plateau 2",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 270,
		},
		hainemy: {
			name: "Kontra Bandista",
			league: "Euskal Roller Derby (Bayonne)",
			logo: null,
			score: 134,
		},
		photos: [photo1.src, photo3.src],
	},
	{
		id: "3",
		date: "2026-05-09T10:00:00",
		poster: photo3.src,
		tournament: "Championnat de France 2026",
		event: "Nationale 2 — Plateau 2",
		rdbc: {
			name: "Petites Morts",
			logo: mummy.src,
			score: 186,
			travelTeam: "A",
		},
		hainemy: {
			name: "Collectif B",
			league: "Roller Derby Toulouse",
			logo: null,
			score: 182,
		},
		photos: [photo1.src, photo2.src],
	},
	{
		id: "4",
		date: "2026-06-13T12:30:00",
		poster: photo1.src,
		tournament: "Championnat de France 2026",
		event: "National 2 - Playoffs",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 111,
		},
		hainemy: {
			name: "Silly Geez B",
			league: "Nordiks de Touraine (Tours)",
			logo: null,
			score: 41,
		},
		photos: [photo2.src, photo3.src],
	},
	{
		id: "5",
		date: "2026-06-13T15:30:00",
		poster: photo1.src,
		tournament: "Championnat de France 2026",
		event: "National 2 - Playoffs",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 45,
		},
		hainemy: {
			name: "Les Encastreuses",
			league: "Lutece Destroyeuses (Paris)",
			logo: null,
			score: 58,
		},
		photos: [photo2.src, photo3.src],
	},
	{
		id: "6",
		date: "2026-06-13T20:00:00",
		poster: photo1.src,
		tournament: "Championnat de France 2026",
		event: "National 2 - Playoffs",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 189,
		},
		hainemy: {
			name: "Les Titanesques",
			league: "RDNA Roller Derby (Nantes)",
			logo: null,
			score: 57,
		},
		photos: [photo2.src, photo3.src],
	},
	{
		id: "7",
		date: "2026-06-14T14:30:00",
		poster: photo1.src,
		tournament: "Championnat de France 2026",
		event: "National 2 - Playoffs",
		rdbc: {
			name: "Petites Morts",
			travelTeam: "A",
			logo: mummy.src,
			score: 123,
		},
		hainemy: {
			name: "Les Flêches Revêches",
			league: "Roller Derby Dijon",
			logo: null,
			score: 133,
		},
		photos: [photo2.src, photo3.src],
	},
];

// Placeholder fixtures: dates, opponents and venues are still to be provided.
export const UPCOMING_GAMES: UpcomingGame[] = [
	// TTA: a plateau with two games at home
	{
		id: "u1",
		date: "2026-11-14T14:00:00",
		team: "A",
		competition: "[Compétition]",
		event: "[Plateau]",
		venue: "[Lieu]",
		isHome: true,
		rdbc: { name: "Petites Morts", logo: mummy.src },
		opponent: {
			name: "[Adversaire 1]",
			league: "[Ligue de l'adversaire]",
			logo: null,
		},
	},
	{
		id: "u2",
		date: "2026-11-15T11:00:00",
		team: "A",
		competition: "[Compétition]",
		event: "[Plateau]",
		venue: "[Lieu]",
		isHome: true,
		rdbc: { name: "Petites Morts", logo: mummy.src },
		opponent: {
			name: "[Adversaire 2]",
			league: "[Ligue de l'adversaire]",
			logo: null,
		},
	},
	// TTB: a single game away
	{
		id: "u3",
		date: "2026-11-21T16:00:00",
		team: "B",
		competition: "[Compétition]",
		event: "[Événement]",
		venue: "[Lieu]",
		isHome: false,
		rdbc: { name: "Compagnie Cruelle", logo: mummy.src },
		opponent: {
			name: "[Adversaire 3]",
			league: "[Ligue de l'adversaire]",
			logo: null,
		},
	},
];
