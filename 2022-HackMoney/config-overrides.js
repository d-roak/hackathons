const webpack = require("webpack")

module.exports = function override(config, env) {
	config.resolve.fallback = {
		...config.resolve.fallback,
		stream: require.resolve("stream-browserify"),
		buffer: require.resolve("buffer"),
		crypto: false,
		browser: false,
		url: false,
		fs: false,
		https: false,
		http: false,
		os: false,
		util: false,
		process: false,
	}
	config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
	config.plugins = [
		...config.plugins,
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
	]
	config.module.rules = [
		...config.module.rules,
		{
			test: /\.m?js$/,
			type: "javascript/auto",
		},
		{
			test: /\.m?js$/,
			resolve: {
				fullySpecified: false,
			},
		},
	]
	
	return config
}