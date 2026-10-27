import "./legend.css";

interface SlideDotsProps {
	titles: string[];
	index: number;
	label: string;
	onSelect: (index: number) => void;
}

const SlideDots = ({ titles, index, label, onSelect }: SlideDotsProps) => (
	<nav className="dots" aria-label={label}>
		{titles.map((title, i) => (
			<button
				key={title}
				type="button"
				aria-label={`${i + 1}. ${title}`}
				aria-current={i === index ? "step" : undefined}
				onClick={() => onSelect(i)}
			/>
		))}
	</nav>
);

export default SlideDots;
