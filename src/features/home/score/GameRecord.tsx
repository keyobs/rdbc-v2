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
}: GameRecordProps) => (
	<div className="game-record">
		<div className="game-record__divider">
			<span>
				{date} &mdash; {event}
			</span>
		</div>

		<div className="game-record__teams">
			{/* Row 1 — stable: logo + score + name */}
			<div className="game-record__main-row">
				<span className="game-record__vs">vs</span>
				<TeamDisplay team={rdbc} isWin={rdbcWins} fallbackText="RDBC" />
				<TeamDisplay
					team={hainemy}
					isWin={!rdbcWins}
					fallbackText={hainemy.name.slice(0, 3).toUpperCase()}
					isHainemy
				/>
			</div>

			{/* Row 2 — variable: travelTeam / league */}
			{(rdbc.travelTeam || hainemy.league) && (
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
	</div>
);

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
}: TeamDisplayProps) => (
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
		</div>
	</div>
);
