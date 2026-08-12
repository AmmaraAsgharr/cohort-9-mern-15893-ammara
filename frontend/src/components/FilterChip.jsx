export default function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px',
        borderRadius: 20,
        border: active ? 'none' : '1.5px solid #e8e8e8',
        backgroundColor: active ? '#111' : '#fff',
        color: active ? '#fff' : '#11111180',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        textTransform: 'capitalize',
        transition: 'all 0.18s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}