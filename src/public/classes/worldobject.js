import scene from './scene'
import { Mesh } from 'three'
export default class WorldObject {
	constructor(geometry, material) {
		this.mesh = new Mesh(geometry, material)
		// add the mesh to the scene
		scene.add(this.mesh)
	}
	setPosition = newpos => {
		// Spread the new position into the old position, overwriting anything
		this.mesh.position = { ...this.mesh.position, ...newpos }
	}
}
