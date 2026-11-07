import {defineField, defineType} from 'sanity'
import {VideoInput} from '../video/VideoInput'
import {VIDEO_PROFILE, VIDEO_PRESETS, isVideoPreset, videoDate} from '../video/videoProfile'

export const optimizedVideo = defineType({
  name: 'optimizedVideo',
  title: 'Vidéo optimisée',
  type: 'file',
  components: {input: VideoInput},
  fields: [
    ...['duration', 'width', 'height', 'size', 'sourceSize', 'sourceWidth', 'sourceHeight'].map((name) =>
      defineField({name, title: name, type: 'number', readOnly: true}),
    ),
    defineField({name: 'profile', title: 'Profil d’optimisation', type: 'string', readOnly: true}),
    defineField({
      name: 'preset',
      title: 'Résolution',
      type: 'string',
      readOnly: true,
      options: {
        list: Object.entries(VIDEO_PRESETS).map(([value, settings]) => ({
          value,
          title: settings.label,
        })),
      },
    }),
    defineField({
      name: 'capturedAt',
      title: 'Date issue des métadonnées',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({name: 'uploadedAt', title: 'Date d’upload', type: 'datetime', readOnly: true}),
  ],
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      if (!value) return true
      const asset = value.asset as {_ref?: string} | undefined
      // Existing files without a preset were encoded with the original 800px profile.
      const preset =
        value.preset === undefined
          ? VIDEO_PRESETS.max
          : isVideoPreset(value.preset)
            ? VIDEO_PRESETS[value.preset]
            : null
      if (
        !asset?._ref ||
        !preset ||
        value.profile !== VIDEO_PROFILE ||
        typeof value.duration !== 'number' ||
        value.duration <= 0 ||
        value.duration > 30 ||
        typeof value.width !== 'number' ||
        typeof value.height !== 'number' ||
        value.width > preset.dimension ||
        value.height > preset.dimension ||
        value.width <= 0 ||
        value.height <= 0
      )
        return 'Importer et optimiser une vidéo de 30 secondes maximum.'
      const stored = await context.getClient({apiVersion: '2025-01-01'}).fetch<{
        size: number
        mimeType: string
      } | null>('*[_id == $id][0]{size, mimeType}', {id: asset._ref})
      return stored &&
        stored.mimeType === 'video/mp4' &&
        stored.size === value.size &&
        stored.size <= preset.maxBytes
        ? true
        : `Le fichier doit être un MP4 optimisé respectant le profil ${preset.label}.`
    }),
})

export const video = defineType({
  name: 'libraryVideo',
  title: 'Vidéo',
  type: 'document',
  initialValue: {title: 'Nouvelle vidéo'},
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la vidéo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recordedAt',
      title: 'Date de la vidéo (facultative)',
      type: 'date',
      description:
        'Priorité à cette date, puis à la date des métadonnées, sinon à la date d’upload.',
    }),
    defineField({
      name: 'file',
      title: 'Fichier vidéo',
      type: 'optimizedVideo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Photo miniature (facultative)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Affichée avant et après la lecture sur Rejoindre. Une couverture renseignée sur le profil reste prioritaire.',
    }),
    defineField({
      name: 'thumbnailRef',
      title: 'Miniature — choisir dans Photos',
      type: 'reference',
      to: [{type: 'libraryPhoto'}],
      options: {disableNew: true, filter: 'defined(image.asset)'},
      description:
        'Facultatif. Cette photo est prioritaire sur l’upload direct ci-dessus. Retirer ce choix pour utiliser l’upload direct.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'recordedAt',
      captured: 'file.capturedAt',
      uploaded: 'file.uploadedAt',
      duration: 'file.duration',
      media: 'thumbnail',
      libraryMedia: 'thumbnailRef.image',
    },
    prepare: ({title, date, captured, uploaded, duration, media, libraryMedia}) => {
      const resolved = videoDate(date, captured, uploaded)
      return {
        title,
        media: libraryMedia ?? media,
        subtitle: [
          resolved && `${resolved.date} · ${resolved.origin}`,
          duration && `${duration.toFixed(1)} s`,
        ]
          .filter(Boolean)
          .join(' — '),
      }
    },
  },
})
