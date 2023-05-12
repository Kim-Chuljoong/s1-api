const express = require('express')
const subdomain = require('express-subdomain')
const cors = require('cors')

const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const api = require('./app/routes/api.js')
const admin = require('./app/routes/admin.js')

app.use(subdomain('api', api))
app.use(subdomain('admin', admin))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
