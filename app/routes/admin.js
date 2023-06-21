const cacheMiddleware = require('../cache.js')
const admin = require('express').Router()
const path = require('path')

admin.get('/history', cacheMiddleware(10), (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../public/pages/history') })
})

admin.get('/workhistory', cacheMiddleware(10), (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../public/pages/history') })
})

module.exports = admin