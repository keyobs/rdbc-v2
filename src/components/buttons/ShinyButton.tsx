import "./shiny.css";

interface ShinyButtonProps {
	href: string;
	children: React.ReactNode;
	animationStart?: boolean;
	onClick?: () => void;
}

const ShinyButton = ({
	href,
	children,
	animationStart = true,
	onClick,
}: ShinyButtonProps) => (
	<a
		href={href}
		className={`btn-shiny${animationStart ? " btn-shiny--animate" : ""}`}
		onClick={onClick}
	>
		<span className="btn-shiny__border" aria-hidden="true" />
		<span className="btn-shiny__border" aria-hidden="true" />
		<span className="btn-shiny__border" aria-hidden="true" />
		<span className="btn-shiny__border" aria-hidden="true" />
		{children}
	</a>
);

export default ShinyButton;
