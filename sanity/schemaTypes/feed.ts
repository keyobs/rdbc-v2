import {defineField, defineType} from 'sanity'

const MOBILE_TITLE_MAX_LENGTH = 80
// Label of the button: kept short so that the button stays on one line
const BUTTON_LABEL_MAX_LENGTH = 25

// Slugs match src/features/home/feed/themes.ts
const THEMES = [
  {title: 'Sunset — jaune, orange, rouge', value: 'sunset'},
  {title: 'Vice City — doré, rouge, violet', value: 'vice-city'},
  {title: 'Heatwave — rose, violet', value: 'heatwave'},
  {title: 'Neon Drift — cyan, bleu', value: 'neon-drift'},
]

const isPermanent = (document: unknown): boolean =>
  (document as {isPermanent?: boolean} | undefined)?.isPermanent === true

// FR is the reference language; EN is optional and falls back to FR on the site
const localizedString = (name: string, title: string, maxLength?: number, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'fr',
        title: 'Français',
        type: 'string',
        validation: (Rule) => {
          const rule = maxLength ? Rule.max(maxLength) : Rule
          return required ? rule.required() : rule
        },
      }),
      defineField({
        name: 'en',
        title: 'English (facultatif)',
        type: 'string',
        validation: (Rule) => (maxLength ? Rule.max(maxLength) : Rule),
      }),
    ],
  })

export const feed = defineType({
  name: 'feed',
  title: 'Fil d’actualités — feed',
  type: 'document',
  description: 'Une carte du fil d’actualités de l’accueil. Elle s’affiche si elle est placée dans un emplacement.',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom interne',
      type: 'string',
      description: 'Pour retrouver ce feed dans le Studio. Non affiché sur le site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPermanent',
      title: 'Feed permanent',
      type: 'boolean',
      description:
        'Toujours valable (ex : « Rejoindre le club »). Remplace automatiquement un feed expiré dans un emplacement.',
      initialValue: false,
    }),
    defineField({
      name: 'date',
      title: 'Date de l’événement',
      type: 'date',
      description: 'Affichée sur la carte.',
      hidden: ({document}) => isPermanent(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isPermanent(context.document) && !value ? 'La date est obligatoire pour un feed non permanent.' : true,
        ),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Date d’expiration',
      type: 'date',
      description: 'Le feed reste affiché jusqu’à la fin de ce jour, puis il est remplacé par un feed permanent.',
      hidden: ({document}) => isPermanent(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isPermanent(context.document) && !value
            ? 'La date d’expiration est obligatoire pour un feed non permanent.'
            : true,
        ),
    }),
    localizedString('title', 'Titre', undefined, true),
    defineField({
      ...localizedString('mobileTitle', 'Titre court (mobile, facultatif)', MOBILE_TITLE_MAX_LENGTH),
      description: `Remplace le titre sur mobile. ${MOBILE_TITLE_MAX_LENGTH} caractères maximum.`,
    }),
    defineField({
      name: 'description',
      title: 'Résumé',
      type: 'object',
      description: 'Court : sur mobile, seules les 2 premières lignes s’affichent.',
      fields: [
        defineField({name: 'fr', title: 'Français', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
        defineField({name: 'en', title: 'English (facultatif)', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Couleurs',
      type: 'string',
      options: {list: THEMES, layout: 'radio'},
      initialValue: 'sunset',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Photo de fond (facultative)',
      type: 'image',
      description: 'Remplace le dégradé de couleurs. Choisir une photo sombre pour que le texte reste lisible.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'link',
      title: 'Bouton (facultatif)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        localizedString('label', 'Texte du bouton', BUTTON_LABEL_MAX_LENGTH),
        defineField({
          name: 'href',
          title: 'Lien',
          type: 'url',
          description: 'Chemin interne (ex : /competitions) ou adresse complète.',
          validation: (Rule) => Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          const link = value as {label?: {fr?: string}; href?: string} | undefined
          return link?.label?.fr && !link.href ? 'Le bouton a besoin d’un lien.' : true
        }),
    }),
  ],
  orderings: [
    {
      title: 'Date de l’événement (récentes d’abord)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', isPermanent: 'isPermanent', date: 'date', media: 'backgroundImage'},
    prepare: ({title, isPermanent, date, media}) => ({
      title: title ?? 'Feed sans nom',
      subtitle: isPermanent ? 'Permanent' : date ? new Date(date).toLocaleDateString('fr-FR') : '',
      media,
    }),
  },
})
