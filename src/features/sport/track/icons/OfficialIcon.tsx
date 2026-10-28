import { SKATER_RADIUS, type Team } from "../scene/cast";
import { starPoints } from "./SkaterIcon";
import "./icons.css";

interface OfficialIconProps {
	starTeam?: Team;
}

const R = SKATER_RADIUS;
// Inner marks scale with the disc
const STRIPES = [-R * 0.41, 0, R * 0.41];
const REF_STAR = starPoints(R * 0.56, R * 0.24);

// Striped referee jersey; jammer referees add a star in their jammer's color
const OfficialIcon = ({ starTeam }: OfficialIconProps) => (
	<g className="official">
		<circle className="disc" r={R} />
		{STRIPES.map((x) => {
			const half = Math.sqrt(R * R - x * x) - 0.05;
			return (
				<line key={x} className="stripe" x1={x} x2={x} y1={-half} y2={half} />
			);
		})}
		{starTeam && <polygon className={`star ${starTeam}`} points={REF_STAR} />}
	</g>
);

export default OfficialIcon;
