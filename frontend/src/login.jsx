import { useState } from 'react'
import API from './api'

export default function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [tempToken, setTempToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', form)
      if (res.data.mfaRequired) {
        setTempToken(res.data.tempToken)
        setMfaRequired(true)
      } else if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        window.location.reload()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleMFAVerify = async () => {
    try {
      const res = await API.post('/mfa/login-verify', { tempToken, token: mfaCode })
      localStorage.setItem('token', res.data.token)
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid MFA code')
    }
  }

  if (mfaRequired) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>Two-step verification</h2>
          <p className="subtitle">Enter the 6-digit code from Google Authenticator</p>
          {error && <div className="error-msg">{error}</div>}
          <input
            type="text"
            placeholder="000000"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            maxLength={6}
            style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '20px' }}
          />
          <button
            type="button"
            onClick={handleMFAVerify}
            style={{
              width: '100%', padding: '11px', background: '#2C3B1F',
              color: '#F5F0E8', border: 'none', borderRadius: '8px',
              fontSize: '14px', cursor: 'pointer', marginTop: '12px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Verify
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your account</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign in</button>
        </form>
        <div className="auth-divider">or</div>
        <a href="https://todo-backend-itkm.onrender.com/auth/google" className="google-btn">
  Continue with Google
</a>
        <div className="auth-switch">
          No account? <span onClick={onSwitch}>Create one</span>
        </div>
      </div>
    </div>
  )
}