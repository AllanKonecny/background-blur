const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	stats: 'errors-warnings',
	output: {
		path: path.resolve(__dirname, 'build')
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'ts-loader']
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{ loader: 'file-loader', options: { outputPath: 'fonts/' } }]
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.pug$/,
				use: ['pug-loader']
			}
		]
	},

	plugins: [
		new webpack.ProgressPlugin({
			handler(percentage, message, ...args) {
				console.clear();
				console.log('\x1b[33m%s\x1b[0m', `[${Math.round(percentage * 100)}%]`, '\x1b[32m', message, ...args);
				if (percentage === 1) {
					console.clear();
					console.log(
						'\x1b[33m%s\x1b[0m',
						`[${Math.round(percentage * 100)}%]`,
						'\x1b[32m',
						'Compiled successfully'
					);
				}
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/index.pug'
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	],

	devServer: {
		historyApiFallback: true,
		port: 4200,
		proxy: {
			'/': {
				target: 'https://stage.brandmaster.com',
				secure: true,
				changeOrigin: true
			}
		}
	}
};
