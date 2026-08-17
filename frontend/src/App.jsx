import { useState, useEffect } from 'react'
import { useAuth } from './Context/AuthContext'
import AuthScreen from './pages/AuthScreen'
import Dashboard from './pages/Dashboard'
import NoteEditor from './pages/NoteEditor'
import UserProfile from './pages/UserProfile'
import { getNotes, createNote, updateNote, deleteNote as deleteNoteApi } from './api/notesService'

function App() {
  const { user, logout } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [screen, setScreen] = useState('dashboard')
  const [activeNote, setActiveNote] = useState(null)

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

  const handleNewNote = () => {
    setActiveNote(null)
    setScreen('editor')
  }

  const handleEditNote = (note) => {
    setActiveNote({ ...note, id: note._id })
    setScreen('editor')
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.id) {
        const updated = await updateNote(noteData.id, noteData)
        setNotes(prev => prev.map(n => (n._id === noteData.id ? updated : n)))
      } else {
        const created = await createNote(noteData)
        setNotes(prev => [created, ...prev])
      }
      setScreen('dashboard')
    } catch (err) {
      setActionMessage('Failed to save note.')
      throw err
    }
  }

  const handleCancelEdit = () => {
    setActiveNote(null)
    setScreen('dashboard')
  }

  const handleNavigate = (target) => {
    setScreen(target)
  }

  const handleBackToDashboard = () => {
    setScreen('dashboard')
  }

  if (!user) {
    return <AuthScreen />
  }

  if (screen === 'editor') {
    return (
      <NoteEditor
        note={activeNote}
        onSave={handleSaveNote}
        onCancel={handleCancelEdit}
      />
    )
  }

  if (screen === 'profile') {
    return (
      <UserProfile
        user={user}
        notes={notes}
        onLogout={logout}
        onBack={handleBackToDashboard}
      />
    )
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