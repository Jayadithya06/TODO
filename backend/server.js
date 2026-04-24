require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const mfaRoutes = require('./routes/mfa')
const paymentRoutes = require('./routes/payment')
const oauthRoutes = require('./routes/oauth')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(passport.initialize())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB connection error:', err))

app.use('/auth', oauthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/mfa', mfaRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'TODO API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))