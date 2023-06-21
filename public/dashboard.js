const settings = {
  dicLabel: {
    'WorkDate': '근무일자',
    'Department': '조직',
    'Name': '이름',
    'CardNo': '카드번호',
    'Sabun': '사원번호',
    'WorkGroupName': '근무조',
    'ScheduleName': '근무스케쥴',
    'WSType': '출근 판정',
    'WCType': '퇴근 판정',
    'bWS': '출근 여부',
    'bWC': '퇴근 여부',
    'WSTime': '출근 시간',
    'WCTime': '퇴근 시간',
    // 'PWType': '',
    'PWTime': '조기 출근 시간',
    'OWTime': '연장 근무 시간',
    'NWTime': '야간 근무 시간',
    'TotalWorkTime': '총 근무 시간',
    'NormalWorkTime': '정상 근무 시간',
    // 'HWTime': '',
    'bLate': '지각 여부',
    'bPWC': '조기 출근 여부',
    // 'bAbsent': '',
    'LateTime': '지각 시간',
    // 'ModifyUser': '',
    // 'InsertTime': '',
    // 'UpdateTime': '',
    // 'Version': '',
    'ATime': '발생시각',
    // 'ID': '',
    // 'EqCode': '',
    'Master': '위치',
    // 'Param': '',
    // 'Ack': '',
    'AckTime': '응답시각',
    // 'Transfer': '',
    // 'AckMode': '',
    // 'State': '',
    'Flag1': '이벤트 구분',
    // 'Flag2': '',
    // 'Flag3': '',
    'Flag4': '인증 방식',
  },
  dicValue: {
    'Department': {
      '001': '익시',
      '002': '브렉스',
      '003': '일공이사',
      '004': '히워즈본',
      '005': 'UX실',
      '006': 'UI실',
      '007': '개발실',
      '008': 'GM',
      '009': 'DFX',
      '010': '3D',
      '011': '사업전략실',
      '012': 'DFZ',
      default: '디파이',
    },
    'Master': {
      '1': '옥상',
      '2': '4층사무실',
      '3': '4층회의실?',
      '4': '3층사무실',
      '5': '2층사무실',
      '6': '1층현관',
      '7': '지하1층현관',
      '8': '지하2층사무실',
      '9': '???',
      '10': '매틴_3층정문',
    },
    'Flag1': {
      '0': '단순출입',
      '1': '출근',
      '2': '외출',
      '3': '복귀',
      '4': '퇴근',
    },
    'Flag4': {
      '1': '지문',
      '2': '카드',
    }
  },
  goalTarget: 'WSType',
  goalKeyword: ['조기 출근', '정상 출근', '지각'],
  columns: ['WorkDate', 'Name', 'Sabun', 'Department', 'ScheduleName', 'WSTime', 'WCTime', 'WSType', 'WCType', 'PWTime', 'LateTime', 'NormalWorkTime', 'OWTime', 'NWTime', 'TotalWorkTime'],
  sortBy: {},
  groupBy: '',
  foldedGroup: [],
  hide: [],
  filter: {},
  filterOperator: 'and'
}
let data = []
let sortBy = { no: 'ASC' }
let groupBy = ''
let filterTimeout
let isGrab = false
let grabTarget = null
let grabPosition = null

const exportButton = document.querySelector('button#export')
const wrapperEl = document.querySelector('.table-wrapper')
const tableEl = document.querySelector('table')
const tableHeader = document.querySelector('table thead')
const tableBody = document.querySelector('table tbody')
const filterContainer = document.querySelector('.table-wrapper > .filter')

const resetView = () => {
  document.querySelector('style#hiddenData') && document.querySelector('style#hiddenData').remove()
  document.querySelector('style#foldedData') && document.querySelector('style#foldedData').remove()
  document.querySelector('.table-wrapper').classList.add('loading')
  document.querySelector('.table-wrapper > .filter .inactive').click()
  Object.assign(settings, { sortBy: {}, groupBy: '', foldedGroup: [], hide: [], filter: {}, filterOperator: 'and' })
  sortBy = { no: 'ASC' }
  groupBy = ''
  filterTimeout
  isGrab = false
  grabTarget = null
  grabPosition = null
  tableHeader.innerHTML = ''
  tableBody.innerHTML = ''
}

