import { WebGLRenderer } from 'three'

const antialias = false
const alpha = false
const renderer = new WebGLRenderer({ antialias, alpha })
// renderer.setFaceCulling(false, 'cw')

// Make it high res (2x what it would normally be)
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setPixelRatio(0.3)

// renderer.setPixelRatio(0.1)

const clearTop = 0x75abff
const clearBottom = 0xa5c9ff
renderer.setClearColor(clearTop)
renderer.shadowMapEnabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
document.addEventListener('pointerlockchange', console.log(), false)
document.body.appendChild(renderer.domElement)
renderer.domElement.addEventListener(
	'click',
	ev => {
		document.body.requestPointerLock()
	},
	true
)
export default renderer
