import type { Player, Team } from "../../../sanity/sanity.types";
import {
	ROSTER_GROUPS,
	type RosterGroup,
} from "../../../sanity/rosterGroups.ts";
export type { RosterGroup } from "../../../sanity/rosterGroups.ts";

export interface TeamMember
	extends Pick<
		Player,
		| "_id"
		| "category"
		| "team"
		| "intraligue"
		| "number"
		| "role"
		| "official_roles"
		| "generation"
		| "first_season"
		| "last_season"
		| "standby"
		| "hall_of_fame"
		| "in_roster"
	> {
	name: string;
	photoUrl: string | null;
	anecdote: string;
	groups?: RosterGroup[];
}

/** Published lists take precedence, including an explicitly empty list. */
export function resolveRosterMemberships(
	members: TeamMember[],
	teams: Pick<Team, "_id" | "members">[],
): TeamMember[] {
	const memberships = new Map<RosterGroup, Set<string>>();
	for (const group of ROSTER_GROUPS) {
		const team = teams.find((entry) => entry._id === `team-${group.key}`);
		const ids = team
			? (team.members ?? []).map((reference) => reference._ref)
			: getRosterMembers(members, group.key).map((member) => member._id);
		memberships.set(group.key, new Set(ids));
	}
	return members.map((member) => ({
		...member,
		groups: ROSTER_GROUPS.filter((group) =>
			memberships.get(group.key)?.has(member._id),
		).map((group) => group.key),
	}));
}

const nameOrder = new Intl.Collator("fr", { sensitivity: "base" });
const numberOrder = new Intl.Collator("fr", { numeric: true });

function compareNames(a: TeamMember, b: TeamMember): number {
	return nameOrder.compare(a.name, b.name) || a._id.localeCompare(b._id);
}

/** Keep leading zeroes for the first-digit group, then sort numerically within it. */
function compareNumbers(a: TeamMember, b: TeamMember): number {
	const first = a.number?.trim() ?? "";
	const second = b.number?.trim() ?? "";
	const firstIsNumber = /^\d+$/.test(first);
	const secondIsNumber = /^\d+$/.test(second);
	if (!firstIsNumber || !secondIsNumber) {
		if (firstIsNumber !== secondIsNumber) return firstIsNumber ? -1 : 1;
		return compareNames(a, b);
	}
	return (
		first[0].localeCompare(second[0]) ||
		numberOrder.compare(first, second) ||
		compareNames(a, b)
	);
}

/** Hall of Fame membership is independent of the current roster and standby. */
export function getRosterMembers(
	members: TeamMember[],
	group: RosterGroup,
): TeamMember[] {
	const selected = members.filter((member) => {
		if (group === "hall")
			return member.groups?.includes(group) ?? member.hall_of_fame === true;
		if (member.in_roster === false) return false;
		if (member.groups) return member.groups.includes(group);
		const category = member.category ?? "skater";
		if (group === "officials") return category === "referee";
		if (group === "staff")
			return (
				category === "bench" || category === "staff" || category === "support"
			);
		return (
			category === "skater" &&
			(member.team === group || member.intraligue === group)
		);
	});
	return selected.sort(
		group === "officials" || group === "staff" || group === "hall"
			? compareNames
			: compareNumbers,
	);
}

/** Count inclusively, and avoid inventing ongoing seasons for former members. */
export function getSeasonCount(
	member: Pick<TeamMember, "first_season" | "last_season" | "in_roster">,
	currentStart: number,
): number | null {
	const first = member.first_season;
	const last =
		member.last_season ??
		(member.in_roster === false ? undefined : currentStart);
	if (
		first === undefined ||
		last === undefined ||
		!Number.isInteger(first) ||
		!Number.isInteger(last) ||
		first < 1900 ||
		last < first ||
		first > currentStart ||
		last > currentStart
	)
		return null;
	return last - first + 1;
}
