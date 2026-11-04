import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveJoinContent } from "./joinContent.ts";

test("unpublished content preserves the current page and its role-specific presets", () => {
	for (const locale of ["fr", "en"] as const) {
		const content = resolveJoinContent(null, [], locale);
		assert.deepEqual(
			content.roles.map((role) => role.id),
			["play", "referee", "volunteer"],
		);
		assert.equal(content.values.tags.length, 4);
		assert.equal(
			content.roles.every(
				(role) => role.message.length > 0 && !role.message.includes("{role}"),
			),
			true,
		);
		assert.equal(new Set(content.roles.map((role) => role.message)).size, 3);
	}
});

test("English content falls back to the published French fields before defaults", () => {
	const content = resolveJoinContent(
		{ title: { fr: "Bienvenue" }, valuesTags: { fr: ["Solidaire"] } },
		[
			{
				_id: "joinRole-play",
				title: { fr: "Patiner", en: "  " },
				message: { fr: "Je souhaite essayer." },
				tags: { fr: ["Prêt de patins"] },
			},
		],
		"en",
	);
	assert.equal(content.hero.title, "Bienvenue");
	assert.deepEqual(content.values.tags, ["Solidaire"]);
	assert.equal(content.roles[0].title, "Patiner");
	assert.equal(content.roles[0].message, "Je souhaite essayer.");
	assert.deepEqual(content.roles[0].tags, ["Prêt de patins"]);
	assert.equal(content.roles[1].title, "Referee");
});

test("English overrides and deliberately empty badge lists are respected", () => {
	const content = resolveJoinContent(
		{ title: { fr: "FR", en: "EN" }, valuesTags: { fr: ["FR"], en: [] } },
		[
			{
				_id: "joinRole-volunteer",
				tags: { fr: ["FR"], en: [] },
				message: { fr: "FR", en: "I can help." },
			},
		],
		"en",
	);
	assert.equal(content.hero.title, "EN");
	assert.deepEqual(content.values.tags, []);
	assert.deepEqual(content.roles[2].tags, []);
	assert.equal(content.roles[2].message, "I can help.");
});

test("media and editable titles do not change stable anchors or role identities", () => {
	const content = resolveJoinContent(
		null,
		[
			{
				_id: "joinRole-referee",
				title: { fr: "Team Zebra" },
				videoUrl: "https://cdn.sanity.io/files/video.mp4",
				posterUrl: "https://cdn.sanity.io/images/poster.jpg",
			},
			{
				_id: "joinRole-play",
				posterUrl: "https://cdn.sanity.io/images/player.jpg",
			},
		],
		"fr",
	);
	assert.equal(content.roles[1].id, "referee");
	assert.equal(content.roles[1].title, "Team Zebra");
	assert.deepEqual(content.roles[1].video, {
		src: "https://cdn.sanity.io/files/video.mp4",
		poster: "https://cdn.sanity.io/images/poster.jpg",
	});
	assert.equal(content.roles[0].video, undefined);
	assert.equal(
		content.roles[0].poster,
		"https://cdn.sanity.io/images/player.jpg",
	);
});
