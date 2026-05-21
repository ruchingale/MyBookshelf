
export default function FilterBar({ filter, setFilter, genres, genre, setGenre, onReset, onAddInGenre }) {
  const statusOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'want_to_read', label: 'Want to Read' },
    { value: 'reading', label: 'Currently Reading' },
    { value: 'read', label: 'Read' }
  ]

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/40 rounded-lg border border-pink-200 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === option.value
                ? 'bg-pink-400 text-white'
                : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="border-l border-pink-300 h-6"></div>
      <div className="flex items-center gap-2">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-white border border-pink-300 rounded-md px-3 py-1 text-pink-600 text-sm focus:outline-none focus:border-pink-500 font-semibold"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {genre && onAddInGenre && (
          <button
            onClick={() => onAddInGenre(genre)}
            className="px-2 py-1 rounded-md bg-pink-300 hover:bg-pink-400 text-white font-semibold text-sm transition-all"
            title={`Add book in ${genre}`}
          >
            + Add
          </button>
        )}
      </div>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1 rounded-full text-sm font-medium bg-purple-200 text-purple-700 hover:bg-purple-300"
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}
