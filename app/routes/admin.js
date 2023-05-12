const admin = require('express').Router()
const path = require('path')

admin.get('/history', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../public/pages/history') })
})

admin.get('/workhistory', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../../public/pages/history') })
})

module.exports = admin