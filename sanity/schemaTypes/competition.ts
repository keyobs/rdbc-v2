import {defineArrayMember, defineField, defineType} from 'sanity'

type CompetitionTeam = 'A' | 'B' | 'home'

// Values match TeamKey in src/features/games/types.ts
const TEAMS: {title: string; value: CompetitionTeam}[] = [
  {title: 'TTA — Petites Morts', value: 'A'},
  {title: 'TTB — Compagnie Cruelle', value: 'B'},
  {title: 'Intraligue — entre équipes du club', value: 'home'},
]

const HOME_TEAMS = [
  {title: 'Pink Cheek Peaches', value: 'pink-cheek-peaches'},
  {title: 'Rotten Black Grapes', value: 'rotten-black-grapes'},
  {title: 'Boom Bright Gold', value: 'boom-bright-gold'},
]

const teamOf = (document: unknown): CompetitionTeam | undefined =>
  (document as {team?: CompetitionTeam} | undefined)?.team

const isIntraleague = (document: unknown): boolean => teamOf(document) === 'home'

interface GameValue {
  rdbcScore?: number
  opponentScore?: number
  homeTeam?: string
  awayTeam?: string
}

const isPlayed = (game: GameValue): boolean => game.rdbcScore !== undefined && game.opponentScore !== undefined

// Venue and home/away are only shown in "Prochains matchs": required as long as a game is still to come
const hasUpcomingGame = (document: unknown): boolean =>
  ((document as {games?: GameValue[]} | undefined)?.games ?? []).some((game) => !isPlayed(game))

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

// FR is the reference language; EN is optional and falls back to FR on the site
const localizedName = (name: string, title: string, example: string) =>
  defineField({
    name,
    title,
    type: 'object',
    description: example,
    fields: [
      defineField({name: 'fr', title: 'Français', type: 'string'}),
      defineField({name: 'en', title: 'English (facultatif)', type: 'string'}),
    ],
  })

const scoreField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'number',
    validation: (Rule) => Rule.integer().min(0),
  })

