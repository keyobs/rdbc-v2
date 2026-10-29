import {createImageUrlBuilder} from '@sanity/image-url'
import {useClient, type ImageValue, type ObjectInputProps} from 'sanity'

// Same box as .results-row__poster in src/features/home/results/lastResults.css
const DISPLAY_WIDTH = 120
const DISPLAY_HEIGHT = 76

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.75rem',
  padding: '0.75rem',
  background: 'rgb(8, 20, 75)',
  color: 'rgb(184, 228, 180)',
  fontSize: '0.8125rem',
} as const

// Default image input, plus a preview of the poster as cropped on the home "last results" rows
export function PosterInput(props: ObjectInputProps<ImageValue>) {
  const client = useClient({apiVersion: '2025-01-01'})
  const {value} = props

  const src = value?.asset
    ? createImageUrlBuilder(client)
        .image(value)
        .width(DISPLAY_WIDTH * 2)
        .height(DISPLAY_HEIGHT * 2)
        .fit('crop')
        .auto('format')
        .url()
    : undefined

  return (
    <div>
      {props.renderDefault(props)}
      {src && (
        <div style={ROW_STYLE}>
          <img
            src={src}
            alt="Aperçu de l’affiche sur le site"
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            style={{display: 'block', objectFit: 'cover', border: '2px solid rgb(0, 255, 150)'}}
          />
          <span>Aperçu sur l’accueil (taille réelle sur desktop)</span>
        </div>
      )}
    </div>
  )
}
