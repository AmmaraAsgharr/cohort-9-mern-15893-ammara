export default function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '14px 0',
        borderRadius: 12,
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        backgroundColor: '#FF6B00',
        color: '#fff',
        fontFamily: 'Unbounded, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
    >
      {loading ? 'Please wait...' : label}
    </button>
  )
}
