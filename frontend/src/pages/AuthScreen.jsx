import { useState } from 'react'
import { login as loginApi, signup } from '../api/authService'
import { useAuth } from '../Context/AuthContext'
import SubmitButton from '../components/SubmitButton'
import { labelStyle } from '../constants/styles'
import '../styles/auth.css'

export default function AuthScreen() {
  const { login } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || (mode === 'signup' && !name)) {
      setErr('Please fill in all fields.')
      return
    }
    setErr('')
    setLoading(true)
    try {
      const { user, token } = mode === 'login'
        ? await loginApi(email, password)
        : await signup(name, email, password)
      login(user, token)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="auth-container">
      {/* ── Left brand panel ── */}
      <div className="auth-brand">
        <div className="auth-brand-glow-top" />
        <div className="auth-brand-glow-bottom" />

        <div className="auth-logo">
          <div className="auth-logo-dot" />
        </div>

        <h1 className="auth-title">
          Note<br /><span className="auth-title-highlight">Space.</span>
        </h1>

        <p className="auth-subtitle">
          Capture ideas, organize thoughts, and build your second brain — beautifully.
        </p>

        <div className="auth-tags">
          {['personal', 'work', 'ideas'].map((tag, i) => (
            <span key={tag} className={`auth-tag auth-tag-${i}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form-subtitle">
            {mode === 'login' ? 'Log in to your notes' : 'Start capturing ideas today'}
          </p>

          <div className="auth-mode-toggle">
            {['login', 'signup'].map(m => (
              <button
               type="button"
                key={m}
                onClick={() => { setMode(m); setErr('') }}
                className={`auth-mode-btn ${mode === m ? 'active' : ''}`}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
            <div className="auth-field auth-field-slide">
                <label htmlFor="name" style={labelStyle}>Full Name</label>
                 <input 
                   id="name"
                    className="auth-input" 
                    type="text" 
                    value={name}
                     onChange={e => setName(e.target.value)} 
                     placeholder="Ammara Asghar" 
                />
             </div>
  )}
       <div className="auth-field">
            <label htmlFor="email" style={labelStyle}>Email</label>
             <input 
              id="email"
               className="auth-input" 
                type="email" 
                value={email}
               onChange={e => setEmail(e.target.value)} 
               placeholder="ammara@gmail.com" 
          />
        </div>
        <div className="auth-field auth-field-last">
           <label htmlFor="password" style={labelStyle}>Password</label>
          <input 
             id="password"
             className="auth-input" 
             type="password" 
             value={password}
             onChange={e => setPassword(e.target.value)} 
             placeholder="••••••••" 
            />
           </div>

             {err && (
               <p className="auth-error" role="alert">{err}</p>
              )}

          <div className="auth-submit-wrapper">
              <SubmitButton loading={loading} label={mode === 'login' ? 'Log In' : 'Create Account'} />
           </div>
          </form>
        </div>
      </div>
    </div>
  )
}