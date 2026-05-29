import { useScroll, useTransform, motion } from "framer-motion";
import photo1 from "../../assets/hero/match_misty_1-3.jpg";
import photo2 from "../../assets/hero/match_peak_1-1.jpg";
import photo3 from "../../assets/hero/train_kiwi_block.jpeg";
import "./heroStrip.css";

const HeroStrip = () => {
	const { scrollY } = useScroll();
	const x0 = useTransform(scrollY, [0, 400], [0, 30]);
	const x1 = useTransform(scrollY, [0, 400], [0, 50]);
	const x2 = useTransform(scrollY, [0, 400], [0, 70]);

	return (
		<div className="hero-strip">
			<div className="hero-strip__panel hero-strip__panel--left">
				<motion.img
					src={photo1.src}
					alt="Match RDBC"
					className="hero-strip__img"
					style={{ x: x0, scale: 1.5 }}
				/>
			</div>
			<div className="hero-strip__panel hero-strip__panel--mid">
				<motion.img
					src={photo2.src}
					alt="Match RDBC"
					className="hero-strip__img"
					style={{ x: x1, scale: 1.5 }}
				/>
			</div>
			<div className="hero-strip__panel hero-strip__panel--right">
				<motion.img
					src={photo3.src}
					alt="Match RDBC"
					className="hero-strip__img"
					style={{ x: x2, scale: 1.5 }}
				/>
			</div>
		</div>
	);
};

export default HeroStrip;
