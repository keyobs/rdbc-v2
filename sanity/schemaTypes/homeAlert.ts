import {defineField, defineType} from 'sanity'

const localizedString = (name: string, title: string, maxLength: number) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'fr', title: 'FR', type: 'string', validation: (Rule) => Rule.max(maxLength)}),
      defineField({name: 'en', title: 'EN', type: 'string', validation: (Rule) => Rule.max(maxLength)}),
    ],
  })

// Label of the button: kept short so that the button stays on one line
const BUTTON_LABEL_MAX_LENGTH = 25

export const homeAlert = defineType({
  name: 'homeAlert',
  title: 'Accueil - Bandeau alerte',
  type: 'document',
  description:
    'Une seule information éphémère entre le fil d’actualités et les photos (ex: lien vers le streaming d’un match).',
  fields: [
    defineField({
      name: 'active',
      title: 'Afficher le bandeau',
      type: 'boolean',
      initialValue: false,
    }),
    localizedString('label', 'Pastille', 20),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'object',
      fields: [
        defineField({name: 'fr', title: 'FR', type: 'string', validation: (Rule) => Rule.max(90)}),
        defineField({name: 'en', title: 'EN', type: 'string', validation: (Rule) => Rule.max(90)}),
      ],
      validation: (Rule) =>
        Rule.custom((message, context) => {
          const active = (context.document as {active?: boolean} | undefined)?.active
          const value = message as {fr?: string; en?: string} | undefined
          return active && !value?.fr && !value?.en
            ? 'Un message est obligatoire quand le bandeau est affiché.'
            : true
        }),
    }),
    localizedString('meta', 'Ligne d’information (date, heure, plateforme)', 90),
    defineField({
      name: 'link',
      title: 'Bouton',
      type: 'object',
      fields: [
        defineField({
          name: 'href',
          title: 'Lien',
          type: 'url',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
        }),
        localizedString('label', 'Texte du bouton', BUTTON_LABEL_MAX_LENGTH),
      ],
    }),
  ],
  preview: {
    select: {title: 'message.fr', active: 'active'},
    prepare: ({title, active}) => ({
      title: title ?? 'Bandeau alerte',
      subtitle: active ? 'Affiché' : 'Masqué',
    }),
  },
})
