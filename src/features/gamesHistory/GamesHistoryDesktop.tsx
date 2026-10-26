import GamesTabs from "./GamesTabs";
import "./gamesHistoryDesktop.css";

const GamesHistoryDesktop = () => (
	<div className="games-history-desktop">
		<div className="games-history-desktop__row">
			<main className="games-history-desktop__left">
				<GamesTabs />
			</main>
			<aside className="games-history-desktop__right">
				<div className="games-history-desktop__placeholder">
					Widgets à venir
				</div>
			</aside>
		</div>
	</div>
);

export default GamesHistoryDesktop;
