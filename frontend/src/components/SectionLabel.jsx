export default function SectionLabel({ children }) {
  return (
    <h3
      style={{
        fontFamily: 'Unbounded, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#11111170',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 16,
      }}
    >
      {children}
    </h3>
  )
}