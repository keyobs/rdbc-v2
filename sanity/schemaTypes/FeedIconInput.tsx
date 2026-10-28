import {set, type StringInputProps} from 'sanity'
import {FEED_ICONS} from './feedIcons'

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(4rem, 1fr))',
  gap: '0.5rem',
} as const

// Icon picker shown as a grid: editors click the icon they want, no label to read
export function FeedIconInput({value, onChange, readOnly}: StringInputProps) {
  return (
    <div role="radiogroup" aria-label="Icône" style={GRID_STYLE}>
      {FEED_ICONS.map(({value: iconValue, title, Icon, glyph}) => {
        const isSelected = value === iconValue
        return (
          <button
            key={iconValue}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={title}
            title={title}
            disabled={readOnly}
            onClick={() => onChange(set(iconValue))}
            style={{
              display: 'grid',
              placeItems: 'center',
              height: '4rem',
              padding: 0,
              border: isSelected ? '3px solid #2276fc' : '1px solid rgb(128 128 128 / 40%)',
              borderRadius: 4,
              background: isSelected ? 'rgb(34 118 252 / 15%)' : 'transparent',
              color: 'inherit',
              fontSize: '1.75rem',
              cursor: readOnly ? 'default' : 'pointer',
            }}
          >
            {Icon ? <Icon weight="bold" aria-hidden="true" /> : <span style={{fontSize: '0.875rem'}}>{glyph}</span>}
          </button>
        )
      })}
    </div>
  )
}
