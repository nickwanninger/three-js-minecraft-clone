import Block from '../block'
import { BoxGeometry, TextureLoader, MeshPhongMaterial, NearestFilter } from 'three'
const loader = new TextureLoader()
// side of grass texture
const side_texture = loader.load('/assets/textures/blocks/torch.png')
side_texture.magFilter = NearestFilter
const side = new MeshPhongMaterial({ map: side_texture })
// top of grass texture
const top_texture = loader.load('/assets/textures/blocks/torch_top.png')
top_texture.magFilter = NearestFilter
const top = new MeshPhongMaterial({ map: top_texture })
export default class StoneBlock extends Block {
	constructor(x, y, z, options) {
		super({
			texture: '/assets/textures/blocks/torch.png',
			x,
			y,
			z
		})
		const w = 2 / 16
		const h = 10 / 16
		this.mesh.material = [ side, side, top, side, side, side ]
		this.mesh.geometry = new BoxGeometry(w, h, w)
		this.mesh.translateY(-3 / 16)
		this.collision = false
		this.name = 'torch'
		this.updateOutline(1.1)
	}
}
