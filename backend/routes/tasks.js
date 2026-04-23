const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const authMiddleware = require('../middleware/auth')
const { client, cache } = require('../middleware/cache')
const { encrypt, decrypt } = require('../utils/encrypt')

router.get('/', authMiddleware, cache, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
    const decrypted = tasks.map(t => ({
      ...t._doc,
      title: decrypt(t.title)
    }))
    res.json(decrypted)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      title: encrypt(req.body.title),
      user: req.user.id
    })
    const savedTask = await task.save()
    await client.del(`tasks:${req.user.id}`)
    res.status(201).json({ ...savedTask._doc, title: req.body.title })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed: req.body.completed },
      { returnDocument: 'after' }
    )
    await client.del(`tasks:${req.user.id}`)
    res.json(task)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    await client.del(`tasks:${req.user.id}`)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router