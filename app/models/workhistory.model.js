const sql = require('./db.js')
const date = require('../modules/date.js')

// constructor
const Workhistory = function() {}
const processData = function(data) {
  const result = data.reduce((acc, cur) => {
    if (!acc.find(item => item.WorkDate === cur.WorkDate && item.Sabun === cur.Sabun) && cur.Sabun) {
      acc.push(cur)
    }
    return acc;
  }, [])

  return result.map(row => {
    row.WorkDate = date.dateTimeFormat(row.WorkDate)
    row.WSTime = date.dateTimeFormat(row.WSTime)
    row.WCTime = date.dateTimeFormat(row.WCTime)
    row.InsertTime = date.dateTimeFormat(row.InsertTime)
    row.UpdateTime = date.dateTimeFormat(row.UpdateTime)
    row.NormalWorkTime = date.minutesFormat(row.NormalWorkTime)
    if (row.WSTime && row.WCTime) {
      row.TotalWorkTime = date.getElapsedTime(row.WSTime, row.WCTime)
      row.NormalWorkTime = row.NormalWorkTime >= '09:00' ? '09:00' : row.TotalWorkTime
    } else {
      row.TotalWorkTime = date.minutesFormat(0)
    }

    const workDateYear = row.WorkDate.replace(/(\d{4}).+/, '$1')

    row.bPWC = 0
    row.bLate = 0
    row.PWTime = date.minutesFormat(0)
    row.LateTime = date.minutesFormat(0)
    row.OWTime = date.minutesFormat(0)
    row.NWTime = date.minutesFormat(0)

    if (row.WSTime) {
      const wsTime = row.WSTime
      const targetDate = row.WorkDate.replace(/(\d{4})(\d{2})(\d{2}).+/, '$1-$2-$3')
      const lateTime = targetDate + ` ${workDateYear < '2023' ? '11:00:00' : '10:30:00'}`
      const earlyTime = targetDate + ` ${workDateYear < '2023' ? '09:00:00' : '08:30:00'}`
      if (wsTime > lateTime) {
        row.bPWC = 0
        row.bLate = 1
        row.PWTime = date.minutesFormat(0)
        row.LateTime = date.getElapsedTime(lateTime, wsTime)
      } else if (earlyTime > wsTime) {
        row.bPWC = 1
        row.bLate = 0
        row.PWTime = date.getElapsedTime(wsTime, earlyTime)
        row.LateTime = date.minutesFormat(0)
      }
    }
    if (row.TotalWorkTime > '09:00' && row.WCTime > row.WSTime.replace(/(\d{4})-(\d{2})-(\d{2}).+/, `$1-$2-$3 ${workDateYear < '2023' ? '18:00:00' : '17:30:00'}`)) {
      const totalWork = row.TotalWorkTime.split(':')
      const owHour = totalWork[0] * 1 - 9
      row.OWTime = `${owHour.toString().padStart(2, 0)}:${totalWork[1]}`
    }
    if (row.WSTime && row.WCTime) {
      const wsTime = row.WSTime
      const wcTime = row.WCTime
      const startDay = wsTime.replace(/(\d{4})-(\d{2})-(\d{2}).+/, '$1-$2-$3')
      const startTime = startDay + ' 22:00:00'
      let nextDayObj = new Date(startDay)
      nextDayObj.setDate(nextDayObj.getDate() + 1)
      let endTime = `${nextDayObj.getFullYear()}-${(nextDayObj.getMonth() + 1).toString().padStart(2, 0)}-${nextDayObj.getDate().toString().padStart(2, 0)} 06:00:00`
      
      if (startTime < wcTime) {
        endTime = endTime > wcTime ? wcTime : endTime
        row.NWTime = date.getElapsedTime(startTime, endTime)
      }
    }

    row.WSType = row.bWS ? row.bLate ? '지각' : row.bPWC ? '조기 출근' : '정상 출근' : row.bWC ? '' : '결근'
    row.WCType = row.bWC ? row.NormalWorkTime < '09:00' && row.bWS ? '조기 퇴근' : row.TotalWorkTime > '09:00' && row.WCTime > row.WSTime.replace(/(\d{4})-(\d{2})-(\d{2}).+/, `$1-$2-$3 ${workDateYear < '2023' ? '18:00:00' : '17:30:00'}`) ? '지연 퇴근' : '정상 퇴근' : row.bWS ? '' : '결근'

    return row
  })
}

