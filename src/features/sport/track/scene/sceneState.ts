import {
	OFFICIALS,
	type OfficialId,
	SKATERS,
	type SkaterId,
	type SkaterPositions,
} from "./cast";
import { OFFICIALS_START, START } from "./positions";
import { SITUATIONS, type Situation } from "./situations";

// Type aliases (not interfaces) so they fit Record<string, number> in lerpRecord
type SkaterFrame = {
	s: number;
	d: number;
	opacity: number;
};

type OfficialFrame = {
	x: number;
	y: number;
	opacity: number;
};

export interface ZoneFrame {
	rear: number;
	front: number;
	opacity: number;
}

export interface SceneState {
	skaters: Record<SkaterId, SkaterFrame>;
	officials: Record<OfficialId, OfficialFrame>;
	pack: ZoneFrame;
	engagement: ZoneFrame;
	spotlight: number;
}

const PROXIMITY = 10;
const ENGAGEMENT_DISTANCE = 20;
// Opacity loss of everything but the jammers when they are in the spotlight
export const DIMMED = 0.5;

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// Pack = largest group of blockers no more than 10' apart; jammers never count
const packBounds = (positions: SkaterPositions): [number, number] => {
	const s = SKATERS.filter((k) => k.role !== "jammer")
		.map((k) => positions[k.id][0])
		.sort((a, b) => a - b);
	const groups: number[][] = [[s[0]]];
	for (let i = 1; i < s.length; i++) {
		if (s[i] - s[i - 1] <= PROXIMITY) groups[groups.length - 1].push(s[i]);
		else groups.push([s[i]]);
	}
	const pack = groups.reduce((best, g) => (g.length > best.length ? g : best));
	return [pack[0], pack[pack.length - 1]];
};

const toSceneState = (situation: Situation): SceneState => {
	const skaters = situation.skaters ?? START;
	const officials = situation.officials ?? OFFICIALS_START;
	const [rear, front] = packBounds(skaters);
	const zoneOpacity = situation.spotlightJammers ? 1 - DIMMED : 1;

	return {
		skaters: Object.fromEntries(
			SKATERS.map((k) => [
				k.id,
				{
					s: skaters[k.id][0],
					d: skaters[k.id][1],
					opacity: situation.skaters ? 1 : 0,
				},
			]),
		) as Record<SkaterId, SkaterFrame>,
		officials: Object.fromEntries(
			OFFICIALS.map((k) => [
				k.id,
				{
					x: officials[k.id][0],
					y: officials[k.id][1],
					opacity: situation.officials ? 1 : 0,
				},
			]),
		) as Record<OfficialId, OfficialFrame>,
		pack: { rear, front, opacity: situation.pack ? zoneOpacity : 0 },
		engagement: {
			rear: rear - ENGAGEMENT_DISTANCE,
			front: front + ENGAGEMENT_DISTANCE,
			opacity: situation.engagement ? zoneOpacity : 0,
		},
		spotlight: situation.spotlightJammers ? 1 : 0,
	};
};

// One stable state per situation, so transitions can compare references
export const SCENE_STATES: SceneState[] = SITUATIONS.map(toSceneState);

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const lerpRecord = <K extends string, V extends Record<string, number>>(
	from: Record<K, V>,
	to: Record<K, V>,
	t: number,
): Record<K, V> =>
	Object.fromEntries(
		(Object.keys(to) as K[]).map((key) => [
			key,
			Object.fromEntries(
				Object.keys(to[key]).map((p) => [p, lerp(from[key][p], to[key][p], t)]),
			),
		]),
	) as Record<K, V>;

const lerpZone = (from: ZoneFrame, to: ZoneFrame, t: number): ZoneFrame => ({
	rear: lerp(from.rear, to.rear, t),
	front: lerp(from.front, to.front, t),
	opacity: lerp(from.opacity, to.opacity, t),
});

export const lerpScene = (
	from: SceneState,
	to: SceneState,
	t: number,
): SceneState => ({
	skaters: lerpRecord(from.skaters, to.skaters, t),
	officials: lerpRecord(from.officials, to.officials, t),
	pack: lerpZone(from.pack, to.pack, t),
	engagement: lerpZone(from.engagement, to.engagement, t),
	spotlight: lerp(from.spotlight, to.spotlight, t),
});
