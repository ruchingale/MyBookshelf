import clsx from 'clsx'

function StatusBadge({ status }) {
  const badges = {
    read: { color: 'bg-green-200 text-green-700', label: 'Read' },
    reading: { color: 'bg-yellow-200 text-yellow-700', label: 'Reading' },
    want_to_read: { color: 'bg-purple-200 text-purple-700', label: 'Want to Read' }
  }
  const badge = badges[status] || badges.want_to_read
  return <span className={clsx('text-xs px-3 py-1 rounded-full font-semibold', badge.color)}>{badge.label}</span>
}

export default function BookCard({ book, onClick }) {
  return (
    <div
      onClick={() => onClick(book)}
      className="backdrop-blur-md bg-gradient-to-br from-white to-pink-50 border border-pink-200 rounded-lg p-4 cursor-pointer hover:scale-105 hover:border-pink-300 transition-all duration-300 h-full flex flex-col shadow-md"
    >
      <div className="h-48 w-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="text-sm text-purple-400 px-2 text-center">No Cover Available</div>
        )}
      </div>
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base text-pink-700 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-pink-500 mt-1">{book.author}</p>
        <p className="text-xs text-purple-500 mt-2">{book.genre}</p>
        <div className="mt-3 flex items-center gap-1">
          <span className="text-yellow-500">{'★'.repeat(book.rating || 0)}</span>
          <span className="text-gray-300">{'☆'.repeat(5 - (book.rating || 0))}</span>
        </div>
        <div className="mt-auto pt-3">
          <StatusBadge status={book.status} />
        </div>
      </div>
    </div>
  )
}
