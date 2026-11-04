import {defineField, defineType} from 'sanity'
import {ROSTER_GROUPS} from '../rosterGroups'

export const team = defineType({
  name: 'team',
  title: 'Équipe ou rubrique',
  type: 'document',
  fields: [
    defineField({
      name: 'members',
      title: 'Membres',
      type: 'array',
      description:
        'Sélectionner les fiches créées dans Membres du club. Une même personne peut appartenir à plusieurs équipes. Le site applique automatiquement le tri et le stand-by.',
      of: [
        {
          type: 'reference',
          to: [{type: 'player'}],
          options: {
            disableNew: true,
            filter: ({document}) => {
              const id = document._id.replace(/^drafts\./, '')
              if (id === 'team-hall') return {filter: 'true'}
              const category =
                id === 'team-officials'
                  ? 'category == "referee"'
                  : id === 'team-staff'
                    ? 'category in ["bench", "staff", "support"]'
                    : 'coalesce(category, "skater") == "skater"'
              return {filter: `in_roster != false && (${category})`}
            },
          },
        },
      ],
      initialValue: [],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: {id: '_id', members: 'members'},
    prepare: ({id, members}) => ({
      title:
        ROSTER_GROUPS.find((group) => `team-${group.key}` === id?.replace(/^drafts\./, ''))
          ?.title ?? 'Équipe ou rubrique',
      subtitle: `${members?.length ?? 0} membre(s)`,
    }),
  },
})
