import type { GameResult } from "@features/home/score/LastResults";
import { formatGameDate, formatGameTime } from "@features/home/score/utils";
import { withBase } from "@utils/urlHandler";
import "./matchCard.css";

interface MatchCardProps {
	game: GameResult;
}

const MatchCard = ({ game }: MatchCardProps) => {
	const { rdbc, hainemy, date, tournament, event, id } = game;
	const rdbcWins = rdbc.score > hainemy.score;

	return (
		<article className="match-card">
			<div className="match-card__header">
				<div className="match-card__datetime">
					<time className="match-card__date">{formatGameDate(date)}</time>
					<span className="match-card__time">{formatGameTime(date)}</span>
				</div>
				<span className="match-card__meta">
					{tournament} — {event}
				</span>
				<a href={withBase(`/competitions/${id}`)} className="match-card__link">
					Détails
				</a>
			</div>

			<div className="match-card__body">
				<TeamLogo name={rdbc.name} logo={rdbc.logo} side="rdbc" />

				<div className="match-card__center">
					<div className="match-card__team-col">
						<span className="match-card__team-name">{rdbc.name}</span>
						<span
							className={`match-card__score match-card__score--${rdbcWins ? "win" : "lost"}`}
						>
							{rdbc.score}
						</span>
					</div>

					<span className="match-card__vs">vs</span>

					<div className="match-card__team-col match-card__team-col--right">
						<span className="match-card__team-name">{hainemy.name}</span>
						<span
							className={`match-card__score match-card__score--${rdbcWins ? "lost" : "win"}`}
						>
							{hainemy.score}
						</span>
					</div>
				</div>

				<TeamLogo name={hainemy.name} logo={hainemy.logo} side="hainemy" />
			</div>
		</article>
	);
};

export default MatchCard;

interface TeamLogoProps {
	name: string;
	logo: string | null;
	side: "rdbc" | "hainemy";
}

const TeamLogo = ({ name, logo, side }: TeamLogoProps) => {
	const fallback = side === "rdbc" ? "RDBC" : name.slice(0, 3).toUpperCase();

	return (
		<div className={`match-card__team match-card__team--${side}`}>
			{logo ? (
				<img src={logo} alt={`Logo ${name}`} className="match-card__logo-img" />
			) : (
				<span className="match-card__logo-fallback">{fallback}</span>
			)}
		</div>
	);
};
