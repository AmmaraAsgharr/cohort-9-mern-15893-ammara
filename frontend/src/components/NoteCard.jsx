import { extractPlainText } from '../utils/html'   

const COLOR_MAP = {
  '#FF6B00': '#FFDDD0',
  '#FFB830': '#FFEEC2',
  '#34C77B': '#CDF5E1',
  '#38AAFF': '#CDEBFB',
  '#8B5CF6': '#E3D6FA',
  '#FF4444': '#FFCDE7',
}

export default function NoteCard({ note, view, onEdit, onDelete, isConfirmingDelete, onCancelDelete, onConfirmDelete }) {
  const bgColor = COLOR_MAP[note.color] || '#f5f5f5'

  const plainText = extractPlainText(note.content)
  const preview = plainText.length > 140 ? plainText.slice(0, 140) + '…' : plainText

  const handleCardClick = (e) => {
    if (!e.target.closest('button')) {
      onEdit()
    }
  }

  const handleCardKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) {
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
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
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
            color: '#111111d0',
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
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onConfirmDelete()
              }}
              onKeyDown={(e) => e.stopPropagation()}
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
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCancelDelete()
              }}
              onKeyDown={(e) => e.stopPropagation()}
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
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Edit note: ${note.title || 'Untitled'}`}
              style={{
                fontSize: '0.8rem',
                color: '#111111a0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Delete note: ${note.title || 'Untitled'}`}
              style={{
                fontSize: '0.8rem',
                color: '#111111a0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              🗑
            </button>
          </div>
        )}
      </div>
    </div>
  )
}