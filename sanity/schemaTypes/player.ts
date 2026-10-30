import {defineField, defineType, type SanityDocument} from 'sanity'

const isSkater = (document: SanityDocument | undefined) =>
  !document?.category || document.category === 'skater'

export const player = defineType({
  name: 'player',
  title: 'Membre du club',
  type: 'document',
  initialValue: {category: 'skater', standby: false, hall_of_fame: false, in_roster: true},
  fields: [
    defineField({
      name: 'derby_name',
      title: 'Nom de derby',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          {title: 'Skater', value: 'skater'},
          {title: 'Arbitre', value: 'referee'},
          {title: 'Banc', value: 'bench'},
          {title: 'Staff', value: 'staff'},
          {title: 'Soutien émotionnel', value: 'support'},
        ],
        layout: 'radio',
      },
      initialValue: 'skater',
    }),
    defineField({
      name: 'official_roles',
      title: 'Type d’arbitrage',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'SO — officiel·le en patins', value: 'SO'},
          {title: 'NSO — officiel·le sans patins', value: 'NSO'},
        ],
      },
      hidden: ({document}) => document?.category !== 'referee',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'team',
      title: 'Équipe',
      type: 'string',
      description:
        'Laisser vide si la personne ne fait pas partie de la TTA ou de la TTB. L’intraligue se choisit séparément.',
      options: {
        list: [
          {title: 'TTA — Les Petites Morts', value: 'A'},
          {title: 'TTB — La Compagnie Cruelle', value: 'B'},
        ],
      },
      hidden: ({document}) => !isSkater(document),
    }),
    defineField({
      name: 'intraligue',
      title: 'Équipe intraligue',
      type: 'string',
      options: {
        list: [
          {title: 'Pink Cheek Peaches', value: 'pink-cheek-peaches'},
          {title: 'Rotten Black Grapes', value: 'rotten-black-grapes'},
          {title: 'Boom Bright Gold', value: 'boom-bright-gold'},
        ],
      },
      hidden: ({document}) => !isSkater(document),
    }),
    defineField({
      name: 'number',
      title: 'Numéro de maillot',
      type: 'string',
      description: 'Saisi comme du texte pour conserver les zéros initiaux, par exemple 007.',
      hidden: ({document}) => !isSkater(document),
    }),
    defineField({
      name: 'role',
      title: 'Postes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Jammer', value: 'jammer'},
          {title: 'Blocker', value: 'blocker'},
          {title: 'Pivot', value: 'pivot'},
        ],
      },
      hidden: ({document}) => !isSkater(document),
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'generation',
      title: 'Génération (facultative)',
      type: 'string',
      options: {
        list: [
          {title: 'Boomer', value: 'boomer'},
          {title: 'Génération X', value: 'generationX'},
          {title: 'Xennials', value: 'xennials'},
          {title: 'Millenials', value: 'millenials'},
          {title: 'Génération Z', value: 'generationZ'},
          {title: 'Alpha', value: 'alpha'},
          {title: 'MamaForEver', value: 'MamaForEver'},
          {title: 'ForeverYoung', value: 'ForeverYoung'},
          {title: 'BornOld', value: 'BornOld'},
          {title: 'GrannyVibes', value: 'GrannyVibes'},
          {title: 'CoolAunt', value: 'CoolAunt'},
        ],
      },
    }),
    defineField({
      name: 'first_season',
      title: 'Première saison',
      type: 'number',
      description:
        'Année de début de saison : 2020 pour 2020–2021. Le nombre de saisons est calculé automatiquement, première saison incluse.',
      validation: (Rule) => Rule.integer().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'last_season',
      title: 'Dernière saison (facultative)',
      type: 'number',
      description:
        'Pour une personne ayant quitté le club : année de début de sa dernière saison. Permet de figer le nombre de saisons.',
      hidden: ({document}) => document?.in_roster !== false,
      validation: (Rule) =>
        Rule.integer()
          .min(1900)
          .max(new Date().getFullYear())
          .custom((value, context) => {
            const first = context.document?.first_season
            return value !== undefined && typeof first === 'number' && value < first
              ? 'La dernière saison doit suivre la première.'
              : true
          }),
    }),
    defineField({name: 'misc', title: 'Anecdote ou souvenir marquant', type: 'text', rows: 3}),
    defineField({
      name: 'misc_en',
      title: 'Anecdote en anglais (facultative)',
      type: 'text',
      rows: 3,
      description: 'Si ce champ est vide, la version française sera utilisée.',
    }),
    defineField({
      name: 'standby',
      title: 'En stand-by',
      type: 'boolean',
      initialValue: false,
      description:
        'ON : affichage dans le groupe En stand-by de toutes ses équipes et rubriques. La personne garde ses affiliations. Sans effet sur le Hall of Fame.',
    }),
    defineField({
      name: 'hall_of_fame',
      title: 'Hall of Fame',
      type: 'boolean',
      initialValue: false,
      description:
        'Afficher cette fiche dans la rubrique Hall of Fame. Ce choix est indépendant des effectifs actuels.',
    }),
    defineField({
      name: 'in_roster',
      title: 'Effectif actuel',
      type: 'boolean',
      initialValue: true,
      description:
        'Désactiver pour retirer la fiche des effectifs TTA, TTB, intraligue, officiels et staff. Une fiche sélectionnée pour le Hall of Fame y reste visible.',
    }),
    // Keep the legacy value readable without using a second season counter.
    defineField({
      name: 'season',
      title: 'Ancien nombre de saisons',
      type: 'number',
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'derby_name',
      media: 'photo',
      category: 'category',
      standby: 'standby',
      hall: 'hall_of_fame',
    },
    prepare: ({title, media, category, standby, hall}) => ({
      title,
      subtitle: [
        category === 'referee'
          ? 'Arbitre'
          : category === 'bench'
            ? 'Banc'
            : category === 'support'
              ? 'Soutien émotionnel'
              : category === 'staff'
                ? 'Staff'
                : 'Skater',
        standby && 'En stand-by',
        hall && 'Hall of Fame',
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
