import {defineField, defineType} from 'sanity'

const SEASON_PATTERN = /^(\d{4})-(\d{4})$/

const SAME_SEASON_QUERY = `count(*[_type == "season" && name == $name && !(_id in path("drafts.**")) && _id != $id])`

const captionField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'fr', title: 'Français', type: 'text', rows: 2}),
      defineField({name: 'en', title: 'English (facultatif)', type: 'text', rows: 2}),
    ],
  })

export const season = defineType({
  name: 'season',
  title: 'Saison',
  type: 'document',
  description:
    'La phrase affichée au-dessus des résultats de chaque équipe, sur la page Matchs. Pour la saison en cours, écrire au présent ; pour une saison passée, au passé.',
  fields: [
    defineField({
      name: 'name',
      title: 'Saison',
      type: 'string',
      description: 'Une saison va de septembre à août. Ex : 2026-2027',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const match = value ? SEASON_PATTERN.exec(value) : null
          if (!match || Number(match[2]) !== Number(match[1]) + 1) {
            return 'Écris la saison sous la forme 2026-2027.'
          }
          if (!context.document) return true
          const count = await context
            .getClient({apiVersion: '2025-08-15'})
            .fetch<number>(SAME_SEASON_QUERY, {name: value, id: context.document._id.replace(/^drafts\./, '')})
          return count > 0 ? `La saison ${value} existe déjà.` : true
        }),
    }),
    captionField('captionA', 'TTA — Petites Morts'),
    captionField('captionB', 'TTB — Compagnie Cruelle'),
    captionField('captionHome', 'Intraligue'),
  ],
  orderings: [
    {title: 'Saison (récentes d’abord)', name: 'nameDesc', by: [{field: 'name', direction: 'desc'}]},
  ],
  preview: {
    select: {name: 'name'},
    prepare: ({name}) => ({title: name ? `Saison ${name}` : 'Saison sans nom'}),
  },
})
