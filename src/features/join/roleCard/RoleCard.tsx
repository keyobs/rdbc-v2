import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlayIcon } from "@phosphor-icons/react/dist/csr/Play";
import { PauseIcon } from "@phosphor-icons/react/dist/csr/Pause";
import { withBase } from "@utils/urlHandler";
import Reveal from "@components/reveal/Reveal";
import "./roleCard.css";

export interface RoleVideo {
	src: string;
	poster?: string;
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
	poster?: string;
	playLabel: string;
	pauseLabel: string;
	onVideoToggle: () => void;
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
	poster,
	playLabel,
	pauseLabel,
	onVideoToggle,
	onPick,
}: RoleCardProps) {
	const [playing, setPlaying] = useState(false);
	const [ended, setEnded] = useState(false);
	const cover = video?.poster ?? poster;
	const mediaUrl = (url: string) => (url.startsWith("/") ? withBase(url) : url);

	return (
		<Reveal as="article" id={id} className="role-card" variants={fadeUp}>
			<div className="media">
				{video ? (
					<>
						<video
							id={`role-video-${id}`}
							data-role-video={id}
							data-src={mediaUrl(video.src)}
							poster={video.poster ? mediaUrl(video.poster) : undefined}
							muted
							playsInline
							preload="none"
							onPlay={() => {
								setPlaying(true);
								setEnded(false);
							}}
							onPause={() => setPlaying(false)}
							onEnded={() => {
								setPlaying(false);
								setEnded(true);
							}}
							onError={() => setPlaying(false)}
							aria-hidden
						/>
						{ended && cover && (
							<img
								className="video-end-cover"
								src={mediaUrl(cover)}
								alt=""
								decoding="async"
								width={800}
								height={800}
							/>
						)}
						<button
							type="button"
							className="video-toggle"
							aria-label={`${playing ? pauseLabel : playLabel} — ${title}`}
							aria-controls={`role-video-${id}`}
							onClick={onVideoToggle}
						>
							{playing ? (
								<PauseIcon weight="bold" aria-hidden="true" />
							) : (
								<PlayIcon weight="bold" aria-hidden="true" />
							)}
						</button>
					</>
				) : poster ? (
					<img
						src={mediaUrl(poster)}
						alt=""
						loading="lazy"
						decoding="async"
						width={800}
						height={800}
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
		</Reveal>
	);
}
