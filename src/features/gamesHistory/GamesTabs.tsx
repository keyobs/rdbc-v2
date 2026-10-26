import * as Tabs from "@radix-ui/react-tabs";
import { RESULTS } from "@features/home/score/resultsData";
import { getGroupedResults } from "@features/home/score/utils";
import MatchCard from "./MatchCard";
import "./gamesTabs.css";

const TEAM_ORDER: ("A" | "B" | "home")[] = ["A", "B", "home"];

const TAB_LABELS: Record<"A" | "B" | "home", string> = {
	A: "Team A",
	B: "Team B",
	home: "Home Teams",
};

const grouped = getGroupedResults(RESULTS);

const teamsWithGames = TEAM_ORDER.filter((team) => grouped[team].length > 0);

const GamesTabs = () => (
	<Tabs.Root className="games-tabs" defaultValue={teamsWithGames[0]}>
		<Tabs.List className="games-tabs__list" aria-label="Filtrer par équipe">
			{teamsWithGames.map((team) => (
				<Tabs.Trigger key={team} value={team} className="games-tabs__trigger">
					{TAB_LABELS[team]}
				</Tabs.Trigger>
			))}
		</Tabs.List>

		{teamsWithGames.map((team) => (
			<Tabs.Content key={team} value={team} className="games-tabs__content">
				{grouped[team].map((game) => (
					<MatchCard key={`${game.id}-${game.date}`} game={game} />
				))}
			</Tabs.Content>
		))}
	</Tabs.Root>
);

export default GamesTabs;
