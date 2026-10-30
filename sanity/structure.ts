import type { StructureBuilder, StructureResolver } from "sanity/structure";

// Pages that exist once: the document id is the schema type name, so the site
// can query them by `_id` and editors can never create a second one.
export const SINGLETON_TYPES = new Set([
	"feedSettings",
	"homeAlert",
	"homeJoiningSection",
	"clubPage",
	"sportNotionsSection",
	"advancedRulesSection",
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
			S.listItem()
				.title("News")
				.icon(() => "📰")
				.child(
					S.documentTypeList("news")
						.title("News")
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
			S.documentTypeListItem("player").title("Équipes — membres du club").icon(() => "⭐"),
		]);
