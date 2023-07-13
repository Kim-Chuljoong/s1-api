const cacheMiddleware = require('../cache.js')
const alarms = require('../controllers/alarm.controller.js')
const workhistories = require('../controllers/workhistory.controller.js')
const spreadsheets = require('../controllers/spreadsheet.controller.js')

const api = require('express').Router()

api.get('/alarm', cacheMiddleware(10), alarms.findAll)
api.get('/alarm/current', cacheMiddleware(10), alarms.find)

api.get('/workhistory', cacheMiddleware(10), workhistories.findAll)
api.get('/workhistory/current', cacheMiddleware(10), workhistories.find)

api.get('/sheets/member', cacheMiddleware(3600), spreadsheets.findMember)
api.get('/sheets/allMember', cacheMiddleware(3600), spreadsheets.findAllMember)
api.get('/sheets/group', cacheMiddleware(3600), spreadsheets.findGroup)
api.get('/sheets/team', cacheMiddleware(3600), spreadsheets.findTeam)
api.get('/sheets/schedule', cacheMiddleware(3600), spreadsheets.findSchedule)
api.get('/sheets/specialSchedule', cacheMiddleware(3600), spreadsheets.findSpecialSchedule)
api.get('/sheets/notification', cacheMiddleware(10), spreadsheets.findNotification)
api.get('/sheets/leave', cacheMiddleware(3600), spreadsheets.findLeave)

module.exports = api
