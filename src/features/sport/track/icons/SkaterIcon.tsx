import { SKATER_RADIUS, type SkaterRole, type Team } from "../scene/cast";
import "./icons.css";

interface SkaterIconProps {
	team: Team;
	kind: SkaterRole;
}

const R = SKATER_RADIUS;

// 5-pointed star centered on the origin
export const starPoints = (outer: number, inner: number): string =>
	Array.from({ length: 10 }, (_, i) => {
		const a = (Math.PI / 5) * i - Math.PI / 2;
		const r = i % 2 ? inner : outer;
		return `${(Math.cos(a) * r).toFixed(3)},${(Math.sin(a) * r).toFixed(3)}`;
	}).join(" ");

const JAMMER_STAR = starPoints(0.95, 0.4);

// Blocker = ring, pivot = stripe, jammer = star; drawn at the origin, in feet
const SkaterIcon = ({ team, kind }: SkaterIconProps) => (
	<g className={`skater ${team}`}>
		<circle className="disc" r={R} />
		{kind === "blocker" && <circle className="ring" r={0.85} />}
		{kind === "pivot" && (
			<line className="stripe" x1={-R + 0.05} x2={R - 0.05} y1={0} y2={0} />
		)}
		{kind === "jammer" && <polygon className="star" points={JAMMER_STAR} />}
	</g>
);

export default SkaterIcon;
