export const ROSTER_GROUPS = [
  {key: 'A', title: 'TTA — Les Petites Morts'},
  {key: 'B', title: 'TTB — Les Cruelles'},
  {key: 'pink-cheek-peaches', title: 'Pink Cheek Peaches'},
  {key: 'rotten-black-grapes', title: 'Rotten Black Grapes'},
  {key: 'boom-bright-gold', title: 'Boom Bright Gold'},
  {key: 'officials', title: 'Officiels'},
  {key: 'staff', title: 'Staff'},
  {key: 'hall', title: 'Hall of Fame'},
] as const

export type RosterGroup = (typeof ROSTER_GROUPS)[number]['key']
