import { getImage } from "astro:assets";
import mummy from "../../assets/mummy.png";
import type { Competition } from "../../../sanity/sanity.types";
import type { TeamKey } from "./types";

type HomeTeamKey = NonNullable<
	NonNullable<Competition["games"]>[number]["homeTeam"]
>;

/** Every RDBC team plays under the club logo. Same size as the opponent logos (2.375rem, ×2 for sharp screens). */
export const RDBC_LOGO = (
	await getImage({ src: mummy, width: 96, height: 96, format: "webp" })
).src;

/** Travel teams: the name shown on the scoreboard. */
export const TRAVEL_TEAM_NAMES: Record<Exclude<TeamKey, "home">, string> = {
	A: "Petites Morts",
	B: "Compagnie Cruelle",
};

/** Home teams, opposed in intraleague games. Keys match the Sanity `competition` schema. */
export const HOME_TEAM_NAMES: Record<HomeTeamKey, string> = {
	"pink-cheek-peaches": "Pink Cheek Peaches",
	"rotten-black-grapes": "Rotten Black Grapes",
	"boom-bright-gold": "Boom Bright Gold",
};
