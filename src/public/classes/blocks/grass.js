import Block from '../block'
import { LinearFilter, TextureLoader, MeshPhongMaterial, NearestFilter } from 'three'
const loader = new TextureLoader()
// side of grass texture
const side_texture = loader.load('/assets/textures/blocks/grass_side.png')
side_texture.magFilter = NearestFilter
const grass_side = new MeshPhongMaterial({ map: side_texture })
// top of grass texture
const top_texture = loader.load('/assets/textures/blocks/grass_top.png')
top_texture.magFilter = NearestFilter
const grass_top = new MeshPhongMaterial({ map: top_texture })
// bottom of grass texture
const bottom_texture = loader.load('/assets/textures/blocks/dirt.png')
bottom_texture.magFilter = NearestFilter
const grass_bottom = new MeshPhongMaterial({ map: bottom_texture })

export default class GrassBlock extends Block {
	constructor(x, y, z, options) {
		super({
			x,
			y,
			z
		})
		this.mesh.material = [ grass_side, grass_side, grass_top, grass_bottom, grass_side, grass_side ]
		// this.setMaterial([ grass_side, grass_side, grass_top, grass_bottom, grass_side, grass_side ])
		this.name = 'grassblock'
	}
}
