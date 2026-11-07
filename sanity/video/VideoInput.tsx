import { useEffect, useRef, useState } from 'react'
import { set, useClient, type FileInputProps } from 'sanity'
import type { OptimizedVideo } from '../sanity.types'
import type { OptimizedResult } from './optimizeVideo'
import {
  VIDEO_PROFILE,
  VIDEO_PRESETS,
  DEFAULT_VIDEO_PRESET,
  isVideoPreset,
  type VideoPresetId,
} from './videoProfile'

const megabytes = (size: number) => `${(size / 1024 / 1024).toFixed(2)} Mo`
const tableCellStyle = {border: '1px solid currentColor', padding: '0.5rem'}

export function VideoInput({value: rawValue, onChange, readOnly}: FileInputProps) {
  const value = rawValue as OptimizedVideo | undefined
  const client = useClient({apiVersion: '2025-01-01'})
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [candidate, setCandidate] = useState<OptimizedResult | null>(null)
  const [preview, setPreview] = useState<string>()
  const [currentUrl, setCurrentUrl] = useState<string>()
  const [preset, setPreset] = useState<VideoPresetId>(
    isVideoPreset(value?.preset) ? value.preset : DEFAULT_VIDEO_PRESET,
  )
  const controller = useRef<AbortController | null>(null)
  const sourceRef = useRef<Blob | string | null>(null)

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    let active = true
    setCurrentUrl(undefined)
    if (value?.asset?._ref)
      client
        .fetch<string | null>('*[_id == $id][0].url', {id: value.asset._ref})
        .then((url) => {
          if (active) setCurrentUrl(url ?? undefined)
        })
        .catch(() => {
          if (active) setError('Impossible de charger l’aperçu actuel.')
        })
    return () => {
      active = false
    }
  }, [client, value?.asset?._ref])
  useEffect(() => {
    if (!candidate) {
      setPreview(undefined)
      return
    }
    const url = URL.createObjectURL(candidate.blob)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [candidate])

  const cancel = () => {
    controller.current?.abort()
    controller.current = null
    sourceRef.current = null
    setCandidate(null)
    setBusy(false)
    setStatus('Annulé. La vidéo enregistrée est conservée.')
  }
  const prepare = async (source: Blob | string, selectedPreset: VideoPresetId = preset) => {
    if (readOnly || busy) return
    sourceRef.current = source
    const task = new AbortController()
    controller.current = task
    setBusy(true)
    setError('')
    setCandidate(null)
    try {
      setStatus('Préparation locale…')
      const file =
        typeof source === 'string'
          ? await (async () => {
              const response = await fetch(source, {signal: task.signal})
              if (!response.ok) throw new Error('Impossible de récupérer cette vidéo.')
              return response.blob()
            })()
          : source
      const {optimizeVideo} = await import('./optimizeVideo')
      task.signal.throwIfAborted()
      const result = await optimizeVideo(
        file,
        task.signal,
        (message) => {
          if (!task.signal.aborted) setStatus(message)
        },
        selectedPreset,
      )
      if (!task.signal.aborted) {
        setCandidate(result)
        setStatus('Prête. Vérifie l’aperçu avant l’envoi.')
      }
    } catch (cause) {
      if (!task.signal.aborted) {
        setStatus('')
        setError(cause instanceof Error ? cause.message : 'Impossible d’optimiser cette vidéo.')
      }
    } finally {
      if (controller.current === task && !task.signal.aborted) {
        controller.current = null
        setBusy(false)
      }
    }
  }
  const upload = async () => {
    if (!candidate || busy || readOnly) return
    const task = new AbortController()
    controller.current = task
    setBusy(true)
    setError('')
    try {
      const asset = await new Promise<{_id: string}>((resolve, reject) => {
        const subscription = client.observable.assets
          .upload('file', candidate.blob, {
            filename: 'video-optimized.mp4',
            contentType: 'video/mp4',
          })
          .subscribe({
            next: (event) => {
              if (event.type === 'progress') setStatus(`Envoi : ${Math.round(event.percent)} %`)
              if (event.type === 'response') resolve(event.body.document)
            },
            error: reject,
          })
        task.signal.addEventListener(
          'abort',
          () => {
            subscription.unsubscribe()
            reject(new DOMException('Annulé', 'AbortError'))
          },
          {once: true},
        )
      })
      if (task.signal.aborted) return
      const original = typeof sourceRef.current === 'string' ? value : candidate
      onChange(
        set({
          _type: 'optimizedVideo',
          asset: {_type: 'reference', _ref: asset._id},
          duration: candidate.info.duration,
          width: candidate.info.width,
          height: candidate.info.height,
          size: candidate.blob.size,
          sourceSize: original?.sourceSize,
          sourceWidth: original?.sourceWidth,
          sourceHeight: original?.sourceHeight,
          profile: VIDEO_PROFILE,
          preset: candidate.preset,
          ...(original?.capturedAt ? {capturedAt: original.capturedAt} : {}),
          uploadedAt: new Date().toISOString(),
        }),
      )
      setCandidate(null)
      sourceRef.current = null
      setStatus('Vidéo envoyée. Publie la fiche pour la rendre sélectionnable sur le site.')
    } catch (cause) {
      if (!task.signal.aborted)
        setError(cause instanceof Error ? cause.message : 'L’envoi a échoué.')
    } finally {
      if (controller.current === task && !task.signal.aborted) {
        controller.current = null
        setBusy(false)
      }
    }
  }

  return (
    <div
      style={{display: 'grid', gap: '0.75rem'}}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) void prepare(file)
      }}
    >
      <p>
        Entrée: vidéo durée: 30 secondes MAX.<br />
        Format de sortie: MP4, SANS AUDIO. Aucun fichier source n’est envoyé.
        <pre />
        Optimisation :
        <ul>
          <li>Mini 250x250</li>
          <li>Réduite 400x400: optimisé pour page /rejoindre</li>
          <li>Max 800x800: à utiliser avec parcimonie</li>
        </ul>
      </p>

      <label>
        Choisir ou déposer une vidéo
      </label>
        <input
          type="file"
          accept="video/*,.mov,.m4v"
          disabled={readOnly || busy}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) void prepare(file)
          }}
        />

      {(preview || currentUrl) && (
        <video
          src={preview ?? currentUrl}
          controls
          muted
          playsInline
          preload="metadata"
          style={{width: '100%', maxHeight: 280}}
        />
      )}

      {candidate && (
        <p>
          {VIDEO_PRESETS[candidate.preset].label} · Avant : {megabytes(candidate.sourceSize)} →
          après : {megabytes(candidate.blob.size)} · {candidate.info.duration.toFixed(1)} s ·{' '}
          {candidate.info.width} × {candidate.info.height} px
        </p>
      )}

      {!candidate && value?.asset && (
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid currentColor'}}>
            <caption>
              Vidéo enregistrée
              {value.duration !== undefined && ` — ${value.duration.toFixed(1)} s`}
            </caption>
            <thead>
              <tr>
                <th scope="col" style={tableCellStyle}>Information</th>
                <th scope="col" style={tableCellStyle}>Originale (métadonnées)</th>
                <th scope="col" style={tableCellStyle}>Upload</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={tableCellStyle}>Date</th>
                <td style={tableCellStyle}>{value.capturedAt?.slice(0, 10) ?? '--'}</td>
                <td style={tableCellStyle}>Uploadée le : {value.uploadedAt?.slice(0, 10) ?? '--'}</td>
              </tr>
              <tr>
                <th scope="row" style={tableCellStyle}>Résolution</th>
                <td style={tableCellStyle}>
                  {value.sourceWidth && value.sourceHeight
                    ? `${value.sourceWidth} × ${value.sourceHeight} px`
                    : '--'}
                </td>
                <td style={tableCellStyle}>
                  Optimisée : {VIDEO_PRESETS[isVideoPreset(value.preset) ? value.preset : 'max'].label}
                  <br />
                  {value.width && value.height ? `${value.width} × ${value.height} px` : '--'}
                </td>
              </tr>
              <tr>
                <th scope="row" style={tableCellStyle}>Poids</th>
                <td style={tableCellStyle}>{value.sourceSize !== undefined ? megabytes(value.sourceSize) : '--'}</td>
                <td style={tableCellStyle}>{value.size !== undefined ? megabytes(value.size) : '--'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}


        <div style={{display: 'flex', flexDirection:'column', gap: '0.75rem', flexWrap: 'wrap', maxWidth:'250px'}}>
                  <label>
        Optimiser la résolution
        <select
          value={preset}
          disabled={readOnly || busy}
          onChange={(event) => {
            if (!isVideoPreset(event.target.value)) return
            setPreset(event.target.value)
            if (sourceRef.current) void prepare(sourceRef.current, event.target.value)
            else {
              setCandidate(null)
              setStatus('Profil modifié. Choisis un fichier ou optimise la vidéo actuelle.')
            }
          }}
        >
          {Object.entries(VIDEO_PRESETS).map(([id, settings]) => (
            <option key={id} value={id}>
              {settings.label}
            </option>
          ))}
        </select>
      </label>

          {currentUrl && !candidate && (
            <button
              type="button"
              disabled={busy || readOnly}
              onClick={() => void prepare(currentUrl)}
            >
              Optimiser la vidéo actuelle
            </button>
          )}
          {(busy || candidate) && (
            <button type="button" disabled={readOnly} onClick={cancel}>
              Annuler
            </button>
          )}

          {candidate && (
            <button type="button" disabled={busy || readOnly} onClick={() => void upload()}>
              Envoyer la vidéo optimisée
            </button>
          )}
      </div>
      <p role="status" aria-live="polite">
        {status}
      </p>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
