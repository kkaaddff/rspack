const { rspack } = require("@rspack/core");
class Plugin2 {
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("Plugin2", compilation => {
			compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(
				"Plugin2",
				(_loaderContext, module) => {
					return "not allow inline startup";
				}
			);
		});
	}
}

const config = {
	entry: "./index",
	stats: "errors-warnings",
	ignoreWarnings: [/Using \/ for division outside/],
	plugins: [new Plugin2()],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								}
							}
						}
					}
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [{ loader: "sass-loader" }]
				// type: 'css',
			}
		]
	},
	experiments: {
		css: true
	}
};

// 创建编译器实例
const compiler = rspack(config);

// 运行编译
compiler.run((err, stats) => {
	if (err) {
		console.error(err);
		return;
	}

	// 输出编译统计信息
	console.log(
		stats.toString({
			colors: true
		})
	);
});
