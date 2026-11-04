import {defineField} from 'sanity'

export const joinString = (name: string, title: string, multiline = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'fr',
        title: 'Français',
        type: multiline ? 'text' : 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({name: 'en', title: 'Anglais (facultatif)', type: multiline ? 'text' : 'string'}),
    ],
    validation: (Rule) => Rule.required(),
  })

export const joinTags = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'fr',
        title: 'Français',
        type: 'array',
        of: [{type: 'string'}],
        validation: (Rule) => Rule.unique(),
      }),
      defineField({
        name: 'en',
        title: 'Anglais (facultatif)',
        type: 'array',
        of: [{type: 'string'}],
        validation: (Rule) => Rule.unique(),
      }),
    ],
    description:
      'Sans traduction anglaise, les badges français seront utilisés. Une liste vide masque les badges.',
  })
