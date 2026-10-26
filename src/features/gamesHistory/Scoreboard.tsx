import type { ReactNode } from "react";
import "./scoreboard.css";

export interface ScoreboardTeam {
	name: string;
	logo?: string | null;
}

interface ScoreboardProps {
	size: "next" | "row";
	home: ScoreboardTeam;
	away: ScoreboardTeam;
	/** Accessible summary of the whole board, e.g. "Petites Morts 215, Valient Biitchiiz 75". */
	label: string;
	/** Content of the centre bar: a `ScoreDigits` or the date/chip/time of an upcoming game. */
	children: ReactNode;
}

/** First letters of the first two words, ignoring any placeholder brackets. */
function getInitials(name: string): string {
	return name
		.replace(/[^\p{L}\s]/gu, "")
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

const TeamMark = ({ team }: { team: ScoreboardTeam }) =>
	team.logo ? (
		<img className="scoreboard__logo" src={team.logo} alt="" />
	) : (
		<span className="scoreboard__shield" aria-hidden="true">
			{getInitials(team.name)}
		</span>
	);

const Scoreboard = ({ size, home, away, label, children }: ScoreboardProps) => (
	<figure className={`scoreboard scoreboard--${size}`} aria-label={label}>
		<div className="scoreboard__side scoreboard__side--home">
			<div className="scoreboard__panel scoreboard__panel--home">
				<TeamMark team={home} />
				<span className="scoreboard__name">{home.name}</span>
			</div>
		</div>

		<div className="scoreboard__center">{children}</div>

		<div className="scoreboard__side scoreboard__side--away">
			<div className="scoreboard__panel scoreboard__panel--away">
				<span className="scoreboard__name">{away.name}</span>
				<TeamMark team={away} />
			</div>
		</div>
	</figure>
);

export default Scoreboard;

const getScoreClass = (score: number, other: number): string => {
	if (score === other) return "scoreboard__score";
	return `scoreboard__score ${score > other ? "is-winner" : "is-loser"}`;
};

interface ScoreDigitsProps {
	homeScore: number;
	awayScore: number;
}

/** Winner in neon green, loser muted: the colour carries the result, no label. */
export const ScoreDigits = ({ homeScore, awayScore }: ScoreDigitsProps) => (
	<>
		<span className={getScoreClass(homeScore, awayScore)}>{homeScore}</span>
		<span className="scoreboard__sep" aria-hidden="true">
			/
		</span>
		<span className={getScoreClass(awayScore, homeScore)}>{awayScore}</span>
	</>
);
