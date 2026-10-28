import {defineField, defineType} from 'sanity'
import {FeedIconInput} from './FeedIconInput'
import {FEED_ICONS} from './feedIcons'
import {FEED_THEMES} from './feedThemes'

const MOBILE_TITLE_MAX_LENGTH = 80
// Label of the button: kept short so that the button stays on one line
const BUTTON_LABEL_MAX_LENGTH = 25
const MAX_PERMANENT_FEEDS = 10

const PERMANENT_COUNT_QUERY = `count(*[_type == "feed" && isPermanent == true && !(_id in path("drafts.**")) && _id != $id])`
const SAME_PRIORITY_QUERY = `*[_type == "feed" && isPermanent == true && priority == $priority && !(_id in path("drafts.**")) && _id != $id][0].name`

const PRIORITIES = Array.from({length: MAX_PERMANENT_FEEDS}, (_, index) => {
  const priority = index + 1
  const hint = priority === 1 ? ' — utilisé en premier' : priority === MAX_PERMANENT_FEEDS ? ' — utilisé en dernier' : ''
  return {title: `${priority}${hint}`, value: priority}
})

// Published version of the document: a draft and its published copy are the same feed
const publishedId = (document: {_id: string}): string => document._id.replace(/^drafts\./, '')

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
  description:
    'Une carte du fil d’actualités de l’accueil. Ses couleurs dépendent de l’emplacement où elle est placée.',
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
      description: `Toujours valable (ex : « Rejoindre le club »). Remplace automatiquement un feed expiré dans un emplacement. ${MAX_PERMANENT_FEEDS} feeds permanents maximum.`,
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value || !context.document) return true
          // Other published permanent feeds: this one is left out, draft or not
          const count = await context
            .getClient({apiVersion: '2025-08-15'})
            .fetch<number>(PERMANENT_COUNT_QUERY, {id: publishedId(context.document)})
          return count >= MAX_PERMANENT_FEEDS
            ? `Il y a déjà ${MAX_PERMANENT_FEEDS} feeds permanents : décoche-en un avant.`
            : true
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Icône',
      type: 'string',
      description: 'Affichée à la place de la date.',
      options: {list: FEED_ICONS.map(({title, value}) => ({title, value}))},
      components: {input: FeedIconInput},
      hidden: ({document}) => !isPermanent(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          isPermanent(context.document) && !value ? 'L’icône est obligatoire pour un feed permanent.' : true,
        ),
    }),
    defineField({
      name: 'priority',
      title: 'Priorité de remplacement',
      type: 'number',
      description:
        'Quand un feed daté expire, ou quand aucun feed n’est placé dans les emplacements, les feeds permanents prennent la place, dans cet ordre : la priorité 1 d’abord, puis la 2, etc. Chaque feed permanent a sa propre priorité.',
      options: {list: PRIORITIES},
      hidden: ({document}) => !isPermanent(document),
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!isPermanent(context.document) || !context.document) return true
          if (!value) return 'La priorité est obligatoire pour un feed permanent.'
          const sameName = await context
            .getClient({apiVersion: '2025-08-15'})
            .fetch<string | null>(SAME_PRIORITY_QUERY, {priority: value, id: publishedId(context.document)})
          return sameName
            ? `La priorité ${value} est déjà prise par le feed « ${sameName} ». Choisis-en une autre.`
            : true
        }),
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
      name: 'forcedTheme',
      title: 'Couleurs forcées (facultatif)',
      type: 'string',
      description:
        'Laisser vide pour prendre les couleurs de l’emplacement occupé. Si rempli, ce feed garde toujours ces couleurs.',
      options: {list: FEED_THEMES, layout: 'radio'},
      hidden: ({document}) => !isPermanent(document),
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
      title: 'Priorité des feeds permanents',
      name: 'priorityAsc',
      by: [
        {field: 'isPermanent', direction: 'desc'},
        {field: 'priority', direction: 'asc'},
      ],
    },
    {
      title: 'Date de l’événement (récentes d’abord)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', isPermanent: 'isPermanent', priority: 'priority', date: 'date', media: 'backgroundImage'},
    prepare: ({title, isPermanent, priority, date, media}) => ({
      title: title ?? 'Feed sans nom',
      subtitle: isPermanent
        ? `Permanent · priorité ${priority ?? 'à choisir'}`
        : date
          ? new Date(date).toLocaleDateString('fr-FR')
          : '',
      media,
    }),
  },
})
