export default function FmtBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="fmt-btn"
      type="button"
    >
      {children}
    </button>
  )
}

export function Divider() {
  return <span className="fmt-divider" />
}