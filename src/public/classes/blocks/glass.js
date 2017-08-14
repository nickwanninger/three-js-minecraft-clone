import Block from '../block'
import { LinearFilter } from 'three'
export default class GlassBlock extends Block {
	constructor(x, y, z, options) {
		super({
			texture: '/assets/textures/blocks/glass.png',
			x,
			y,
			z
		})
		this.material.transparent = true
		this.name = 'glassblock'
		this.collision = false
	}
}
