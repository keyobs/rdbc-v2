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

export const joiningPositions = defineType({
  name: 'homeJoiningSection',
  title: 'Accueil - Profils pour rejoindre',
  type: 'document',
  fields: [
    defineField({
      name: 'positions',
      title: 'Profils affichés',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            localizedString('title', 'Titre'),
            localizedText('description', 'Description'),
            defineField({
              name: 'icon',
              title: 'Icône',
              type: 'string',
              description: 'Emoji ou caractère court affiché sur la carte.',
            }),
          ],
          preview: {
            select: {title: 'title.fr', subtitle: 'description.fr'},
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Accueil - Profils pour rejoindre'}),
  },
})
