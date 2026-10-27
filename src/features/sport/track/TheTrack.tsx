import type { ReactNode } from "react";
import "./the-track.css";

interface TheTrackProps {
	title: string;
	children?: ReactNode;
}

interface Marker {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

// WFTDA regulation geometry, in feet. Origin = track center, y axis points down.
// Direction of play is counterclockwise: right to left on the top straightaway.
const INNER_ARC_X = 17.5;
const INNER_RADIUS = 12.5;
const OUTER_OFFSET = 1;
const OUTER_RADIUS = 26.5;
const PIVOT_LINE_X = -INNER_ARC_X;
const JAMMER_LINE_X = PIVOT_LINE_X + 30;
const MARKER_DISTANCE = 5.25;
const MARKER_HALF_LENGTH = 1;
// 7'0.5" chord between turn markers, on the inside arc
const TURN_MARKER_STEP = 2 * Math.asin(84.5 / 12 / 2 / INNER_RADIUS);

const INNER_PATH = [
	`M ${-INNER_ARC_X} ${-INNER_RADIUS}`,
	`H ${INNER_ARC_X}`,
	`A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${INNER_ARC_X} ${INNER_RADIUS}`,
	`H ${-INNER_ARC_X}`,
	`A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${-INNER_ARC_X} ${-INNER_RADIUS}`,
	"Z",
].join(" ");

// Outside arc points sit 1' off the inside arc points, in opposite directions
const OUTER_PATH = [
	`M ${-INNER_ARC_X} ${OUTER_OFFSET - OUTER_RADIUS}`,
	`L ${INNER_ARC_X} ${-OUTER_OFFSET - OUTER_RADIUS}`,
	`A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${INNER_ARC_X} ${OUTER_RADIUS - OUTER_OFFSET}`,
	`L ${-INNER_ARC_X} ${OUTER_RADIUS + OUTER_OFFSET}`,
	`A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${-INNER_ARC_X} ${OUTER_OFFSET - OUTER_RADIUS}`,
	"Z",
].join(" ");

// Outer boundary y on the top straightaway, at a given x
const outerTopY = (x: number): number =>
	OUTER_OFFSET -
	OUTER_RADIUS -
	((x + INNER_ARC_X) / (2 * INNER_ARC_X)) * 2 * OUTER_OFFSET;

// Marker centered 5'3" from the inside boundary, along a unit direction from (cx, 0)
const marker = (cx: number, dx: number, dy: number): Marker => {
	const near = INNER_RADIUS + MARKER_DISTANCE - MARKER_HALF_LENGTH;
	const far = INNER_RADIUS + MARKER_DISTANCE + MARKER_HALF_LENGTH;
	return { x1: cx + dx * near, y1: dy * near, x2: cx + dx * far, y2: dy * far };
};

const MARKERS: Marker[] = [
	// Top straightaway, 10' and 20' behind the pivot line
	marker(PIVOT_LINE_X + 10, 0, -1),
	marker(PIVOT_LINE_X + 20, 0, -1),
	// Opposite straightaway, 0' to 30' from point A
	...[0, 10, 20, 30].map((d) => marker(INNER_ARC_X - d, 0, 1)),
	// Five markers per turn, counterclockwise from each inside arc point
	...[1, 2, 3, 4, 5].flatMap((k) => {
		const dx = Math.sin(k * TURN_MARKER_STEP);
		const dy = Math.cos(k * TURN_MARKER_STEP);
		return [marker(-INNER_ARC_X, -dx, -dy), marker(INNER_ARC_X, dx, dy)];
	}),
];

const TheTrack = ({ title, children }: TheTrackProps) => {
	return (
		<div className="the-track">
			<svg
				viewBox="-45 -28.5 90 57"
				role="img"
				aria-labelledby="the-track-title"
			>
				<title id="the-track-title">{title}</title>

				<path className="boundary" d={OUTER_PATH} />
				<path className="boundary" d={INNER_PATH} />

				<line
					className="boundary"
					x1={PIVOT_LINE_X}
					y1={-INNER_RADIUS}
					x2={PIVOT_LINE_X}
					y2={outerTopY(PIVOT_LINE_X)}
				/>
				<line
					className="boundary"
					x1={JAMMER_LINE_X}
					y1={-INNER_RADIUS}
					x2={JAMMER_LINE_X}
					y2={outerTopY(JAMMER_LINE_X)}
				/>

				{MARKERS.map((m) => (
					<line key={`${m.x1}-${m.y1}`} className="marker" {...m} />
				))}

				{/* Jam scene layers, drawn in the same feet-based coordinates */}
				{children}
			</svg>
		</div>
	);
};

export default TheTrack;
