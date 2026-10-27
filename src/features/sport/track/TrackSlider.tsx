import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Translations } from "@i18n/index";
import PlayerLayer from "./diagram/PlayerLayer";
import StageArrows from "./diagram/StageArrows";
import TheTrack from "./diagram/TheTrack";
import TrackCredit from "./diagram/TrackCredit";
import ZoneLayer from "./diagram/ZoneLayer";
import NextCard from "./legend/NextCard";
import SituationSlides from "./legend/SituationSlides";
import SlideDots from "./legend/SlideDots";
import { SCENE_STATES } from "./scene/sceneState";
import { SITUATIONS } from "./scene/situations";
import { useSceneTransition } from "./scene/useSceneTransition";
import { useSwipe } from "./scene/useSwipe";
import "./trackSlider.css";

interface TrackSliderProps {
	labels: Translations["sport"]["track"];
}

const TrackSlider = ({ labels }: TrackSliderProps) => {
	const [index, setIndex] = useState(0);
	const frame = useSceneTransition(SCENE_STATES[index]);

	const count = SITUATIONS.length;
	const situation = SITUATIONS[index];
	const isLast = index === count - 1;
	const titles = SITUATIONS.map((s) => labels.situations[s.id].title);

	const goTo = (i: number) => setIndex((i + count) % count);
	const goPrevious = () => {
		if (index > 0) goTo(index - 1);
	};
	const goNext = () => goTo(index + 1);
	const swipe = useSwipe(goNext, goPrevious);

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "ArrowRight") goNext();
		if (event.key === "ArrowLeft") goPrevious();
	};

	return (
		<section
			className="track-slider"
			aria-roledescription="carousel"
			aria-label={labels.situationsLabel}
			onKeyDown={handleKeyDown}
		>
			<div className="visual" {...swipe}>
				<TheTrack
					title={titles[index]}
					directionLabel={labels.directionLabel}
					highlightStartLines={situation.highlightStartLines}
					underlay={
						<ZoneLayer pack={frame.pack} engagement={frame.engagement} />
					}
					controls={
						<StageArrows
							previousLabel={labels.previous}
							nextLabel={
								isLast
									? labels.restart
									: `${labels.next} – ${titles[index + 1]}`
							}
							canGoPrevious={index > 0}
							isLast={isLast}
							onPrevious={goPrevious}
							onNext={goNext}
						/>
					}
				>
					<PlayerLayer frame={frame} />
				</TheTrack>

				<TrackCredit
					text={labels.credit}
					linkLabel={labels.creditLink}
					author={labels.creditAuthor}
				/>
			</div>

			<div className="legend">
				<header>
					<span className="section__eyebrow">{labels.eyebrow}</span>
					<h2 className="section__title">{labels.title}</h2>
				</header>

				<SituationSlides index={index} labels={labels} />

				<SlideDots
					titles={titles}
					index={index}
					label={labels.situationsLabel}
					onSelect={goTo}
				/>

				<NextCard
					titles={titles}
					index={index}
					upNextLabel={labels.upNext}
					restartLabel={labels.restart}
					onClick={goNext}
				/>
			</div>
		</section>
	);
};

export default TrackSlider;
