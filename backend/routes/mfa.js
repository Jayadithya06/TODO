const express = require('express')
const router = express.Router()
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')

const JWT_SECRET = 'todo-app-secret-key-2024'

router.get('/status', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json({ mfaEnabled: user.mfaEnabled })
})

router.post('/setup', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (user.mfaEnabled) {
    return res.json({ message: 'MFA already enabled' })
  }
  const secret = speakeasy.generateSecret({ name: 'TODO App' })
  await User.findByIdAndUpdate(req.user.id, {
    mfaSecret: secret.base32,
    mfaEnabled: false
  })
  const qr = await qrcode.toDataURL(secret.otpauth_url)
  res.json({ qr, secret: secret.base32 })
})

router.post('/verify', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: req.body.token
  })
  if (!verified) return res.status(400).json({ message: 'Invalid code' })
  await User.findByIdAndUpdate(req.user.id, { mfaEnabled: true })
  res.json({ message: 'MFA enabled successfully' })
})

router.post('/login-verify', async (req, res) => {
  try {
    const { tempToken, token } = req.body
    const decoded = jwt.verify(tempToken, JWT_SECRET)

    if (!decoded.mfaPending) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    const user = await User.findById(decoded.id)
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token
    })

    if (!verified) return res.status(400).json({ message: 'Invalid MFA code' })

    const finalToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token: finalToken })
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' })
  }
})

module.exports = router