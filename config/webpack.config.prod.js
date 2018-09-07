const path = require("path"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const pluginName = "filery";

module.exports = {
    mode: 'production',
    entry: {
        "plugin": "./src/ts/index.ts",
        "plugin.min": "./src/ts/index.ts"
    },
    output: {
        library: 'Filery',
        libraryTarget: 'umd',
        path: path.join(__dirname, "../dist", pluginName),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader"
        }, {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }, {
            test: /\.(png|jpg|gif)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        }]
    },
    node: {
        fs: 'empty'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            }),
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.min\.css$/,
            })]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            // chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "../LICENSE"),
                to: path.join(__dirname, "../dist", pluginName)
            }, {
                from: path.join(__dirname, "../src/langs/"),
                to: path.join(__dirname, "../dist", pluginName, 'langs')
            }, {
                from: path.join(__dirname, "../api/"),
                to: path.join(__dirname, "../dist", 'api'),
                ignore: ['config.php']
            }
        ])
    ]
};
