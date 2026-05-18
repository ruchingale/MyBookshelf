import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BookDetailModal({ book, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const statusLabels = {
    want_to_read: 'Want to Read',
    reading: 'Reading',
    read: 'Read'
  }

  const statusColors = {
    want_to_read: 'bg-gray-500',
    reading: 'bg-yellow-500',
    read: 'bg-green-500'
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this book?')) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('books').delete().eq('id', book.id)
      if (error) throw error
      onDeleted && onDeleted(book.id)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Error deleting book')
    } finally {
      setDeleting(false)
    }
  }

  if (!book) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-8 w-full max-w-2xl border border-white/10">
        <div className="flex gap-6">
          <div className="w-40 h-60 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden flex-shrink-0">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover"/>
            ) : (
              <div className="text-white/70 p-4 flex items-center justify-center h-full">No Cover</div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">{book.title}</h2>
            <p className="text-white/70 text-lg mb-4">{book.author}</p>
            
            <div className="space-y-2 text-white/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-white/50">Genre:</span>
                <span className="text-white">{book.genre}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[book.status] || 'bg-gray-500'}`}>
                  {statusLabels[book.status] || book.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50">Rating:</span>
                <span className="text-white">{'★'.repeat(book.rating || 0)}{'☆'.repeat(5 - (book.rating || 0))}</span>
              </div>
            </div>

            {book.review && (
              <div className="mt-4 p-3 rounded-md bg-white/5 border border-white/10">
                <p className="text-sm text-white/70 mb-1">Review</p>
                <p className="text-white text-sm">{book.review}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white"
          >
            Close
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
