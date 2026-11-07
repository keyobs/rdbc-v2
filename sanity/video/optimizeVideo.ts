import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'
import classWorkerURL from '@ffmpeg/ffmpeg/worker?worker&url'
import {
  assertSource,
  assertOptimized,
  encodingArgs,
  MAX_SOURCE_BYTES,
  parseVideoInfo,
  type VideoInfo,
  DEFAULT_VIDEO_PRESET,
  type VideoPresetId,
} from './videoProfile'

export interface OptimizedResult {
  blob: Blob
  info: VideoInfo
  sourceSize: number
  sourceWidth: number
  sourceHeight: number
  capturedAt?: string
  preset: VideoPresetId
}

/** Single-threaded WASM stays in the editor's browser and needs no isolation headers. */
export async function optimizeVideo(
  file: Blob,
  signal: AbortSignal,
  status: (message: string) => void,
  preset: VideoPresetId = DEFAULT_VIDEO_PRESET,
): Promise<OptimizedResult> {
  if (file.size > MAX_SOURCE_BYTES) throw new Error('Le fichier source dépasse 100 Mo.')
  signal.throwIfAborted()
  const {FFmpeg} = await import('@ffmpeg/ffmpeg')
  signal.throwIfAborted()
  const engine = new FFmpeg()
  const logs: string[] = []
  engine.on('log', ({message}) => {
    logs.push(message)
    if (logs.length > 6) logs.shift()
  })
  const abort = () => engine.terminate()
  signal.addEventListener('abort', abort, {once: true})
  let expired = false
  const timeout = setTimeout(() => {
    expired = true
    engine.terminate()
  }, 180000)
  try {
    status('Chargement de l’outil local…')
    await engine.load({coreURL, wasmURL, classWorkerURL})
    signal.throwIfAborted()
    await engine.writeFile('source', new Uint8Array(await file.arrayBuffer()))
    const probe = async (path: string) => {
      const code = await engine.ffprobe([
        '-v',
        'error',
        '-show_format',
        '-show_streams',
        '-of',
        'json',
        path,
        '-o',
        `${path}.json`,
      ])
      // Core 0.12.10 can leave its exit status at -1 after successful ffprobe output.
      if (code > 0) throw new Error(`Impossible d’analyser ce fichier vidéo. ${logs.join(' ')}`)
      const data = await engine.readFile(`${path}.json`, 'utf8')
      if (typeof data !== 'string') throw new Error('Métadonnées illisibles.')
      return parseVideoInfo(data)
    }
    status('Analyse de la vidéo…')
    const source = await probe('source')
    assertSource(source, file.size)
    engine.on('progress', ({progress}) =>
      status(`Optimisation locale : ${Math.min(99, Math.max(0, Math.round(progress * 100)))} %`),
    )
    status('Optimisation locale…')
    if ((await engine.exec(encodingArgs(source, 'source', 'optimized.mp4', preset))) !== 0)
      throw new Error('La conversion de cette vidéo a échoué.')
    status('Vérification du résultat…')
    const info = await probe('optimized.mp4')
    const bytes = await engine.readFile('optimized.mp4')
    if (typeof bytes === 'string') throw new Error('Fichier optimisé invalide.')
    assertOptimized(info, bytes.byteLength, preset)
    signal.throwIfAborted()
    return {
      blob: new Blob([new Uint8Array(bytes)], {type: 'video/mp4'}),
      info,
      sourceSize: file.size,
      sourceWidth: source.width,
      sourceHeight: source.height,
      capturedAt: source.capturedAt,
      preset,
    }
  } catch (cause) {
    if (expired)
      throw new Error('La conversion a dépassé trois minutes. Essaie une vidéo plus légère.')
    throw cause
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', abort)
    engine.terminate()
  }
}