const today = new Date()
const _today = new Date(today.setHours(today.getHours() + 9)).toISOString()
const _todayDate = _today.replace(/(\d{4}-\d{2}-\d{2}).+/, '$1')
const currentDate = {
  start: _todayDate,
  end: _todayDate
}
document.querySelector('#datepicker').value = `${_todayDate} ~ ${_todayDate}`
document.querySelector('.info dt .dummy').textContent = document.querySelector('#datepicker').value
document.querySelector('.info dt').style.setProperty('--date-width', document.querySelector('.info dt .dummy').offsetWidth + 'px')
const picker = new easepick.create({
  element: '#datepicker',
  css: [
    'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
    '/datepicker.css'
  ],
  zIndex: 10,
  firstDay: 0,
  lang: "ko-KR",
  autoApply: false,
  locale: {
    cancel: '취소',
    apply: '조회',
    previousMonth: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path></svg>',
    nextMonth: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path></svg>'
  },
  RangePlugin: {
    delimiter: " ~ ",
    tooltip: false
  },
  LockPlugin: {
    minDate: '2022-12-01T00:00:00.000Z',
    maxDate: _today
  },
  plugins: [
    'RangePlugin',
    'LockPlugin'
  ],
  setup(picker) {
    picker.on('select', (e) => {
      const { start, end } = e.detail;
      const startDate = new Date(start.setHours(start.getHours() + 9)).toISOString().replace(/(\d{4}-\d{2}-\d{2}).+/, '$1')
      const endDate = new Date(end.setHours(end.getHours() + 9)).toISOString().replace(/(\d{4}-\d{2}-\d{2}).+/, '$1')
      if (currentDate.start === startDate && currentDate.end === endDate) {
        return false
      }
      document.querySelector('.info dt .dummy').textContent = document.querySelector('#datepicker').value
      document.querySelector('.info dt').style.setProperty('--date-width', document.querySelector('.info dt .dummy').offsetWidth + 'px')
      currentDate.start = startDate
      currentDate.end = endDate
      resetView()
      fetch(`https://api.dfy.works/workhistory/?start=${startDate}&end=${endDate}`)
        .then(res => res.json())
        .then(json => {
          data = json
          generateTable(data)
        })
    });
  }
})

exportButton.addEventListener('click', () => {
  const _table = document.createElement('table')
  _table.innerHTML = tableEl.innerHTML
  _table.querySelectorAll('thead th .option-box > div, tr.hidden').forEach(el => {
    el.remove()
  })
  settings.hide.forEach(key => {
    _table.querySelectorAll(`[data-field="${key}"]`).forEach(el => {
      el.remove()
    })
  })
  settings.foldedGroup.forEach(key => {
    _table.querySelectorAll(`[data-group-by="${key}"]`).forEach(el => {
      el.remove()
    })
  })
  TableToExcel.convert(_table, {
    name: `${currentDate.start}_${currentDate.end}.xlsx`,
    sheet: {
      name: 'Sheet1'
    }
  })
  _table.remove()
})

const getColumnSize = () => {
  const targetEL = document.querySelector('th.no')
  if (targetEL) {
    tableEl.style.setProperty(`--no-width`, `${targetEL.offsetLeft + targetEL.offsetWidth}px`)
  }
  filterContainer.style.setProperty(`--table-width`, `${tableEl.offsetWidth}px`)
}

const updateProgress = () => {
  const goal = data.length
  const done = data.filter(item => (Array.isArray(settings.goalKeyword) ? settings.goalKeyword : [settings.goalKeyword]).includes(item[settings.goalTarget] + '')).length
  document.querySelector('.info dd').innerHTML = `<span class="label">출근률 : </span><b>${Math.round((done / goal) * 100)}%</b> (${done}/${goal})`
}

