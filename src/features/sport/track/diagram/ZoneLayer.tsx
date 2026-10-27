import { clamp01, type ZoneFrame } from "../scene/sceneState";
import { zonePath } from "./trackGeometry";
import "./diagram.css";

interface ZoneLayerProps {
	pack: ZoneFrame;
	engagement: ZoneFrame;
}

// Pack (solid) and engagement zone (hatched); the hatch pattern is also used by the legend
const ZoneLayer = ({ pack, engagement }: ZoneLayerProps) => (
	<>
		<defs>
			<pattern
				id="track-hatch"
				width={1.4}
				height={1.4}
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(45)"
			>
				<line className="hatch-line" x1={0} y1={0} x2={0} y2={1.4} />
			</pattern>
		</defs>
		<path
			className="engagement-zone"
			d={zonePath(engagement.rear, engagement.front)}
			opacity={clamp01(engagement.opacity)}
		/>
		<path
			className="pack-zone"
			d={zonePath(pack.rear, pack.front)}
			opacity={clamp01(pack.opacity)}
		/>
	</>
);

export default ZoneLayer;
