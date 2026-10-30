import * as Tabs from "@radix-ui/react-tabs";
import type { CSSProperties } from "react";
import type { Translations } from "@i18n/index";
import { TEAM_TITLES } from "@features/gamesHistory/teams";
import PlayerCard from "./playerCard/PlayerCard";
import { getRosterMembers, type TeamMember, type RosterGroup } from "./roster";
import "./teams.css";

interface TeamsProps {
	members: TeamMember[];
	labels: Translations["teams"];
	captions: { A: string; B: string };
	currentStart: number;
}

const HOME_TEAMS = [
	{ key: "pink-cheek-peaches", title: "Pink Cheek Peaches", accent: "#ff92c9" },
	{
		key: "rotten-black-grapes",
		title: "Rotten Black Grapes",
		accent: "#c5a5ff",
	},
	{
		key: "boom-bright-gold",
		title: "Boom Bright Gold",
		accent: "var(--color-zone)",
	},
] as const;

interface RosterSectionProps
	extends Pick<TeamsProps, "members" | "labels" | "currentStart"> {
	group: RosterGroup;
	title: string;
	caption: string;
	accent?: string;
}

function RosterSection({
	members,
	labels,
	currentStart,
	group,
	title,
	caption,
	accent,
}: RosterSectionProps) {
	const selected = getRosterMembers(members, group);
	const hallOfFame = group === "hall";
	const active = hallOfFame
		? selected
		: selected.filter((member) => !member.standby);
	const standby = hallOfFame ? [] : selected.filter((member) => member.standby);
	const renderCards = (roster: TeamMember[]) => (
		<div className="teams-grid">
			{roster.map((member) => (
				<PlayerCard
					key={member._id}
					member={member}
					labels={labels}
					currentStart={currentStart}
					hallOfFame={hallOfFame}
				/>
			))}
		</div>
	);

	return (
		<section
			className={`teams-section${accent ? " teams-section--accent" : ""}`}
			style={
				accent ? ({ "--team-accent": accent } as CSSProperties) : undefined
			}
		>
			<div className="games-board">
				<h2 className="games-board__band">{title}</h2>
				{caption && <p className="games-board__caption">{caption}</p>}
				<div className="teams-section__content">
					{selected.length === 0 && (
						<p className="teams-empty">{labels.empty}</p>
					)}
					{active.length > 0 && renderCards(active)}
					{standby.length > 0 && (
						<section
							className={`teams-standby${active.length ? " teams-standby--separated" : ""}`}
							aria-label={labels.standby}
						>
							<h3>{labels.standby}</h3>
							{renderCards(standby)}
						</section>
					)}
				</div>
			</div>
		</section>
	);
}

export default function Teams({
	members,
	labels,
	captions,
	currentStart,
}: TeamsProps) {
	const shared = { members, labels, currentStart };
	return (
		<Tabs.Root className="teams" defaultValue="A">
			<Tabs.List
				className="games-results__tabs teams-tabs"
				aria-label={labels.tabsLabel}
			>
				{(Object.keys(labels.tabs) as Array<keyof typeof labels.tabs>).map(
					(key) => (
						<Tabs.Trigger className="games-tab" key={key} value={key}>
							{labels.tabs[key]}
						</Tabs.Trigger>
					),
				)}
			</Tabs.List>
			<Tabs.Content value="A">
				<RosterSection
					{...shared}
					group="A"
					title={TEAM_TITLES.A ?? labels.tabs.A}
					caption={captions.A}
				/>
			</Tabs.Content>
			<Tabs.Content value="B">
				<RosterSection
					{...shared}
					group="B"
					title={TEAM_TITLES.B ?? labels.tabs.B}
					caption={captions.B}
				/>
			</Tabs.Content>
			<Tabs.Content value="intra">
				{HOME_TEAMS.map((team) => (
					<RosterSection
						{...shared}
						key={team.key}
						group={team.key}
						title={team.title}
						caption={labels.intraCaption}
						accent={team.accent}
					/>
				))}
			</Tabs.Content>
			<Tabs.Content value="officials">
				<RosterSection
					{...shared}
					group="officials"
					title={labels.tabs.officials}
					caption={labels.officialsCaption}
				/>
			</Tabs.Content>
			<Tabs.Content value="staff">
				<RosterSection
					{...shared}
					group="staff"
					title={labels.tabs.staff}
					caption={labels.staffCaption}
				/>
			</Tabs.Content>
			<Tabs.Content value="hall">
				<RosterSection
					{...shared}
					group="hall"
					title={labels.tabs.hall}
					caption={labels.hallCaption}
					accent="var(--color-zone)"
				/>
			</Tabs.Content>
		</Tabs.Root>
	);
}
