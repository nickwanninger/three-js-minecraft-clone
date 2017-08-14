import { PerspectiveCamera } from 'three'
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000)
const sensitivity = 1
export default camera
