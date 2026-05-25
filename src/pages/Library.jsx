import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import AddBookModal from '../components/AddBookModal'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import FilterBar from '../components/FilterBar'
import FloatingBasket from '../components/FloatingBasket'
import IllustratedShelf from '../components/IllustratedShelf'
import { supabase } from '../lib/supabase'

const GENRES = ['Fiction','Non-Fiction','Sci-Fi','Fantasy','Mystery','Biography','History','Self-Help','Other']
const BOOKS_PER_UNIT = 16

const normalizeGenre = (value) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')

const normalizeStatus = (value) => {
  const status = String(value || '').trim().toLowerCase().replace(/_/g, ' ')
  if (status === 'want to read' || status === 'to be read') return 'want_to_read'
  if (status === 'reading') return 'reading'
  if (status === 'read') return 'read'
  return status
}

// Overlay card shown following the cursor while dragging
function DragOverlayCard({ book }) {
  const GENRE_ICONS = {
    'Fiction': '📖', 'Non-Fiction': '🔬', 'Sci-Fi': '🚀', 'Fantasy': '✨',
    'Mystery': '🔍', 'Biography': '👤', 'History': '🏛️', 'Self-Help': '💪', 'Other': '🌸',
  }
  const SPINE_COLORS = [
    ['#ff9ec4', '#ff6ea0'], ['#b8a8f8', '#9b87f5'], ['#88ddb0', '#5cc48a'],
    ['#85c4f8', '#52a8f5'], ['#ffc585', '#ff9f45'],
  ]
  function hashTitle(t) {
    let h = 0
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0
    return Math.abs(h)
  }
  const colorIdx = hashTitle(book.title || '') % SPINE_COLORS.length
  const [c1, c2] = SPINE_COLORS[colorIdx]
  const icon = GENRE_ICONS[book.genre] || '🌸'
  const hasCover = !!book.cover_url

  return (
    <div style={{
      width: '90px',
      height: '130px',
      borderRadius: '10px',
      background: hasCover ? 'transparent' : `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.35), 0 8px 20px rgba(199,125,255,0.3)',
      transform: 'scale(1.05)',
      cursor: 'grabbing',
      border: '2px solid rgba(255,255,255,0.6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: hasCover ? 'flex-end' : 'space-between',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {hasCover ? (
        <>
          <img
            src={book.cover_url}
            alt={book.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            draggable={false}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
            borderRadius: '0 0 8px 8px',
            padding: '18px 4px 5px',
            fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.95)',
            textAlign: 'center', fontFamily: "'Nunito', sans-serif",
          }}>
            {book.title.length > 22 ? book.title.slice(0, 22) + '…' : book.title}
          </div>
        </>
      ) : (
        <>
          <span style={{ fontSize: '16px', padding: '8px 0 0', zIndex: 2 }}>{icon}</span>
          <span style={{
            fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.95)',
            textAlign: 'center', lineHeight: 1.1, wordBreak: 'break-word',
            overflow: 'hidden', maxHeight: '68px',
            fontFamily: "'Nunito', sans-serif", padding: '0 4px',
          }}>
            {book.title.length > 28 ? book.title.slice(0, 28) + '…' : book.title}
          </span>
          <div style={{ height: '8px' }} />
        </>
      )}
    </div>
  )
}

export default function Library() {
  const [books, setBooks] = useState([])
  const [basketBooks, setBasketBooks] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)
  const [preSelectedGenre, setPreSelectedGenre] = useState('')
  const [viewMode, setViewMode] = useState('shelf')
  const [activeBook, setActiveBook] = useState(null) // book being dragged (for overlay)

  // Track pending Supabase syncs so rapid drags don't cause race conditions
  const syncTimeout = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  useEffect(() => { fetchBooks() }, [])

  async function fetchBooks() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAdded(book) {
    setBooks((s) => [book, ...s])
  }

  function handleUpdated(updatedBook) {
    setBooks((s) => s.map((b) => (b.id === updatedBook.id ? updatedBook : b)))
    setSelected(updatedBook)
  }

  function handleDeleted(bookId) {
    setBooks((s) => s.filter((b) => b.id !== bookId))
    setBasketBooks((s) => s.filter((b) => b.id !== bookId))
  }

  // ─── Derived state ──────────────────────────────────────────────────────────

  const basketIds = new Set(basketBooks.map((b) => b.id))

  const filtered = books.filter((b) => {
    if (basketIds.has(b.id)) return false
    const bookStatus = normalizeStatus(b.status)
    const bookGenre = normalizeGenre(b.genre)
    const activeFilter = normalizeStatus(filter)
    const selectedGenre = normalizeGenre(genre)
    if (filter !== 'all' && bookStatus !== activeFilter) return false
    if (genre && selectedGenre && bookGenre !== selectedGenre) return false
    return true
  })

  // Group by genre, maintain GENRES order
  const booksByGenre = {}
  for (const g of GENRES) booksByGenre[g] = []
  for (const book of filtered) {
    const g = book.genre || 'Other'
    if (!booksByGenre[g]) booksByGenre[g] = []
    booksByGenre[g].push(book)
  }

  // Sort each genre's books: sort_order ASC, then created_at ASC
  for (const g of Object.keys(booksByGenre)) {
    booksByGenre[g].sort((a, b) => {
      const soA = a.sort_order ?? Infinity
      const soB = b.sort_order ?? Infinity
      if (soA !== soB) return soA - soB
      return new Date(a.created_at) - new Date(b.created_at)
    })
  }

  // Build shelfUnits: sort genres by total book count desc, split into chunks of 16
  const genresSortedByCount = Object.entries(booksByGenre)
    .filter(([, bks]) => bks.length > 0)
    .sort(([, a], [, b]) => b.length - a.length)

  const shelfUnits = []
  for (const [genreName, genreBooks] of genresSortedByCount) {
    const totalChunks = Math.max(1, Math.ceil(genreBooks.length / BOOKS_PER_UNIT))
    for (let i = 0; i < totalChunks; i++) {
      shelfUnits.push({
        genre: genreName,
        books: genreBooks.slice(i * BOOKS_PER_UNIT, (i + 1) * BOOKS_PER_UNIT),
        allGenreBooks: genreBooks,  // full genre list for SortableContext
        unitIndex: i,
      })
    }
  }

  // ─── Drag handlers ───────────────────────────────────────────────────────────

  function handleDragStart(event) {
    const { active } = event
    const draggedBook = books.find((b) => b.id === active.id)
    setActiveBook(draggedBook || null)
    document.body.classList.add('dragging-active')
  }

  function handleDragCancel() {
    setActiveBook(null)
    document.body.classList.remove('dragging-active')
  }

  function handleDragEnd(event) {
    document.body.classList.remove('dragging-active')
    const { active, over } = event
    setActiveBook(null)

    if (!over) return // dropped outside — snap back (dnd-kit handles this)

    const draggedId = active.id
    const sourceType = active.data.current?.sourceType
    const overType = over.data.current?.type     // 'shelf' or 'basket' (droppable zones)
    const overSortable = over.data.current?.sortable // present when over a sortable item

    // ── Basket interactions (unchanged) ──────────────────────────────────────
    if (sourceType === 'shelf' && overType === 'basket') {
      const book = books.find((b) => b.id === draggedId)
      if (book && !basketIds.has(draggedId)) {
        setBasketBooks((prev) => [...prev, book])
      }
      return
    }
    if (sourceType === 'basket' && overType === 'shelf') {
      setBasketBooks((prev) => prev.filter((b) => b.id !== draggedId))
      return
    }
    if (sourceType === 'basket' && overType === 'basket') return

    // ── Shelf drag ────────────────────────────────────────────────────────────
    if (sourceType !== 'shelf') return

    const draggedBook = books.find((b) => b.id === draggedId)
    if (!draggedBook) return

    const draggedGenre = draggedBook.genre || 'Other'

    // Determine target genre:
    // • If dropped on a sortable book → use that book's genre
    // • If dropped on a droppable shelf zone → use that shelf's genre
    let targetGenre = null
    if (over.data.current?.book) {
      // Over a sortable book item
      targetGenre = over.data.current.book.genre || 'Other'
    } else if (overType === 'shelf') {
      // Over an empty shelf zone
      targetGenre = over.data.current.genre
    } else {
      // Fallback: same genre (reorder within)
      targetGenre = draggedGenre
    }

    if (!targetGenre) return

    const isCrossGenre = normalizeGenre(draggedGenre) !== normalizeGenre(targetGenre)

    setBooks((prevBooks) => {
      let updated = [...prevBooks]

      if (isCrossGenre) {
        // ── Cross-genre: change genre, append at end of target ──────────────
        // Find the end sort_order for target genre
        const targetBooks = updated.filter(
          (b) => normalizeGenre(b.genre || 'Other') === normalizeGenre(targetGenre) && !basketIds.has(b.id)
        )
        const maxOrder = targetBooks.length
        updated = updated.map((b) =>
          b.id === draggedId
            ? { ...b, genre: targetGenre, sort_order: maxOrder }
            : b
        )
        // Re-number target genre
        const reTargetBooks = updated
          .filter((b) => normalizeGenre(b.genre || 'Other') === normalizeGenre(targetGenre) && !basketIds.has(b.id))
          .sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity))
        reTargetBooks.forEach((b, i) => {
          const idx = updated.findIndex((u) => u.id === b.id)
          if (idx !== -1) updated[idx] = { ...updated[idx], sort_order: i }
        })
        // Re-number source genre
        const reSrcBooks = updated
          .filter((b) => normalizeGenre(b.genre || 'Other') === normalizeGenre(draggedGenre) && !basketIds.has(b.id))
          .sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity))
        reSrcBooks.forEach((b, i) => {
          const idx = updated.findIndex((u) => u.id === b.id)
          if (idx !== -1) updated[idx] = { ...updated[idx], sort_order: i }
        })
      } else {
        // ── Same genre: reorder ───────────────────────────────────────────────
        // Build sorted genre list
        const genreBooks = updated
          .filter((b) => normalizeGenre(b.genre || 'Other') === normalizeGenre(draggedGenre) && !basketIds.has(b.id))
          .sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity))

        const oldIndex = genreBooks.findIndex((b) => b.id === draggedId)
        const newIndex = genreBooks.findIndex((b) => b.id === over.id)

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prevBooks

        const reordered = arrayMove(genreBooks, oldIndex, newIndex)

        // Re-number and write back
        reordered.forEach((b, i) => {
          const idx = updated.findIndex((u) => u.id === b.id)
          if (idx !== -1) updated[idx] = { ...updated[idx], sort_order: i }
        })
      }

      // ── Background Supabase sync ─────────────────────────────────────────
      scheduleSyncBooks(updated, draggedId, draggedGenre, targetGenre, isCrossGenre)

      return updated
    })
  }

  function scheduleSyncBooks(updatedBooks, draggedId, srcGenre, targetGenre, isCrossGenre) {
    // Debounce: cancel pending sync, schedule a new one
    if (syncTimeout.current) clearTimeout(syncTimeout.current)
    syncTimeout.current = setTimeout(() => {
      syncBooksToSupabase(updatedBooks, draggedId, srcGenre, targetGenre, isCrossGenre)
    }, 300)
  }

  async function syncBooksToSupabase(updatedBooks, draggedId, srcGenre, targetGenre, isCrossGenre) {
    try {
      const genresToSync = isCrossGenre
        ? [normalizeGenre(srcGenre), normalizeGenre(targetGenre)]
        : [normalizeGenre(srcGenre)]

      // Collect affected books (those in the affected genres)
      const affectedBooks = updatedBooks.filter(
        (b) => genresToSync.includes(normalizeGenre(b.genre || 'Other')) && !basketIds.has(b.id)
      )

      // Batch update each affected book's sort_order (and genre if cross-genre)
      const updates = affectedBooks.map((b) => ({
        id: b.id,
        sort_order: b.sort_order ?? 0,
        genre: b.genre,
      }))

      // Supabase doesn't support true batch upsert with different values per row
      // in a single call without a stored procedure, so we fire concurrent updates
      await Promise.all(
        updates.map(({ id, sort_order, genre }) =>
          supabase
            .from('books')
            .update({ sort_order, genre })
            .eq('id', id)
        )
      )
    } catch (err) {
      console.error('Error syncing sort order to Supabase:', err)
    }
  }

  function handleReturnBook(book) {
    setBasketBooks((prev) => prev.filter((b) => b.id !== book.id))
  }

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f3e8ff 0%, #fce4ec 100%)',
    position: 'relative',
  }

  // Full-width sticky header — lives outside the content container
  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255,255,255,0.85)',
    boxShadow: '0 2px 16px rgba(199,125,255,0.10)',
  }

  const headerInnerStyle = {
    padding: '16px 32px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  }

  // Full-width scrollable content below sticky header
  const containerStyle = {
    width: '100%',
    padding: '0 32px 140px',
    position: 'relative',
    zIndex: 1,
    boxSizing: 'border-box',
  }

  const titleStyle = {
    fontFamily: "'Pacifico', cursive",
    fontSize: '36px',
    background: 'linear-gradient(135deg, #c77dff 0%, #e879a0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
  }

  const subtitleStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '13px',
    color: '#c084d0',
    margin: '3px 0 0',
    letterSpacing: '0.04em',
  }

  const btnPrimary = {
    padding: '9px 22px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #e879a0 0%, #c77dff 100%)',
    color: 'white',
    border: 'none',
    fontWeight: 800,
    fontSize: '14px',
    fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(199,125,255,0.35)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    letterSpacing: '0.02em',
  }

  const btnSecondary = {
    padding: '9px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.6)',
    color: '#9b59b6',
    border: '1.5px solid #d8b4f0',
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div style={pageStyle}>
        {/* ── Sticky frosted-glass header ── */}
        <header style={stickyHeaderStyle}>
          <div style={headerInnerStyle}>
            <div>
              <h1 style={titleStyle}>📚 MyShelf</h1>
              <p style={subtitleStyle}>✨ your cozy personal library ✨</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* View toggle */}
              <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #d8b4f0', background: 'rgba(255,255,255,0.5)' }}>
                <button
                  onClick={() => setViewMode('shelf')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: viewMode === 'shelf' ? 'linear-gradient(135deg, #c77dff 0%, #e879a0 100%)' : 'transparent',
                    color: viewMode === 'shelf' ? 'white' : '#9b59b6',
                    transition: 'all 0.2s ease',
                  }}
                >
                  📚 Shelf
                </button>
                <button
                  onClick={() => setViewMode('covers')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: viewMode === 'covers' ? 'linear-gradient(135deg, #c77dff 0%, #e879a0 100%)' : 'transparent',
                    color: viewMode === 'covers' ? 'white' : '#9b59b6',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🖼️ Covers
                </button>
              </div>
              <button
                style={btnPrimary}
                onClick={() => setIsAddOpen(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(199,125,255,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(199,125,255,0.35)'
                }}
              >
                + Add Book
              </button>
              <button
                style={btnSecondary}
                onClick={fetchBooks}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.85)'
                  e.currentTarget.style.borderColor = '#b89cd8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
                  e.currentTarget.style.borderColor = '#d8b4f0'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </header>

        {/* ── Scrollable content ── */}
        <div style={containerStyle}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <p style={{ fontFamily: "'Nunito', sans-serif", color: '#c084d0', fontSize: '16px', fontWeight: 600 }}>
                Loading your cozy library…
              </p>
            </div>
          ) : (
            <>
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                genres={GENRES}
                genre={genre}
                setGenre={setGenre}
                onReset={() => { setFilter('all'); setGenre('') }}
                onAddInGenre={(selectedGenre) => {
                  setPreSelectedGenre(selectedGenre)
                  setIsAddOpen(true)
                }}
              />

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌸</div>
                  <p style={{ fontFamily: "'Pacifico', cursive", fontSize: '20px', color: '#c77dff', marginBottom: '8px' }}>
                    No books here yet!
                  </p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b89cd8', fontSize: '14px' }}>
                    Add your first book to fill the shelves ✨
                  </p>
                </div>
              ) : viewMode === 'covers' ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '20px',
                  paddingBottom: '120px',
                }}>
                  {filtered.map((b) => (
                    <BookCard key={b.id} book={b} onClick={() => setSelected(b)} />
                  ))}
                </div>
              ) : (
                <div className="shelf-grid">
                  {shelfUnits.map(({ genre: genreName, books: unitBooks, allGenreBooks, unitIndex }) => (
                    <IllustratedShelf
                      key={`${genreName}-${unitIndex}`}
                      genre={genreName}
                      books={unitBooks}
                      allGenreBooks={allGenreBooks}
                      unitIndex={unitIndex}
                      onBookClick={(book) => setSelected(book)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>{/* end containerStyle */}

        <FloatingBasket
          books={basketBooks}
          onReturnBook={handleReturnBook}
          onBookClick={(book) => setSelected(book)}
        />

        <AddBookModal
          isOpen={isAddOpen}
          onClose={() => { setIsAddOpen(false); setPreSelectedGenre('') }}
          onAdded={handleAdded}
          preSelectedGenre={preSelectedGenre}
        />
        <BookDetailModal
          book={selected}
          onClose={() => setSelected(null)}
          onDeleted={handleDeleted}
          onUpdated={handleUpdated}
        />
      </div>

      {/* Drag overlay — full-opacity book spine following cursor */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeBook ? <DragOverlayCard book={activeBook} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
