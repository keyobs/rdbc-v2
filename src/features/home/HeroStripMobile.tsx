import { useScroll, useTransform, motion } from "framer-motion";
import photo1 from "../../assets/hero/match_misty_1-3.jpg";
import photo2 from "../../assets/hero/match_peak_1-1.jpg";
import photo3 from "../../assets/hero/train_kiwi_block.jpeg";
import "./heroStripMobile.css";

const HeroStripMobile = () => {
	const { scrollY } = useScroll();
	const x0 = useTransform(scrollY, [0, 300], [0, 20]);
	const x1 = useTransform(scrollY, [0, 300], [0, 30]);
	const x2 = useTransform(scrollY, [0, 300], [0, 15]);

	return (
		<div className="hero-strip-mobile">
			<div className="hero-strip-mobile__row">
				<div className="hero-strip-mobile__panel hero-strip-mobile__panel--top-left">
					<motion.img
						src={photo1.src}
						alt="Match RDBC"
						className="hero-strip-mobile__img"
						style={{ x: x0, scale: 1.5 }}
					/>
				</div>
				<div className="hero-strip-mobile__panel hero-strip-mobile__panel--top-right">
					<motion.img
						src={photo2.src}
						alt="Match RDBC"
						className="hero-strip-mobile__img"
						style={{ x: x1, scale: 1.5 }}
					/>
				</div>
			</div>
			<div className="hero-strip-mobile__row">
				<div className="hero-strip-mobile__panel hero-strip-mobile__panel--bottom">
					<motion.img
						src={photo3.src}
						alt="Match RDBC"
						className="hero-strip-mobile__img"
						style={{ x: x2, scale: 1.5 }}
					/>
				</div>
			</div>
		</div>
	);
};

export default HeroStripMobile;
