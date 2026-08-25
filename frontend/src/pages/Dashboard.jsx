import { useState } from 'react'
import { useColorCycle } from '../hooks/useColorCycle'
import FilterChip from '../components/FilterChip'
import SectionLabel from '../components/SectionLabel'
import NoteGrid from '../components/NoteGrid'
import EmptyState from '../components/EmptyState'
import '../styles/dashboard.css'

export default function Dashboard({
  user, notes, loading, error, actionMessage, onNewNote, onEditNote, onDeleteNote, onNavigate,
}) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [sortBy, setSortBy] = useState('updated')
  const [view, setView] = useState('grid')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = notes
    .filter(n => {
      const q = search.toLowerCase()
       if (q && !n.title.toLowerCase().includes(q) && !n.content.replace(/<[^>]+>/g, '').toLowerCase().includes(q)) return false
      if (activeTag && !n.tags.includes(activeTag)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'alpha') return a.title.localeCompare(b.title)
      if (sortBy === 'created') return b.createdAt.localeCompare(a.createdAt)
      return b.updatedAt.localeCompare(a.updatedAt)
    })

  const pinned = filtered.filter(n => n.pinned)
  const rest = filtered.filter(n => !n.pinned)
  const allTags = [...new Set(notes.flatMap(n => n.tags))]

  return (
    <div className="screen-enter dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-logo">
            Note<span className="dashboard-logo-highlight">Space</span>
          </span>
          <span className="dashboard-note-count">{notes.length} notes</span>
        </div>

        <div className="dashboard-header-right">
          <DashNewButton onClick={onNewNote} />
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="dashboard-avatar-btn"
            aria-label="View profile"
          >
            {user.avatar}
          </button>
        </div>
      </header>

      <div className="dashboard-toolbar">
        <div className="dashboard-search-wrapper">
          <span className="dashboard-search-icon">⌕</span>
          <input
            className="input-field dashboard-search-input"
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="dashboard-filters">
          <FilterChip active={activeTag === null} onClick={() => setActiveTag(null)}>All</FilterChip>
          {allTags.map(t => (
            <FilterChip key={t} active={activeTag === t} onClick={() => setActiveTag(activeTag === t ? null : t)}>{t}</FilterChip>
          ))}
        </div>

        <div className="dashboard-view-controls">
          <label htmlFor="sort-select" className="sr-only">Sort notes by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="dashboard-sort-select"
          >
            <option value="updated">Last edited</option>
            <option value="created">Created</option>
            <option value="alpha">A → Z</option>
          </select>
          {['grid', 'list'].map(v => (
            <button
              type="button"
              key={v}
              onClick={() => setView(v)}
              className={`dashboard-view-btn ${view === v ? 'active' : ''}`}
              aria-label={v === 'grid' ? 'Grid view' : 'List view'}
              aria-pressed={view === v}
            >
              {v === 'grid' ? '⊞' : '☰'}
            </button>
          ))}
        </div>
      </div>

      <main className="dashboard-main">
        {actionMessage && (
          <p className="dashboard-status-text dashboard-action-text">{actionMessage}</p>
        )}

        {loading && (
          <p className="dashboard-status-text">Loading your notes...</p>
        )}

        {!loading && error && (
          <p className="dashboard-status-text dashboard-error-text">{error}</p>
        )}

        {!loading && !error && (
          <>
            {pinned.length > 0 && (
              <section className="dashboard-section">
                <SectionLabel>📌 Pinned</SectionLabel>
                <NoteGrid notes={pinned} view={view} onEdit={onEditNote}
                  onDelete={id => setDeleteConfirm(id)}
                  deleteConfirm={deleteConfirm}
                  setDeleteConfirm={setDeleteConfirm}
                  onDeleteConfirm={onDeleteNote} />
              </section>
            )}
            {rest.length > 0 && (
              <section>
                <SectionLabel>{pinned.length > 0 ? 'All Notes' : 'Your Notes'}</SectionLabel>
                <NoteGrid notes={rest} view={view} onEdit={onEditNote}
                  onDelete={id => setDeleteConfirm(id)}
                  deleteConfirm={deleteConfirm}
                  setDeleteConfirm={setDeleteConfirm}
                  onDeleteConfirm={onDeleteNote} />
              </section>
            )}
            {filtered.length === 0 && <EmptyState search={search} onNewNote={onNewNote} />}
          </>
        )}
      </main>
    </div>
  )
}

function DashNewButton({ onClick }) {
  const { bg, start, stop } = useColorCycle('#FF6B00')
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={start}
      onMouseLeave={stop}
      className="dashboard-new-btn"
      style={{ backgroundColor: bg }}
    >
      + New Note
    </button>
  )
}