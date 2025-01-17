const Spreadsheet = require('../models/spreadsheet.model.js')
const spreadsheetId = '18CzDe2DJ-ojhd_gvT-NwhYMvtIdk40Bdq81kHgX50T8'

exports.findMember = (req, res) => {
  const range = '구성원'
  const find = req.query.find

  Spreadsheet.get(spreadsheetId, range, 'member', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findAllMember = (req, res) => {
  const range = '구성원'

  Spreadsheet.get(spreadsheetId, range, 'allMember', null, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findGroup = (req, res) => {
  const range = '구성원'
  const find = req.query.find

  Spreadsheet.get(spreadsheetId, range, 'group', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findTeam = (req, res) => {
  const range = '구성원'
  const find = req.query.find

  Spreadsheet.get(spreadsheetId, range, 'team', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findSchedule = (req, res) => {
  const range = '일정!A1:F32'
  const find = req.query.find

  Spreadsheet.get(spreadsheetId, range, 'schedule', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findSpecialSchedule = (req, res) => {
  const range = '특수 일정'
  const find = req.query.find

  Spreadsheet.get(spreadsheetId, range, 'specialSchedule', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findNotification = (req, res) => {
  const range = '알림'

  Spreadsheet.get(spreadsheetId, range, 'notification', null, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}

exports.findLeave = (req, res) => {
  const range = `${new Date().getFullYear()}년 통계`
  const find = req.query.find

  Spreadsheet.get('19NTWiBbEZIuX0-6ooyZ3WySuC-PfH95QlWs7fZzaiBk', range, 'leave', find, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving spreadsheets.'
      })
    else res.send(data)
  })
}