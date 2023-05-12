const dateTimeFormat = function(target) {
  const regex = new RegExp(/(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/)

  return target && target.replace(regex, '$1-$2-$3 $4:$5:$6').replace(/(:[^\d]|:$)/g, '').trim()
}
const minutesFormat = function(minutes) {
  const hours = Math.floor(minutes / 60)
  const hoursString = hours.toString().padStart(2, '0')
  const minutesString = (minutes % 60).toString().padStart(2, '0')

  return `${hoursString}:${minutesString}`
}
const getElapsedTime = function(start, end) {
  const startTime = new Date(dateTimeFormat(start)).getTime()
  const endTime = new Date(dateTimeFormat(end)).getTime()

  return minutesFormat((endTime - startTime) / 1000 / 60)
}

exports.dateTimeFormat = dateTimeFormat
exports.minutesFormat = minutesFormat
exports.getElapsedTime = getElapsedTime