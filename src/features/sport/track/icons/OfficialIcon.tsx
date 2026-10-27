import { SKATER_RADIUS, type Team } from "../scene/cast";
import { starPoints } from "./SkaterIcon";
import "./icons.css";

interface OfficialIconProps {
	starTeam?: Team;
}

const R = SKATER_RADIUS;
const STRIPES = [-0.55, 0, 0.55];
const REF_STAR = starPoints(0.75, 0.32);

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
