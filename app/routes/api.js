const alarms = require('../controllers/alarm.controller.js')
const workhistories = require('../controllers/workhistory.controller.js')
const spreadsheets = require('../controllers/spreadsheet.controller.js')

const api = require('express').Router()

api.get('/alarm', alarms.findAll)
api.get('/alarm/current', alarms.find)

api.get('/workhistory', workhistories.findAll)
api.get('/workhistory/current', workhistories.find)

api.get('/sheets/member', spreadsheets.findMember)
api.get('/sheets/group', spreadsheets.findGroup)
api.get('/sheets/team', spreadsheets.findTeam)
api.get('/sheets/schedule', spreadsheets.findSchedule)
api.get('/sheets/specialSchedule', spreadsheets.findSpecialSchedule)

module.exports = api
