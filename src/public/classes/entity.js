import { Vector3, BoxGeometry, Mesh, MeshPhongMaterial, Euler, Line, Geometry, LineBasicMaterial, Vector } from 'three'
import AABB from './AABB'
import scene from './scene'
class Entity {
	constructor(props) {
		// build out a basic player-sized mesh
		this.geometry = new BoxGeometry(0.5, 1.62, 0.5)
		this.mesh = new Mesh(this.geometry, new MeshPhongMaterial({ opacity: 0 }))
		// The velocity of the entity
		this.velocity = new Vector3()
		// Maximum per-tick/frame move speed
		this.movespeed = 0.07195
		// How many blocks of acceleration are applied every frame
		this.gravity_accel = 0.008
		this.boundingbox = new AABB(this.mesh)
		this.onSurface = false
	}
	applyVelocity(v = this.velocity) {
		const damping = 0.8
		if (!this.isshift && this.stamina < 100) this.stamina = Math.min(this.stamina + 0.25, 100)
		const a = this.velocity.x ** 2
		const b = this.velocity.z ** 2
		const totalVelocity = Math.sqrt(a + b)
		const clampRatio = Math.min(this.movespeed * (this.isshift ? this.shiftMul : 1) / totalVelocity, 100)
		const clampingMul = 1 / Math.max(1 / clampRatio, 1)

		this.mesh.translateX(this.velocity.x * clampingMul)
		this.mesh.translateZ(this.velocity.z * clampingMul)
		this.mesh.translateY(this.velocity.y)

		// Slow down the player
		if (this.onSurface) {
			this.velocity.x *= damping
			this.velocity.z *= damping
		}
	}
	fall(g = this.gravity_accel) {
		this.velocity.y -= g
	}
	/**
   * collide
   *    Returns all the blocks the entity is colliding with 
   * @param {*} collisions: 
   */
	calculateCollisions(bb = this.boundingbox) {
		this.blocks = scene.children.filter(b => {
			return b.type == 'block'
		})
		const directions = Object.keys(this.velocity)
		const global_velocity = this.velocity.clone().applyAxisAngle(new Vector3(0, 1, 0), this.mesh.rotation.y)
		const rotation = new Euler()
		rotation.setFromQuaternion(this.mesh.quaternion)
		// console.log(this.mesh.quaternion)
		const angle = Math.atan(rotation.x / rotation.z)
		const degrees = angle * 180 / Math.PI
		directions.forEach(dir => {
			const vect = new Vector3()
			vect[dir] = global_velocity[dir]
			const nextBoundingBox = new AABB(this.mesh)
			nextBoundingBox.move(vect.x, vect.y, vect.z)
			const blockIntersects = this.getCollisions(nextBoundingBox, this.blocks)
			blockIntersects.forEach(b => {
				if (b.collision) {
					global_velocity[dir] = 0
					if (dir == 'y') this.onSurface = true
				}
			})
		})
		this.velocity.copy(global_velocity.clone().applyAxisAngle(new Vector3(0, 1, 0), -this.mesh.rotation.y))
	}
	// returns an array of collisions with the bouning box (bb) and the blocks (colliders)
	getCollisions(bb = this.boundingbox, colliders = this.blocks) {
		const c = []
		colliders.forEach(collider => {
			const other = collider.block.boundingbox
			if (bb.intersects(other)) {
				c.push(collider.block)
			}
		})
		return c
	}

	updateBoundingBox() {
		this.boundingbox.update()
	}
	setPos = (x, y, z) => this.mesh.position.set(x, y, z)
	moveForward(speed, angle) {
		this.velocity.z -= speed / 4
	}
	moveBack(speed, angle) {
		this.velocity.z += speed / 4
	}
	moveLeft(speed, angle) {
		this.velocity.x -= speed / 4
	}
	moveRight(speed, angle) {
		this.velocity.x += speed / 4
	}
}
export default Entity
