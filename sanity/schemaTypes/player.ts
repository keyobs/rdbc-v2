import { defineField, defineType } from "sanity";

export const player = defineType({
	name: "player",
	title: "Player",
	type: "document",
	fields: [
		defineField({
			name: "derby_name",
			title: "Derby Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "photo",
			title: "Photo",
			type: "image",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role(s)",
			type: "array",
			of: [{ type: "string" }],
			options: {
				list: [
					{ title: "Jammer", value: "jammer" },
					{ title: "Blocker", value: "blocker" },
					{ title: "Pivot", value: "pivot" },
				],
			},
		}),
		defineField({
			name: "season",
			title: "Number of Seasons",
			type: "number",
		}),
		defineField({
			name: "first_season",
			title: "First Season (year)",
			type: "number",
		}),
		defineField({
			name: "misc",
			title: "Anecdote",
			type: "text",
			rows: 3,
		}),
	],
	preview: {
		select: { title: "derby_name", media: "photo" },
	},
});
