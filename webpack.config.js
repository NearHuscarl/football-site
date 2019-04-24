// https://thesoftwaresimpleton.com/blog/2019/03/15/ts-code-splitting

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
	dotenv.config({ path: '.env_test' });
} else if (process.env.NODE_ENV === 'development') {
	dotenv.config({ path: '.env_development' });
}
dotenv.config({ path: '.api_keys' });

module.exports = (env) => {
	const isProduction = env === 'production';

	return {
		entry: ['@babel/polyfill', './src/app.js'],
		output: {
			path: path.join(__dirname, 'dist'),
			filename: isProduction ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
			chunkFilename: isProduction ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
			// publicPath: 'public/',
		},
		module: {
			rules: [
				{
					loader: 'babel-loader',
					test:  /\.(js|jsx)$/,
					exclude: /node_modules/,
				},
				{
					test: /\.(scss|css)$/,
					use: [
						// 'css-hot-loader',
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								hmr: !isProduction,
								sourceMap: true,
							},
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					]
				},
				{
					test: /\.(ttf|otf|eot|svg|woff|woff2)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'fonts/',
								publicPath: '../fonts/',
							},
						},
					],
				},
				{
					test: /\.(jpg|png|gif)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'images/',
							},
						},
					],
				},
			],
		},
		plugins: [
			new BundleAnalyzerPlugin(),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: 'public/index.html',
			}),
			new MiniCssExtractPlugin({
				filename: isProduction ? 'css/[name].[chunkhash:8].chunk.css' : 'css/[name].chunk.css',
				chunkFilename: isProduction ? 'css/[name].[chunkhash:8].chunk.css' : 'css/[name].chunk.css',
			}),
			new webpack.DefinePlugin({
				'process.env.NEWS_API_KEY': JSON.stringify(
					process.env.NEWS_API_KEY,
				),
				'process.env.FOOTBALL_DATA_API_KEY': JSON.stringify(
					process.env.FOOTBALL_DATA_API_KEY,
				),
				'process.env.FIREBASE_API_KEY': JSON.stringify(
					process.env.FIREBASE_API_KEY,
				),
				'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
					process.env.FIREBASE_AUTH_DOMAIN,
				),
				'process.env.FIREBASE_DATABASE_URL': JSON.stringify(
					process.env.FIREBASE_DATABASE_URL,
				),
				'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
					process.env.FIREBASE_PROJECT_ID,
				),
				'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(
					process.env.FIREBASE_STORAGE_BUCKET,
				),
				'process.env.FIREBASE_MESSAGING_ID': JSON.stringify(
					process.env.FIREBASE_MESSAGING_ID,
				),
			}),
		],
		devtool: isProduction ? 'source-map' : 'inline-source-map',
		devServer: {
			// contentBase: path.join(__dirname, 'dist'),
			// watchContentBase: true, // A workaround to be able to watch for html file changes
			historyApiFallback: true,
		},
		mode: 'development',
		resolve: {
			extensions: ['.js', '.jsx'],
		},
	};
};
