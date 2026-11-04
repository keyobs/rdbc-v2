/**
 * Preview: sanity exec scripts/migrateTeamRosters.ts --with-user-token
 * Apply: append -- --apply. Existing lists and player documents are never changed.
 */
import {getCliClient} from 'sanity/cli'
import type {Player} from '../sanity.types'
import {ROSTER_GROUPS} from '../rosterGroups'

const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({
  useCdn: false,
  perspective: 'raw',
})

async function run(): Promise<void> {
  const [players, existingIds] = await Promise.all([
    client.fetch<Player[]>(
      '*[_type == "player" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]',
    ),
    client.fetch<string[]>('*[_type == "team"]._id'),
  ])
  const transaction = client.transaction()
  let changes = 0
  for (const group of ROSTER_GROUPS) {
    const id = `team-${group.key}`
    if (existingIds.includes(id) || existingIds.includes(`drafts.${id}`)) {
      console.log(`${group.title}: liste existante conservée.`)
      continue
    }
    const selected = players.filter((player) => {
      if (group.key === 'hall') return player.hall_of_fame === true
      if (player.in_roster === false) return false
      const category = player.category ?? 'skater'
      if (group.key === 'officials') return category === 'referee'
      if (group.key === 'staff') return ['bench', 'staff', 'support'].includes(category)
      return category === 'skater' && (player.team === group.key || player.intraligue === group.key)
    })
    console.log(`${group.title}: ${selected.length} membre(s).`)
    transaction.createIfNotExists({
      _id: id,
      _type: 'team',
      members: selected.map((member, index) => ({
        _key: `member-${index}`,
        _type: 'reference',
        _ref: member._id,
      })),
    })
    changes++
  }
  if (!changes) {
    console.log('Aucune liste à créer.')
  } else if (process.argv.includes('--apply')) {
    await transaction.commit()
    console.log(`${changes} liste(s) créée(s). Les fiches membres sont conservées.`)
  } else {
    console.log(`Simulation : ${changes} liste(s) à créer. Ajouter -- --apply pour appliquer.`)
  }
}

run().catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
