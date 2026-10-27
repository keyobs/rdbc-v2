import type { ReactNode } from "react";
import {
	INNER_ARC_X,
	INNER_PATH,
	INNER_RADIUS,
	JAMMER_LINE_X,
	OUTER_RADIUS,
	PIVOT_LINE_X,
	SAFETY_RADIUS,
	offsetTrackPath,
	outerTopY,
} from "./trackGeometry";
import "./theTrack.css";

interface TheTrackProps {
	title: string;
	directionLabel: string;
	// Blink the pivot and jammer lines to tell them apart
	highlightStartLines?: boolean;
	// SVG layers drawn under the track lines (zones), in the same feet-based coordinates
	underlay?: ReactNode;
	// HTML laid over the diagram (navigation…)
	controls?: ReactNode;
	// SVG layers drawn over the track lines (skaters, officials)
	children?: ReactNode;
}

interface Marker {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

const MARKER_DISTANCE = 5.25;
const MARKER_HALF_LENGTH = 1;
// 7'0.5" chord between turn markers, on the inside arc
const TURN_MARKER_STEP = 2 * Math.asin(84.5 / 12 / 2 / INNER_RADIUS);

// Outside arc points sit 1' off the inside arc points, in opposite directions
const OUTER_PATH = offsetTrackPath(OUTER_RADIUS);
const SAFETY_PATH = offsetTrackPath(SAFETY_RADIUS);

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

const TheTrack = ({
	title,
	directionLabel,
	highlightStartLines = false,
	underlay,
	controls,
	children,
}: TheTrackProps) => {
	return (
		<div
			className={
				highlightStartLines ? "the-track highlight-start" : "the-track"
			}
		>
			<svg
				viewBox="-55 -38.5 110 77"
				role="img"
				aria-labelledby="the-track-title"
			>
				<title id="the-track-title">{title}</title>

				{underlay}

				<path className="safety" d={SAFETY_PATH} />
				<path className="boundary" d={OUTER_PATH} />
				<path className="boundary" d={INNER_PATH} />

				{/* Direction of play, in the infield along the bottom straightaway */}
				<path
					className="play-direction"
					d="M -8 7.5 H 8 M 6.6 6.1 L 8 7.5 L 6.6 8.9"
				/>
				<text className="play-direction-label" x={0} y={5}>
					{directionLabel}
				</text>

				<line
					className="boundary pivot-line"
					x1={PIVOT_LINE_X}
					y1={-INNER_RADIUS}
					x2={PIVOT_LINE_X}
					y2={outerTopY(PIVOT_LINE_X)}
				/>
				<line
					className="boundary jammer-line"
					x1={JAMMER_LINE_X}
					y1={-INNER_RADIUS}
					x2={JAMMER_LINE_X}
					y2={outerTopY(JAMMER_LINE_X)}
				/>

				{MARKERS.map((m) => (
					<line key={`${m.x1}-${m.y1}`} className="marker" {...m} />
				))}

				{children}
			</svg>

			{controls}
		</div>
	);
};

export default TheTrack;
