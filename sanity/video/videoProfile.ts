export const VIDEO_PROFILE = 'rdbc-video-v1'
export const MAX_DURATION = 30
export const MAX_SOURCE_BYTES = 100 * 1024 * 1024
export const MAX_VIDEO_BYTES = 5 * 1024 * 1024
export const VIDEO_PRESETS = {
  mini: {
    label: 'Mini - 250 × 250',
    dimension: 250,
    crf: 30,
    maxrate: '180k',
    bufsize: '360k',
    fps: 24,
    maxBytes: 1024 * 1024,
  },
  reduce: {
    label: 'Réduite - 400 × 400',
    dimension: 400,
    crf: 28,
    maxrate: '400k',
    bufsize: '800k',
    fps: 24,
    maxBytes: 2 * 1024 * 1024,
  },
  max: {
    label: 'Max - 800 × 800',
    dimension: 800,
    crf: 26,
    maxrate: '1200k',
    bufsize: '2400k',
    fps: 30,
    maxBytes: MAX_VIDEO_BYTES,
  },
} as const
export type VideoPresetId = keyof typeof VIDEO_PRESETS
export const DEFAULT_VIDEO_PRESET: VideoPresetId = 'reduce'
export const isVideoPreset = (value: unknown): value is VideoPresetId =>
  typeof value === 'string' && Object.hasOwn(VIDEO_PRESETS, value)

export interface VideoInfo {
  duration: number
  width: number
  height: number
  hasAudio: boolean
  codec: string
  capturedAt?: string
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function parseVideoInfo(json: string): VideoInfo {
  const data: unknown = JSON.parse(json)
  if (!record(data) || !Array.isArray(data.streams)) throw new Error('Fichier vidéo illisible.')
  const streams = data.streams.filter(record)
  const video = streams.find((stream) => stream.codec_type === 'video')
  const format = record(data.format) ? data.format : {}
  if (!video) throw new Error('Ce fichier ne contient pas de vidéo.')
  const duration = Number(format.duration ?? video.duration)
  let width = Number(video.width)
  let height = Number(video.height)
  const sar =
    typeof video.sample_aspect_ratio === 'string'
      ? video.sample_aspect_ratio.split(':').map(Number)
      : [1, 1]
  if (sar[0] > 0 && sar[1] > 0) width *= sar[0] / sar[1]
  const sides = Array.isArray(video.side_data_list) ? video.side_data_list.filter(record) : []
  const tags = record(video.tags) ? video.tags : {}
  const rotation = Number(
    sides.find((side) => typeof side.rotation === 'number')?.rotation ?? tags.rotate ?? 0,
  )
  if (Math.abs(rotation) % 180 === 90) [width, height] = [height, width]
  if (![duration, width, height].every((value) => Number.isFinite(value) && value > 0))
    throw new Error('Durée ou dimensions de la vidéo inconnues.')
  const formatTags = record(format.tags) ? format.tags : {}
  const rawDate =
    formatTags.creation_time ??
    tags.creation_time ??
    formatTags['com.apple.quicktime.creationdate'] ??
    formatTags.date
  const time = typeof rawDate === 'string' ? Date.parse(rawDate) : NaN
  // Ignore missing, sentinel and implausibly future container dates.
  const capturedAt =
    Number.isFinite(time) && time > Date.UTC(1970, 0, 1) && time <= Date.now() + 86400000
      ? new Date(time).toISOString()
      : undefined
  return {
    duration,
    width: Math.round(width),
    height: Math.round(height),
    hasAudio: streams.some((stream) => stream.codec_type === 'audio'),
    codec: String(video.codec_name ?? ''),
    capturedAt,
  }
}

export function assertSource(info: VideoInfo, size: number): void {
  if (size > MAX_SOURCE_BYTES) throw new Error('Le fichier source dépasse 100 Mo.')
  if (info.duration > MAX_DURATION)
    throw new Error('La vidéo dépasse 30 secondes. Raccourcis-la avant de l’importer.')
}

export function encodingArgs(
  info: VideoInfo,
  input: string,
  output: string,
  preset: VideoPresetId = DEFAULT_VIDEO_PRESET,
): string[] {
  const settings = VIDEO_PRESETS[preset]
  const ratio = Math.min(1, settings.dimension / info.width, settings.dimension / info.height)
  const width = Math.max(2, Math.floor((info.width * ratio) / 2) * 2)
  const height = Math.max(2, Math.floor((info.height * ratio) / 2) * 2)
  return [
    '-i',
    input,
    '-map',
    '0:v:0',
    '-an',
    '-sn',
    '-dn',
    '-vf',
    `scale=${width}:${height},setsar=1`,
    '-c:v',
    'libx264',
    '-preset',
    'fast',
    '-crf',
    String(settings.crf),
    '-maxrate',
    settings.maxrate,
    '-bufsize',
    settings.bufsize,
    '-pix_fmt',
    'yuv420p',
    '-fpsmax',
    String(settings.fps),
    '-map_metadata',
    '-1',
    '-movflags',
    '+faststart',
    output,
  ]
}

export function assertOptimized(
  info: VideoInfo,
  size: number,
  preset: VideoPresetId = DEFAULT_VIDEO_PRESET,
): void {
  assertSource(info, size)
  const settings = VIDEO_PRESETS[preset]
  if (
    size > settings.maxBytes ||
    info.width > settings.dimension ||
    info.height > settings.dimension ||
    info.hasAudio ||
    info.codec !== 'h264'
  )
    throw new Error(
      `Le résultat ne respecte pas le profil ${settings.label} : MP4 H.264 sans audio, ${(settings.maxBytes / 1024 / 1024).toFixed(0)} Mo maximum.`,
    )
}

export function videoDate(
  recordedAt?: string,
  capturedAt?: string,
  uploadedAt?: string,
): {date: string; origin: string} | null {
  const date = recordedAt || capturedAt || uploadedAt
  return date
    ? {
        date: date.slice(0, 10),
        origin: recordedAt ? 'Date saisie' : capturedAt ? 'Métadonnées' : 'Date d’upload',
      }
    : null
}
