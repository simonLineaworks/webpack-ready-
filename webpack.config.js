const path = require('path')
const uglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const dev = process.env.NODE_ENV === "dev"

let cssloaders = [  
			        { 
			        	loader: 'css-loader', options: { importLoaders: 1, minimize: false } 
			        },
			        { 
			        	loader: 'postcss-loader',
			           	options: {
			           		plugins: (loader) => [
			           			require('autoprefixer')({
			           				browsers:['last 2 versions','ie > 8']
			           			}),
			           		]
			           	}
			      	}
			   	]

let config = {
				entry:{
					app:"./assets/js/app.js"
				},
				watch : dev,
				output:{
					path: dev ? path.resolve('./dist') : path.resolve('./dist'),
					filename:dev ? '[name].js' : '[name].[chunkhash:8].js'
				},
				devtool : dev ? 'cheap-module-eval-source-map' : false,
				module : {
					rules : [
						{
							test : /\.js$/,
							exclude: /(node_modules|bower_components)/,
							use : ['babel-loader']
						},
						{
							test : /\.css$/,
							use : ['style-loader','css-loader']
						},
						{
							test : /\.scss$/,
					        use: ExtractTextPlugin.extract({
					          fallback: "style-loader",
					          use: [...cssloaders,'sass-loader']
					        })
						}
					]
				},
				plugins : [
					new ExtractTextPlugin({
						filename: dev ? '[name].css' : '[name].[contenthash:8].css',
						// disable: dev
					})
				]
			}

if(!dev){
	config.plugins.push(new uglifyJSPlugin()),
	config.plugins.push(new CleanWebpackPlugin(['dist'],{
		root:     path.resolve('./'),
		verbose : true
	}))
}

module.exports = config