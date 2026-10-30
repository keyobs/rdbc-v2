import assert from "node:assert/strict";
import { test } from "node:test";
import { getRosterMembers, getSeasonCount, type TeamMember } from "./roster.ts";
import { getAlternateHref, getLocalizedHref } from "../../i18n/routes.ts";

const member = (fields: Partial<TeamMember> = {}): TeamMember => ({
	_id: "member",
	name: "Derby name",
	photoUrl: null,
	anecdote: "",
	...fields,
});

test("travel team and intraleague affiliations are independent, including on standby", () => {
	const skater = member({
		team: "A",
		intraligue: "pink-cheek-peaches",
		standby: true,
	});
	assert.deepEqual(getRosterMembers([skater], "A"), [skater]);
	assert.deepEqual(getRosterMembers([skater], "pink-cheek-peaches"), [skater]);
	assert.deepEqual(getRosterMembers([skater], "B"), []);
});

test("officials and staff ignore stale skater affiliations", () => {
	const official = member({
		category: "referee",
		team: "A",
		intraligue: "pink-cheek-peaches",
	});
	assert.deepEqual(getRosterMembers([official], "A"), []);
	assert.deepEqual(getRosterMembers([official], "pink-cheek-peaches"), []);
	assert.deepEqual(getRosterMembers([official], "officials"), [official]);
	for (const category of ["bench", "staff", "support"] as const) {
		const staff = member({ category, standby: true });
		assert.deepEqual(getRosterMembers([staff], "staff"), [staff]);
	}
});

test("Hall of Fame is independent of standby and current roster", () => {
	const former = member({
		in_roster: false,
		hall_of_fame: true,
		team: "A",
		standby: true,
	});
	assert.deepEqual(getRosterMembers([former], "A"), []);
	assert.deepEqual(getRosterMembers([former], "hall"), [former]);
	const current = member({ hall_of_fame: true, team: "B" });
	assert.deepEqual(getRosterMembers([current], "B"), [current]);
	assert.deepEqual(getRosterMembers([current], "hall"), [current]);
});

test("legacy members default to skaters in the current roster", () => {
	const legacy = member({ team: "B" });
	assert.deepEqual(getRosterMembers([legacy], "B"), [legacy]);
});

test("skaters sort by first digit, retaining zeroes, then numerically within each group", () => {
	const numbers = [
		"2",
		"101",
		"07",
		"1005",
		"15",
		"0208",
		"1",
		"11",
		"21",
		"9",
		"55",
	];
	const roster = numbers.map((number) =>
		member({
			_id: number,
			team: "A",
			intraligue: "pink-cheek-peaches",
			number,
		}),
	);
	const expected = [
		"07",
		"0208",
		"1",
		"11",
		"15",
		"101",
		"1005",
		"2",
		"21",
		"55",
		"9",
	];
	for (const group of ["A", "pink-cheek-peaches"] as const) {
		assert.deepEqual(
			getRosterMembers(roster, group).map((player) => player.number),
			expected,
		);
	}
	assert.deepEqual(
		roster.map((player) => player.number),
		numbers,
	);
});

test("standby skaters use the same order and missing numbers come last by name", () => {
	const roster = [
		member({ name: "Zulu", team: "B", standby: true }),
		member({ name: "Alpha", team: "B", number: "", standby: true }),
		member({ name: "Two", team: "B", number: "2", standby: true }),
		member({ name: "One", team: "B", number: " 101 ", standby: true }),
	];
	assert.deepEqual(
		getRosterMembers(roster, "B").map((player) => player.name),
		["One", "Two", "Alpha", "Zulu"],
	);
});

test("officials, staff and Hall of Fame sort by name regardless of jersey numbers", () => {
	for (const group of ["officials", "staff", "hall"] as const) {
		const category = group === "officials" ? "referee" : "staff";
		const roster = [
			member({ name: "Zulu", number: "1", category, hall_of_fame: true }),
			member({ name: "Éclair", number: "07", category, hall_of_fame: true }),
			member({ name: "alpha", number: "9", category, hall_of_fame: true }),
		];
		assert.deepEqual(
			getRosterMembers(roster, group).map((player) => player.name),
			["alpha", "Éclair", "Zulu"],
		);
	}
});

test("season count is inclusive and freezes at the last season", () => {
	assert.equal(getSeasonCount({ first_season: 2026 }, 2026), 1);
	assert.equal(getSeasonCount({ first_season: 2020 }, 2026), 7);
	assert.equal(
		getSeasonCount(
			{ first_season: 2020, last_season: 2023, in_roster: false },
			2026,
		),
		4,
	);
	assert.equal(
		getSeasonCount({ first_season: 2020, in_roster: false }, 2026),
		null,
	);
	assert.equal(getSeasonCount({}, 2026), null);
	assert.equal(getSeasonCount({ first_season: 2027 }, 2026), null);
	assert.equal(
		getSeasonCount({ first_season: 2024, last_season: 2023 }, 2026),
		null,
	);
});

test("team routes switch languages and navigation preserves the locale and anchors", () => {
	assert.equal(
		getAlternateHref("/competitions/equipes/"),
		"/en/competitions/teams",
	);
	assert.equal(
		getAlternateHref("/en/competitions/teams/"),
		"/competitions/equipes",
	);
	assert.equal(getLocalizedHref("/competitions", "en"), "/en/competitions");
	assert.equal(getLocalizedHref("/club#contact", "en"), "/en/club#contact");
	assert.equal(getLocalizedHref("/", "en"), "/en/");
	assert.equal(getLocalizedHref("/competitions", "fr"), "/competitions");
});
