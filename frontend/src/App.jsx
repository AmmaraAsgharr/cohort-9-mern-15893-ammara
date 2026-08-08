import { useState } from 'react'
import AuthScreen from './pages/AuthScreen'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user?.name || 'User'}!</h1>
      <p>Dashboard in pr 5 </p>
    </div>
  )
}

export default App