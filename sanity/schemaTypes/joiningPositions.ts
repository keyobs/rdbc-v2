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
              options: {
                layout: 'radio',
                list: [
                  {title: 'Jouer', value: 'play'},
                  {title: 'Arbitrer', value: 'referee'},
                  {title: 'Accompagner', value: 'support'},
                  {title: 'Kiffer', value: 'fun'},
                ],
              },
            }),
            defineField({
              name: 'href',
              title: 'Lien',
              type: 'string',
              description:
                'Chemin interne (ex: /rejoindre#jouer) ou URL. Laisser vide tant que la page de destination n’existe pas.',
              validation: (Rule) =>
                Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
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
