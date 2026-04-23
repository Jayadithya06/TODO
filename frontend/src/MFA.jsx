import { useState, useEffect } from 'react'
import API from './api'

export default function MFA({ onClose }) {
  const [qr, setQr] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState('loading')

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const res = await API.get('/mfa/status')
      if (res.data.mfaEnabled) {
        setStep('done')
        setMessage('MFA is active on your account')
      } else {
        await setupMFA()
      }
    } catch (err) {
      setStep('setup')
    }
  }

  const setupMFA = async () => {
    const res = await API.post('/mfa/setup')
    setQr(res.data.qr)
    setStep('verify')
  }

  const verifyMFA = async () => {
    try {
      const res = await API.post('/mfa/verify', { token })
      setMessage(res.data.message)
      setStep('done')
    } catch (err) {
      setMessage('Invalid code — try again')
    }
  }

  if (step === 'loading') {
    return (
      <div className="mfa-box">
        <p>Checking MFA status...</p>
      </div>
    )
  }

  return (
    <div className="mfa-box">
      <h2>Multi-Factor Authentication</h2>

      {step === 'verify' && (
        <>
          <p>Scan this QR code with Google Authenticator, then enter the 6-digit code below.</p>
          <img src={qr} alt="MFA QR Code" style={{ width: '160px', marginBottom: '16px', borderRadius: '8px' }} />
          <input
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
          />
          {message && <p style={{ color: '#993C1D', fontSize: '13px', marginBottom: '8px' }}>{message}</p>}
          <button onClick={verifyMFA}>Verify & Enable</button>
        </>
      )}

      {step === 'done' && (
        <>
          <div className="success-msg" style={{ marginBottom: '16px' }}>{message}</div>
          <button onClick={onClose}>Close</button>
        </>
      )}
    </div>
  )
}