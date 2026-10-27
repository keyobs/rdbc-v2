import type { Translations } from "@i18n/index";
import KeyIcon from "../icons/KeyIcon";
import { SITUATIONS } from "../scene/situations";
import "./legend.css";

interface SituationSlidesProps {
	index: number;
	labels: Translations["sport"]["track"];
}

// Every slide sits in the same grid cell: the tallest one sets the height
const SituationSlides = ({ index, labels }: SituationSlidesProps) => (
	<div className="slides" aria-live="polite">
		{SITUATIONS.map((situation, i) => (
			<div
				key={situation.id}
				className="slide"
				data-active={i === index}
				aria-hidden={i !== index}
			>
				<h3>{labels.situations[situation.id].title}</h3>
				<p>{labels.situations[situation.id].text}</p>
				<ul className="key" aria-label={labels.keyLabel}>
					{situation.keys.map((item) => (
						<li key={item}>
							<KeyIcon item={item} />
							{labels.keys[item]}
						</li>
					))}
				</ul>
			</div>
		))}
	</div>
);

export default SituationSlides;
