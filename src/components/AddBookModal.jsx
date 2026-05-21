import { useEffect, useState } from 'react'
import { fetchCoverFromOpenLibrary } from '../lib/bookUtils'
import { supabase } from '../lib/supabase'

const genres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Biography', 'History', 'Self-Help', 'Other']

export default function AddBookModal({ isOpen, onClose, onAdded, preSelectedGenre }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState(preSelectedGenre || genres[0])
  const [status, setStatus] = useState('want_to_read')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Update genre when preSelectedGenre changes
  useEffect(() => {
    if (preSelectedGenre) {
      setGenre(preSelectedGenre)
    }
  }, [preSelectedGenre, isOpen])

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
      console.log('Book successfully added:', { title, author, genre, status, data })
      onAdded && onAdded(data[0])
      setTitle('')
      setAuthor('')
      setGenre(preSelectedGenre || genres[0])
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl p-8 w-full max-w-xl border border-pink-300 shadow-xl">
        <h2 className="text-pink-600 text-2xl font-bold mb-6">Add Book to MyShelf</h2>
        {error && <div className="mb-4 p-3 rounded-md bg-red-200 text-red-700 text-sm font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-pink-600 block mb-1 font-semibold">Title *</label>
            <input 
              required 
              value={title} 
              onChange={(e)=>setTitle(e.target.value)} 
              placeholder="Enter book title"
              className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div>
            <label className="text-sm text-pink-600 block mb-1 font-semibold">Author *</label>
            <input 
              required 
              value={author} 
              onChange={(e)=>setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm text-pink-600 block mb-1 font-semibold">Genre</label>
              <select value={genre} onChange={(e)=>setGenre(e.target.value)} className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 font-semibold">
                {genres.map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-pink-600 block mb-1 font-semibold">Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 font-semibold">
                <option value="want_to_read">Want to Read</option>
                <option value="reading">Reading</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-pink-600 block mb-1 font-semibold">Rating</label>
              <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 font-semibold">
                <option value={0}>No Rating</option>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-pink-600 block mb-1 font-semibold">Review (Optional)</label>
            <textarea 
              value={review} 
              onChange={(e)=>setReview(e.target.value)}
              placeholder="Add your review..."
              rows={3}
              className="w-full p-2 rounded-md bg-pink-50 border border-pink-300 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div>
            <label className="text-sm text-pink-600 block mb-1 font-semibold">Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e)=>setFile(e.target.files[0])}
              className="w-full p-2 text-pink-700 text-sm"
            />
            <p className="text-xs text-pink-400 mt-1">If not provided, will fetch from Open Library</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="px-4 py-2 rounded-md bg-pink-400 hover:bg-pink-500 text-white font-semibold disabled:opacity-50"
            >
              {loading? 'Adding...':'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
