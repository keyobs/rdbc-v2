import { defineField, defineType } from "sanity";

const RDBC_TEAMS = [
	{ title: "Petites Morts (Travel A)", value: "petites-morts" },
	{ title: "Compagnie Cruelle (Travel B)", value: "compagnie-cruelle" },
	{ title: "Pink Cheek Peaches (Home)", value: "pink-cheek-peaches" },
	{ title: "Rotten Black Grapes (Home)", value: "rotten-black-grapes" },
	{ title: "Boom Bright Gold (Home)", value: "boom-bright-gold" },
];

export const game = defineType({
	name: "game",
	title: "Game",
	type: "document",
	fields: [
		defineField({
			name: "date",
			title: "Date",
			type: "datetime",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "location",
			title: "Location",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "team",
			title: "RDBC Team",
			type: "string",
			options: { list: RDBC_TEAMS },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "opponent",
			title: "Opponent",
			type: "reference",
			to: [{ type: "club" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "team_score",
			title: "RDBC Score",
			type: "number",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "opponent_score",
			title: "Opponent Score",
			type: "number",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "tournament_name",
			title: "Tournament",
			type: "string",
		}),
	],
	preview: {
		select: { title: "team", subtitle: "date" },
		prepare({ title, subtitle }) {
			const team = RDBC_TEAMS.find((t) => t.value === title)?.title ?? title;
			const date = subtitle
				? new Date(subtitle).toLocaleDateString("fr-FR")
				: "";
			return { title: team, subtitle: date };
		},
	},
});
