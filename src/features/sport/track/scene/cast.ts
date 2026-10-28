export type Team = "green" | "blue";
export type SkaterRole = "blocker" | "pivot" | "jammer";

export type SkaterId =
	| "g1"
	| "g2"
	| "g3"
	| "gp"
	| "gj"
	| "b1"
	| "b2"
	| "b3"
	| "bp"
	| "bj";
export type OfficialId =
	| "ipr1"
	| "ipr2"
	| "jrb"
	| "jrg"
	| "opr1"
	| "opr2"
	| "opr3";

interface Skater {
	id: SkaterId;
	team: Team;
	role: SkaterRole;
}

interface Official {
	id: OfficialId;
	// Jammer referees wear a star in the color of the jammer they follow
	starTeam?: Team;
}

// Skaters as [s, d]: distance along the track from the pivot line, distance from the
// inside boundary, in feet
export type SkaterPositions = Record<SkaterId, readonly [number, number]>;
// Officials as [x, y], in feet
export type OfficialPositions = Record<OfficialId, readonly [number, number]>;

export const SKATER_RADIUS = 1.6;

export const SKATERS: Skater[] = [
	{ id: "g1", team: "green", role: "blocker" },
	{ id: "g2", team: "green", role: "blocker" },
	{ id: "g3", team: "green", role: "blocker" },
	{ id: "gp", team: "green", role: "pivot" },
	{ id: "gj", team: "green", role: "jammer" },
	{ id: "b1", team: "blue", role: "blocker" },
	{ id: "b2", team: "blue", role: "blocker" },
	{ id: "b3", team: "blue", role: "blocker" },
	{ id: "bp", team: "blue", role: "pivot" },
	{ id: "bj", team: "blue", role: "jammer" },
];

export const OFFICIALS: Official[] = [
	{ id: "ipr1" },
	{ id: "ipr2" },
	{ id: "jrb", starTeam: "blue" },
	{ id: "jrg", starTeam: "green" },
	{ id: "opr1" },
	{ id: "opr2" },
	{ id: "opr3" },
];
