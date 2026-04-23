const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  photo: {
  type: String,
  default: null
},
  mfaSecret: { type: String, default: null },
  mfaEnabled: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)