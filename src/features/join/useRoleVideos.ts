import { useEffect, useRef } from "react";
import type { JoinProfile } from "./joinContent";

/** Synchronize native media elements; manual interaction takes over for this visit. */
export function useRoleVideos(roles: JoinProfile[]) {
	const sectionRef = useRef<HTMLElement>(null);
	const toggleRef = useRef<((id: string) => void) | null>(null);

	useEffect(() => {
		const videos = Array.from(
			sectionRef.current?.querySelectorAll<HTMLVideoElement>(
				"video[data-role-video]",
			) ?? [],
		).filter((video) =>
			roles.some((role) => role.id === video.dataset.roleVideo && role.video),
		);
		if (!videos.length) return;
		const desktop = window.matchMedia("(min-width: 1024px)");
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const visible = new Set<HTMLVideoElement>();
		let cursor = 0;
		let manual = false;
		let blocked = false;
		let active: HTMLVideoElement | null = null;
		let request = 0;
		let disposed = false;

		const pauseOthers = (keep?: HTMLVideoElement) => {
			if (active && active !== keep) {
				active = null;
				request++;
			}
			for (const video of videos) if (video !== keep) video.pause();
		};
		const start = (video: HTMLVideoElement) => {
			if (disposed || document.hidden || !visible.has(video)) return;
			if (active === video && !video.paused) return;
			pauseOthers(video);
			active = video;
			const token = ++request;
			video.muted = true;
			if (!video.getAttribute("src") && video.dataset.src)
				video.src = video.dataset.src;
			if (video.ended) video.currentTime = 0;
			video
				.play()
				.then(() => {
					if (
						disposed ||
						active !== video ||
						document.hidden ||
						!visible.has(video)
					)
						video.pause();
				})
				.catch(() => {
					// Browsers may reject autoplay. Leave the play button available without retrying.
					if (request === token && active === video) {
						active = null;
						blocked = true;
					}
				});
		};
		const reconcile = () => {
			if (active && (document.hidden || !visible.has(active))) pauseOthers();
			if (manual) return;
			if (!desktop.matches || reduced.matches || document.hidden || blocked) {
				pauseOthers();
				return;
			}
			const next = videos[cursor];
			if (next && visible.has(next)) start(next);
		};
		const ended = (event: Event) => {
			const video = event.currentTarget as HTMLVideoElement;
			if (active === video) {
				active = null;
				request++;
			}
			if (!manual && videos[cursor] === video) {
				cursor++;
				reconcile();
			}
		};
		const failed = (event: Event) => {
			if (!manual && videos[cursor] === event.currentTarget) ended(event);
		};
		const keepMuted = (event: Event) => {
			const video = event.currentTarget as HTMLVideoElement;
			if (!video.muted) video.muted = true;
		};
		const played = (event: Event) => {
			const video = event.currentTarget as HTMLVideoElement;
			if (active !== video || document.hidden || !visible.has(video))
				video.pause();
			else pauseOthers(video);
		};
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const video = entry.target as HTMLVideoElement;
					if (entry.isIntersecting && entry.intersectionRatio >= 0.25)
						visible.add(video);
					else visible.delete(video);
				}
				reconcile();
			},
			{ threshold: [0, 0.25] },
		);
		for (const video of videos) {
			observer.observe(video);
			video.addEventListener("ended", ended);
			video.addEventListener("error", failed);
			video.addEventListener("play", played);
			video.addEventListener("volumechange", keepMuted);
		}
		desktop.addEventListener("change", reconcile);
		reduced.addEventListener("change", reconcile);
		document.addEventListener("visibilitychange", reconcile);
		toggleRef.current = (id) => {
			const video = videos.find((item) => item.dataset.roleVideo === id);
			if (!video) return;
			manual = true;
			if (active === video && !video.paused) pauseOthers();
			else start(video);
		};
		return () => {
			disposed = true;
			toggleRef.current = null;
			observer.disconnect();
			desktop.removeEventListener("change", reconcile);
			reduced.removeEventListener("change", reconcile);
			document.removeEventListener("visibilitychange", reconcile);
			for (const video of videos) {
				video.removeEventListener("ended", ended);
				video.removeEventListener("error", failed);
				video.removeEventListener("play", played);
				video.removeEventListener("volumechange", keepMuted);
			}
			pauseOthers();
		};
	}, [roles]);

	return { sectionRef, toggleVideo: (id: string) => toggleRef.current?.(id) };
}
