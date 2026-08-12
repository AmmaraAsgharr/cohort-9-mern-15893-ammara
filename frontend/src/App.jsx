import { useState, useEffect } from 'react'
import { useAuth } from './Context/AuthContext'
import AuthScreen from './pages/AuthScreen'
import Dashboard from './pages/Dashboard'
import { getNotes, deleteNote as deleteNoteApi } from './api/notesService'

function App() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    if (!user) {
      setNotes([])
      return
    }

    let isCurrent = true

    const fetchNotes = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const data = await getNotes()
        if (isCurrent) {
          setNotes(data)
        }
      } catch (err) {
        if (isCurrent) {
          setLoadError('Failed to load notes. Please try again.')
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    fetchNotes()

    return () => {
      isCurrent = false
    }
  }, [user])

  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteApi(id)
      setNotes(prev => prev.filter(n => n._id !== id))
    } catch (err) {
      setActionMessage('Failed to delete note.')
    }
  }

  // this section is going to implement in next PR
  const handleNewNote = () => {
    setActionMessage('Note creation is coming soon.')
  }

  const handleEditNote = () => {
    setActionMessage('Note editing is coming soon.')
  }

  const handleNavigate = () => {
    setActionMessage('This section is coming soon.')
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <Dashboard
      user={user}
      notes={notes}
      loading={loading}
      error={loadError}
      actionMessage={actionMessage}
      onNewNote={handleNewNote}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
      onNavigate={handleNavigate}
    />
  )
}

export default App