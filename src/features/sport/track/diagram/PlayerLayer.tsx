import OfficialIcon from "../icons/OfficialIcon";
import SkaterIcon from "../icons/SkaterIcon";
import { OFFICIALS, SKATERS } from "../scene/cast";
import { clamp01, DIMMED, type SceneState } from "../scene/sceneState";
import { onTrack } from "./trackGeometry";
import "./diagram.css";

interface PlayerLayerProps {
	frame: SceneState;
}

const translate = (x: number, y: number): string =>
	`translate(${x.toFixed(2)} ${y.toFixed(2)})`;

// Officials and skaters; when jammers are in the spotlight, they get a halo and the rest dims
const PlayerLayer = ({ frame }: PlayerLayerProps) => {
	const dimmed = 1 - DIMMED * frame.spotlight;

	return (
		<>
			{OFFICIALS.map((official) => {
				const f = frame.officials[official.id];
				return (
					<g
						key={official.id}
						transform={translate(f.x, f.y)}
						opacity={clamp01(f.opacity * dimmed)}
					>
						<OfficialIcon starTeam={official.starTeam} />
					</g>
				);
			})}

			{SKATERS.map((skater) => {
				const f = frame.skaters[skater.id];
				const p = onTrack(f.s, f.d);
				const isJammer = skater.role === "jammer";
				return (
					<g
						key={skater.id}
						transform={translate(p.x, p.y)}
						opacity={clamp01(f.opacity * (isJammer ? 1 : dimmed))}
					>
						{isJammer && (
							<g opacity={clamp01(frame.spotlight)}>
								<circle className="halo" r={2.4} />
							</g>
						)}
						<SkaterIcon team={skater.team} kind={skater.role} />
					</g>
				);
			})}
		</>
	);
};

export default PlayerLayer;
