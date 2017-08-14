import {
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	HemisphereLight,
	AmbientLight,
	DirectionalLight,
	MeshPhongMaterial,
	TextureLoader,
	NearestFilter,
	LinearMipMapLinearFilter,
	Fog,
	Color,
	SphereGeometry,
	ShaderMaterial,
	BackSide,
	AxisHelper
} from 'three'

import renderer from './classes/renderer'
import scene from './classes/scene'
import GameLoop from './classes/gameloop'
import WorldObject from './classes/worldobject'
import Block from './classes/block'

import StoneBlock from './classes/blocks/stone'
import GrassBlock from './classes/blocks/grass'
import Torch from './classes/blocks/torch'
import NullBlock from './classes/blocks/null'
import CobbleStone from './classes/blocks/cobblestone'
import Player from './classes/player'

GameLoop.setCamera(Player.camera)
GameLoop.render()

window.THREE = require('three')
window.scene = scene

// camera.position.z = 0
const blocks = []

const indev = require('indev')
const generator = indev({ seed: 'lol' })
const simplexGenerator = generator.simplex({
	min: 0,
	max: 12,
	frequency: 0.01,
	octaves: 8
})
const worldSize = 70
const feature_size = 12
import Perlin from './lib/perlin'
const pn = new Perlin('WOOT')
for (var x = 0; x < worldSize; x++) {
	for (var z = 0; z < worldSize; z++) {
		const y = simplexGenerator.in2D(x, z)
		blocks.push(new GrassBlock(x, y, z))
	}
}
for (var b = 0; b < blocks.length; b++) {
	blocks[b].addToScene(scene)
}

const topColor = 0x73aaff
const bottomColor = 0xb4d2ff
// const bottomColor = 0x00ff00
const view_distance = 40

// const ambientLight = new AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

import Sky from './classes/sky'
const sky = new Sky()
scene.add(sky.getObject())
scene.add(sky.getLight())

// var directionalLight = new DirectionalLight(0xffffff, 1)
// directionalLight.position.set(1, 1, 0.5).normalize()
// directionalLight.castShadow = false
// scene.add(directionalLight)

scene.add(Player.mesh)
Player.setPos(worldSize / 2, 30, worldSize / 2)
scene.fog = new Fog(0xffffff, view_distance / 2, view_distance)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
	const width = window.innerWidth
	const height = window.innerHeight
	Player.camera.aspect = width / height
	Player.camera.updateProjectionMatrix()
	renderer.setSize(width, height)
}
