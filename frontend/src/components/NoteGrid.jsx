import NoteCard from './NoteCard'

export default function NoteGrid({ notes, view, onEdit, onDelete, deleteConfirm, setDeleteConfirm, onDeleteConfirm }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
        gap: 16,
      }}
    >
      {notes.map(note => (
        <NoteCard
          key={note._id}
          note={note}
          view={view}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note._id)}
          isConfirmingDelete={deleteConfirm === note._id}
          onCancelDelete={() => setDeleteConfirm(null)}
          onConfirmDelete={() => onDeleteConfirm(note._id)}
        />
      ))}
    </div>
  )
}