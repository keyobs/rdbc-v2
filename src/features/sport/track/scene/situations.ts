import type { OfficialId, OfficialPositions, SkaterPositions } from "./cast";
import {
	ACTION,
	IN_ZONE,
	OFFICIALS_ACTION,
	OFFICIALS_START,
	OUT_OF_ZONE,
	START,
} from "./positions";

export type SituationId =
	| "track"
	| "inBounds"
	| "officials"
	| "pack"
	| "engagement"
	| "jammers"
	| "inZone"
	| "outOfZone";

export type KeyItem =
	| "pivotLine"
	| "jammerLine"
	| "safety"
	| "blocker"
	| "pivot"
	| "jammer"
	| "teams"
	| "official"
	| "jammerRef"
	| "pack"
	| "engagement";

export interface Situation {
	id: SituationId;
	skaters: SkaterPositions | null;
	officials: OfficialPositions | null;
	// Officials placed from the action (jammers, pack) instead of their hand-set position
	trackedOfficials?: OfficialId[];
	// Outside refs 1 and 3 stay level with the front blocker in the engagement zone and the rearmost skater,
	// instead of the engagement zone limits
	outsideRefsOnSkaters?: boolean;
	pack: boolean;
	engagement: boolean;
	// Jammers highlighted, everything else dimmed
	spotlightJammers: boolean;
	highlightStartLines: boolean;
	keys: KeyItem[];
}

const PLAYER_KEYS: KeyItem[] = ["blocker", "pivot", "jammer"];

export const SITUATIONS: Situation[] = [
	{
		id: "track",
		skaters: null,
		officials: null,
		pack: false,
		engagement: false,
		spotlightJammers: false,
		highlightStartLines: true,
		keys: ["pivotLine", "jammerLine", "safety"],
	},
	{
		id: "inBounds",
		skaters: START,
		officials: null,
		pack: false,
		engagement: false,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "teams"],
	},
	{
		id: "officials",
		skaters: START,
		officials: OFFICIALS_START,
		pack: false,
		engagement: false,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "teams", "official", "jammerRef"],
	},
	{
		id: "pack",
		skaters: START,
		officials: OFFICIALS_START,
		pack: true,
		engagement: false,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "official", "pack"],
	},
	{
		id: "engagement",
		skaters: START,
		officials: OFFICIALS_START,
		pack: true,
		engagement: true,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "official", "pack", "engagement"],
	},
	{
		id: "jammers",
		skaters: ACTION,
		officials: OFFICIALS_ACTION,
		trackedOfficials: ["jrg", "jrb", "ipr1", "opr1"],
		pack: true,
		engagement: true,
		spotlightJammers: true,
		highlightStartLines: false,
		keys: ["jammer", "pack", "engagement"],
	},
	{
		id: "inZone",
		skaters: IN_ZONE,
		officials: OFFICIALS_ACTION,
		trackedOfficials: ["jrg", "jrb", "ipr1", "opr1", "opr2", "opr3"],
		outsideRefsOnSkaters: true,
		pack: true,
		engagement: true,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "official", "pack", "engagement"],
	},
	{
		id: "outOfZone",
		skaters: OUT_OF_ZONE,
		officials: OFFICIALS_ACTION,
		trackedOfficials: ["jrg", "jrb", "ipr2", "opr1", "opr2", "opr3"],
		outsideRefsOnSkaters: true,
		pack: true,
		engagement: true,
		spotlightJammers: false,
		highlightStartLines: false,
		keys: [...PLAYER_KEYS, "official", "pack", "engagement"],
	},
];
