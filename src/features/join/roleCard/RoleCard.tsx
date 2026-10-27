import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlayIcon } from "@phosphor-icons/react/dist/csr/Play";
import { withBase } from "@utils/urlHandler";
import "./roleCard.css";

export interface RoleVideo {
	src: string;
	poster: string;
}

interface RoleCardProps {
	id: string;
	title: string;
	lead: string;
	text: string;
	tags: string[];
	cta: string;
	videoSoon: string;
	video?: RoleVideo;
	onPick: () => void;
}

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring" as const, stiffness: 260, damping: 26 },
	},
};

export default function RoleCard({
	id,
	title,
	lead,
	text,
	tags,
	cta,
	videoSoon,
	video,
	onPick,
}: RoleCardProps) {
	const reduceMotion = useReducedMotion();

	// No autoPlay attribute: the server-rendered markup cannot know the
	// visitor's reduced-motion preference, so playback starts once hydrated
	const startVideo = (element: HTMLVideoElement | null) => {
		if (element && !reduceMotion) element.play().catch(() => {});
	};

	return (
		<motion.article
			id={id}
			className="role-card"
			variants={fadeUp}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-40px" }}
		>
			<div className="media">
				{video ? (
					<video
						ref={startVideo}
						src={withBase(video.src)}
						poster={withBase(video.poster)}
						muted
						loop
						playsInline
						preload="metadata"
						aria-hidden
					/>
				) : (
					<div className="placeholder">
						<PlayIcon weight="bold" aria-hidden="true" />
						<span>{videoSoon}</span>
					</div>
				)}
			</div>

			<div className="body">
				<h2>{title}</h2>
				<p className="lead">{lead}</p>
				{text
					.split("\n")
					.filter((line) => line.trim() !== "")
					.map((line) => (
						<p key={line}>{line}</p>
					))}
				<ul className="tags">
					{tags.map((tag) => (
						<li key={tag}>{tag}</li>
					))}
				</ul>
				{/* biome-ignore lint/a11y/useValidAnchor: real in-page navigation, the click only adds the form preset */}
				<a className="cta" href="#contact" onClick={onPick}>
					{cta}
					<ArrowRightIcon weight="bold" aria-hidden="true" />
				</a>
			</div>
		</motion.article>
	);
}
