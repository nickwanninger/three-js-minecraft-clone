const webpack = require('webpack')
const path = require('path')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
var SimpleProgressPlugin = require('webpack-simple-progress-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const chalk = require('chalk')
const fs = require('fs')
const filter = require('minimatch').filter
const src = dir => path.resolve(process.env.cwd, process.env.src || 'src', dir)
const production = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preprod'

const plugins = [
	// new LodashModuleReplacementPlugin,
	new webpack.DefinePlugin({
		'process.env': {
			// This has effect on the react lib size
			NODE_ENV: JSON.stringify('production'),
			BUILD_ENV: production
		}
	}),
	new webpack.NoErrorsPlugin()
]

// console.log(process.env)

// In production we do a bit more...
if (production) {
	console.log('BUILDING FOR PRODUCTION')
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			comments: false, // remove comments
			compress: {
				unused: true,
				dead_code: true, // big one--strip code that will never execute
				warnings: false, // good for prod apps so users can't peek behind curtain
				drop_debugger: true,
				conditionals: true,
				evaluate: true,
				drop_console: true, // strips console statements
				sequences: true,
				booleans: true
			}
		})
	)
	plugins.push(new webpack.optimize.DedupePlugin())
	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
} else {
	plugins.push(
		new ProgressBarPlugin({
			format: chalk.green.bold('BUILD') + ' {:bar} ' + chalk.green.bold(':percent') + ':msg (:elapsed seconds)',
			clear: true
		})
	)
}

const modules = {
	loaders: [
		{
			test: /\.(js|jsx)$/,
			// in dev only, hotload
			loader: [ 'babel-loader' ],
			exclude: /node_modules/
		},
		{
			test: /\.(vert|frag)$/,
			loader: 'raw-loader'
		},
		{
			test: /\.json$/,
			loader: 'json-loader'
		}
	]
}

const resolve = {
	extensions: [ '.js', '.jsx', '.json' ],
	alias: {}
}

const outputPath = path.join(__dirname, 'src/public/www/js')

const files = fs.readdirSync(outputPath)
files.forEach(name => {
	const url = path.join(outputPath, name)
	fs.unlinkSync(url)
})

module.exports = {
	devtool: false, //production ? false : 'eval',
	entry: './src/public/index.js',
	output: {
		path: outputPath,
		filename: 'bundle.js',
		chunkFilename: 'chunk.[chunkhash:5].js',
		publicPath: 'js/'
	},
	stats: 'verbose',
	root: path.resolve('./src'),
	// Extra helpers to make require or include easier.
	resolve: resolve,
	module: modules,
	plugins: plugins
}
