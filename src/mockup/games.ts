import type { GameResult } from "@features/home/score/LastResults";
import photo1 from "../assets/hero/match_misty_1-3.jpg";
import photo2 from "../assets/hero/match_peak_1-1.jpg";
import photo3 from "../assets/hero/train_kiwi_block.jpeg";
import mummy from "../assets/mummy.png";

export const RESULTS: GameResult[] = [
	{
		id: "1",
		date: "2026-05-10",
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
		date: "2026-05-09",
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
		date: "2026-05-09",
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
		date: "2026-06-13",
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
		date: "2026-06-13",
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
		id: "1",
		date: "2026-06-13",
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
];
