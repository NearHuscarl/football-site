const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
	// dotenv.config({ path: '.env_test' });
} else if (process.env.NODE_ENV === 'development') {
	dotenv.config({ path: '.env_development' });
}

module.exports = (env) => {
	const isProduction = env === 'production';
	const CSSExtract = new ExtractTextPlugin('styles.css');

	return {
		entry: ['babel-polyfill', './src/app.js'],
		output: {
			path: path.join(__dirname, 'public', 'dist'),
			filename: 'bundle.js',
		},
		module: {
			rules: [
				{
					loader: 'babel-loader',
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
				},
				{
					test: /\.s?css$/,
					use: ['css-hot-loader'].concat(
						CSSExtract.extract({
							use: [
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
							],
						}),
					),
				},
				{
					test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'fonts/', // where the fonts will go
							},
						},
					],
				},
			],
		},
		plugins: [
			CSSExtract,
			new webpack.DefinePlugin({
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
			contentBase: path.join(__dirname, 'public'),
			publicPath: '/dist/',
			historyApiFallback: true,
		},
		mode: 'development',
		resolve: {
			extensions: ['.js', '.jsx'],
		},
	};
};
