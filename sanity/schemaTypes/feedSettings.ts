import {defineField, defineType} from 'sanity'
import {FEED_THEMES} from './feedThemes'

// Spot names match src/features/home/feed/feedData.ts
const SPOTS = ['spot1', 'spot2', 'spot3', 'spot4'] as const
type SpotName = (typeof SPOTS)[number]

interface SpotValue {
  theme?: string
  feed?: {_ref?: string}
}

const otherSpots = (document: unknown, name: SpotName): SpotValue[] =>
  SPOTS.filter((spot) => spot !== name).flatMap((spot) => {
    const value = (document as Partial<Record<SpotName, SpotValue>> | undefined)?.[spot]
    return value ? [value] : []
  })

const spotField = (name: SpotName, index: number) =>
  defineField({
    name,
    title: `Emplacement ${index + 1}`,
    type: 'object',
    fields: [
      defineField({
        name: 'theme',
        title: 'Couleurs',
        type: 'string',
        options: {list: FEED_THEMES, layout: 'radio'},
        validation: (Rule) =>
          Rule.required().custom((value, context) =>
            otherSpots(context.document, name).some((spot) => spot.theme === value)
              ? 'Ces couleurs sont déjà utilisées par un autre emplacement.'
              : true,
          ),
      }),
      defineField({
        name: 'feed',
        title: 'Feed',
        type: 'reference',
        description: 'Laisser vide pour ne rien afficher ici.',
        to: [{type: 'feed'}],
        options: {
          // Only feeds that can still be shown and are not placed elsewhere
          filter: ({document}) => ({
            filter: '(isPermanent == true || expiryDate >= $today) && !(_id in $placed)',
            params: {
              today: new Date().toISOString().slice(0, 10),
              placed: otherSpots(document, name).flatMap((spot) => (spot.feed?._ref ? [spot.feed._ref] : [])),
            },
          }),
        },
        validation: (Rule) =>
          Rule.custom((value, context) =>
            value?._ref && otherSpots(context.document, name).some((spot) => spot.feed?._ref === value._ref)
              ? 'Ce feed est déjà placé dans un autre emplacement.'
              : true,
          ),
      }),
    ],
  })

export const feedSettings = defineType({
  name: 'feedSettings',
  title: 'Fil d’actualités — emplacements',
  type: 'document',
  description:
    'Les feeds affichés sur l’accueil, dans l’ordre des emplacements, chacun avec ses couleurs. Un feed expiré est remplacé automatiquement par un feed permanent. Sans feed placé, l’accueil affiche les feeds permanents dans ces couleurs.',
  fields: SPOTS.map(spotField),
  initialValue: Object.fromEntries(SPOTS.map((spot, index) => [spot, {theme: FEED_THEMES[index].value}])),
  preview: {
    prepare: () => ({title: 'Fil d’actualités — emplacements'}),
  },
})
