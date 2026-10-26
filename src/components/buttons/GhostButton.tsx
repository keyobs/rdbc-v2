import "./ghostButton.css";

interface GhostButtonProps {
	href: string;
	children: React.ReactNode;
}

const GhostButton = ({ href, children }: GhostButtonProps) => (
	<a href={href} className="ghost-btn">
		{children}
	</a>
);

export default GhostButton;
