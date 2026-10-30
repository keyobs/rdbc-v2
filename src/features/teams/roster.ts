import type { Player } from "../../../sanity/sanity.types";

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
}

export type RosterGroup =
	| NonNullable<Player["team"]>
	| NonNullable<Player["intraligue"]>
	| "officials"
	| "staff"
	| "hall";

/** Hall of Fame membership is independent of the current roster and standby. */
export function getRosterMembers(
	members: TeamMember[],
	group: RosterGroup,
): TeamMember[] {
	return members.filter((member) => {
		if (group === "hall") return member.hall_of_fame === true;
		if (member.in_roster === false) return false;
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
