import type { KeyItem } from "../scene/situations";
import OfficialIcon from "./OfficialIcon";
import SkaterIcon from "./SkaterIcon";
import "./icons.css";

interface KeyIconProps {
	item: KeyItem;
}

const KeyIcon = ({ item }: KeyIconProps) => (
	<svg className="key-icon" viewBox="-2.6 -2.6 5.2 5.2" aria-hidden="true">
		{item === "pivotLine" && (
			<line
				className="start-line pivot-line"
				x1={0}
				y1={-2.2}
				x2={0}
				y2={2.2}
			/>
		)}
		{item === "jammerLine" && (
			<line
				className="start-line jammer-line"
				x1={0}
				y1={-2.2}
				x2={0}
				y2={2.2}
			/>
		)}
		{item === "safety" && (
			<line className="safety-line" x1={0} y1={-2.2} x2={0} y2={2.2} />
		)}
		{item === "blocker" && <SkaterIcon team="green" kind="blocker" />}
		{item === "pivot" && <SkaterIcon team="green" kind="pivot" />}
		{item === "jammer" && <SkaterIcon team="blue" kind="jammer" />}
		{item === "teams" && (
			<>
				<g transform="translate(-0.8 0)">
					<SkaterIcon team="green" kind="blocker" />
				</g>
				<g transform="translate(0.8 0)">
					<SkaterIcon team="blue" kind="blocker" />
				</g>
			</>
		)}
		{item === "official" && <OfficialIcon />}
		{item === "jammerRef" && <OfficialIcon starTeam="green" />}
		{item === "pack" && (
			<rect className="pack-zone" x={-2.2} y={-2.2} width={4.4} height={4.4} />
		)}
		{item === "engagement" && (
			<rect
				className="engagement-zone"
				x={-2.2}
				y={-2.2}
				width={4.4}
				height={4.4}
			/>
		)}
	</svg>
);

export default KeyIcon;
