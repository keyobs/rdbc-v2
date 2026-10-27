import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { lerpScene, type SceneState } from "./sceneState";

// Springs every skater, official and zone from the current frame to the target scene.
// The effect syncs with Motion's animation loop, an external system.
export const useSceneTransition = (target: SceneState): SceneState => {
	const [frame, setFrame] = useState<SceneState>(target);
	const frameRef = useRef<SceneState>(target);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		const from = frameRef.current;
		if (from === target) return;

		if (reduceMotion) {
			frameRef.current = target;
			setFrame(target);
			return;
		}

		const controls = animate(0, 1, {
			type: "spring",
			stiffness: 90,
			damping: 18,
			onUpdate: (t) => {
				frameRef.current = lerpScene(from, target, t);
				setFrame(frameRef.current);
			},
			onComplete: () => {
				frameRef.current = target;
				setFrame(target);
			},
		});

		return () => controls.stop();
	}, [target, reduceMotion]);

	return frame;
};
