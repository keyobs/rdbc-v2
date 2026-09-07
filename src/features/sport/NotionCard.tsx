import { useState } from "react";
import "./notionCard.css";

interface NotionCardProps {
	number: string;
	title: string;
	summary: string;
	detail: string;
}

const NotionCard = ({ number, title, summary, detail }: NotionCardProps) => {
	const [flipped, setFlipped] = useState(false);

	return (
		<button
			type="button"
			className={`notion-card${flipped ? " notion-card--flipped" : ""}`}
			onClick={() => setFlipped((f) => !f)}
			aria-pressed={flipped}
		>
			<span className="notion-card__inner">
				<span className="notion-card__face notion-card__face--front">
					<span className="notion-card__number">{number}</span>
					<span className="notion-card__title">{title}</span>
					<span className="notion-card__summary">{summary}</span>
				</span>
				<span className="notion-card__face notion-card__face--back">
					<span className="notion-card__title">{title}</span>
					<span className="notion-card__detail">{detail}</span>
				</span>
			</span>
		</button>
	);
};

export default NotionCard;
