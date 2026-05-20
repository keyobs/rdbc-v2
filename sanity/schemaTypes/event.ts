import { defineField, defineType } from "sanity";

export const event = defineType({
	name: "event",
	title: "Event",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
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
			name: "description",
			title: "Description",
			type: "text",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "link",
			title: "External Link",
			type: "url",
		}),
	],
	preview: {
		select: { title: "title", subtitle: "date" },
		prepare({ title, subtitle }) {
			const date = subtitle
				? new Date(subtitle).toLocaleDateString("fr-FR")
				: "";
			return { title, subtitle: date };
		},
	},
});
