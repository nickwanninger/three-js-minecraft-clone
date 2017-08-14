import Block from './block'
import { Object3D } from 'three'
class Chunk {
	constructor(xpos, ypos) {
		this.entities = []
		this.blocks = []
		this.chunks = []
		// 16 of these, ranging from 0 to 16 in height
		this.sections = [ new Object3D() ]
	}
}
export default Chunk
