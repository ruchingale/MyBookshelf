import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

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

const SPINE_COLORS = [
  ['#ff9ec4', '#ff6ea0'],
  ['#b8a8f8', '#9b87f5'],
  ['#88ddb0', '#5cc48a'],
  ['#85c4f8', '#52a8f5'],
  ['#ffc585', '#ff9f45'],
]

const STATUS_COLORS = {
  read: { bg: '#bbf7d0', text: '#166534', label: 'Read' },
  reading: { bg: '#fef9c3', text: '#854d0e', label: 'Reading' },
  want_to_read: { bg: '#ede9fe', text: '#5b21b6', label: 'Want to Read' },
}

function hashTitle(title) {
  let h = 0
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export default function BookSpine({ book, onClick, inBasket = false }) {
  const [hovered, setHovered] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: book.id,
    data: { book, sourceType: inBasket ? 'basket' : 'shelf' },
  })

  const colorIdx = hashTitle(book.title || '') % SPINE_COLORS.length
  const [c1, c2] = SPINE_COLORS[colorIdx]
  const icon = GENRE_ICONS[book.genre] || '🌸'
  const hasCover = !!book.cover_url
  const statusInfo = STATUS_COLORS[book.status] || STATUS_COLORS.want_to_read

  const spineStyle = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    background: hasCover && !inBasket
      ? 'transparent'
      : `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`,
    width: inBasket ? '28px' : '60px',
    height: inBasket ? '44px' : '100px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: hasCover && !inBasket ? 'flex-end' : 'space-between',
    padding: inBasket ? '3px 2px' : '0',
    boxShadow: isDragging
      ? '0 16px 32px rgba(0,0,0,0.3)'
      : hovered && !inBasket
      ? '4px 16px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)'
      : '2px 4px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)',
    border: '1px solid rgba(255,255,255,0.4)',
    position: 'relative',
    flexShrink: 0,
    transition: isDragging ? 'none' : 'transform 0.18s ease, box-shadow 0.18s ease',
    userSelect: 'none',
    zIndex: isDragging ? 9999 : hovered ? 50 : 1,
    overflow: 'visible',
  }

  const coverImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
  }

  const titleOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
    borderRadius: '0 0 8px 8px',
    padding: '18px 4px 5px',
    fontSize: '8px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 1.2,
    fontFamily: "'Nunito', sans-serif",
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    wordBreak: 'break-word',
    overflow: 'hidden',
    maxHeight: '48px',
  }

  const noImageTitleStyle = {
    fontSize: inBasket ? '5px' : '9px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 1.1,
    wordBreak: 'break-word',
    overflow: 'hidden',
    maxHeight: inBasket ? '22px' : '68px',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    fontFamily: "'Nunito', sans-serif",
    letterSpacing: '0.02em',
    padding: '0 4px',
  }

  const iconStyle = {
    fontSize: inBasket ? '8px' : '16px',
    lineHeight: 1,
    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
    padding: inBasket ? '0' : '8px 0 0',
    zIndex: 2,
    position: 'relative',
  }

  // Hover preview popup (only on shelf, not in basket, not dragging)
  const showPreview = hovered && !inBasket && !isDragging

  return (
    <div
      ref={setNodeRef}
      style={spineStyle}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation()
          onClick && onClick(book)
        }
      }}
      className="book-spine-hover"
    >
      {/* Cover image or plain spine */}
      {hasCover && !inBasket ? (
        <>
          <img src={book.cover_url} alt={book.title} style={coverImgStyle} draggable={false} />
          {/* Title overlay at bottom */}
          <div style={titleOverlayStyle}>
            {book.title.length > 22 ? book.title.slice(0, 22) + '…' : book.title}
          </div>
        </>
      ) : (
        <>
          <span style={iconStyle}>{icon}</span>
          <span style={noImageTitleStyle}>
            {inBasket
              ? book.title.slice(0, 6)
              : book.title.length > 28
              ? book.title.slice(0, 28) + '…'
              : book.title}
          </span>
          {!inBasket && <div style={{ height: '8px' }} />}
        </>
      )}

      {/* Hover cover preview popup */}
      {showPreview && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            background: 'linear-gradient(145deg, #fff8ff 0%, #fdf0ff 100%)',
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(200,160,255,0.35)',
            overflow: 'hidden',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'popupFadeIn 0.15s ease',
          }}
        >
          {/* Cover image in popup */}
          {hasCover ? (
            <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
              <img
                src={book.cover_url}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: '120px',
              background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}>
              {icon}
            </div>
          )}

          {/* Info below image */}
          <div style={{ padding: '10px 10px 8px' }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: '12px',
              color: '#4a2070',
              margin: '0 0 3px',
              lineHeight: 1.3,
            }}>
              {book.title}
            </p>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '10px',
              color: '#9b6fc0',
              margin: '0 0 6px',
            }}>
              {book.author}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {book.rating > 0 && (
                <span style={{ fontSize: '10px', color: '#f59e0b' }}>
                  {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                </span>
              )}
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
                background: statusInfo.bg,
                color: statusInfo.text,
                borderRadius: '6px',
                padding: '2px 6px',
                marginLeft: 'auto',
              }}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Hint */}
          <div style={{
            background: 'rgba(199,125,255,0.08)',
            padding: '5px 10px',
            borderTop: '1px solid rgba(200,160,255,0.2)',
          }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '9px',
              color: '#b89cd8',
              margin: 0,
              textAlign: 'center',
            }}>
              click to open · drag to basket
            </p>
          </div>

          {/* Little arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-7px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '7px solid #fdf0ff',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))',
          }} />
        </div>
      )}
    </div>
  )
}
