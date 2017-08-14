import Block from '../block'
export default class StoneBlock extends Block {
	constructor(x, y, z, options) {
		super({
			texture: '/assets/textures/blocks/cobblestone.png',
			x,
			y,
			z
		})
		this.name = 'stoneblock'
	}
}
