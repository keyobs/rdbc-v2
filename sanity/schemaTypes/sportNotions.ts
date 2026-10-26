import {defineField, defineType} from 'sanity'

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'fr', title: 'FR', type: 'string'}),
      defineField({name: 'en', title: 'EN', type: 'string'}),
    ],
  })

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'fr', title: 'FR', type: 'text'}),
      defineField({name: 'en', title: 'EN', type: 'text'}),
    ],
  })

export const sportNotions = defineType({
  name: 'sportNotionsSection',
  title: 'Le sport - Notions',
  type: 'document',
  fields: [
    defineField({
      name: 'notions',
      title: 'Notions affichées',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'number', title: 'Numéro', type: 'string'}),
            localizedString('title', 'Titre'),
            localizedText('summary', 'Résumé (recto)'),
            localizedText('detail', 'Détail (verso)'),
          ],
          preview: {
            select: {title: 'title.fr', subtitle: 'summary.fr'},
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Le sport - Notions'}),
  },
})
