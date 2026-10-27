import "./diagram.css";

interface StageArrowsProps {
	previousLabel: string;
	nextLabel: string;
	canGoPrevious: boolean;
	isLast: boolean;
	onPrevious: () => void;
	onNext: () => void;
}

const StageArrows = ({
	previousLabel,
	nextLabel,
	canGoPrevious,
	isLast,
	onPrevious,
	onNext,
}: StageArrowsProps) => (
	<>
		<button
			className="stage-arrow previous"
			type="button"
			aria-label={previousLabel}
			disabled={!canGoPrevious}
			onClick={onPrevious}
		>
			←
		</button>
		<button
			className="stage-arrow next"
			type="button"
			aria-label={nextLabel}
			onClick={onNext}
		>
			{isLast ? "↺" : "→"}
		</button>
	</>
);

export default StageArrows;
