import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { ROSTER_GROUPS } from "./rosterGroups";
import { JOIN_ROLES } from "./joinRoles";

// These types use fixed document IDs in the structure, without creation or deletion.
export const SINGLETON_TYPES = new Set([
	"feedSettings",
	"homeAlert",
	"homeJoiningSection",
	"clubPage",
	"sportNotionsSection",
	"advancedRulesSection",
	"team",
	"joinPage",
	"joinRole",
]);

const singleton = (S: StructureBuilder, type: string, title: string) =>
	S.listItem()
		.title(title)
		.id(type)
		.child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Contenu")
		.items([
			S.listItem()
				.title("Accueil")
				.icon(() => "🏠")
				.child(
					S.list()
						.title("Accueil")
						.items([
							singleton(S, "feedSettings", "Fil d’actualités — emplacements"),
							S.listItem()
								.title("Fil d’actualités — feeds")
								.child(
									S.documentTypeList("feed")
										.title("Feeds")
										.defaultOrdering([{ field: "date", direction: "desc" }]),
								),
							singleton(S, "homeAlert", "Bandeau alerte"),
							singleton(S, "homeJoiningSection", "Profils pour rejoindre"),
						]),
				),
			singleton(S, "clubPage", "Le club").icon(() => "🛼"),
			S.listItem()
				.title("Rejoindre")
				.child(
					S.list()
						.title("Rejoindre")
						.items([
							singleton(S, "joinPage", "Introduction et valeurs"),
							...JOIN_ROLES.map((role) =>
								S.listItem()
									.id(`joinRole-${role.id}`)
									.title(role.title)
									.child(
										S.document()
											.schemaType("joinRole")
											.documentId(`joinRole-${role.id}`)
											.title(role.title),
									),
							),
						]),
				),
			S.listItem()
				.title("Le sport")
				.icon(() => "📖")
				.child(
					S.list()
						.title("Le sport")
						.items([
							singleton(S, "sportNotionsSection", "Notions"),
							singleton(S, "advancedRulesSection", "Règles avancées"),
						]),
				),
			S.divider(),
			S.documentTypeListItem("libraryVideo").title("Vidéos"),
			S.documentTypeListItem("libraryPhoto").title("Photos"),
			S.listItem()
				.title("Articles")
				.icon(() => "📰")
				.child(
					S.documentTypeList("article")
						.title("Articles")
						.defaultOrdering([{ field: "date", direction: "desc" }]),
				),
			S.listItem()
				.title("Matchs")
				.icon(() => "🏆")
				.child(
					S.list()
						.title("Matchs")
						.items([
							S.documentTypeListItem("competition").title("Compétitions"),
							S.documentTypeListItem("club").title("Clubs adverses"),
							S.listItem()
								.title("Légendes des saisons")
								.child(
									S.documentTypeList("season")
										.title("Légendes des saisons")
										.defaultOrdering([{ field: "name", direction: "desc" }]),
								),
						]),
				),
			S.listItem()
				.title("Équipes et membres")
				.icon(() => "⭐")
				.child(
					S.list()
						.title("Équipes et membres")
						.items([
							S.documentTypeListItem("player").title("Membres du club"),
							S.divider(),
							...ROSTER_GROUPS.map((group) =>
								S.listItem()
									.id(`team-${group.key}`)
									.title(group.title)
									.child(
										S.document()
											.schemaType("team")
											.documentId(`team-${group.key}`)
											.title(group.title),
									),
							),
						]),
				),
		]);
