import { type HTMLMotionProps, motion, useInView } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

const TAGS = {
	article: motion.article,
	div: motion.div,
	h1: motion.h1,
	h2: motion.h2,
	li: motion.li,
};

type InViewMargin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

interface RevealProps
	extends Omit<
		HTMLMotionProps<"div">,
		"ref" | "initial" | "animate" | "whileInView" | "viewport"
	> {
	as?: keyof typeof TAGS;
	// Viewport margin before the block is revealed
	margin?: InViewMargin;
}

// Scroll reveal that never hides content without JS: the server HTML shows the block,
// and once hydrated only blocks still off screen are hidden until scrolled into view.
// `variants` must define "hidden" and "visible".
export default function Reveal({
	as = "div",
	margin = "-40px",
	...props
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin });
	const [deferred, setDeferred] = useState(false);

	// Layout effect: off-screen blocks get hidden before the first paint after hydration
	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		const { top, bottom, left, right } = element.getBoundingClientRect();
		const offScreen =
			top >= window.innerHeight ||
			bottom <= 0 ||
			left >= window.innerWidth ||
			right <= 0;
		if (offScreen) setDeferred(true);
	}, []);

	// Each tag shares the div props used here; the cast only picks the element type
	const Tag = TAGS[as] as typeof motion.div;

	return (
		<Tag
			ref={ref}
			initial={false}
			animate={deferred && !inView ? "hidden" : "visible"}
			{...props}
		/>
	);
}
