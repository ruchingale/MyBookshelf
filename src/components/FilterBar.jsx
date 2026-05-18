
export default function FilterBar({ filter, setFilter, genres, genre, setGenre }) {
  const statusOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'want_to_read', label: 'Want to Read' },
    { value: 'reading', label: 'Currently Reading' },
    { value: 'read', label: 'Read' }
  ]

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === option.value
                ? 'bg-amber-600 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="border-l border-white/20 h-6"></div>
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-md px-3 py-1 text-white text-sm focus:outline-none focus:border-amber-600/50"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  )
}
