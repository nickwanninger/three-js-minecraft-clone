const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const config = require('../../webpack.config')
const compiler = webpack(config)
const notifier = require('node-notifier')
const path = require('path')
compiler.watch({}, (err, stats) => {})

var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
var clearConsole = require('react-dev-utils/clearConsole')
clearConsole()

compiler.plugin('compile', function(params) {
	clearConsole()
	console.log('The compiler is starting to compile...')
})
compiler.plugin('done', function(stats) {
	const durration = stats.endTime - stats.startTime
	var rawMessages = stats.toJson({}, true)
	var messages = formatWebpackMessages(rawMessages)
	if (!messages.errors.length && !messages.warnings.length) {
		console.log('Compiled successfully!')
		notifier.notify({
			title: 'Webpack compiled successfully',
			message: `in ${durration / 1000} seconds`,
			sound: true
		})
	}
	if (messages.errors.length) {
		console.log('Failed to compile.')
		notifier.notify({
			title: 'Webpack Build FAILED :(',
			message: 'Check the console for the reason!',
			sound: 'Sosumi'
		})
		messages.errors.forEach(e => console.log(e))
		return
	}
	if (messages.warnings.length) {
		console.log('Compiled with warnings.')

		messages.warnings.forEach(w => console.log(w))
	}
})