window.addEventListener('resize', getColumnSize)
document.querySelector('.table-wrapper > .filter .inactive').addEventListener('click', (e) => {
  filterContainer.classList.remove('active')
  filterContainer.querySelectorAll('.filter__item').forEach((el, idx) => {
    el.remove()
  })
  document.querySelectorAll('tbody tr:not(.group-header):not(.group-footer)').forEach(el => {
    delete el.dataset.field
    el.classList.remove('hidden')
  })
  getColumnSize()
  settings.filter = {}
  settings.filterOperator = 'and'
  document.querySelector('.table-wrapper > .filter .operator').setAttribute('aria-checked', true)
})
document.querySelector('.table-wrapper > .filter .operator').addEventListener('click', (e) => {
  const prevAriaCheckedValue = e.currentTarget.getAttribute('aria-checked')
  e.currentTarget.setAttribute('aria-checked', prevAriaCheckedValue === 'true' ? 'false' : 'true')
  settings.filterOperator = prevAriaCheckedValue === 'true' ? 'or' : 'and'
  document.querySelector('.filter__item input').dispatchEvent(new Event('input'))
})
document.addEventListener('mousemove', (e) => {
  if (isGrab) {
    const baseStart = grabTarget.offsetLeft
    const baseEnd = baseStart + grabTarget.offsetWidth
    const th = e.target.closest('th:not(.no')
    const guideLine = document.querySelector('.guide-line')
    if (th && th !== grabTarget && (e.screenX + wrapperEl.scrollLeft < baseStart - 20 || e.screenX + wrapperEl.scrollLeft > baseEnd + 20)) {
      const half = th.offsetWidth * 0.5
      grabPosition = e.screenX + wrapperEl.scrollLeft <= th.offsetLeft + half ? 'before' : 'after'
      guideLine.style.left = (e.screenX + wrapperEl.scrollLeft <= th.offsetLeft + half ? th.offsetLeft : th.offsetLeft + th.offsetWidth) - 1 - wrapperEl.scrollLeft + 'px'
    } else {
      grabPosition = null
      guideLine.style.removeProperty('left')
    }
  }
})
document.addEventListener('mouseup', (e) => {
  if (isGrab) {
    const th = e.target.closest('th:not(.no')
    isGrab = false
    document.body.classList.remove('is-grabbing')
    document.querySelector('.guide-line').style.removeProperty('left')
    if (th && grabPosition) {
      const prevColumnsOrder = [...settings.columns]
      const rows = document.querySelectorAll('tr')
      settings.columns.splice(settings.columns.findIndex(i => i === grabTarget.dataset.field), 1)
      settings.columns.splice(settings.columns.findIndex(i => i === th.dataset.field) + (grabPosition === 'before' ? 0 : 1), 0, grabTarget.dataset.field)
      if (JSON.stringify(prevColumnsOrder) !== JSON.stringify(settings.columns)) {
        rows.forEach((row, idx) => {
          const sortedColumns = [...row.querySelectorAll('th, td')].sort((a, b) => {
            const aIndex = a.dataset.field === 'no' ? -1 : settings.columns.findIndex(i => i === a.dataset.field)
            const bIndex = b.dataset.field === 'no' ? -1 : settings.columns.findIndex(i => i === b.dataset.field)
            return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0
          })
          const rowFrag = document.createDocumentFragment()
          sortedColumns.forEach(col => {
            rowFrag.append(col)
          })
          document.querySelectorAll('.table-wrapper tr')[idx].append(rowFrag)
        })
        grabTarget = null
        grabPosition = null
      }
    }
  }
})
document.body.addEventListener('click', (e) => {
  if (e.pointerType && ['mouse', 'touch'].includes(e.pointerType)) {
    closeOption(e.target)
  }
})
document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeOption(document.body)
  }
})

