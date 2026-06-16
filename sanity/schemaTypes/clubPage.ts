import { defineField, defineType } from "sanity";

const localizedString = (name: string, title: string) =>
	defineField({
		name,
		title,
		type: "object",
		fields: [
			defineField({ name: "fr", title: "FR", type: "string" }),
			defineField({ name: "en", title: "EN", type: "string" }),
		],
	});

const localizedText = (name: string, title: string) =>
	defineField({
		name,
		title,
		type: "object",
		fields: [
			defineField({ name: "fr", title: "FR", type: "text" }),
			defineField({ name: "en", title: "EN", type: "text" }),
		],
	});

const localizedBlocks = (name: string, title: string) =>
	defineField({
		name,
		title,
		type: "object",
		fields: [
			defineField({ name: "fr", title: "FR", type: "array", of: [{ type: "block" }] }),
			defineField({ name: "en", title: "EN", type: "array", of: [{ type: "block" }] }),
		],
	});

export const clubPage = defineType({
	name: "clubPage",
	title: "Page Club",
	type: "document",
	fields: [
		// HistoryBlock
		localizedBlocks("history", "Historique du club"),

		// ValuesBlock
		defineField({
			name: "values",
			title: "Valeurs du club",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						localizedString("title", "Titre"),
						localizedText("description", "Description"),
						defineField({ name: "emoji", title: "Emoji", type: "string" }),
					],
					preview: {
						select: { title: "title.fr" },
					},
				},
			],
		}),

		// TrainingBlock
		defineField({
			name: "training_sessions",
			title: "Séances d'entraînement",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						localizedString("label", "Intitulé"),
						defineField({
							name: "days",
							title: "Jours",
							type: "array",
							of: [{ type: "string" }],
							options: {
								list: [
									{ title: "Lundi", value: "lundi" },
									{ title: "Mardi", value: "mardi" },
									{ title: "Mercredi", value: "mercredi" },
									{ title: "Jeudi", value: "jeudi" },
									{ title: "Vendredi", value: "vendredi" },
									{ title: "Samedi", value: "samedi" },
									{ title: "Dimanche", value: "dimanche" },
								],
							},
						}),
						defineField({ name: "time_start", title: "Heure début", type: "string" }),
						defineField({ name: "time_end", title: "Heure fin", type: "string" }),
						defineField({ name: "location_name", title: "Nom du lieu", type: "string" }),
						defineField({ name: "location_address", title: "Adresse", type: "string" }),
						defineField({
							name: "maps_query",
							title: "Requête Maps (nom + adresse pour l'URL)",
							type: "string",
							description: "Utilisé pour le lien 'Ouvrir dans Maps'. Ex: Gymnase Mouneyra, Bordeaux",
						}),
					],
					preview: {
						select: { title: "label.fr", subtitle: "location_name" },
					},
				},
			],
		}),

		// RolesPile
		defineField({
			name: "roles",
			title: "Rôles dans le club",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						localizedString("title", "Titre du rôle"),
						localizedText("description", "Description"),
						defineField({ name: "emoji", title: "Emoji", type: "string" }),
					],
					preview: {
						select: { title: "title.fr" },
					},
				},
			],
		}),

		// PolaroidGallery
		defineField({
			name: "gallery",
			title: "Galerie Polaroid",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "photo",
							title: "Photo",
							type: "image",
							options: { hotspot: true },
							validation: (Rule) => Rule.required(),
						}),
						localizedString("caption", "Légende manuscrite"),
					],
					preview: {
						select: { title: "caption.fr", media: "photo" },
					},
				},
			],
		}),

		// JoinUsForm
		defineField({
			name: "join_email",
			title: "Email de contact pour rejoindre le club",
			type: "string",
			validation: (Rule) => Rule.email(),
		}),
		localizedText("join_info", "Texte d'invitation (Rejoindre le club)"),
	],
	preview: {
		prepare: () => ({ title: "Page Club RDBC" }),
	},
});
