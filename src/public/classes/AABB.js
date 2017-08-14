import { Box3, Vector3, BoundingBoxHelper } from 'three'
export default class AABB {
	constructor(mesh) {
		if (mesh) {
			this.mesh = mesh
		} else {
			throw new Error('No mesh was provided to the bounding box constructor')
		}
		// setup the bounding box right away
		this.update()
	}
	intersects(other) {
		return this.bb.intersectsBox(other.bb)
	}
	move(x, y, z) {
		this.bb.max.x += x
		this.bb.max.y += y
		this.bb.max.z += z
		this.bb.min.x += x
		this.bb.min.y += y
		this.bb.min.z += z
	}
	update(mesh = this.mesh) {
		const { parameters: s } = mesh.geometry

		let min = {
			x: mesh.position.x - s.width / 2,
			y: mesh.position.y - s.height / 2,
			z: mesh.position.z - s.depth / 2
		}
		min = new Vector3(min.x, min.y, min.z)
		let max = {
			x: mesh.position.x + s.width / 2,
			y: mesh.position.y + s.height / 2,
			z: mesh.position.z + s.depth / 2
		}
		max = new Vector3(max.x, max.y, max.z)
		this.bb = new Box3(min, max)
	}
}
