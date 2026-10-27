import {
	type OfficialPositions,
	SKATER_RADIUS,
	type SkaterPositions,
} from "./cast";

// Jam start: blockers between the pivot and jammer lines, jammers behind the jammer line
export const START: SkaterPositions = {
	g1: [129.4, 11.3],
	g2: [130.5, 7.8],
	g3: [128.8, 3],
	gp: [121.0, 8],
	gj: [116.3, 3],
	b1: [124.9, 10.7],
	b2: [125.5, 6.7],
	b3: [123.4, 3],
	bp: [121.2, 11.6],
	bj: [116.0, 8.6],
};

// Pack in action; the green jammer is in contact with the rear blue blockers
export const ACTION: SkaterPositions = {
	g1: [142.9, 10.3],
	g2: [144.7, 6.8],
	g3: [139.6, 3.8],
	gp: [129.5, 2.7],
	gj: [120.4, 4.6],
	b1: [150.6, 4.6],
	b2: [129.9, 7.5],
	b3: [125.0, 4.8],
	bp: [122.5, 10],
	bj: [139.7, 7.5],
};

// Green jammer 10' behind the rearmost blocker (blue pivot); a green blocker and the blue
// jammer 5 m (16.4') ahead of the pack, still in the engagement zone
export const IN_ZONE: SkaterPositions = {
	g1: [177.0, 4],
	g2: [154.7, 6.8],
	g3: [149.6, 3.8],
	gp: [139.5, 2.7],
	gj: [122.5, 10],
	b1: [160.6, 4.6],
	b2: [139.9, 7.5],
	b3: [135.0, 4.8],
	bp: [132.5, 10],
	bj: [177.5, 9.5],
};

// The green jammer makes contact with the blue pivot; the blue jammer is out of the zone
export const OUT_OF_ZONE: SkaterPositions = {
	...IN_ZONE,
	g1: [173.7, 4],
	g2: [157.3, 6.8],
	bp: [130.86, 10],
	gj: [130.86 - 2 * SKATER_RADIUS, 10],
	bj: [193.9, 7],
};

export const OFFICIALS_START: OfficialPositions = {
	ipr1: [-11.1, -9.1],
	ipr2: [5.2, -8.4],
	jrb: [13.7, -8.5],
	jrg: [17.3, -9.9],
	opr1: [-18, -30],
	opr2: [-4.3, -30.4],
	opr3: [12.6, -30.8],
};

export const OFFICIALS_ACTION: OfficialPositions = {
	ipr1: [-24.4, 0.6],
	ipr2: [-4.1, -5.7],
	jrb: [-8.1, -9.6],
	jrg: [23.7, -5.7],
	opr1: [-17.3, -29.6],
	opr2: [-4.1, -30.3],
	opr3: [12.1, -30.8],
};
