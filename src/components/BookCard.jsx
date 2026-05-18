import clsx from 'clsx'

function StatusBadge({ status }) {
  const badges = {
    read: { color: 'bg-green-500/20 text-green-400', label: 'Read' },
    reading: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Reading' },
    want_to_read: { color: 'bg-gray-500/20 text-gray-300', label: 'Want to Read' }
  }
  const badge = badges[status] || badges.want_to_read
  return <span className={clsx('text-xs px-3 py-1 rounded-full font-semibold', badge.color)}>{badge.label}</span>
}

export default function BookCard({ book, onClick }) {
  return (
    <div
      onClick={() => onClick(book)}
      className="backdrop-blur-md bg-gradient-to-br from-white/8 to-white/3 border border-white/15 rounded-lg p-4 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 h-full flex flex-col"
    >
      <div className="h-48 w-full bg-gradient-to-br from-gray-600 to-gray-900 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="text-sm text-white/50 px-2 text-center">No Cover Available</div>
        )}
      </div>
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base text-white line-clamp-2">{book.title}</h3>
        <p className="text-sm text-white/60 mt-1">{book.author}</p>
        <p className="text-xs text-white/50 mt-2">{book.genre}</p>
        <div className="mt-3 flex items-center gap-1">
          <span className="text-yellow-400">{'★'.repeat(book.rating || 0)}</span>
          <span className="text-white/30">{'☆'.repeat(5 - (book.rating || 0))}</span>
        </div>
        <div className="mt-auto pt-3">
          <StatusBadge status={book.status} />
        </div>
      </div>
    </div>
  )
}
