import { useState } from 'react'
import AuthScreen from './pages/AuthScreen'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    console.log('Login successful, user data:', userData)
    setUser(userData)
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user?.name || 'User'}!</h1>
      <p>Dashboard coming soon...</p>
    </div>
  )
}

export default App