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
  const [view3D, setView3D] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ 
    console.log('📚 Library component mounted')
    fetchBooks() 
  }, [])

  async function fetchBooks(){
    setLoading(true)
    console.log('🔄 Fetching books from Supabase...')
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', {ascending:false})
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      console.log('✅ Books fetched:', data?.length || 0, 'books')
      setBooks(data || [])
    } catch (err) {
      console.error('❌ Error fetching books:', err)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  function handleAdded(book){
    setBooks((s)=>[book,...s])
  }

  function handleDeleted(bookId){
    setBooks((s)=>s.filter(b=>b.id !== bookId))
  }

  const filtered = books.filter(b=> {
    if (filter !== 'all'){
      if (filter === 'want_to_read' && b.status !== 'want_to_read') return false
      if (filter === 'reading' && b.status !== 'reading') return false
      if (filter === 'read' && b.status !== 'read') return false
    }
    if (genre && b.genre !== genre) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">📚 MyShelf</h1>
            <p className="text-white/60 text-sm mt-1">Your personal e-library</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={()=>setView3D(v=>!v)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/20 text-white hover:border-white/40 transition-all"
            >
              {view3D? '📋 2D Library':'🎨 3D Shelf'}
            </button>
            <button 
              onClick={()=>setIsAddOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold hover:from-amber-700 hover:to-amber-800 transition-all"
            >
              + Add Book
            </button>
            <button 
              onClick={fetchBooks}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:border-white/40 transition-all disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-white/60">Loading your books...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">No books found. Add your first book to get started!</p>
          </div>
        ) : (
          <>
            {!view3D && (
              <div>
                <FilterBar filter={filter} setFilter={setFilter} genres={GENRES} genre={genre} setGenre={setGenre} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filtered.map(b=> <BookCard key={b.id} book={b} onClick={(bk)=>setSelected(bk)}/>)}
                </div>
              </div>
            )}

            {view3D && (
              <BookShelf3D books={filtered} onBookClick={(bk)=>setSelected(bk)} />
            )}
          </>
        )}

        <AddBookModal isOpen={isAddOpen} onClose={()=>setIsAddOpen(false)} onAdded={handleAdded} />
        <BookDetailModal book={selected} onClose={()=>setSelected(null)} onDeleted={handleDeleted} />
      </div>
    </div>
  )
}