Workhistory.get = (name, no, group, status, orderBy, result) => {
  let query = 'SELECT * FROM T_SECOM_WORKHISTORY WHERE DATE(WorkDate) = CURDATE()'

  if (name) {
    query += ` AND Name = '${name}'`
  }
  if (no) {
    const noArray = no.split(/\s?,\s?/)
    query += ` AND Sabun IN (${noArray.map((no) => `'${no}'`).join(', ')})`
  }

  if (group) {
    groupQuery = JSON.stringify(group.split(',').map(num => num.length < 3 ? paddedNumber = ('00' + num).slice(-3) : num)).replace(/[\[\]]/g, '')
    query += ` AND Department IN (${groupQuery})`
  }
  
  if (status) {
    let statusQuery = ''
    switch (status) {
      case '0': // 결근
        statusQuery = ' AND bWS = 0'
        break
      case '1': // 정상 출근
        statusQuery = ' AND bWS = 1 AND RIGHT(WSTime, 6) <= 110000'
        break
      case '2': // 지각
        statusQuery = ' AND bWS = 1 AND RIGHT(WSTime, 6) > 110000'
        break
      case '3': // 출근 완료
        statusQuery = ' AND bWS = 1'
        break
      case '4': // 근무중
        statusQuery = ' AND bWS = 1 AND bWC = 0'
        break
      case '5': // 정상 퇴근
        statusQuery = ' AND bWS = 1 AND bWC = 1 AND TotalWorkTime >= 540'
        break
      case '6': // 조퇴
        statusQuery = ' AND bWS = 1 AND bWC = 1 AND TotalWorkTime < 540'
        break
      case '7': // 퇴근 완료
        statusQuery = ' AND bWS = 1 AND bWC = 1'
        break
      default:
        statusQuery = ''
    }
    query += statusQuery
  }

  if (['asc', 'desc'].includes(orderBy)) {
    query += ` ORDER BY WorkDate ${orderBy.toUpperCase()}, UpdateTime ${orderBy.toUpperCase()}`
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
    
    // console.log('workhistories: ', res)
    result(null, res)
  })
}

Workhistory.getAll = (start, end, date, name, no, group, status, orderBy, result) => {
  let query = 'SELECT * FROM T_SECOM_WORKHISTORY'
  let notUsedWhere = true

  if (date) {
    query += ` WHERE DATE(WorkDate) = DATE('${date}')`
    notUsedWhere = false
  } else {
    if (start) {
      query += ` WHERE DATE(WorkDate) >= DATE('${start}')`
      notUsedWhere = false
      if (end) {
        query += ` AND DATE(WorkDate) <= DATE('${end}')`
      }
    } else if (end) {
      query += ` WHERE DATE(WorkDate) <= DATE('${end}')`
      notUsedWhere = false
    }
  }

  if (name) {
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} Name = '${name}'`
    notUsedWhere = false
  }
  if (no) {
    const noArray = no.split(/\s?,\s?/)
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} Sabun IN (${noArray.map((no) => `'${no}'`).join(', ')})`
    notUsedWhere = false
  }

  if (group) {
    groupQuery = JSON.stringify(group.split(',').map(num => num.length < 3 ? paddedNumber = ('00' + num).slice(-3) : num)).replace(/[\[\]]/g, '')
    query += ` ${notUsedWhere ? 'WHERE' : 'AND'} Department IN (${groupQuery})`
    notUsedWhere = false
  }
  
  if (status) {
    let statusQuery = ''
    switch (status) {
      case '0': // 결근
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 0`
        break
      case '1': // 정상 출근
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND RIGHT(WSTime, 6) <= 110000`
        break
      case '2': // 지각
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND RIGHT(WSTime, 6) > 110000`
        break
      case '3': // 출근 완료
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1`
        break
      case '4': // 근무중
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND bWC = 0`
        break
      case '5': // 정상 퇴근
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND bWC = 1 AND TotalWorkTime >= 540`
        break
      case '6': // 조퇴
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND bWC = 1 AND TotalWorkTime < 540`
        break
      case '7': // 퇴근 완료
        statusQuery = ` ${notUsedWhere ? 'WHERE' : 'AND'} bWS = 1 AND bWC = 1`
        break
      default:
        statusQuery = ''
    }
    query += statusQuery
  }

  if (['asc', 'desc'].includes(orderBy)) {
    query += ` ORDER BY WorkDate ${orderBy.toUpperCase()}, UpdateTime ${orderBy.toUpperCase()}`
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
    
    console.log('workhistories: ', res)
    result(null, res)
  })
}

module.exports = Workhistory
