import vertexShader from '../shaders/hemisphere.vert'
import fragmentShader from '../shaders/hemisphere.frag'
import GameLoop from './gameloop'
import Player from './player'
import scene from './scene'
import { Color, SphereGeometry, ShaderMaterial, Mesh, BackSide, HemisphereLight } from 'three'
function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '')
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	}
	lum = lum || 0

	// convert to decimal and change luminosity
	var rgb = '0x',
		c,
		i
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16)
		c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
		rgb += ('00' + c).substr(c.length)
	}

	return parseInt(rgb, 16)
}

const maxHex = 16777215
class Sky {
	constructor() {
		this.topColor = new Color(0x73aaff)
		this.bottomColor = new Color(0xb4d2ff)
		this.view_distance = 300
		this.light = new HemisphereLight(0xffffff, 0x555555, 1)
		this.uniforms = {
			topColor: { value: this.topColor },
			bottomColor: { value: this.bottomColor },
			offset: { value: 33 },
			exponent: { value: 0.6 }
		}
		this.skyGeo = new SphereGeometry(this.view_distance, 32, 15)
		this.skyMat = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: this.uniforms,
			side: BackSide
		})
		this.mesh = new Mesh(this.skyGeo, this.skyMat)
		GameLoop.add('skytick', this.tick)
	}
	tick = frame => {
		// move the sky to the player's position so they never walk outside of the mesh
		this.mesh.position.copy(Player.mesh.position)
		// const lum = 0.8 - Math.sin(frame / 400) - 0.8
		// const newTopColor = ColorLuminance('#73aaff', lum)
		// this.changeTopColor(newTopColor)
		// this.changeBottomColor(ColorLuminance('#73aaff', lum + 0.1))
	}
	changeTopColor(hex) {
		this.topColor.setHex(hex)
		this.light.color.setHex(hex)
		this.uniforms.topColor.value.setHex(hex)
	}
	changeBottomColor(hex) {
		this.bottomColor.setHex(hex)
		this.light.groundColor.setHex(hex)
		this.uniforms.bottomColor.value.setHex(hex)
	}
	getObject() {
		return this.mesh
	}
	getLight() {
		return this.light
	}
}

export default Sky
