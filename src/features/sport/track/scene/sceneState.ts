import {
	isOnTurn,
	PERIMETER,
	type TrackPosition,
	toTrack,
	trackWidthAt,
} from "../diagram/trackGeometry";
import {
	OFFICIALS,
	type OfficialId,
	SKATERS,
	type SkaterId,
	type SkaterPositions,
} from "./cast";
import { OFFICIALS_START, START } from "./positions";
import { SITUATIONS, type Situation } from "./situations";

// Type alias (not interface) so it fits Record<string, number> in lerpRecord
type SkaterFrame = {
	s: number;
	d: number;
	opacity: number;
};

// Officials also live in track coordinates, so they glide along the track
type OfficialFrame = SkaterFrame;

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

// Officials' distance from the track: infield (wider in the turns) and outer lane
const INFIELD_GAP = 3;
const TURN_INFIELD_GAP = 5;
const OUTER_LANE_GAP = 5;
// Inside ref 2 sits deeper, so it never covers a jammer ref
const DEEP_INFIELD_EXTRA = 4;
const FRONT_REF_LEAD = 3;

const infield = (s: number, extra = 0): TrackPosition => ({
	s,
	d: -(isOnTurn(s) ? TURN_INFIELD_GAP : INFIELD_GAP) - extra,
});

const outerLane = (s: number): TrackPosition => ({
	s,
	d: trackWidthAt(s) + OUTER_LANE_GAP,
});

// Where each official stands to follow the action
const followAction = (
	skaters: SkaterPositions,
	rear: number,
	front: number,
	outsideRefsOnSkaters: boolean,
): Record<OfficialId, TrackPosition> => {
	const middle = (rear + front) / 2;
	const rearmostSkater = Math.min(...Object.values(skaters).map(([s]) => s));
	// Blockers may stand ahead of the pack while still in the engagement zone
	const frontBlockerInZone = Math.max(
		...SKATERS.filter((k) => k.role !== "jammer")
			.map((k) => skaters[k.id][0])
			.filter((s) => s <= front + ENGAGEMENT_DISTANCE),
	);
	// Inside ref 2 follows the trailing jammer while she is close to the pack
	const trailingJammer = Math.min(skaters.gj[0], skaters.bj[0]);
	const action = trailingJammer >= rear - PROXIMITY ? trailingJammer : middle;

	return {
		jrg: infield(skaters.gj[0]),
		jrb: infield(skaters.bj[0]),
		ipr1: infield(front + FRONT_REF_LEAD),
		ipr2: infield(action, DEEP_INFIELD_EXTRA),
		opr1: outerLane(
			outsideRefsOnSkaters ? frontBlockerInZone : front + ENGAGEMENT_DISTANCE,
		),
		opr2: outerLane(middle),
		opr3: outerLane(
			outsideRefsOnSkaters ? rearmostSkater : rear - ENGAGEMENT_DISTANCE,
		),
	};
};

const toSceneState = (situation: Situation): SceneState => {
	const skaters = situation.skaters ?? START;
	const officials = situation.officials ?? OFFICIALS_START;
	const [rear, front] = packBounds(skaters);
	const followed = followAction(
		skaters,
		rear,
		front,
		situation.outsideRefsOnSkaters ?? false,
	);
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
			OFFICIALS.map((k) => {
				const [x, y] = officials[k.id];
				const position = situation.trackedOfficials?.includes(k.id)
					? followed[k.id]
					: toTrack({ x, y });
				return [k.id, { ...position, opacity: situation.officials ? 1 : 0 }];
			}),
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

// Officials take the short way around the track: their s values may sit a lap apart
const lerpOfficials = (
	from: Record<OfficialId, OfficialFrame>,
	to: Record<OfficialId, OfficialFrame>,
	t: number,
): Record<OfficialId, OfficialFrame> =>
	Object.fromEntries(
		OFFICIALS.map(({ id }) => {
			const delta = to[id].s - from[id].s;
			return [
				id,
				{
					s:
						from[id].s +
						(delta - PERIMETER * Math.round(delta / PERIMETER)) * t,
					d: lerp(from[id].d, to[id].d, t),
					opacity: lerp(from[id].opacity, to[id].opacity, t),
				},
			];
		}),
	) as Record<OfficialId, OfficialFrame>;

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
	officials: lerpOfficials(from.officials, to.officials, t),
	pack: lerpZone(from.pack, to.pack, t),
	engagement: lerpZone(from.engagement, to.engagement, t),
	spotlight: lerp(from.spotlight, to.spotlight, t),
});
