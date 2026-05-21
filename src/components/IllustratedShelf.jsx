import { useDroppable } from '@dnd-kit/core'
import BookSpine from './BookSpine'

const GENRE_ICONS = {
  'Fiction': '📖',
  'Non-Fiction': '🔬',
  'Sci-Fi': '🚀',
  'Fantasy': '✨',
  'Mystery': '🔍',
  'Biography': '👤',
  'History': '🏛️',
  'Self-Help': '💪',
  'Other': '🌸',
}

const DECORATIONS = ['✨', '💕', '🌸', '⭐', '🦋', '🌷']

function getDecoration(genre) {
  const idx = (genre.charCodeAt(0) + genre.length) % DECORATIONS.length
  return DECORATIONS[idx]
}

export default function IllustratedShelf({ genre, books, onBookClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `shelf-${genre}`,
    data: { type: 'shelf', genre },
  })

  const planks = Math.max(1, Math.ceil(books.length / 4))
  const icon = GENRE_ICONS[genre] || '🌸'
  const deco = getDecoration(genre)

  const shelfStyle = {
    background: 'linear-gradient(145deg, #fdf4ff 0%, #f8edff 100%)',
    border: '2px solid #c9b8f0',
    borderRadius: '16px',
    padding: '0 0 12px 0',
    boxShadow: isOver
      ? '0 8px 32px rgba(180,120,255,0.35), 0 0 0 3px #c9b8f0'
      : '0 4px 20px rgba(160,100,220,0.15), 0 2px 8px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s ease',
    position: 'relative',
    overflow: 'visible',
    minHeight: '180px',
  }

  const headerStyle = {
    background: 'linear-gradient(135deg, #d4b8f0 0%, #c9a8e8 100%)',
    borderRadius: '14px 14px 0 0',
    padding: '10px 16px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid #b89cd8',
  }

  const genreLabelStyle = {
    fontFamily: "'Pacifico', cursive",
    fontSize: '15px',
    color: '#8B6914',
    textShadow: '0 1px 2px rgba(139,105,20,0.2)',
    letterSpacing: '0.02em',
  }

  const plankStyle = {
    background:
      'repeating-linear-gradient(90deg, rgba(210,180,140,0.08) 0px, rgba(210,180,140,0.08) 2px, transparent 2px, transparent 20px), linear-gradient(180deg, #e8d5f5 0%, #dcc8f0 100%)',
    borderRadius: '4px',
    border: '1px solid rgba(180,140,230,0.4)',
    margin: '0 10px',
    padding: '10px 8px 8px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    minHeight: '120px',
    position: 'relative',
    overflow: 'visible',
    boxShadow: 'inset 0 -3px 0 rgba(160,120,210,0.25), 0 2px 4px rgba(0,0,0,0.06)',
    flexWrap: 'nowrap',
  }

  const plankLedgeStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(180deg, #c9b8f0 0%, #b8a0e0 100%)',
    borderRadius: '0 0 4px 4px',
  }

  const emptyPlankStyle = {
    ...plankStyle,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  }

  const emptyLabel = {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '11px',
    color: '#b09ad0',
    fontStyle: 'italic',
  }

  return (
    <div ref={setNodeRef} style={shelfStyle}>
      {/* Sparkle decoration top-right */}
      <span
        style={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          fontSize: '14px',
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {deco}
      </span>

      {/* Genre header */}
      <div style={headerStyle}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={genreLabelStyle}>{genre}</span>
      </div>

      {/* Shelf planks */}
      <div style={{ padding: '10px 0 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Array.from({ length: planks }).map((_, plankIdx) => {
          const plankBooks = books.slice(plankIdx * 4, plankIdx * 4 + 4)
          return (
            <div key={plankIdx} style={plankBooks.length === 0 ? emptyPlankStyle : plankStyle}>
              {plankBooks.length === 0 ? (
                <span style={emptyLabel}>empty shelf…</span>
              ) : (
                plankBooks.map((book) => (
                  <BookSpine key={book.id} book={book} onClick={onBookClick} />
                ))
              )}
              <div style={plankLedgeStyle} />
            </div>
          )
        })}

        {/* Show an extra drop plank when dragging over and all existing planks are full */}
        {isOver && books.length % 4 === 0 && (
          <div style={{ ...plankStyle, border: '2px dashed #b89cd8', opacity: 0.7 }}>
            <span style={emptyLabel}>drop here ✨</span>
            <div style={plankLedgeStyle} />
          </div>
        )}
      </div>
    </div>
  )
}
