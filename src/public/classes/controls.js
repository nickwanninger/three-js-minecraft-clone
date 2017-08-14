import GameLoop from './gameloop'
import keycode from 'keycode'
export default class Controls {
	constructor() {
		this.watchers = []
		this.presswatchers = []
		this.keys = {}
		document.addEventListener('keydown', e => {
			this.keys[keycode(e)] = true
			this.presswatchers.forEach(event => {
				if (this.keys[event.name]) {
					event.cb(event.name)
				}
			})
		})
		document.addEventListener('keyup', e => {
			this.keys[keycode(e)] = false
		})
		GameLoop.add('controlwatcher', this.tick)
	}
	onPress = (name, cb) => {
		this.presswatchers.push({
			name: name.toLowerCase(),
			cb
		})
	}
	on = (name, cb) => {
		this.watchers.push({
			name: name.toLowerCase(),
			cb
		})
	}
	off = name => {
		this.watchers.splice(this.watchers.findIndex(e => e.name == name), 1)
	}
	tick = frame => {
		this.watchers.forEach(event => {
			if (this.keys[event.name]) {
				event.cb(event.name)
			}
		})
	}
}
