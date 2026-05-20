import { defineField, defineType } from "sanity";

export const article = defineType({
	name: "article",
	title: "Article",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title" },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "date",
			title: "Publication Date",
			type: "datetime",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "image",
			title: "Featured Image",
			type: "image",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [{ type: "block" }],
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "title", subtitle: "author", media: "image" },
	},
});
