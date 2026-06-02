const PhotoStrip = ({ photos }: { photos: string[] }) => (
	<div className="game-photostrip">
		{photos.map((src, i) => {
			const pos = i === 0 ? "left" : i === photos.length - 1 ? "right" : "mid";
			return (
				<div
					key={src}
					className={`game-photostrip__panel game-photostrip__panel--${pos}`}
				>
					<img src={src} alt="" className="game-photostrip__img" />
				</div>
			);
		})}
	</div>
);

export default PhotoStrip;
