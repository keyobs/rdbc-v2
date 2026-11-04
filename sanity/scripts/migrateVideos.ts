/** Preview: sanity exec scripts/migrateVideos.ts --with-user-token. Add -- --apply to save drafts. Requires local ffmpeg/ffprobe. */
import {getCliClient} from 'sanity/cli'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {mkdtemp, readFile, writeFile, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import type {JoinRole, LibraryVideo, SanityFileAsset} from '../sanity.types'
import {
  parseVideoInfo,
  assertSource,
  assertOptimized,
  encodingArgs,
  VIDEO_PROFILE,
  MAX_SOURCE_BYTES,
  DEFAULT_VIDEO_PRESET,
} from '../video/videoProfile'

const execute = promisify(execFile)
const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({
  useCdn: false,
  perspective: 'raw',
})
type LegacyRole = JoinRole & {legacy?: SanityFileAsset}

async function run(): Promise<void> {
  const apply = process.argv.includes('--apply')
  const roles = await client.fetch<LegacyRole[]>(
    '*[_type == "joinRole" && !(_id in path("versions.**"))]{..., "legacy": video.asset->}',
  )
  const selected = roles.filter(
    (role) =>
      role._id.startsWith('drafts.') || !roles.some((entry) => entry._id === `drafts.${role._id}`),
  )
  const directory = await mkdtemp(join(tmpdir(), 'rdbc-video-migration-'))
  try {
    for (const role of selected) {
      if (role.videoRef || !role.legacy?.url || !role.legacy.size) continue
      const id = `library-video-${role.legacy._id}`
      const existing = await client.fetch<LibraryVideo | null>('*[_id in [$id, $draft]][0]', {
        id,
        draft: `drafts.${id}`,
      })
      let library = existing
      if (!library) {
        if (role.legacy.size > MAX_SOURCE_BYTES)
          throw new Error('Fichier source supérieur à 100 Mo.')
        const response = await fetch(role.legacy.url)
        if (!response.ok) throw new Error(`Téléchargement impossible : ${role._id}`)
        const input = join(directory, 'source')
        const output = join(directory, 'optimized.mp4')
        await writeFile(input, new Uint8Array(await response.arrayBuffer()))
        const probe = async (file: string) =>
          parseVideoInfo(
            (
              await execute('ffprobe', [
                '-v',
                'error',
                '-show_format',
                '-show_streams',
                '-of',
                'json',
                file,
              ])
            ).stdout,
          )
        const source = await probe(input)
        assertSource(source, role.legacy.size)
        await execute('ffmpeg', ['-y', ...encodingArgs(source, input, output)], {
          timeout: 180000,
          maxBuffer: 4 * 1024 * 1024,
        })
        const info = await probe(output)
        const buffer = await readFile(output)
        assertOptimized(info, buffer.byteLength)
        console.log(
          `${role.title?.fr ?? role._id} : ${source.duration.toFixed(2)} s, ${role.legacy.size} → ${buffer.length} octets ; ${info.width} × ${info.height}, sans audio.`,
        )
        if (!apply) continue
        const hash = createHash('sha1').update(buffer).digest('hex')
        const asset =
          (await client.fetch<{_id: string} | null>(
            '*[_type == "sanity.fileAsset" && sha1hash == $hash][0]{_id}',
            {hash},
          )) ??
          (await client.assets.upload('file', buffer, {
            filename: 'video-optimized.mp4',
            contentType: 'video/mp4',
          }))
        const draft = await client.createIfNotExists({
          _id: `drafts.${id}`,
          _type: 'libraryVideo' as const,
          title: `Vidéo — ${role.title?.fr ?? role._id.replace(/^drafts\./, '')}`,
          file: {
            _type: 'optimizedVideo' as const,
            asset: {_type: 'reference' as const, _ref: asset._id},
            duration: info.duration,
            width: info.width,
            height: info.height,
            size: buffer.length,
            sourceSize: role.legacy.size,
            profile: VIDEO_PROFILE,
            preset: DEFAULT_VIDEO_PRESET,
            uploadedAt: role.legacy._createdAt,
            ...(source.capturedAt ? {capturedAt: source.capturedAt} : {}),
          },
        })
        library = draft
      }
      if (!apply) {
        console.log(`${role._id} : bibliothèque existante, référence à préparer.`)
        continue
      }
      const videoRef = {
        _type: 'reference',
        _ref: id,
        ...(library._id.startsWith('drafts.')
          ? {
              _weak: true,
              _strengthenOnPublish: {type: 'libraryVideo', template: {id: 'libraryVideo'}},
            }
          : {}),
      }
      if (role._id.startsWith('drafts.')) {
        await client
          .patch(role._id)
          .ifRevisionId(role._rev)
          .set({videoRef})
          .unset(['video'])
          .commit()
      } else {
        const {_id, _rev, _createdAt, _updatedAt, video, legacy, ...content} = role
        await client.create({...content, _id: `drafts.${role._id}`, videoRef})
      }
      console.log(`Brouillons associés : ${role._id} → ${id}.`)
    }
    console.log(
      apply
        ? 'Migration en brouillon terminée. Rien publié.'
        : 'Simulation terminée. Aucun asset ni document écrit.',
    )
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
}

run().catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
