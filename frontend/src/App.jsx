import { useAuth } from './Context/AuthContext'
import AuthScreen from './pages/AuthScreen'

function App() {
  const { user } = useAuth()

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user?.name || 'User'}!</h1>
      <p>Dashboard coming soon...</p>
    </div>
  )
}

export default App