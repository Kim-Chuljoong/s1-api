const sql = require('./db.js')

// constructor
const Alarm = function() {}

Alarm.get = (name, no, result) => {
  let query = 'SELECT * FROM T_SECOM_ALARM WHERE DATE(ATime) = CURDATE()'

  if (name) {
    query += ` AND Name = '${name}'`
  }
  if (no) {
    query += ` AND Name = ${no}`
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log('alarms: ', res)
    result(null, res)
  })
}

Alarm.getAll = (start, end, date, name, no, result) => {
  let query = 'SELECT * FROM T_SECOM_ALARM'
  let notUsedWhere = true

  if (date) {
    query += ` WHERE DATE(ATime) = DATE('${date}')`
    notUsedWhere = false
  } else {
    if (start) {
      query += ` WHERE DATE(ATime) >= DATE('${start}')`
      notUsedWhere = false
      if (end) {
        query += ` AND DATE(ATime) <= DATE('${end}')`
      }
    } else if (end) {
      query += ` WHERE DATE(ATime) <= DATE('${end}')`
      notUsedWhere = false
    }
  }

  if (name) {
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} Name = '${name}'`
  }
  if (no) {
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} CardNo = ${no}`
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log('alarms: ', res)
    result(null, res)
  })
}

module.exports = Alarm
