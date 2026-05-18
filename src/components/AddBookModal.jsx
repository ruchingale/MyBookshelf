import { useState } from 'react'
import { fetchCoverFromOpenLibrary } from '../lib/bookUtils'
import { supabase } from '../lib/supabase'

const genres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Biography', 'History', 'Self-Help', 'Other']

export default function AddBookModal({ isOpen, onClose, onAdded }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState(genres[0])
  const [status, setStatus] = useState('want_to_read')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || !author) {
      setError('Title and Author are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      let cover_url = null
      if (file) {
        const fileName = `${Date.now()}_${file.name}`
        const { data, error: uploadErr } = await supabase.storage.from('covers').upload(fileName, file)
        if (uploadErr) throw uploadErr
        const { data: publicData } = supabase.storage.from('covers').getPublicUrl(fileName)
        cover_url = publicData.publicUrl
      } else {
        cover_url = await fetchCoverFromOpenLibrary(title)
      }

      const { data, error } = await supabase.from('books').insert([
        { title, author, genre, status, rating: rating || null, review: review || null, cover_url },
      ]).select()
      if (error) {
        console.error('Supabase insert error:', error)
        throw new Error(`Failed to add book: ${error.message}`)
      }
      onAdded && onAdded(data[0])
      setTitle('')
      setAuthor('')
      setGenre(genres[0])
      setStatus('want_to_read')
      setRating(0)
      setReview('')
      setFile(null)
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error adding book')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-8 w-full max-w-xl border border-white/10">
        <h2 className="text-white text-2xl font-bold mb-6">Add Book to MyShelf</h2>
        {error && <div className="mb-4 p-3 rounded-md bg-red-500/20 text-red-300 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 block mb-1">Title *</label>
            <input 
              required 
              value={title} 
              onChange={(e)=>setTitle(e.target.value)} 
              placeholder="Enter book title"
              className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-600/50"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1">Author *</label>
            <input 
              required 
              value={author} 
              onChange={(e)=>setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-600/50"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm text-white/70 block mb-1">Genre</label>
              <select value={genre} onChange={(e)=>setGenre(e.target.value)} className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white">
                {genres.map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-1">Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white">
                <option value="want_to_read">Want to Read</option>
                <option value="reading">Reading</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-1">Rating</label>
              <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white">
                <option value={0}>No Rating</option>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1">Review (Optional)</label>
            <textarea 
              value={review} 
              onChange={(e)=>setReview(e.target.value)}
              placeholder="Add your review..."
              rows={3}
              className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-600/50"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1">Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e)=>setFile(e.target.files[0])}
              className="w-full p-2 text-white text-sm"
            />
            <p className="text-xs text-white/40 mt-1">If not provided, will fetch from Open Library</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold disabled:opacity-50"
            >
              {loading? 'Adding...':'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
