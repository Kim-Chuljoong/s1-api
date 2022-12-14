const Workhistory = require('../models/workhistory.model.js')

exports.find = (req, res) => {
  const name = req.query.name
  const no = req.query.no

  Workhistory.get(name, no, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving workhistories.'
      })
    else res.send(data)
  })
}

exports.findAll = (req, res) => {
  const start = req.query.start
  const end = req.query.end
  const date = req.query.date
  const name = req.query.name
  const no = req.query.no

  Workhistory.getAll(start, end, date, name, no, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving workhistories.'
      })
    else res.send(data)
  })
}