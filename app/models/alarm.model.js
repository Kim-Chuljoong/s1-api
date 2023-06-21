const sql = require('./db.js')
const date = require('../modules/date.js')

// constructor
const Alarm = function() {}
const processData = function(data) {
  return data.map(row => {
    row.ATime = date.dateTimeFormat(row.ATime)
    row.AckTime = date.dateTimeFormat(row.AckTime)
    row.InsertTime = date.dateTimeFormat(row.InsertTime)
    row.UpdateTime = date.dateTimeFormat(row.UpdateTime)

    return row
  })
}

Alarm.get = (name, orderBy, result) => {
  let query = 'SELECT * FROM T_SECOM_ALARM WHERE DATE(ATime) = CURDATE()'

  if (name) {
    const nameArray = name.split(/\s?,\s?/)
    query += ` AND Name IN (${nameArray.map((name) => `'${name}'`).join(', ')})`
  }

  if (['asc', 'desc'].includes(orderBy)) {
    query += ` ORDER BY ATime ${orderBy.toUpperCase()}`
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    // const rowLength = res.length
    // if (rowLength) {
    //   Object.keys(res[0]).forEach((key) => {
    //     if (res.filter((obj) => !obj[key] && obj[key] !== 0).length === rowLength) {
    //       res.map(obj => delete obj[key])
    //     }
    //   })
    // }

    res = processData(res)

    console.log('alarms: ', res)
    result(null, res)
  })
}

Alarm.getAll = (start, end, date, name, orderBy, result) => {
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
    const nameArray = name.split(/\s?,\s?/)
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} Name IN (${nameArray.map((name) => `'${name}'`).join(', ')})`
    notUsedWhere = false
  }

  if (['asc', 'desc'].includes(orderBy)) {
    query += ` ORDER BY ATime ${orderBy.toUpperCase()}`
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    // const rowLength = res.length
    // if (rowLength) {
    //   Object.keys(res[0]).forEach((key) => {
    //     if (res.filter((obj) => !obj[key] && obj[key] !== 0).length === rowLength) {
    //       res.map(obj => delete obj[key])
    //     }
    //   })
    // }

    res = processData(res)

    // console.log('alarms: ', res)
    result(null, res)
  })
}

module.exports = Alarm
