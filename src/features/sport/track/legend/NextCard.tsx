import "./legend.css";

interface NextCardProps {
	titles: string[];
	index: number;
	upNextLabel: string;
	restartLabel: string;
	onClick: () => void;
}

// "Up next" card; every caption is stacked in the same cell so the card never resizes
const NextCard = ({
	titles,
	index,
	upNextLabel,
	restartLabel,
	onClick,
}: NextCardProps) => {
	const count = titles.length;
	const isLast = index === count - 1;

	return (
		<button className="next-card" type="button" onClick={onClick}>
			<span className="next-stack">
				{titles.map((title, i) => (
					<span
						key={title}
						className="next-text"
						data-active={i === index}
						aria-hidden={i !== index}
					>
						<span className="next-label">
							{i === count - 1 ? restartLabel : upNextLabel}
						</span>
						<span className="next-title">{titles[(i + 1) % count]}</span>
					</span>
				))}
			</span>
			<span className="next-arrow" aria-hidden="true">
				{isLast ? "↺" : "→"}
			</span>
		</button>
	);
};

export default NextCard;
