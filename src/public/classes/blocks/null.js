import Block from '../block'
export default class NullBlock extends Block {
	constructor(x, y, z, options) {
		super({
			texture: '/assets/textures/blocks/null.png',
			x,
			y,
			z
		})
		this.name = 'stoneblock'
	}
}
