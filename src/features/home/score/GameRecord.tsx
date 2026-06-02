import "./gameRecord.css";
import type { TeamInfo } from "../GamesStrip";

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
	return (
		<div className="game-record">
			<div className="game-record__divider">
				<span>
					{date} &mdash; {event}
				</span>
			</div>

			<div className="game-record__teams">
				{/* Ton "vs" d'origine placé exactement au même endroit */}
				<span className="game-record__vs">vs</span>

				{/* Équipe RDBC */}
				<TeamDisplay team={rdbc} isWin={rdbcWins} fallbackText="RDBC" />

				{/* Équipe Hainemy (avec sa classe modificatrice d'origine) */}
				<TeamDisplay
					team={hainemy}
					isWin={!rdbcWins}
					fallbackText={hainemy.name.slice(0, 3).toUpperCase()}
					isHainemy={true}
				/>
			</div>
		</div>
	);
};

interface TeamDisplayProps {
	team: TeamInfo;
	isWin: boolean;
	fallbackText: string;
	isHainemy?: boolean;
}

const TeamDisplay = ({
	team,
	isWin,
	fallbackText,
	isHainemy = false,
}: TeamDisplayProps) => {
	return (
		<div
			className={`game-record__team ${isHainemy ? "game-record__team--hainemy" : ""}`}
		>
			<div
				className="game-record__logo"
				style={team.logo ? { backgroundImage: `url(${team.logo})` } : undefined}
			>
				{!team.logo && fallbackText}
			</div>

			<div className="game-record__info">
				<h3
					className={`game-record__score game-record__score--${isWin ? "win" : "lost"}`}
				>
					<span>{team.score}</span>
				</h3>
				<h4 className="game-record__team-name">{team.name}</h4>
				{team.travelTeam && (
					<span className="game-record__team-level">{team.travelTeam}</span>
				)}
				{team.league && (
					<span className="game-record__team-league">{team.league}</span>
				)}
			</div>
		</div>
	);
};
