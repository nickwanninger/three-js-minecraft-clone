import WorldObject from './worldobject'
import {
	BoxGeometry,
	TextureLoader,
	MeshPhongMaterial,
	NearestFilter,
	LinearMipMapLinearFilter,
	Mesh,
	Geometry,
	Face3,
	Box3,
	Vector3,
	EdgesGeometry,
	LineBasicMaterial,
	LineSegments
} from 'three'
import AABB from './AABB'
import scene from './scene'
const basic_block_geometry = new BoxGeometry(1, 1, 1)
const defaultOpts = {
	texture: '/assets/textures/blocks/null.png',
	x: 0,
	y: 0,
	z: 0
}

const block_geometry = new Geometry()
export default class Block {
	constructor(opts = defaultOpts) {
		this.texLoader = new TextureLoader()
		this.texture = this.texLoader.load(opts.texture)
		this.texture.magFilter = NearestFilter
		// this.texture.minFilter = LinearMipMapLinearFilter
		this.material = new MeshPhongMaterial({ map: this.texture, specular: 0, shininess: 0 })
		this.name = 'null'
		this.collision = true
		this.selectable = true
		// this.mesh = new Mesh(basic_block_geometry, this.material)
		this.mesh = new Mesh(basic_block_geometry, this.material)
		this.mesh.block = this
		this.mesh.doubleSided = false
		this.mesh.position.x = Math.round(opts.x)
		this.mesh.position.y = Math.round(opts.y)
		this.mesh.position.z = Math.round(opts.z)
		this.mesh.mass = 0
		this.mesh.geometry.faces[0].materialIndex = 0
		this.mesh.type = 'block'
		this.boundingbox = new AABB(this.mesh)
		this.selected = false
		const frameScale = 1.01
		this.wireframe = new LineSegments(
			new EdgesGeometry(basic_block_geometry.clone().scale(frameScale, frameScale, frameScale)),
			new LineBasicMaterial({ color: 0x333333, linewidth: 2 })
		)
		this.wireframe.visible = false
		this.mesh.add(this.wireframe)
		console.log(this.mesh.geometry)
	}
	select() {
		this.wireframe.visible = true
		this.selected = true
	}
	deselect() {
		this.wireframe.visible = false
		this.selected = false
	}
	addToScene(scene) {
		scene.add(this.mesh)
	}

	updateOutline(frameScale = 1.01) {
		this.wireframe.geometry = new EdgesGeometry(
			this.mesh.geometry.clone().scale(frameScale, frameScale, frameScale)
		)
	}
	setPosition = newpos => {
		// Spread the new position into the old position, overwriting anything
		this.mesh.position = {
			...this.mesh.position,
			...newpos
		}
	}
}
