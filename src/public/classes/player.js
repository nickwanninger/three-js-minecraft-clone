import camera from './camera'
import Controls from './controls'
import {
	Vector2,
	Vector3,
	Object3D,
	FirstPersonControls,
	Mesh,
	PerspectiveCamera,
	BoxGeometry,
	Geometry,
	MeshPhongMaterial,
	TextureLoader,
	Raycaster,
	BackSide,
	SphereGeometry,
	LineBasicMaterial,
	Line,
	Ray,
	PointLight,
	Box3,
	Euler,
	Quaternion,
	CylinderGeometry
} from 'three'
import AABB from './AABB'
import socket from '../lib/socket'
import scene from './scene'
import PointerLockControls from '../lib/pointerLockControls'
import GameLoop from './gameloop'
import Entity from './entity'
class Player extends Entity {
	constructor() {
		super()
		// all the controls required
		this.controls = new Controls()
		this.controls.on('w', this._moveHandler)
		this.controls.on('a', this._moveHandler)
		this.controls.on('s', this._moveHandler)
		this.controls.on('d', this._moveHandler)
		this.controls.on('ctrl', this._moveHandler)
		this.controls.on('space', this.jump)
		this.mouselistener = window.addEventListener('mousemove', this.mouseMove, true)

		GameLoop.add('playertick', this.tick)
		this.camera = new PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.01, 10000)
		this.mesh.rotation.order = 'YXZ'

		this.mesh.name = 'playerobject'
		this.mesh.add(this.camera)
		this.looking_at = {}
		// Make sure there is a bounding box on the object
		this.height = 1.62
		this.sensitivity = 1
		this.gazeCaster = new Raycaster()
		this.playerHeight = 1.85
		this.playerWidth = 0.925
		this.shiftMul = 1.6
		this.stamina = 100
		this.health = 20
		this.bobtime = 0
	}
	_moveHandler = key => {
		const acceleration = 1
		this.isshift = this.controls.keys.shift
		const speed = this.movespeed * (this.onSurface ? 1 : 0.1)
		if (this.isshift) {
			this.stamina = Math.max(this.stamina - 1, 0)
		}
		const angle = this.mesh.rotation.y

		if (key == 'a') this.moveLeft(speed, angle)
		if (key == 'd') this.moveRight(speed, angle)
		if (key == 'w') this.moveForward(speed, angle)
		if (key == 's') this.moveBack(speed, angle)
		// if (key == 'a') this.velocity.x -= speed / 4
		// if (key == 'd') this.velocity.x += speed / 4
		if (this.onSurface) {
			this.velocity.x = Math.abs(this.velocity.x) > speed ? Math.sign(this.velocity.x) * speed : this.velocity.x
			this.velocity.z = Math.abs(this.velocity.z) > speed ? Math.sign(this.velocity.z) * speed : this.velocity.z
		}

		// this.velocity.y = Math.abs(this.velocity.y) > speed ? Math.sign(this.velocity.y) * speed : this.velocity.y
	}

	jump = () => {
		if (this.onSurface) {
			this.onSurface = false
			this.velocity.y += 0.14
		}
	}
	mouseMove = event => {
		const mouseSpeedConst = 0.002 * this.sensitivity
		// only allow the user to move their mouse if the pointer is not locked
		if (document.pointerLockElement) {
			const { movementX, movementY } = event
			this.mesh.rotateY(-movementX * mouseSpeedConst)
			this.camera.rotateX(-movementY * mouseSpeedConst)
			this.camera.rotation.x = Math.min(Math.max(-1.5, this.camera.rotation.x), 1.5)
		}
	}

	tick = frame => {
		// Update the block you are looking at
		this.updateGaze()
		// Apply the gravity constant to the y velocity
		this.fall()
		// Limit the velocities based on collisions
		this.calculateCollisions()
		// Apply those now velocities
		this.applyVelocity()
		// and update the bounding box
		this.updateBoundingBox()
		// Make sure the camera is at the new height if there is one
		this.camera.position.y = 0.75
	}

	updateGaze() {
		this.gazeCaster.setFromCamera(new Vector2(), this.camera)
		const isLookingAtSomething = this.looking_at && 'object' in this.looking_at
		if (this.blocks) {
			const hits = this.gazeCaster.intersectObjects(this.blocks)
			if (hits.length > 0) {
				const hit = hits[0]
				if (hit.object.type == 'block' && hit.object.block.selectable) {
					if (isLookingAtSomething) {
						if (this.looking_at.object.uuid == hit.object.uuid) {
							return
						}
						this.looking_at.object.uuid
						this.looking_at.object.block.deselect()
					}
					this.looking_at = hit
					this.looking_at.object.block.select()
				}
			} else {
				if (isLookingAtSomething) {
					this.looking_at.object.block.deselect()
					this.looking_at = {}
				}
			}
		}
	}
}

export default new Player()
