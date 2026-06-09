import "./teamHeader.css";

export const ORDER: ("A" | "B" | "home")[] = ["A", "B", "home"];

export const TEAM_HEADERS: Record<"A" | "B" | "home", string> = {
	A: "TTA — Les Petites Morts",
	B: "TTB — La Compagnie Cruelle",
	home: "Home Teams",
};

interface TeamHeaderProps {
	title: string;
	team: "A" | "B" | "home";
}

const TeamHeader = ({ title, team }: TeamHeaderProps) => (
	<div className={`last-results__team-header team_${team.toLowerCase()}`}>
		<span>{title}</span>
	</div>
);

export default TeamHeader;
