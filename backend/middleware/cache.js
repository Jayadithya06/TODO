const { createClient } = require('redis')

const client = createClient({
  url: 'redis://default:XPuKFqE0LOsHOe7iQcUoiczjtFwRRXsN@redis-13927.c305.ap-south-1-1.ec2.cloud.redislabs.com:13927'
})

client.connect()
client.on('error', (err) => console.log('Redis error:', err))
client.on('connect', () => console.log('Redis connected'))

const cache = async (req, res, next) => {
  const key = `tasks:${req.user?.id}`
  const cached = await client.get(key)
  if (cached) {
    return res.json(JSON.parse(cached))
  }
  res.sendResponse = res.json
  res.json = async (data) => {
    await client.setEx(key, 60, JSON.stringify(data))
    res.sendResponse(data)
  }
  next()
}

module.exports = { client, cache }