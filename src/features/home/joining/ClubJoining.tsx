import "./clubJoining.css";

import type { Icon } from "@phosphor-icons/react";
import { FlagCheckeredIcon } from "@phosphor-icons/react/dist/csr/FlagCheckered";
import { HandHeartIcon } from "@phosphor-icons/react/dist/csr/HandHeart";
import { HeartIcon } from "@phosphor-icons/react/dist/csr/Heart";
import { PersonSimpleRunIcon } from "@phosphor-icons/react/dist/csr/PersonSimpleRun";
import { withBase } from "@utils/urlHandler";

export interface JoiningPosition {
	id: string;
	title: string;
	description: string;
	icon?: string | null;
	href?: string | null;
}

interface ClubJoiningProps {
	positions: JoiningPosition[];
	title: string;
	subtitle: string;
	moreLabel: string;
}

// Keys match the icon list of the `homeJoiningSection` Sanity schema
const ICONS: Record<string, Icon> = {
	play: PersonSimpleRunIcon,
	referee: FlagCheckeredIcon,
	support: HandHeartIcon,
	fun: HeartIcon,
};

const resolveHref = (href: string): string =>
	href.startsWith("http") ? href : withBase(href);

const ClubJoining = ({
	positions,
	title,
	subtitle,
	moreLabel,
}: ClubJoiningProps) => {
	if (positions.length === 0) return null;

	return (
		<section className="home-wrap club-joining" aria-labelledby="join-title">
			<h2 className="club-joining__title" id="join-title">
				{title}
			</h2>
			<p className="club-joining__subtitle">{subtitle}</p>

			<ul className="club-joining__grid">
				{positions.map((position) => {
					const PositionIcon = position.icon ? ICONS[position.icon] : undefined;
					const content = (
						<>
							{PositionIcon && (
								<PositionIcon
									className="join-card__icon"
									weight="bold"
									aria-hidden="true"
								/>
							)}
							<h3 className="join-card__title">{position.title}</h3>
							<p className="join-card__description">{position.description}</p>
							{position.href && (
								<span className="join-card__more">{moreLabel} →</span>
							)}
						</>
					);

					return (
						<li key={position.id} className="club-joining__item">
							{position.href ? (
								<a className="join-card" href={resolveHref(position.href)}>
									{content}
								</a>
							) : (
								<div className="join-card">{content}</div>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default ClubJoining;
