import type { Icon } from "@phosphor-icons/react";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CameraIcon } from "@phosphor-icons/react/dist/csr/Camera";
import { ConfettiIcon } from "@phosphor-icons/react/dist/csr/Confetti";
import { CrownIcon } from "@phosphor-icons/react/dist/csr/Crown";
import { FlaskIcon } from "@phosphor-icons/react/dist/csr/Flask";
import { IslandIcon } from "@phosphor-icons/react/dist/csr/Island";
import { MonitorIcon } from "@phosphor-icons/react/dist/csr/Monitor";
import { PlugsIcon } from "@phosphor-icons/react/dist/csr/Plugs";
import { StrategyIcon } from "@phosphor-icons/react/dist/csr/Strategy";
import { TargetIcon } from "@phosphor-icons/react/dist/csr/Target";
import { TrophyIcon } from "@phosphor-icons/react/dist/csr/Trophy";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import type { FeedIconKey } from "./types";

// Keys match the icon list of sanity/schemaTypes/feedIcons.ts
const ICONS: Record<Exclude<FeedIconKey, "club">, Icon> = {
	alert: WarningIcon,
	game: StrategyIcon,
	event: BellIcon,
	crown: CrownIcon,
	party: ConfettiIcon,
	holiday: IslandIcon,
	target: TargetIcon,
	trophy: TrophyIcon,
	experiment: FlaskIcon,
	connect: PlugsIcon,
	camera: CameraIcon,
	screen: MonitorIcon,
};

const CLUB_GLYPH = "(•̪●)";

interface FeedIconProps {
	icon: FeedIconKey;
	className?: string;
}

/** Decorative: the title of the feed carries the information. */
const FeedIcon = ({ icon, className }: FeedIconProps) => {
	if (icon === "club") {
		return (
			<span className={className} aria-hidden="true">
				{CLUB_GLYPH}
			</span>
		);
	}
	const IconComponent = ICONS[icon];
	return (
		<IconComponent className={className} weight="bold" aria-hidden="true" />
	);
};

export default FeedIcon;
