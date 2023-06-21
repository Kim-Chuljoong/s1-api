const Alarm = require('../models/alarm.model.js')

exports.find = (req, res) => {
  const name = req.query.name
  const orderBy = req.query.orderBy

  Alarm.get(name, orderBy, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving alarms.'
      })
    else res.send(data)
  })
}

exports.findAll = (req, res) => {
  const start = req.query.start
  const end = req.query.end
  const date = req.query.date
  const name = req.query.name
  const orderBy = req.query.orderBy

  Alarm.getAll(start, end, date, name, orderBy, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving alarms.'
      })
    else res.send(data)
  })
}