const sortRows = () => {
  if (!Object.keys(sortBy).length) {
    sortBy = { no: 'ASC' }
  }
  const [ target, direction ] = Object.entries(sortBy)[0]
  const group = groupBy
  const frag = document.createDocumentFragment()
  const appendRows = (arr, group) => {
    arr.sort((a, b) => {
      let aValue = a.querySelector(`[data-field="${target}"]`).textContent.trim()
      let bValue = b.querySelector(`[data-field="${target}"]`).textContent.trim()
      const modify = direction === 'DESC' ? -1 : 1
      aValue = isNaN(aValue * 1) ? aValue : ~~aValue
      bValue = isNaN(bValue * 1) ? bValue : ~~bValue
      return !aValue ? -1 * modify : !bValue ? 1 * modify : aValue < bValue ? -1 * modify : aValue > bValue ? 1 * modify : 0
    }).forEach(el => {
      if (group) {
        el.dataset.groupBy = group
      } else if(el.dataset.groupBy) {
        delete el.dataset.groupBy
      }
      frag.append(el)
    })
  }
  document.querySelectorAll('.group-header, .group-footer').forEach(el => {
    el.remove()
  })
  if (group) {
    const groupObject = [...document.querySelectorAll('tbody tr:not(.hidden)')].reduce((acc, cur) => {
      const field = cur.querySelector(`[data-field="${group}"]`)
      const fieldValue = (field.querySelector('span') || field).textContent.trim()
      acc[fieldValue] = [ ...(acc[fieldValue] || []), cur]
      return acc
    }, {})
    let fields = Object.keys(groupObject).sort()
    if (target === group && direction === 'DESC') {
      fields.reverse()
    }
    fields.forEach(key => {
      const groupHeader = document.createElement('tr')
      const groupFooter = document.createElement('tr')
      groupHeader.className = 'group-header'
      groupHeader.dataset.field = key
      groupHeader.dataset.exclude = 'true'
      groupFooter.className = 'group-footer'
      groupFooter.dataset.field = key
      groupFooter.dataset.exclude = 'true'
      groupHeader.innerHTML = `
        <td colspan="99">
          <button>
            <span class="icon">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
              </svg>
            </span>
          </button>
          <p>
        </td>
      `
      groupHeader.querySelector('button').addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('fold')
        let foldedGroupStyle = document.querySelector('style#foldedData')
        if (!foldedGroupStyle) {
          foldedGroupStyle = document.createElement('style')
          foldedGroupStyle.id = 'foldedData'
          foldedGroupStyle.textContent = `\n[data-group-by="${key}"], .group-footer[data-field="${key}"] { display: none; }\n`
          settings.foldedGroup = [ key ]
        } else {
          if (!e.currentTarget.classList.contains('fold')) {
            foldedGroupStyle.textContent = foldedGroupStyle.textContent.replace(`[data-group-by="${key}"], .group-footer[data-field="${key}"] { display: none; }\n`, '')
            settings.foldedGroup = settings.foldedGroup.filter(item => item !== key)
          } else {
            foldedGroupStyle.textContent += `[data-group-by="${key}"], .group-footer[data-field="${key}"] { display: none; }\n`
            settings.foldedGroup = [ ...settings.foldedGroup, key ]
          }
        }
        document.body.append(foldedGroupStyle)
      })
      frag.append(groupHeader)
      appendRows(groupObject[key], key)
      const goal = groupObject[key].length
      const done = groupObject[key].filter(item => {
        const value = item.querySelector(`[data-field="${settings.goalTarget}"]`).textContent.trim()
        if ((Array.isArray(settings.goalKeyword) ? settings.goalKeyword : [settings.goalKeyword]).includes(value)) {
          return item
        }
      }).length
      groupFooter.innerHTML = `
        <td colspan="99">
          <span class="icon">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path>
            </svg>
          </span>
          <p>출근률 : <b>${Math.round((done / goal) * 100)}%</b> (${done}/${goal})</p>
        </td>
      `
      frag.append(groupFooter)
    })
  } else {
    appendRows([...document.querySelectorAll('tbody tr')])
  }

  document.querySelector('tbody').append(frag)
}
const thActions = (target, type, force) => {
  const optionBox = target.closest('.option-box')
  const input = target.querySelector('input')
  const fieldName = target.closest('th').dataset.field
  const fieldTitle = target.closest('th').title
  const eventType = type || input.dataset.event
  const _settings = {}
  if (eventType === 'sortBy') {
    const prevColumn = document.querySelector('th .option-box[data-sort-by]')
    const prevSortBy = prevColumn && prevColumn.dataset.sortBy
    prevColumn && delete prevColumn.dataset.sortBy
    settings.sortBy = sortBy = {}
    sortRows()
    if (prevColumn !== optionBox || prevSortBy !== input.value || force) {
      delete optionBox.dataset.sortBy
      settings.sortBy = sortBy = { [fieldName]: input.value }
      sortRows()
      optionBox.dataset.sortBy = input.value
    }
  } else if (eventType === 'filter' && !document.querySelector(`.filter__item[data-field="${fieldName}"]`)) {
    const hash = 'filter-' + (Math.random() + 1).toString(36).substring(7)
    const filterItem = document.createElement('div')
    const filterKeyword = document.createElement('span')
    const filterInput = document.createElement('input')
    const filterClear = document.createElement('button')

    filterKeyword.classList.add('keyword')

    filterItem.dataset.field = fieldName
    filterItem.classList.add('filter__item')
    filterItem.innerHTML = `
      <label for="${hash}">${fieldTitle}: </label>
    `
    filterInput.id = hash
    filterInput.placeholder = 'Filter by keyword'
    filterInput.spellcheck = false
    filterInput.addEventListener('input', (e) => {
      filterKeyword.textContent = filterInput.value || filterInput.placeholder
      filterInput.style.width = filterKeyword.offsetWidth + 'px'
      if (filterInput.value) {
        filterInput.classList.add('filled')
      } else {
        filterInput.classList.remove('filled')
      }
      Object.assign(settings.filter, { [filterInput.closest('.filter__item').dataset.field]: filterInput.value })
      const filterLength = Object.keys(settings.filter).filter(key => settings.filter[key]).length
      document.querySelectorAll('tbody tr:not(.group-header):not(.group-footer)').forEach(el => {
        delete el.dataset.field
        if (filterLength) {
          el.classList.add('hidden')
        } else {
          el.classList.remove('hidden')
        }
      })
      Object.keys(settings.filter).forEach((key, idx) => {
        const value = settings.filter[key]
        document.querySelectorAll('tbody tr:not(.group-header):not(.group-footer)').forEach(el => {
          const targetEl = el.querySelector(`td[data-field="${key}"]`)
          if (value !== '') {
            if (targetEl && targetEl.textContent.trim().includes(value)) {
              el.dataset.filter = el.dataset.filter && !el.dataset.filter.includes(key) ? el.dataset.filter + `, ${key}` : key
            } else if(el.dataset.filter) {
              const regex = new RegExp(`,?\s?${key}`)
              el.dataset.filter = el.dataset.filter.replace(regex, '')
            }
          } else if (el.dataset.filter && el.dataset.filter.includes(key)) {
            const regex = new RegExp(`,?\s?${key}`)
            el.dataset.filter = el.dataset.filter.replace(regex, '')
          }
        })
      })
      document.querySelectorAll('tbody tr[data-filter]').forEach(el => {
        if (settings.filterOperator === 'and') {
          if (el.dataset.filter === Object.keys(settings.filter).filter(key => settings.filter[key]).join(', ')) {
            el.classList.remove('hidden')
          }
        } else if (settings.filterOperator === 'or') {
          if (el.dataset.filter) {
            el.classList.remove('hidden')
          }
        }
      })
      sortRows()
      getColumnSize()
      filterContainer.dataset.filterdCount = [...document.querySelectorAll('tbody tr:not(.hidden):not(.group-header):not(.group-footer)')].filter(el => getComputedStyle(el).display !== 'none').length
    })
    filterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !filterInput.value) {
        e.preventDefault()
        const currentFilterIndex = [...filterContainer.querySelectorAll('.filter__item input')].findIndex(el => el === filterInput)
        filterItem.remove()
        delete settings.filter[fieldName]
        if (!filterContainer.querySelectorAll('.filter__item').length) {
          filterContainer.classList.remove('active')
        } else if (currentFilterIndex > 0) {
          const targetFilter = filterContainer.querySelectorAll('.filter__item input')[currentFilterIndex - 1]
          targetFilter.focus()
          if (targetFilter.offsetLeft < 200) {
            tableEl.scrollTo(0, 0)
          }
        }
      }
    })

    filterClear.classList.add('clear')
    filterClear.innerHTML = `
      <svg aria-hidden="true" role="img" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
      </svg>
    `
    filterClear.addEventListener('click', () => {
      filterInput.value = ''
      filterInput.dispatchEvent(new Event('input'))
      filterInput.focus()
    })
    filterItem.append(filterKeyword)
    filterItem.append(filterInput)
    filterItem.append(filterClear)
    filterContainer.append(filterItem)
    filterContainer.classList.add('active')
    filterContainer.querySelectorAll('input').forEach(input => {
      input.dispatchEvent(new Event('input'))
    })
    filterInput.focus()
    if (filterInput.offsetLeft < 200) {
      tableEl.scrollTo(0, 0)
    }
    closeOption(document.body)
  } else if (eventType === 'filter') {
    if (!filterContainer.classList.contains('active')) {
      filterContainer.classList.add('active')
      filterContainer.querySelectorAll('input').forEach(input => {
        input.dispatchEvent(new Event('input'))
      })
    }
    document.querySelector(`.filter__item[data-field="${fieldName}"] input`).focus()
    closeOption(document.body)
  } else if (eventType === 'groupBy') {
    const prevColumn = document.querySelector('th .option-box.group')
    prevColumn && optionBox !== prevColumn && prevColumn.classList.remove('group')
    if (optionBox.classList.contains('group') && !force) {
      optionBox.classList.remove('group')
      settings.groupBy = groupBy = ''
      sortRows()
    } else {
      optionBox.classList.add('group')
      settings.groupBy = groupBy = fieldName
      sortRows()
    }
    getColumnSize()
  } else if (eventType === 'hide') {
    let hiddenStyle = document.querySelector('style#hiddenData')
    if (!hiddenStyle) {
      hiddenStyle = document.createElement('style')
      hiddenStyle.id = 'hiddenData'
      hiddenStyle.textContent = `\n[data-field="${fieldName}"] { display: none; }\n`
      settings.hide = [ fieldName ]
    } else {
      hiddenStyle.textContent += `[data-field="${fieldName}"] { display: none; }\n`
      settings.hide = [ ...settings.hide, fieldName ]
      if (settings.hide.length > 1) {
        settings.hide = [ ...new Set(settings.hide) ]
      }
    }
    document.body.append(hiddenStyle)
  }
  const li = target.closest('li')
  if (!li.classList.contains('filter') && !li.classList.contains('hide')) {
    document.querySelectorAll('th .option-box button.active, th .option-box li.active').forEach(el => {
      if (el === li || (eventType === 'sortBy' && el.classList.contains('group')) || (eventType === 'groupBy' && (el.classList.contains('asc') || el.classList.contains('desc')))) {
        return false
      }
      el.classList.remove('active')
    })
    li.classList.toggle('active')
  }
}


