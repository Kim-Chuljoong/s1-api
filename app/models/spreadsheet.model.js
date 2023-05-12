const { google } = require('googleapis')
const sheetsConfig = require('../config/sheets.config.js')
const date = require('../modules/date.js')

// constructor
const authorize = new google.auth.JWT(sheetsConfig.client_email, null, sheetsConfig.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
])
const googleSheet = google.sheets({
  version: 'v4',
  auth: authorize,
})
const Spreadsheet = function() {}

Spreadsheet.get = async (spreadsheetId, range, type, find, result) => {
  if (!spreadsheetId) {
    result(null, 'Invalid request.')
    return
  } else if (type === 'member' && (!find || !find.endsWith('@dfy.co.kr'))) {
    result(null, 'Invalid request.')
    return
  } else if(type === 'group' && (!find || !/^\d{3}$/.test(find))) {
    result(null, 'Invalid request.')
    return
  }

  const context = await googleSheet.spreadsheets.values.get({
    spreadsheetId,
    range
  })

  const keys = context.data.values[0];
  const values = [];
  for (let i = 1; i < context.data.values.length; i++) {
    const obj = {};
    for (let j = 0; j < keys.length; j++) {
      obj[keys[j]] = context.data.values[i][j];
    }
    values.push(obj);
  }

  if (type === 'member') {
    result(null, values.filter((item) => item['이메일'] === find)[0] || {})
  } else if(type === 'group') {
    result(null, values.filter((item) => item['팀'] === find) || [])
  } else if(type === 'schedule') {
    result(null, values)
  } else {
    result(null, 'Invalid request.')
  }
}

module.exports = Spreadsheet
