export const JOIN_ROLES = [
  {id: 'play', title: 'Joueureuse'},
  {id: 'referee', title: 'Arbitre'},
  {id: 'volunteer', title: 'Bénévole'},
] as const

export type JoinRoleId = (typeof JOIN_ROLES)[number]['id']
