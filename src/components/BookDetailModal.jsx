import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BookDetailModal({ book, onClose, onDeleted, onUpdated }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editedStatus, setEditedStatus] = useState(book?.status || 'want_to_read')
  const [editedRating, setEditedRating] = useState(book?.rating || 0)
  const [editedReview, setEditedReview] = useState(book?.review || '')

  const statusLabels = {
    want_to_read: 'Want to Read',
    reading: 'Reading',
    read: 'Read'
  }

  const statusColors = {
    want_to_read: 'bg-purple-500',
    reading: 'bg-yellow-500',
    read: 'bg-green-500'
  }

  async function handleUpdate() {
    setUpdating(true)
    try {
      const { data, error } = await supabase.from('books')
        .update({ status: editedStatus, rating: editedRating, review: editedReview })
        .eq('id', book.id)
        .select()
      if (error) throw error
      
      console.log('Book successfully updated:', { data })
      
      // Call callback to notify parent component
      if (onUpdated && data && data[0]) {
        onUpdated(data[0])
      }
      
      setEditing(false)
      alert('Book updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Error updating book')
    } finally {
      setUpdating(false)
    }
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl p-8 w-full max-w-2xl border border-pink-300 shadow-xl">
        <div className="flex gap-6">
          <div className="w-40 h-60 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg overflow-hidden flex-shrink-0">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover"/>
            ) : (
              <div className="text-purple-400 p-4 flex items-center justify-center h-full">No Cover</div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-pink-600 mb-1">{book.title}</h2>
            <p className="text-pink-500 text-lg mb-4">{book.author}</p>
            
            <div className="space-y-2 text-pink-700 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-semibold">Genre:</span>
                <span className="text-pink-600">{book.genre}</span>
              </div>
              
              {/* Status Edit Section */}
              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-semibold">Status:</span>
                {editing ? (
                  <select 
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="px-2 py-1 rounded-md bg-pink-100 border border-pink-400 text-pink-700 font-semibold text-sm"
                  >
                    <option value="want_to_read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[book.status] || 'bg-gray-400'}`}>
                    {statusLabels[book.status] || book.status}
                  </span>
                )}
              </div>
              
              {/* Rating Edit Section */}
              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-semibold">Rating:</span>
                {editing ? (
                  <select 
                    value={editedRating}
                    onChange={(e) => setEditedRating(Number(e.target.value))}
                    className="px-2 py-1 rounded-md bg-pink-100 border border-pink-400 text-pink-700 font-semibold text-sm"
                  >
                    <option value={0}>No Rating</option>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-yellow-500">{'★'.repeat(book.rating || 0)}{'☆'.repeat(5 - (book.rating || 0))}</span>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="mt-4 p-3 rounded-md bg-pink-100 border border-pink-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-pink-600 font-semibold">Review</p>
                {!editing && (
                  <button 
                    onClick={() => setEditing(true)}
                    className="text-xs px-2 py-1 rounded bg-pink-300 hover:bg-pink-400 text-white font-semibold transition-all"
                  >
                    ✏️
                  </button>
                )}
              </div>
              {editing ? (
                <textarea
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  placeholder="Add your review here..."
                  className="w-full p-2 rounded-md bg-white border border-pink-400 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-pink-700 text-sm whitespace-pre-wrap">{editedReview || '(No review added yet)'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {editing ? (
            <>
              <button 
                onClick={() => {
                  setEditing(false)
                  setEditedStatus(book.status)
                  setEditedRating(book.rating)
                  setEditedReview(book.review || '')
                }}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="px-4 py-2 rounded-md bg-green-400 hover:bg-green-500 text-white font-semibold disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              >
                Close
              </button>
              <button 
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white font-semibold"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-red-300 hover:bg-red-400 text-red-700 font-semibold disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
