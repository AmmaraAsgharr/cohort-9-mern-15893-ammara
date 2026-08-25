export default function EmptyState({ search, onNewNote }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '80px 20px',
        color: '#11111160',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📝</div>
      <h3
        style={{
          fontFamily: 'Unbounded, sans-serif',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#111',
          marginBottom: 8,
        }}
      >
        {search ? 'No notes found' : 'No notes yet'}
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: 24 }}>
        {search
          ? `Nothing matches "${search}". Try a different search.`
          : 'Start capturing your ideas — create your first note.'}
      </p>
      {!search && (
        <button
         type="button"
          onClick={onNewNote}
          style={{
            padding: '10px 24px',
            backgroundColor: '#FF6B00',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: 'Unbounded, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          + Create Note
        </button>
      )}
    </div>
  )
}