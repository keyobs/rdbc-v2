import {defineArrayMember, defineField, defineType} from 'sanity'

const NUMBER_OF_SPOTS = 4

export const feedSettings = defineType({
  name: 'feedSettings',
  title: 'Fil d’actualités — emplacements',
  type: 'document',
  fields: [
    defineField({
      name: 'spots',
      title: 'Emplacements',
      type: 'array',
      description: `Les ${NUMBER_OF_SPOTS} feeds affichés sur l’accueil, dans l’ordre (glisser pour réordonner). Un feed expiré est remplacé automatiquement par un feed permanent.`,
      of: [defineArrayMember({type: 'reference', to: [{type: 'feed'}]})],
      validation: (Rule) =>
        Rule.required()
          .length(NUMBER_OF_SPOTS)
          .unique()
          .error(`Choisir exactement ${NUMBER_OF_SPOTS} feeds différents.`),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Fil d’actualités — emplacements'}),
  },
})