const closeOption = (target) => {
  const optionBox = target.closest('.option-box')
  const focusedOptionBox = document.querySelector('.option-box.focused')
  const activedOptionButton = document.querySelector('.option-box > button.active')
  if (!optionBox && activedOptionButton) {
    activedOptionButton.classList.remove('active')
    activedOptionButton.closest('.option-box').classList.remove('focused')
  }
  focusedOptionBox && focusedOptionBox.classList.remove('focused')
}

const generateTable = (data) => {
  const columns = []
  const tableEl = document.querySelector('table')
  const tr = document.createElement('tr')
  const th = document.createElement('th')
  th.className = 'no'
  th.dataset.field = 'no'
  th.dataset.exclude = 'true'
  tr.append(th)

  columns.push(...settings.columns)
  columns.forEach(key => {
    const th = document.createElement('th')
    th.dataset.field = key
    th.title = settings.dicLabel[key]
    th.innerHTML = `<div class="option-box">
      <span class="label">${settings.dicLabel[key] || key}</span>
      <span class="sort"></span>
      <span class="group"></span>
      <button class="">
        <span class="icon">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
        </span>
      </button>
      <div>
        <ul>
          <li class="asc">
            <label for="${key}-asc">
              <input type="checkbox" id="${key}-asc" data-event="sortBy"" value="ASC">
              <span>Sort ascending (A...Z)</span>
            </label>
          </li>
          <li class="desc">
            <label for="${key}-desc">
              <input type="checkbox" id="${key}-desc" data-event="sortBy"" value="DESC">
              <span>Sort descending (Z...A)</span>
            </label>
          </li>
          <li class="filter">
            <label for="${key}-filter">
              <input type="checkbox" id="${key}-filter" data-event="filter"">
              <span>Filter by values</span>
            </label>
          </li>
          <li class="group">
            <label for="${key}-group">
              <input type="checkbox" id="${key}-group" data-event="groupBy"">
              <span>Group by values</span>
            </label>
          </li>
          <li class="hide">
            <label for="${key}-hide">
              <input type="checkbox" id="${key}-hide" data-event="hide"">
              <span>Hide field</span>
            </label>
          </li>
        </ul>
      </div>
    </div>`
    tr.append(th)
  })
  tableHeader.append(tr)

  tr.querySelectorAll('.option-box label').forEach(el => {
    el.querySelector('input').addEventListener('focus', () => {
      el.closest('.option-box').classList.add('focused')
    })
    el.addEventListener('mouseenter', () => {
      el.closest('.option-box').classList.add('hoverd')
    })
    el.addEventListener('mouseleave', () => {
      el.closest('.option-box').classList.remove('hoverd')
    })
    el.addEventListener('click', (e) => {
      e.preventDefault()
      thActions(e.currentTarget)
    })
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === 'Space') {
        thActions(e.currentTarget)
      }
    })
  })

  tr.querySelectorAll('.option-box > button').forEach(el => {
    el.addEventListener('click', () => {
      const activedOptionButton = document.querySelector('.option-box > button.active')
      if (activedOptionButton && el !== activedOptionButton) {
        activedOptionButton.classList.remove('active')
      }
      el.closest('.option-box').classList.remove('focused')
      el.classList.toggle('active')
    })
    el.addEventListener('focus', () => {
      const activedOptionButton = document.querySelector('.option-box.hoverd, .option-box.focused')
      if (activedOptionButton) {
        activedOptionButton.classList.remove('hoverd', 'focused')
      }
    })
  })

  data.forEach((row, idx) => {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.className = 'no'
    td.dataset.field = 'no'
    td.dataset.exclude = 'true'
    td.innerHTML = `<span>${idx + 1}</span>`
    tr.append(td)
    settings.columns.forEach(key => {
      const td = document.createElement('td')
      td.dataset.field = key
      td.textContent = settings.dicValue[key]?.[row[key] || 'default'] || row[key]
      tr.append(td)
    })
    tableBody.append(tr)
  })

  getColumnSize()
  updateProgress()

  document.querySelectorAll('th:not(.no)').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      if (!e.target.closest('button')) {
        isGrab = true
        grabTarget = e.currentTarget
        document.body.classList.add('is-grabbing')
      }
    })
  })
  document.querySelector('.table-wrapper').classList.remove('loading')
}

fetch(`https://api.dfy.works/workhistory/current`)
  .then(res => res.json())
  .then(json => {
    data = json
    generateTable(data)
  })
