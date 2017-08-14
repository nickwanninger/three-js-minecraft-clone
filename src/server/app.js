const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const env = process.env.NODE_ENV || 'development'
app.use(require('cookie-parser')())

// app.use(morgan('short'))

// The app runs on the server provided port or port 3000
const PORT = process.env.PORT || 3000
app.port = PORT

app.enable('trust proxy')

app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(bodyParser.json())
app.use(compression())

app.use(express.static(path.join(__dirname, '../public/www/')))

app.get('*', require('./renderer'))

const server = app.listen(app.port, err => {
	console.log('Server Started')
})

require('./socket')(app, server)
// console.log(app.get('io'))

module.exports = app
const io = require('socket.io')
