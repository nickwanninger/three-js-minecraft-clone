import Chunk from './chunk'
class World {
	constructor() {
		this.seed = Math.floor(Math.random() * 256)
		// generate the origin chunk
		this.generateChunk(0, 0)
	}
	generateChunk(xpos, ypos) {}
}
export default new World()
