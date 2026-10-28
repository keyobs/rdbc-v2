import { defineField, defineType } from "sanity";

export const club = defineType({
	name: "club",
	title: "Club adverse",
	type: "document",
	description:
		"Une équipe que le RDBC a affrontée ou va affronter. Une même ligue peut avoir plusieurs équipes : une fiche par équipe.",
	fields: [
		defineField({
			name: "name",
			title: "Nom de l’équipe",
			type: "string",
			description: "Ex : Collectif B",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "league",
			title: "Ligue",
			type: "string",
			description: "Avec la ville si elle n’est pas dans le nom. Ex : Roller Derby Côte Basque (Anglet)",
		}),
		defineField({
			name: "logo",
			title: "Logo (facultatif)",
			type: "image",
			description:
				"Sans logo, un écusson blanc avec les initiales de l’équipe s’affiche.",
		}),
	],
	orderings: [
		{
			title: "Nom de l’équipe",
			name: "nameAsc",
			by: [{ field: "name", direction: "asc" }],
		},
	],
	preview: {
		select: { title: "name", subtitle: "league", media: "logo" },
	},
});
