import { useEffect, useState } from 'react'
import AddBookModal from '../components/AddBookModal'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'
import BookShelf3D from '../components/BookShelf3D'
import FilterBar from '../components/FilterBar'
import { supabase } from '../lib/supabase'

const GENRES = ['Fiction','Non-Fiction','Sci-Fi','Fantasy','Mystery','Biography','History','Self-Help','Other']

export default function Library() {
  const [books, setBooks] = useState([])
  const [view3D, setView3D] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)
  const [preSelectedGenre, setPreSelectedGenre] = useState('')

  const normalizeGenre = (value) => {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
  }
  
  const normalizeStatus = (value) => {
    const status = String(value || '').trim().toLowerCase().replace(/_/g, ' ')
    if (status === 'want to read' || status === 'to be read') return 'want_to_read'
    if (status === 'reading') return 'reading'
    if (status === 'read') return 'read'
    return status
  }

  useEffect(() => { fetchBooks() }, [])

  async function fetchBooks(){
    setLoading(true)
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', {ascending:false})
      if (error) throw error
      console.log('Fetched books:', data)
      setBooks(data || [])
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAdded(book){
    console.log('Book added:', book)
    setBooks((s)=>[book,...s])
  }

  function handleUpdated(updatedBook){
    console.log('Book updated:', updatedBook)
    setBooks((s)=>s.map(b=> b.id === updatedBook.id ? updatedBook : b))
    // Update the selected book to show new values
    setSelected(updatedBook)
  }

  function handleDeleted(bookId){
    setBooks((s)=>s.filter(b=>b.id !== bookId))
  }

  const filtered = books.filter((b) => {
    const bookStatus = normalizeStatus(b.status)
    const bookGenre = normalizeGenre(b.genre)
    const activeFilter = normalizeStatus(filter)
    const selectedGenre = normalizeGenre(genre)
    
    // Status filter: only apply if filter is not 'all'
    if (filter !== 'all' && bookStatus !== activeFilter) return false
    
    // Genre filter: only apply if genre is selected (not empty string)
    if (genre && selectedGenre && bookGenre !== selectedGenre) {
      console.log(`Genre mismatch: "${b.title}" (db: "${b.genre}" → normalized: "${bookGenre}") vs filter (selected: "${genre}" → normalized: "${selectedGenre}")`)
      return false
    }
    
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f9] to-[#f5e6ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-pink-600">📚 MyShelf</h1>
            <p className="text-pink-400 text-sm mt-1">Your personal e-library</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={()=>setView3D(v=>!v)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-300 text-pink-600 hover:border-pink-400 transition-all font-semibold"
            >
              {view3D? '📋 2D Library':'🎨 3D Shelf'}
            </button>
            <button 
              onClick={()=>setIsAddOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-pink-600 transition-all"
            >
              + Add Book
            </button>
            <button 
              onClick={fetchBooks}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-purple-100 border border-purple-300 text-purple-600 hover:border-purple-400 transition-all disabled:opacity-50 font-semibold"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-pink-400">Loading your books...</p>
          </div>
        ) : (
          <>
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              genres={GENRES}
              genre={genre}
              setGenre={setGenre}
              onReset={() => {
                setFilter('all')
                setGenre('')
              }}
              onAddInGenre={(selectedGenre) => {
                setPreSelectedGenre(selectedGenre)
                setIsAddOpen(true)
              }}
            />

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-pink-400 text-lg">No books match the selected genre or reading status.</p>
                <p className="text-purple-400 mt-2">Use the filters above or reset them to view all books.</p>
              </div>
            ) : (
              <>
                {!view3D ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((b) => <BookCard key={b.id} book={b} onClick={() => setSelected(b)} />)}
                  </div>
                ) : (
                  <BookShelf3D books={filtered} onBookClick={(bk) => setSelected(bk)} />
                )}
              </>
            )}
          </>
        )}

        <AddBookModal 
          isOpen={isAddOpen} 
          onClose={()=>{
            setIsAddOpen(false)
            setPreSelectedGenre('')
          }} 
          onAdded={handleAdded} 
          preSelectedGenre={preSelectedGenre}
        />
        <BookDetailModal book={selected} onClose={()=>setSelected(null)} onDeleted={handleDeleted} onUpdated={handleUpdated} />
      </div>
    </div>
  )
}
