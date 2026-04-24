import { useState } from 'react'
import API from './api'

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create account</h2>
        <p className="subtitle">Start organizing your day</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">Create account</button>
        </form>
        <div className="auth-divider">or</div>
        <a href="https://todo-backend-itkm.onrender.com/auth/google" className="google-btn">
          Continue with Google
        </a>
        <div className="auth-switch">
          Already have an account? <span onClick={onSwitch}>Sign in</span>
        </div>
      </div>
    </div>
  )
}