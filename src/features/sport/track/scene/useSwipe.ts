import { useRef } from "react";
import type { PointerEvent } from "react";

interface SwipeHandlers {
	onPointerDown: (event: PointerEvent<HTMLElement>) => void;
	onPointerUp: (event: PointerEvent<HTMLElement>) => void;
}

const SWIPE_THRESHOLD = 40;

// Horizontal swipe; presses on links and buttons are left to them
export const useSwipe = (
	onSwipeLeft: () => void,
	onSwipeRight: () => void,
): SwipeHandlers => {
	const startX = useRef<number | null>(null);

	return {
		onPointerDown: (event) => {
			const target = event.target as Element;
			startX.current = target.closest("a, button") ? null : event.clientX;
		},
		onPointerUp: (event) => {
			if (startX.current === null) return;
			const dx = event.clientX - startX.current;
			startX.current = null;
			if (dx < -SWIPE_THRESHOLD) onSwipeLeft();
			if (dx > SWIPE_THRESHOLD) onSwipeRight();
		},
	};
};
