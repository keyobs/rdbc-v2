import "./gameRecord.css";
import type { TeamInfo } from "./LastResults";

interface GameRecordProps {
	date: string;
	event: string;
	rdbc: TeamInfo;
	hainemy: TeamInfo;
	rdbcWins: boolean;
}

export const GameRecord = ({
	date,
	event,
	rdbc,
	hainemy,
	rdbcWins,
}: GameRecordProps) => {
	const hasSecondaryInfo = rdbc.travelTeam || hainemy.league;

	return (
		<article className="game-record">
			{/* Date et Événement sémantiques */}
			<div className="game-record__divider">
				<time>{date}</time> &mdash; <span>{event}</span>
			</div>

			<div className="game-record__teams">
				{/* Ligne principale : vs + Équipes */}
				<div className="game-record__main-row">
					<span className="game-record__vs" aria-hidden="true">
						vs
					</span>

					<TeamDisplay team={rdbc} isWin={rdbcWins} />

					<TeamDisplay team={hainemy} isWin={!rdbcWins} isHainemy />
				</div>

				{/* Ligne secondaire : travelTeam / league */}
				{hasSecondaryInfo && (
					<div className="game-record__secondary-row">
						<span className="game-record__team-level">
							{rdbc.travelTeam ?? ""}
						</span>
						<span className="game-record__team-league">
							{hainemy.league ?? ""}
						</span>
					</div>
				)}
			</div>
		</article>
	);
};

interface TeamDisplayProps {
	team: TeamInfo;
	isWin: boolean;
	isHainemy?: boolean;
}

const TeamDisplay = ({ team, isWin, isHainemy = false }: TeamDisplayProps) => {
	const fallback = isHainemy ? team.name.slice(0, 3).toUpperCase() : "RDBC";

	return (
		<div
			className={`game-record__team ${isHainemy ? "game-record__team--hainemy" : ""}`}
		>
			<div className="game-record__logo-container">
				{team.logo ? (
					<img
						src={team.logo}
						alt={`Logo ${team.name}`}
						className="game-record__logo-img"
					/>
				) : (
					<span className="game-record__logo-fallback">{fallback}</span>
				)}
			</div>

			<div className="game-record__info">
				<span
					className={`game-record__score game-record__score--${isWin ? "win" : "lost"}`}
				>
					<span>{team.score}</span>
				</span>
				<span className="game-record__team-name">{team.name}</span>
			</div>
		</div>
	);
};
