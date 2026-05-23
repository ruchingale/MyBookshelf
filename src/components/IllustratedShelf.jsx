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

// Empty slot placeholder — faint dashed lavender rectangle, same size as a book spine
function EmptySlot() {
  return (
    <div
      style={{
        width: '60px',
        height: '100px',
        border: '2px dashed #d8b4fe',
        borderRadius: '8px',
        opacity: 0.3,
        flexShrink: 0,
      }}
    />
  )
}

const PLANKS_PER_UNIT = 4
const BOOKS_PER_PLANK = 4

export default function IllustratedShelf({ genre, books, unitIndex = 0, onBookClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `shelf-${genre}-${unitIndex}`,
    data: { type: 'shelf', genre },
  })

  const icon = GENRE_ICONS[genre] || '🌸'
  const deco = getDecoration(genre)

  const shelfStyle = {
    background: 'linear-gradient(145deg, #fdf4ff 0%, #f8edff 100%)',
    border: isOver ? '2px solid #a855f7' : '2px solid #c9b8f0',
    borderRadius: '16px',
    padding: '0 0 12px 0',
    boxShadow: isOver
      ? '0 8px 32px rgba(180,120,255,0.35), 0 0 0 3px #c9b8f0'
      : '0 4px 20px rgba(160,100,220,0.15), 0 2px 8px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    position: 'relative',
    overflow: 'visible',
    // Fixed height: header ~52px + (4 planks × ~138px each) + gaps + bottom padding
    // We let it be determined by the fixed 4-plank layout naturally
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
    height: '120px',
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

      {/* Genre header — always shows plain genre name, no unit numbering */}
      <div style={headerStyle}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={genreLabelStyle}>{genre}</span>
      </div>

      {/* Always exactly PLANKS_PER_UNIT planks, each with exactly BOOKS_PER_PLANK slots */}
      <div style={{ padding: '10px 0 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Array.from({ length: PLANKS_PER_UNIT }).map((_, plankIdx) => {
          const slotStart = plankIdx * BOOKS_PER_PLANK
          const plankBooks = books.slice(slotStart, slotStart + BOOKS_PER_PLANK)
          const emptySlots = BOOKS_PER_PLANK - plankBooks.length

          return (
            <div key={plankIdx} style={plankStyle}>
              {/* Filled book slots */}
              {plankBooks.map((book) => (
                <BookSpine key={book.id} book={book} onClick={onBookClick} />
              ))}
              {/* Empty placeholder slots to fill remainder of plank */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <EmptySlot key={`empty-${plankIdx}-${i}`} />
              ))}
              <div style={plankLedgeStyle} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
