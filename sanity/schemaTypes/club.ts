import { defineField, defineType } from "sanity";

export const club = defineType({
	name: "club",
	title: "Club",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Club Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "name" },
	},
});
