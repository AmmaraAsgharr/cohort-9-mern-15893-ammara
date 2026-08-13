const COLOR_MAP = {
  '#FFA500': '#FFF4E5',
  '#FF69B4': '#FFE8F3',
  '#00CED1': '#E5FBFB',
  '#87CEEB': '#E8F6FD',
  '#DDA0DD': '#F7E8F7',
  '#8B4513': '#F0E4DA',
}

export default function NoteCard({ note, view, onEdit, onDelete, isConfirmingDelete, onCancelDelete, onConfirmDelete }) {
  const bgColor = COLOR_MAP[note.color] || '#f5f5f5'
  const plainText = note.content.replace(/<[^>]*>/g, '')
  const preview = plainText.length > 140 ? plainText.slice(0, 140) + '…' : plainText

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit note: ${note.title || 'Untitled'}`}
      style={{
        backgroundColor: bgColor,
        borderRadius: 14,
        padding: 18,
        display: 'flex',
        flexDirection: view === 'list' ? 'row' : 'column',
        justifyContent: 'space-between',
        gap: 12,
        cursor: 'pointer',
        border: note.pinned ? '1.5px solid #FF6B00' : '1.5px solid transparent',
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onClick={onEdit}
      onKeyDown={handleKeyDown}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {note.pinned && <span style={{ fontSize: '0.75rem' }}>📌</span>}
          <h4
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#111',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {note.title || 'Untitled'}
          </h4>
        </div>

        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.8rem',
            color: '#11111190',
            lineHeight: 1.5,
            margin: 0,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: view === 'list' ? 1 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {preview || 'No content yet...'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {note.tags?.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.65rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                color: '#11111170',
                backgroundColor: '#ffffff80',
                padding: '3px 10px',
                borderRadius: 20,
                textTransform: 'capitalize',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            color: '#11111150',
          }}
        >
          {note.wordCount || 0} words
        </span>

        {isConfirmingDelete ? (
          <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={onConfirmDelete}
              style={{
                fontSize: '0.65rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
                color: '#fff',
                backgroundColor: '#FF4444',
                border: 'none',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Confirm
            </button>
            <button
              onClick={onCancelDelete}
              style={{
                fontSize: '0.65rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                color: '#111',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            aria-label={`Delete note: ${note.title || 'Untitled'}`}
            style={{
              fontSize: '0.8rem',
              color: '#11111150',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  )
}