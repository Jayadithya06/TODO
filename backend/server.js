const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const taskRoutes = require('./routes/tasks')
const authRoutes = require('./routes/auth')
const passport = require('passport')
const oauthRoutes = require('./routes/oauth')

const mfaRoutes = require('./routes/mfa')
const paymentRoutes = require('./routes/payment')
const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use('/auth', oauthRoutes)

require('dotenv').config()
mongoose.connect(process.env.MONGO_URI)
  .catch((err) => console.log('DB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/mfa', mfaRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'TODO API is running' })
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))