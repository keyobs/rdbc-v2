import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import type { Translations } from "@i18n/index";
import { getSeasonCount, type TeamMember } from "../roster";
import "./playerCard.css";

interface PlayerCardProps {
	member: TeamMember;
	labels: Translations["teams"];
	currentStart: number;
	hallOfFame?: boolean;
}

export default function PlayerCard({
	member,
	labels,
	currentStart,
	hallOfFame = false,
}: PlayerCardProps) {
	const [flipped, setFlipped] = useState(false);
	const reduceMotion = useReducedMotion();
	const detailsId = useId();
	const category = member.category ?? "skater";
	const skater = category === "skater";
	const role =
		category === "referee" && member.official_roles?.length
			? `${labels.categories.referee} · ${member.official_roles.join(" / ")}`
			: labels.categories[category];
	const roles = skater
		? (member.role ?? [])
				.filter(
					(position): position is keyof typeof labels.roles =>
						position in labels.roles,
				)
				.map((position) => labels.roles[position])
		: [role];
	const seasons = getSeasonCount(member, currentStart);
	const first = member.first_season;
	const last = member.last_season;
	const period =
		first === undefined
			? ""
			: last !== undefined
				? `${first}–${first + 1} / ${last}–${last + 1}`
				: `${labels.since} ${first}–${first + 1}`;
	const standby = !hallOfFame && member.standby === true;

	return (
		<button
			type="button"
			className="player-card"
			aria-pressed={flipped}
			aria-label={`${flipped ? labels.backToPhoto : labels.flip} ${member.name}${standby ? ` — ${labels.standby}` : ""}`}
			aria-describedby={flipped ? detailsId : undefined}
			onClick={() => setFlipped((value) => !value)}
			onPointerEnter={(event) => {
				if (
					event.pointerType === "mouse" &&
					window.matchMedia("(hover: hover)").matches
				)
					setFlipped(true);
			}}
			onPointerLeave={(event) => {
				if (event.pointerType === "mouse") setFlipped(false);
			}}
			onBlur={() => setFlipped(false)}
			onKeyDown={(event) => {
				if (event.key === "Escape") setFlipped(false);
			}}
		>
			<motion.span
				className="player-card__inner"
				initial={false}
				animate={{ rotateY: flipped ? 180 : 0 }}
				transition={
					reduceMotion
						? { duration: 0 }
						: { type: "spring", stiffness: 180, damping: 24 }
				}
			>
				<span
					className="player-card__face player-card__front"
					aria-hidden={flipped}
				>
					<span className="player-card__ruler" aria-hidden="true">
						180 ─<br />
						170 ─<br />
						160 ─<br />
						150 ─<br />
						140 ─
					</span>
					{member.photoUrl ? (
						<img
							className="player-card__photo"
							src={member.photoUrl}
							alt=""
							loading="lazy"
							decoding="async"
							width={640}
							height={840}
						/>
					) : (
						<svg
							className="player-card__silhouette"
							viewBox="0 0 200 260"
							aria-hidden="true"
						>
							<path
								fill="currentColor"
								d="M44 255v-47q0-33 35-39v-21q-20-13-20-48 0-49 41-49t41 49q0 35-20 48v21q35 6 35 39v47z"
							/>
						</svg>
					)}
					{skater && member.number && (
						<span className="player-card__number">{member.number}</span>
					)}
					{!skater && <span className="player-card__role">{role}</span>}
					{hallOfFame && (
						<span className="player-card__honour">
							<StarIcon weight="bold" aria-hidden="true" /> Hall of Fame
						</span>
					)}
					{standby && (
						<span className="player-card__standby">{labels.standby}</span>
					)}
					<span className="player-card__nameplate">
						{member.name}
						<ArrowClockwiseIcon weight="bold" aria-hidden="true" />
					</span>
				</span>
				<span
					className="player-card__face player-card__back"
					id={detailsId}
					aria-hidden={!flipped}
				>
					<strong>{member.name}</strong>
					{roles.length > 0 && (
						<span>
							<span className="player-card__label">
								{skater ? labels.positions : labels.role}
							</span>
							<span className="player-card__badges">
								{roles.map((position) => (
									<span className="player-card__badge" key={position}>
										{position}
									</span>
								))}
							</span>
						</span>
					)}
					{member.generation && (
						<span className="player-card__generation">
							{labels.generations[member.generation]}
						</span>
					)}
					{first !== undefined && (
						<span className="player-card__experience">
							<span className="player-card__label">{labels.atClub}</span>
							{seasons !== null && (
								<span>
									{seasons}{" "}
									{seasons === 1 ? labels.seasonOne : labels.seasonMany} ·{" "}
								</span>
							)}
							{period}
						</span>
					)}
					{member.anecdote && (
						<span>
							<span className="player-card__label">
								{hallOfFame ? labels.hallAnecdote : labels.anecdote}
							</span>
							<span className="player-card__anecdote">{member.anecdote}</span>
						</span>
					)}
					<ArrowClockwiseIcon
						className="player-card__return"
						weight="bold"
						aria-hidden="true"
					/>
				</span>
			</motion.span>
		</button>
	);
}
