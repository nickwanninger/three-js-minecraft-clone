import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import styled from 'styled-components'
const VignetteStyle = {
	position: 'fixed',
	top: '0px',
	left: '0px',
	width: '100%',
	height: '100%',
	zIndex: '300',
	opacity: 0.4,
	pointerEvents: 'none'
}
const CrossHairStyle = {
	position: 'fixed',
	width: 17,
	zIndex: '300',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	pointerEvents: 'none'
}
const Head = props => (
	<head>
		<title>{`clonething`}</title>
		<meta name="theme-color" content="#ffffff" />
		<meta charset="utf-8" />
		<link rel="manifest" href="/manifest.json" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<base href="/" target="/" />
	</head>
)

class Dom extends Component {
	render() {
		return (
			<html lang="en">
				<Head />
				<body style={{ padding: 0, margin: 0, overflow: 'hidden', maxHeight: '100vh' }}>
					<img style={VignetteStyle} src="/assets/textures/gui/vignette.png" />
					<img style={CrossHairStyle} src="/assets/textures/gui/crosshair.png" />
					<script preload src={`/js/bundle.js`} />
				</body>
			</html>
		)
	}
}
module.exports = (req, res) => {
	const renderedString = '<!DOCTYPE html>' + renderToString(<Dom />)
	res.send(renderedString)
}
