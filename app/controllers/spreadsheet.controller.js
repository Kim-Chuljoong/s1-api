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
