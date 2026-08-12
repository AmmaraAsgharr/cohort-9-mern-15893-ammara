import { useState, useEffect } from 'react'
import { useAuth } from './Context/AuthContext'
import AuthScreen from './pages/AuthScreen'
import Dashboard from './pages/Dashboard'
import { getNotes, deleteNote as deleteNoteApi } from './api/notesService'

function App() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 useEffect(() => {
  if (!user) {
    setNotes([])
    return
  }

  let isCurrent = true

  const fetchNotes = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getNotes()
      if (isCurrent) {
        setNotes(data)
      }
    } catch (err) {
      if (isCurrent) {
        setError('Failed to load notes. Please try again.')
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
      setError('Failed to delete note.')
    }
  }

  //this section is going to implement in next pr
  const handleNewNote = () => {
    setError('Note creation is coming soon.')
  }

  
  const handleEditNote = () => {
    setError('Note editing is coming soon.')
  }

  const handleNavigate = () => {
    setError('This section is coming soon.')
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <Dashboard
      user={user}
      notes={notes}
      loading={loading}
      error={error}
      onNewNote={handleNewNote}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
      onNavigate={handleNavigate}
    />
  )
}

export default App