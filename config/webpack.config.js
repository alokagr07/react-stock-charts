const webpack = require("webpack");
const path = require("path");

const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const rootPath = path.join(__dirname, "..");

function buildConfig(mode) {
	const { ifWatch, ifDocs } = getIfUtils(mode, ["docs", "watch"]);

	const docsEntry = {
		"react-stock-charts-home": "./docs/index.js",
		"react-stock-charts-documentation": "./docs/documentation.js",
	};

	const devServer = {
		contentBase: [
			path.join(rootPath, "docs"),
			path.join(rootPath, "build"),
			path.join(rootPath, "node_modules"),
		],
		host: process.env.IP, // "10.0.0.106", "localhost"
		port: parseInt(process.env.PORT),
	};

	const context = rootPath;
	const loadersForDocs = [
		{ test: /\.jpg$/, use: {loader: "file-loader"} },
		{ test: /\.(png|svg)$/, use: {loader: "url-loader?mimetype=image/png"} },
		{ test: /\.md$/, use: {loader: "html-loader"} },
		{ test: /\.md$/, use: {loader: "remarkable-loader"} },
		{ test: /\.scss$/,  use: {loader: "style-loader"} },
		{ test: /\.scss$/,  use: {loader: "css-loader"} },
		{ test: /\.scss$/, use: {loader: "postcss-loader"} },
		{ test: /\.scss$/, use: {loader: "sass-loader", options: {
      sassOptions: {
        outputStyle: 'expanded'
      }
    }} }
	];

	console.log("MODE", mode);
	return {
    mode: 'development',
		context,
		entry: docsEntry,
		output: {
			path: path.join(rootPath, "build/"),
			filename: `dist/[name]${ifDocs(".[chunkhash]", "")}.js`,
			publicPath: "",
			library: "ReStock",
			libraryTarget: "umd",
			pathinfo: ifWatch(true, false), // since we have eval as devtool for watch, pathinfo gives line numbers which are close enough
		},
		devtool: ifWatch("cheap-module-source-map"),
		module: {
			rules: removeEmpty([
				// { test: /\.json$/, loader: "json" },
				{ test: /\.(js|jsx)$/, use: {loader: "babel-loader"}, exclude: /node_modules/ },
				...loadersForDocs,
			])
		},
		performance: {
			hints: false,
		},
		plugins: removeEmpty([
			new ProgressBarPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			//new webpack.optimize.OccurrenceOrderPlugin(),

			ifDocs(new webpack.DefinePlugin({
				"process.env": {
					// This has effect on the react lib size
					NODE_ENV: JSON.stringify("production"),
				},
			})),
			new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: 'body',
				page: "index",
				mode,
				filename: "index.html"
			}),
			new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: 'body',
				page: "documentation",
				mode,
				filename: "documentation.html"
			}),
			new webpack.LoaderOptionsPlugin({
				options: { remarkable: getRemarkable(), context }
			}),
		]),
		devServer,
		resolve: {
			extensions: [".js", ".scss", ".md"],
			alias: {
				"react-stock-charts": path.join(rootPath, "src"),
			},
			modules: ["docs", "node_modules"]
		}
	};
}

function getRemarkable() {

	const Prism = require("prismjs");

	require("prismjs/components/prism-jsx");
	require("prismjs/plugins/line-numbers/prism-line-numbers");

	return {
		preset: "full",
		html: true,
		linkify: true,
		typographer: true,
		highlight: function(str, lang) {
			const grammer = lang === undefined || Prism.languages[lang] === undefined ? Prism.languages.markup : Prism.languages[lang];
			return Prism.highlight(str, grammer, lang);
		}
	};
}

module.exports = buildConfig;
