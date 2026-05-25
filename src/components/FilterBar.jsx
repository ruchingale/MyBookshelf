
export default function FilterBar({ filter, setFilter, genres, genre, setGenre, onReset, onAddInGenre }) {
  const statusOptions = [
    { value: 'all',          label: '📚 All Books' },
    { value: 'want_to_read', label: '🌙 Want to Read' },
    { value: 'reading',      label: '📖 Reading' },
    { value: 'read',         label: '✅ Read' },
  ]

  const barStyle = {
    position: 'sticky',
    top: '69px',           // height of the sticky header
    zIndex: 90,
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.75)',
    boxShadow: '0 2px 12px rgba(199,125,255,0.08)',
    padding: '10px 32px',
    margin: '0 -32px',     // bleed out of container padding to go edge-to-edge
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '24px',
  }

  const statusGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  }

  const rightGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  }

  function statusBtn(value, label) {
    const active = filter === value
    return (
      <button
        key={value}
        onClick={() => setFilter(value)}
        style={{
          padding: '7px 16px',
          borderRadius: '24px',
          border: active ? 'none' : '1.5px solid rgba(216,180,254,0.7)',
          background: active
            ? 'linear-gradient(135deg, #e879a0 0%, #c77dff 100%)'
            : 'rgba(255,255,255,0.6)',
          color: active ? 'white' : '#9b59b6',
          fontWeight: 700,
          fontSize: '13px',
          fontFamily: "'Nunito', sans-serif",
          cursor: 'pointer',
          boxShadow: active ? '0 4px 12px rgba(199,125,255,0.3)' : 'none',
          transition: 'all 0.18s ease',
          whiteSpace: 'nowrap',
          backdropFilter: active ? 'none' : 'blur(6px)',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.borderColor = '#c084d0'
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
            e.currentTarget.style.borderColor = 'rgba(216,180,254,0.7)'
          }
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={barStyle}>
      {/* Status filter pills */}
      <div style={statusGroupStyle}>
        {statusOptions.map(({ value, label }) => statusBtn(value, label))}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(216,180,254,0.5)', flexShrink: 0 }} />

      {/* Genre + actions */}
      <div style={rightGroupStyle}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1.5px solid rgba(216,180,254,0.7)',
            borderRadius: '10px',
            padding: '7px 14px',
            color: '#7c3aed',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: "'Nunito', sans-serif",
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            backdropFilter: 'blur(6px)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#c084d0' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(216,180,254,0.7)' }}
        >
          <option value="">🏷️ All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {genre && onAddInGenre && (
          <button
            onClick={() => onAddInGenre(genre)}
            title={`Add book in ${genre}`}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ffb3d1 0%, #ff85b5 100%)',
              border: 'none',
              color: 'white',
              fontWeight: 800,
              fontSize: '13px',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255,107,157,0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,157,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,107,157,0.3)'
            }}
          >
            + Add in {genre}
          </button>
        )}

        {onReset && (filter !== 'all' || genre) && (
          <button
            onClick={onReset}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.6)',
              border: '1.5px solid rgba(216,180,254,0.6)',
              color: '#9b59b6',
              fontWeight: 700,
              fontSize: '12px',
              fontFamily: "'Nunito', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backdropFilter: 'blur(6px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
              e.currentTarget.style.borderColor = '#c084d0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(216,180,254,0.6)'
            }}
          >
            ✕ Reset
          </button>
        )}
      </div>
    </div>
  )
}
