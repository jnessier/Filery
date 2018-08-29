const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pluginName = "filery";

module.exports = {
    mode: 'production',
    entry: {
        "plugin": "./src/ts/index.ts",
        "plugin.min": "./src/ts/index.ts"
    },
    output: {
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
            test: /\.js/,
            loader: 'strict-loader'
        }, {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
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
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "../LICENSE"),
                to: path.join(__dirname, "../dist", pluginName)
            }, {
                from: path.join(__dirname, "../src/langs/"),
                to: path.join(__dirname, "../dist", pluginName, 'langs')
            }
        ])
    ]
};
