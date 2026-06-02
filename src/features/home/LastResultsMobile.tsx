import { RESULTS } from "@mockup/games";
import type { GameResult } from "./score/LastResults";
import "./lastResultsMobile.css";

interface TeamScoreProps {
	name: string;
	logo?: string;
	score: number;
	isWin: boolean;
	teamType: "rdbc" | "hainemy";
	isReverse?: boolean; // Added to control HTML source order
}

const TeamScore = ({
	name,
	logo,
	score,
	isWin,
	teamType,
	isReverse = false,
}: TeamScoreProps) => {
	const fallback =
		teamType === "hainemy" ? name.slice(0, 3).toUpperCase() : "RDBC";

	const logoBlock = (
		<div className="game-card-mobile__logo-container">
			{logo ? (
				<img
					src={logo}
					alt={`Logo ${name}`}
					className="game-card-mobile__logo-img"
				/>
			) : (
				<span className="game-card-mobile__logo-fallback">{fallback}</span>
			)}
		</div>
	);

	const scoreBlock = (
		<span
			className={`game-card-mobile__score game-card-mobile__score--${isWin ? "win" : "loss"}`}
		>
			{score}
		</span>
	);

	return (
		<div
			className={`game-card-mobile__score-group game-card-mobile__score-group--${teamType}`}
		>
			{/* If isReverse is true (Hainemy), render Score then Logo.
        Otherwise (RDBC), render Logo then Score.
      */}
			{isReverse ? (
				<>
					{scoreBlock}
					{logoBlock}
				</>
			) : (
				<>
					{logoBlock}
					{scoreBlock}
				</>
			)}
		</div>
	);
};

const GameCardMobile = ({ game }: { game: GameResult }) => {
	const { rdbc, hainemy, date, event } = game;
	const rdbcWins = rdbc.score > hainemy.score;

	return (
		<article className="game-card-mobile">
			<div className="game-card-mobile__header">
				<time className="game-card-mobile__date">{date}</time>
				<span className="game-card-mobile__event">{event}</span>
			</div>

			<div className="game-card-mobile__body">
				{/* Teams */}
				<div className="game-card-mobile__teams">
					<span className="game-card-mobile__team-name game-card-mobile__team-name--rdbc">
						{rdbc.name}
					</span>
					<span className="game-card-mobile__team-name game-card-mobile__team-name--hainemy">
						{hainemy.name}
					</span>
				</div>

				<div className="game-card-mobile__scores">
					<TeamScore
						name={rdbc.name}
						logo={rdbc.logo ?? undefined}
						score={rdbc.score}
						isWin={rdbcWins}
						teamType="rdbc"
					/>

					<span className="game-card-mobile__vs">vs</span>

					<TeamScore
						name={hainemy.name}
						logo={rdbc.logo ?? undefined}
						score={hainemy.score}
						isWin={!rdbcWins}
						teamType="hainemy"
						isReverse
					/>
				</div>
			</div>
		</article>
	);
};

const LastResultsMobile = () => (
	<section className="last-results-mobile">
		{RESULTS.map((game) => (
			<GameCardMobile key={game.id} game={game} />
		))}
	</section>
);

export default LastResultsMobile;
