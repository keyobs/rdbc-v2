import type { ReactNode } from "react";
import "./scoreboard.css";

export interface ScoreboardTeam {
	name: string;
	logo?: string | null;
	/** Small line under the name, e.g. the league of the opponent. */
	subtitle?: string;
}

interface ScoreboardProps {
	home: ScoreboardTeam;
	away: ScoreboardTeam;
	/** Accessible summary of the whole board, e.g. "Petites Morts 215, Valient Biitchiiz 75". */
	label: string;
	/** Background of the home panel: "blue" by default, "green" for the TTB. */
	homeTone?: "blue" | "green";
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
		<img className="scoreboard__logo" src={team.logo} alt="" loading="lazy" />
	) : (
		<span className="scoreboard__shield" aria-hidden="true">
			{getInitials(team.name)}
		</span>
	);

const TeamName = ({ team }: { team: ScoreboardTeam }) => (
	<span className="scoreboard__name">
		{team.name}
		{team.subtitle && (
			<small className="scoreboard__subtitle">{team.subtitle}</small>
		)}
	</span>
);

const Scoreboard = ({
	home,
	away,
	label,
	homeTone = "blue",
	children,
}: ScoreboardProps) => (
	<figure className={`scoreboard is-home-${homeTone}`} aria-label={label}>
		<div className="scoreboard__side scoreboard__side--home">
			<div className="scoreboard__panel scoreboard__panel--home">
				<TeamMark team={home} />
				<TeamName team={home} />
			</div>
		</div>

		<div className="scoreboard__center">{children}</div>

		<div className="scoreboard__side scoreboard__side--away">
			<div className="scoreboard__panel scoreboard__panel--away">
				<TeamName team={away} />
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
