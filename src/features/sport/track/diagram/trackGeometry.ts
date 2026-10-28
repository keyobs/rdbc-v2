// WFTDA regulation geometry, in feet. Origin = track center, y axis points down.
// Direction of play is counterclockwise: right to left on the top straightaway.
export const INNER_ARC_X = 17.5;
export const INNER_RADIUS = 12.5;
export const OUTER_OFFSET = 1;
export const OUTER_RADIUS = 26.5;
// Safety zone and outer officiating lane: 10' around the outer boundary (108' × 75' overall)
export const SAFETY_RADIUS = OUTER_RADIUS + 10;
export const PIVOT_LINE_X = -INNER_ARC_X;
export const JAMMER_LINE_X = PIVOT_LINE_X + 30;

const TURN = Math.PI * INNER_RADIUS;
const STRAIGHT = 2 * INNER_ARC_X;
export const PERIMETER = 2 * TURN + 2 * STRAIGHT;

export interface Point {
	x: number;
	y: number;
}

// s along the track from the pivot line, d from the inside boundary (negative = infield)
export interface TrackPosition {
	s: number;
	d: number;
}

interface BoundaryPoint extends Point {
	nx: number;
	ny: number;
}

// Track shape whose turns are semicircles of `radius`, centered 1' off the inside arc points
export const offsetTrackPath = (radius: number): string =>
	[
		`M ${-INNER_ARC_X} ${OUTER_OFFSET - radius}`,
		`L ${INNER_ARC_X} ${-OUTER_OFFSET - radius}`,
		`A ${radius} ${radius} 0 0 1 ${INNER_ARC_X} ${radius - OUTER_OFFSET}`,
		`L ${-INNER_ARC_X} ${radius + OUTER_OFFSET}`,
		`A ${radius} ${radius} 0 0 1 ${-INNER_ARC_X} ${OUTER_OFFSET - radius}`,
		"Z",
	].join(" ");

export const INNER_PATH = [
	`M ${-INNER_ARC_X} ${-INNER_RADIUS}`,
	`H ${INNER_ARC_X}`,
	`A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${INNER_ARC_X} ${INNER_RADIUS}`,
	`H ${-INNER_ARC_X}`,
	`A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${-INNER_ARC_X} ${-INNER_RADIUS}`,
	"Z",
].join(" ");

// Outer boundary y on the top straightaway, at a given x
export const outerTopY = (x: number): number =>
	OUTER_OFFSET -
	OUTER_RADIUS -
	((x + INNER_ARC_X) / STRAIGHT) * 2 * OUTER_OFFSET;

// Point on the inside boundary at distance s along the direction of play (s = 0 on the
// pivot line), with the outward unit normal
const insideAt = (s: number): BoundaryPoint => {
	let t = ((s % PERIMETER) + PERIMETER) % PERIMETER;
	if (t < TURN) {
		const a = t / INNER_RADIUS;
		return {
			x: -INNER_ARC_X - INNER_RADIUS * Math.sin(a),
			y: -INNER_RADIUS * Math.cos(a),
			nx: -Math.sin(a),
			ny: -Math.cos(a),
		};
	}
	t -= TURN;
	if (t < STRAIGHT)
		return { x: -INNER_ARC_X + t, y: INNER_RADIUS, nx: 0, ny: 1 };
	t -= STRAIGHT;
	if (t < TURN) {
		const a = t / INNER_RADIUS;
		return {
			x: INNER_ARC_X + INNER_RADIUS * Math.sin(a),
			y: INNER_RADIUS * Math.cos(a),
			nx: Math.sin(a),
			ny: Math.cos(a),
		};
	}
	t -= TURN;
	return { x: INNER_ARC_X - t, y: -INNER_RADIUS, nx: 0, ny: -1 };
};

// The outer boundary is the set of points at OUTER_RADIUS from the segment joining the
// outside arc points
const distToOuterAxis = ({ x, y }: Point): number => {
	const ax = -INNER_ARC_X;
	const ay = OUTER_OFFSET;
	const bx = INNER_ARC_X;
	const by = -OUTER_OFFSET;
	const k = Math.max(
		0,
		Math.min(
			1,
			((x - ax) * (bx - ax) + (y - ay) * (by - ay)) /
				((bx - ax) ** 2 + (by - ay) ** 2),
		),
	);
	return Math.hypot(x - (ax + k * (bx - ax)), y - (ay + k * (by - ay)));
};

// Skater position: s along the track, d = distance from the inside boundary
export const onTrack = (s: number, d: number): Point => {
	const p = insideAt(s);
	return { x: p.x + p.nx * d, y: p.y + p.ny * d };
};

// Inverse of onTrack: track position of a point, from the nearest inside boundary point
export const toTrack = ({ x, y }: Point): TrackPosition => {
	if (x < -INNER_ARC_X) {
		const dx = x + INNER_ARC_X;
		return {
			s: INNER_RADIUS * Math.atan2(-dx, -y),
			d: Math.hypot(dx, y) - INNER_RADIUS,
		};
	}
	if (x > INNER_ARC_X) {
		const dx = x - INNER_ARC_X;
		return {
			s: TURN + STRAIGHT + INNER_RADIUS * Math.atan2(dx, y),
			d: Math.hypot(dx, y) - INNER_RADIUS,
		};
	}
	if (y > 0) return { s: TURN + x + INNER_ARC_X, d: y - INNER_RADIUS };
	return { s: 2 * TURN + STRAIGHT + INNER_ARC_X - x, d: -INNER_RADIUS - y };
};

export const isOnTurn = (s: number): boolean => {
	const t = ((s % PERIMETER) + PERIMETER) % PERIMETER;
	return t < TURN || (t >= TURN + STRAIGHT && t < 2 * TURN + STRAIGHT);
};

// Track width at s: distance from the inside to the outside boundary
export const trackWidthAt = (s: number): number => {
	let lo = 0;
	let hi = 20;
	for (let i = 0; i < 30; i++) {
		const mid = (lo + hi) / 2;
		if (distToOuterAxis(onTrack(s, mid)) < OUTER_RADIUS) lo = mid;
		else hi = mid;
	}
	return lo;
};

const outsideAt = (s: number): Point => onTrack(s, trackWidthAt(s));

// Area of the track between s1 (rear) and s2 (front)
export const zonePath = (s1: number, s2: number): string => {
	if (s2 - s1 < 0.05) return "";
	const steps = Math.max(2, Math.ceil((s2 - s1) / 0.5));
	const at = (i: number): number => s1 + ((s2 - s1) * i) / steps;
	const points: Point[] = [];
	for (let i = 0; i <= steps; i++) points.push(onTrack(at(i), 0));
	for (let i = steps; i >= 0; i--) points.push(outsideAt(at(i)));
	return `M${points.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L")} Z`;
};
