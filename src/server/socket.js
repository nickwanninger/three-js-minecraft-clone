var socketio = require('socket.io')
var cookie_parser = require('cookie-parser')
const { Mesh, SphereGeometry } = require('three')
const players = []

module.exports = (app, server, store) => {
	const io = socketio(server, {
		cookie: true
	})
	// setInterval(() => {
	// 	io.emit('playerdata', players)
	// }, 30)
	app.set('io', io)
	io.on('connection', socket => {
		players.push({ playerid: socket.id })
		socket.broadcast.emit('playerconnected', socket.id)
		socket.on('disconnect', data => {
			const index = players.findIndex(p => p.platerid == socket.id)
			players.splice(index, 1)
			socket.broadcast.emit('playerdisconnected', socket.id)
		})
		console.log(`Socket ${socket.id} connected`)
		socket.on('playermoved', data => {
			console.dir(data, { colors: true })
			players.forEach(p => {
				if (p.playerid == socket.id) {
					p.position = data.position
					p.rotation = data.rotation
				}
			})
			// socket.broadcast.emit('playermoved', { ...data, id: socket.id })
		})
	})
}
