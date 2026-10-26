import "./bloomButton.css";
import { motion } from "framer-motion";

interface BloomButtonProps {
	borderGradientColor: string;
	background: string;
	fontColor: string;
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	target?: string;
	rel?: string;
}

interface BloomWrapStyle extends React.CSSProperties {
	"--bloom-color": string;
}

const SPRING = { type: "spring", stiffness: 400, damping: 22 } as const;

const BloomButton = ({
	borderGradientColor,
	background,
	fontColor,
	href,
	onClick,
	children,
	target,
	rel,
}: BloomButtonProps) => {
	const wrapStyle: BloomWrapStyle = { "--bloom-color": borderGradientColor };
	const innerStyle: React.CSSProperties = { background, color: fontColor };

	if (href) {
		return (
			<div className="bloom-btn-wrap" style={wrapStyle}>
				<span className="bloom-btn-glow" aria-hidden="true" />
				<motion.a
					href={href}
					className="bloom-btn"
					style={innerStyle}
					target={target}
					rel={rel}
					whileTap={{ scale: 0.95 }}
					transition={SPRING}
				>
					{children}
				</motion.a>
			</div>
		);
	}

	return (
		<div className="bloom-btn-wrap" style={wrapStyle}>
			<span className="bloom-btn-glow" aria-hidden="true" />
			<motion.button
				className="bloom-btn"
				style={innerStyle}
				onClick={onClick}
				type="button"
				whileTap={{ scale: 0.95 }}
				transition={SPRING}
			>
				{children}
			</motion.button>
		</div>
	);
};

export default BloomButton;
