const sql = require('./db.js')

// constructor
const Workhistory = function() {}

Workhistory.get = (name, no, result) => {
  let query = 'SELECT * FROM T_SECOM_WORKHISTORY WHERE DATE(WorkDate) = CURDATE()'

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

    console.log('workhistories: ', res)
    result(null, res)
  })
}

Workhistory.getAll = (start, end, date, name, no, result) => {
  let query = 'SELECT * FROM T_SECOM_WORKHISTORY'
  let notUsedWhere = true

  if (date) {
    query += ` WHERE DATE(WorkDate) = DATE('${date}')`
    notUsedWhere = false
  } else {
    if (start) {
      query += ` WHERE DATE(WorkDate) >= DATE('${date}')`
      notUsedWhere = false
      if (end) {
        query += ` AND DATE(WorkDate) <= DATE('${date}')`
      }
    } else if (end) {
      query += ` WHERE DATE(WorkDate) <= DATE('${date}')`
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

    console.log('workhistories: ', res)
    result(null, res)
  })
}

module.exports = Workhistory