const gameMember = defineArrayMember({
  name: 'game',
  title: 'Match',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Heure (facultative)',
      type: 'string',
      description: 'Ex : 14:30. Laisser vide si elle n’est pas connue.',
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || TIME_PATTERN.test(value) ? true : 'Écris l’heure sous la forme 14:30.',
        ),
    }),
    defineField({
      name: 'opponent',
      title: 'Équipe adverse',
      type: 'reference',
      to: [{type: 'club'}],
      description: 'Absente de la liste ? Crée-la d’abord dans « Clubs adverses ».',
      hidden: ({document}) => isIntraleague(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isIntraleague(context.document) && !value ? 'Choisis l’équipe adverse.' : true,
        ),
    }),
    defineField({
      name: 'homeTeam',
      title: 'Équipe du club (à gauche)',
      type: 'string',
      options: {list: HOME_TEAMS, layout: 'radio'},
      hidden: ({document}) => !isIntraleague(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          isIntraleague(context.document) && !value ? 'Choisis l’équipe.' : true,
        ),
    }),
    defineField({
      name: 'awayTeam',
      title: 'Équipe adverse du club (à droite)',
      type: 'string',
      options: {list: HOME_TEAMS, layout: 'radio'},
      hidden: ({document}) => !isIntraleague(document),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isIntraleague(context.document)) return true
          if (!value) return 'Choisis l’équipe adverse.'
          return (context.parent as GameValue | undefined)?.homeTeam === value
            ? 'Une équipe ne peut pas jouer contre elle-même.'
            : true
        }),
    }),
    defineField({
      name: 'isWftda',
      title: 'Match WFTDA',
      type: 'boolean',
      description: 'Cocher si ce match compte pour le classement WFTDA.',
      initialValue: false,
    }),
    scoreField('rdbcScore', 'Score RDBC (à gauche)'),
    scoreField('opponentScore', 'Score adverse (à droite)'),
    // Optional so a missing photo never blocks publishing
    defineField({
      name: 'gallery',
      title: 'Photos du match (facultatives)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'credit', title: 'Crédit photo', type: 'string', description: 'Ex : © Prénom Nom'})],
        }),
      ],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'report',
      title: 'Récit du match (facultatif)',
      type: 'reference',
      to: [{type: 'news'}],
      description: 'Article racontant le match. Absent de la liste ? Crée-le d’abord dans les actus, au format « Article ».',
      options: {filter: 'format == "article"'},
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const game = value as GameValue | undefined
      const hasRdbc = game?.rdbcScore !== undefined
      const hasOpponent = game?.opponentScore !== undefined
      return hasRdbc === hasOpponent ? true : 'Saisis les deux scores, ou aucun si le match n’est pas encore joué.'
    }),
  preview: {
    select: {
      date: 'date',
      time: 'time',
      opponent: 'opponent.name',
      homeTeam: 'homeTeam',
      awayTeam: 'awayTeam',
      rdbcScore: 'rdbcScore',
      opponentScore: 'opponentScore',
      isWftda: 'isWftda',
      media: 'gallery.0',
    },
    prepare: ({date, time, opponent, homeTeam, awayTeam, rdbcScore, opponentScore, isWftda, media}) => {
      const titleOf = (value?: string) => HOME_TEAMS.find((team) => team.value === value)?.title
      const versus = opponent ?? [titleOf(homeTeam), titleOf(awayTeam)].filter(Boolean).join(' / ')
      const score = isPlayed({rdbcScore, opponentScore}) ? `${rdbcScore} / ${opponentScore}` : 'À venir'
      const day = date ? new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR') : 'Sans date'
      return {
        title: versus || 'Match sans adversaire',
        subtitle: [day, time, score, isWftda && 'WFTDA'].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})

export const competition = defineType({
  name: 'competition',
  title: 'Compétition',
  type: 'document',
  description:
    'Un plateau, un tournoi ou un match isolé, avec tous ses matchs. Un match sans score est affiché dans « Prochains matchs », un match avec ses deux scores dans « Résultats ».',
  fields: [
    defineField({
      name: 'team',
      title: 'Équipe RDBC',
      type: 'string',
      options: {list: TEAMS, layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    localizedName(
      'competition',
      'Compétition (facultatif)',
      'Seulement pour un championnat ou un match WFTDA. Ex : Championnat de France 2026 / 2026 French Championship. Laisser vide pour tout autre match.',
    ),
    localizedName(
      'event',
      'Événement (facultatif)',
      'Affiché à côté de chaque résultat. Ex : N2 — Plateau 2 / N2 — Stage 2, N2 — Playoffs. Laisser vide pour tout autre match.',
    ),
    defineField({
      name: 'venue',
      title: 'Lieu',
      type: 'string',
      description: 'Ex : Gymnase Mouneyra, Bordeaux. Obligatoire tant qu’un match est à venir.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          hasUpcomingGame(context.document) && !value ? 'Le lieu est obligatoire pour un match à venir.' : true,
        ),
    }),
    defineField({
      name: 'location',
      title: 'Domicile ou extérieur',
      type: 'string',
      options: {
        list: [
          {title: 'Domicile — à Bordeaux', value: 'home'},
          {title: 'Extérieur', value: 'away'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Obligatoire tant qu’un match est à venir.',
      hidden: ({document}) => isIntraleague(document),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !isIntraleague(context.document) && hasUpcomingGame(context.document) && !value
            ? 'Choisis domicile ou extérieur pour un match à venir.'
            : true,
        ),
    }),
    defineField({
      name: 'poster',
      title: 'Affiche (facultative)',
      type: 'image',
      description: 'Affichée à côté des résultats sur l’accueil.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'games',
      title: 'Matchs',
      type: 'array',
      description: 'Un plateau peut durer plusieurs jours : chaque match a sa propre date.',
      of: [gameMember],
      validation: (Rule) => Rule.required().min(1).error('Ajoute au moins un match.'),
    }),
  ],
  preview: {
    select: {competition: 'competition.fr', event: 'event.fr', team: 'team', games: 'games', media: 'poster'},
    prepare: ({competition, event, team, games, media}) => {
      const dates = (Array.isArray(games) ? games : [])
        .map((game: {date?: string}) => game.date)
        .filter((date): date is string => Boolean(date))
        .sort()
      const first = dates[0] ? new Date(`${dates[0]}T12:00:00`).toLocaleDateString('fr-FR') : 'Sans date'
      const teamTitle = TEAMS.find(({value}) => value === team)?.title.split(' — ')[0] ?? ''
      return {
        title: [event, competition].filter(Boolean).join(' · ') || 'Match',
        subtitle: `${teamTitle} · ${first} · ${dates.length} match(s)`,
        media,
      }
    },
  },
})
