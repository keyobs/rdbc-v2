/**
 * sanity exec scripts/importPlayers.ts --with-user-token -- --manifest=/path/players.json
 * Preview by default; --apply saves drafts and --verify checks them without writes.
 * Manifest entries: name, number (string), optional generation, photoPath.
 */
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {getCliClient} from 'sanity/cli'
import type {Player} from '../sanity.types'

interface ImportEntry {
  name: string
  number: string
  generation?: Player['generation']
  photoPath: string
}

const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({
  useCdn: false,
  perspective: 'raw',
})
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

async function run(): Promise<void> {
  const manifestPath = process.argv
    .find((arg) => arg.startsWith('--manifest='))
    ?.slice('--manifest='.length)
  if (!manifestPath) throw new Error('Missing --manifest=/absolute/path.json')
  const entries: ImportEntry[] = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (
    !Array.isArray(entries) ||
    entries.some((entry) => !entry.name || !/^\d+$/.test(entry.number) || !entry.photoPath)
  ) {
    throw new Error('Invalid manifest: name, numeric string number and photoPath are required.')
  }
  const existing = await client.fetch<Player[]>(
    '*[_type == "player" && !(_id in path("versions.**"))]',
  )
  const plans = entries.map((entry) => {
    const matches = existing.filter(
      (player) =>
        normalize(player.derby_name ?? '') === normalize(entry.name) ||
        ((player.category ?? 'skater') === 'skater' && player.number === entry.number),
    )
    const ids = [...new Set(matches.map((player) => player._id.replace(/^drafts\./, '')))]
    if (ids.length > 1)
      throw new Error(`Ambiguous existing records for ${entry.name}: ${ids.join(', ')}`)
    const id = ids[0] ?? `player-${normalize(entry.name)}`
    const prior = matches.find((player) => player._id === `drafts.${id}`) ?? matches[0]
    return {entry, id, prior}
  })
  if (new Set(plans.map((plan) => plan.id)).size !== plans.length)
    throw new Error('Duplicate players in manifest.')
  for (const {entry, id, prior} of plans) {
    console.log(
      `${prior ? 'UPDATE DRAFT' : 'CREATE DRAFT'} ${id}: ${entry.name} #${entry.number} · ${entry.generation ?? 'génération vide'}`,
    )
    await readFile(entry.photoPath)
  }
  if (process.argv.includes('--verify')) {
    for (const {entry, id} of plans) {
      const draft = existing.find((player) => player._id === `drafts.${id}`)
      if (
        !draft ||
        draft.derby_name !== entry.name ||
        draft.number !== entry.number ||
        !draft.photo?.asset?._ref ||
        (entry.generation && draft.generation !== entry.generation)
      ) {
        throw new Error(`Draft verification failed: ${entry.name}`)
      }
    }
    console.log(
      `Verified: ${plans.length} drafts with portraits, names, numbers and expected generations.`,
    )
    return
  }
  if (!process.argv.includes('--apply')) {
    console.log(`Simulation: ${plans.length} fiches. No documents or assets written.`)
    return
  }
  if (process.argv.includes('--names-only')) {
    if (plans.some(({prior}) => !prior?._id.startsWith('drafts.'))) {
      throw new Error('Name corrections require existing drafts for all entries.')
    }
    for (const {entry, prior} of plans) {
      if (!prior || prior.derby_name === entry.name) continue
      await client.patch(prior._id).ifRevisionId(prior._rev).set({derby_name: entry.name}).commit()
      console.log(`Corrected draft name: ${entry.name}`)
    }
    return
  }
  for (const {entry, id, prior} of plans) {
    const buffer = await readFile(entry.photoPath)
    const hash = createHash('sha1').update(buffer).digest('hex')
    let asset = await client.fetch<{_id: string} | null>(
      '*[_type == "sanity.imageAsset" && sha1hash == $hash][0]{_id}',
      {hash},
    )
    if (!asset)
      asset = await client.assets.upload('image', buffer, {
        filename: entry.photoPath.split('/').pop(),
      })
    // Only copy content fields: Sanity manages revision and timestamp metadata.
    const {_id, _rev, _createdAt, _updatedAt, ...content} = prior ?? {}
    const fields = {
      derby_name: entry.name,
      number: entry.number,
      ...(entry.generation ? {generation: entry.generation} : {}),
      photo: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
      category: prior?.category ?? 'skater',
    }
    if (prior?._id.startsWith('drafts.')) {
      await client.patch(prior._id).ifRevisionId(prior._rev).set(fields).commit()
    } else
      await client.create({
        ...content,
        _id: `drafts.${id}`,
        _type: 'player',
        ...fields,
      })
    console.log(`Saved draft: ${entry.name}`)
  }
}

run().catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
