import socket from './socket'

const players = []
const createPlayer = id => {
	const player = new Mesh(new SphereGeometry(1, 50, 50), new MeshPhongMaterial())
	player.playerid = id
	player.name = 'player-' + id
	scene.add(player)
	players.push(player)
	console.log('created player ' + id)
}
socket.on('playerconnected', id => {
	createPlayer(id)
})
socket.on('playerdisconnected', id => {
	const player = players.findIndex(p => p.playerid == id)
	scene.remove(player)
	players.splice(players.findIndex(p => p.playerid == id), 1)
	console.log('Player Disconnected', id)
})

socket.on('playerdata', payload => {
	const remotePlayers = payload //.filter(p => p.playerid !== socket.id)
	remotePlayers.forEach(remotePlayer => {
		remotePlayer.found = false
		players.forEach(player => {
			if (player.playerid == remotePlayer.playerid) {
				remotePlayer.found = true
				if (remotePlayer.position) {
					const { x, y, z } = remotePlayer.position
					player.position.set(x, y, z)
				}
				// if (remotePlayer.rotation) {
				// 	const { x, y, z } = remotePlayer.rotation
				// 	player.rotation.set(x, y, z)
				// }
			}
		})
		// if the remote player isn't in the world
		if (!remotePlayer.found) {
			createPlayer(remotePlayer.playerid)
		}
	})
})
