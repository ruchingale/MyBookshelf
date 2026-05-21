import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import AddBookModal from '../components/AddBookModal'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import FilterBar from '../components/FilterBar'
import FloatingBasket from '../components/FloatingBasket'
import IllustratedShelf from '../components/IllustratedShelf'
import { supabase } from '../lib/supabase'

const GENRES = ['Fiction','Non-Fiction','Sci-Fi','Fantasy','Mystery','Biography','History','Self-Help','Other']

const normalizeGenre = (value) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')

const normalizeStatus = (value) => {
  const status = String(value || '').trim().toLowerCase().replace(/_/g, ' ')
  if (status === 'want to read' || status === 'to be read') return 'want_to_read'
  if (status === 'reading') return 'reading'
  if (status === 'read') return 'read'
  return status
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
  const [viewMode, setViewMode] = useState('shelf') // 'shelf' | 'covers'

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  useEffect(() => { fetchBooks() }, [])

  async function fetchBooks() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false })
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

  // Books currently in basket (by id set)
  const basketIds = new Set(basketBooks.map((b) => b.id))

  const filtered = books.filter((b) => {
    if (basketIds.has(b.id)) return false // hide basket books from shelves
    const bookStatus = normalizeStatus(b.status)
    const bookGenre = normalizeGenre(b.genre)
    const activeFilter = normalizeStatus(filter)
    const selectedGenre = normalizeGenre(genre)
    if (filter !== 'all' && bookStatus !== activeFilter) return false
    if (genre && selectedGenre && bookGenre !== selectedGenre) return false
    return true
  })

  // Group by genre — maintain GENRES order, append unknown genres at end
  const booksByGenre = {}
  for (const g of GENRES) booksByGenre[g] = []
  for (const book of filtered) {
    const g = book.genre || 'Other'
    if (!booksByGenre[g]) booksByGenre[g] = []
    booksByGenre[g].push(book)
  }
  // Only show genres that have books
  const activeGenres = Object.entries(booksByGenre).filter(([, bks]) => bks.length > 0)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const draggedId = active.id
    const sourceType = active.data.current?.sourceType
    const targetType = over.data.current?.type

    if (sourceType === 'shelf' && targetType === 'basket') {
      // Move book from shelf to basket
      const book = books.find((b) => b.id === draggedId)
      if (book && !basketIds.has(draggedId)) {
        setBasketBooks((prev) => [...prev, book])
      }
    } else if (sourceType === 'basket' && targetType === 'shelf') {
      // Return book from basket to shelf display
      setBasketBooks((prev) => prev.filter((b) => b.id !== draggedId))
    } else if (sourceType === 'basket' && targetType === 'basket') {
      // Dropped basket book on basket — do nothing
    }
  }

  function handleReturnBook(book) {
    setBasketBooks((prev) => prev.filter((b) => b.id !== book.id))
  }

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f3e8ff 0%, #fce4ec 100%)',
    position: 'relative',
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 140px',
    position: 'relative',
    zIndex: 1,
  }

  const headerStyle = {
    padding: '28px 0 20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  }

  const titleStyle = {
    fontFamily: "'Pacifico', cursive",
    fontSize: '38px',
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
    margin: '4px 0 0',
    letterSpacing: '0.04em',
  }

  const btnPrimary = {
    padding: '9px 20px',
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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={pageStyle}>
        <div style={containerStyle}>
          <header style={headerStyle}>
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
          </header>

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
                  {activeGenres.map(([genreName, genreBooks]) => (
                    <IllustratedShelf
                      key={genreName}
                      genre={genreName}
                      books={genreBooks}
                      onBookClick={(book) => setSelected(book)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

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
    </DndContext>
  )
}
