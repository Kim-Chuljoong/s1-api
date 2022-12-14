module.exports = app => {
  const alarms = require('../controllers/alarm.controller.js')
  const workhistories = require('../controllers/workhistory.controller.js')

  var router = require('express').Router()

  router.get('/alarm', alarms.findAll)
  router.get('/alarm/current', alarms.find)

  router.get('/workhistory', workhistories.findAll)
  router.get('/workhistory/current', workhistories.find)

  app.use('/api/s1', router)
}
