import scene from './scene'
import renderer from './renderer'
import PointerLockControls from '../lib/pointerLockControls'
import { ShaderPass } from 'three'
import SSAOShader from '../shaders/SSAO'
class GameLoop {
	constructor(renderer, scene, camera) {
		this.scene = scene
		this.camera = camera
		// this.cameraControls = new PointerLockControls(this.camera, renderer.domElement)
		// console.log(this.cameraControls.getObject().children[0])
		this.frameEvents = []
		this.frame = 0
	}
	setCamera = cam => (this.camera = cam)
	add = (name, fn) => {
		if (name && fn) {
			this.frameEvents.push({ name, fn })
		} else {
			throw new Error('Both a name and a function need to be passed into the gameloop')
		}
	}
	render = () => {
		requestAnimationFrame(this.render)
		this.frame += 1
		for (var i = 0; i < this.frameEvents.length; i++) {
			this.frameEvents[i].fn(this.frame)
		}
		// this.cameraControls.update(this.frame)
		renderer.render(scene, this.camera)
	}
}
export default new GameLoop(renderer, scene, null)
