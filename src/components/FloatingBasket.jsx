import { useDroppable } from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'
import BookSpine from './BookSpine'

export default function FloatingBasket({ books, onReturnBook, onBookClick }) {
  const [pos, setPos] = useState({ x: null, y: null })
  const [dragging, setDragging] = useState(false)
  const [open, setOpen] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const basketRef = useRef(null)

  const { setNodeRef, isOver } = useDroppable({
    id: 'basket',
    data: { type: 'basket' },
  })

  // Set initial position to bottom-right after mount
  useEffect(() => {
    setPos({
      x: window.innerWidth - 140,
      y: window.innerHeight - 180,
    })
  }, [])

  useEffect(() => {
    function onMove(e) {
      if (!dragging) return
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }
    function onUp() {
      setDragging(false)
    }
    if (dragging) {
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  function handleMouseDown(e) {
    // Only start basket-drag on the handle/body — not on inner buttons
    if (e.target.closest('.basket-no-drag')) return
    e.preventDefault()
    const rect = basketRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setDragging(true)
    setOpen(false)
  }

  if (pos.x === null) return null

  const basketStyle = {
    position: 'fixed',
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    zIndex: 1000,
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    filter: isOver ? 'drop-shadow(0 0 12px rgba(200,149,108,0.8))' : 'none',
    transition: isOver ? 'filter 0.15s ease' : 'none',
  }

  const peek = books.slice(-5).reverse()

  return (
    <div ref={(el) => { basketRef.current = el; setNodeRef(el) }} style={basketStyle} onMouseDown={handleMouseDown}>
      {/* Peeking books above basket */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '-6px', paddingLeft: '12px', paddingRight: '12px', position: 'relative', zIndex: 2 }}>
        {peek.map((book, i) => (
          <BookSpine key={book.id} book={book} inBasket onClick={onBookClick} />
        ))}
      </div>

      {/* Basket SVG + body */}
      <div style={{ position: 'relative', width: '88px' }} onClick={() => setOpen(o => !o)}>
        {/* Count badge */}
        {books.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ff6b9d',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(255,107,157,0.5)',
              fontFamily: "'Nunito', sans-serif",
              zIndex: 3,
            }}
          >
            {books.length}
          </div>
        )}

        {/* Wicker basket SVG */}
        <svg width="88" height="74" viewBox="0 0 88 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Handle */}
          <path d="M26 20 Q44 2 62 20" stroke="#a0714f" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* Basket body */}
          <rect x="8" y="22" width="72" height="42" rx="14" fill="#e8b890"/>
          {/* Weave pattern lines horizontal */}
          <line x1="8" y1="32" x2="80" y2="32" stroke="#c8956c" strokeWidth="1.5" opacity="0.5"/>
          <line x1="8" y1="42" x2="80" y2="42" stroke="#c8956c" strokeWidth="1.5" opacity="0.5"/>
          <line x1="8" y1="52" x2="80" y2="52" stroke="#c8956c" strokeWidth="1.5" opacity="0.5"/>
          {/* Weave pattern lines vertical */}
          <line x1="22" y1="22" x2="18" y2="64" stroke="#c8956c" strokeWidth="1.5" opacity="0.4"/>
          <line x1="34" y1="22" x2="32" y2="64" stroke="#c8956c" strokeWidth="1.5" opacity="0.4"/>
          <line x1="44" y1="22" x2="44" y2="64" stroke="#c8956c" strokeWidth="1.5" opacity="0.4"/>
          <line x1="54" y1="22" x2="56" y2="64" stroke="#c8956c" strokeWidth="1.5" opacity="0.4"/>
          <line x1="66" y1="22" x2="70" y2="64" stroke="#c8956c" strokeWidth="1.5" opacity="0.4"/>
          {/* Rim */}
          <rect x="6" y="20" width="76" height="10" rx="5" fill="#c8956c"/>
          {/* Base shadow */}
          <ellipse cx="44" cy="65" rx="32" ry="4" fill="rgba(160,113,79,0.3)"/>
          {/* Highlight */}
          <ellipse cx="32" cy="30" rx="8" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-10 32 30)"/>
        </svg>

        {/* Hover/over label */}
        {isOver && (
          <div style={{
            position: 'absolute',
            top: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff6b9d',
            color: 'white',
            borderRadius: '8px',
            padding: '3px 10px',
            fontSize: '11px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(255,107,157,0.4)',
          }}>
            Drop here! 🧺
          </div>
        )}
      </div>

      {/* Popover panel */}
      {open && books.length > 0 && (
        <div
          className="basket-no-drag"
          style={{
            position: 'absolute',
            bottom: '90px',
            right: '0',
            background: 'linear-gradient(145deg, #fff9f0 0%, #fff0e8 100%)',
            border: '2px solid #e8b890',
            borderRadius: '14px',
            padding: '12px',
            width: '220px',
            boxShadow: '0 8px 32px rgba(200,149,108,0.3)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 1001,
            cursor: 'default',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: '13px',
            color: '#8B6914',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            🧺 Your Basket
          </p>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '8px',
                marginBottom: '4px',
                background: 'rgba(232,184,144,0.2)',
                border: '1px solid rgba(200,149,108,0.2)',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  color: '#7a5230',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {book.title}
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#a07850',
                  margin: 0,
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  {book.author}
                </p>
              </div>
              <button
                onClick={() => onReturnBook(book)}
                style={{
                  background: 'linear-gradient(135deg, #ffb3c6 0%, #ff6ea0 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 7px',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  flexShrink: 0,
                }}
              >
                Return
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty basket label */}
      {open && books.length === 0 && (
        <div
          className="basket-no-drag"
          style={{
            position: 'absolute',
            bottom: '90px',
            right: '0',
            background: '#fff9f0',
            border: '2px solid #e8b890',
            borderRadius: '14px',
            padding: '14px 18px',
            width: '180px',
            boxShadow: '0 8px 24px rgba(200,149,108,0.25)',
            textAlign: 'center',
            cursor: 'default',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '12px', color: '#c8956c', margin: 0 }}>
            Drag books here to set them aside 🌸
          </p>
        </div>
      )}
    </div>
  )
}
