import {defineField, defineType} from 'sanity'

export const photo = defineType({
  name: 'libraryPhoto',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la photo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required().assetRequired(),
    }),
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description: 'Décrire la photo lorsqu’elle apporte une information au contenu.',
    }),
    defineField({
      name: 'credit',
      title: 'Crédit photo',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'credit', media: 'image'},
  },
})
