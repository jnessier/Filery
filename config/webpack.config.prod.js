const path = require("path"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    TerserPlugin = require('terser-webpack-plugin'),
    WebpackAutoInject = require('webpack-auto-inject-version'),
    CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm

const pluginName = "filery";

module.exports = {
    mode: 'production',
    entry: {
        "plugin": ["./src/ts/index.ts"],
        "plugin.min": ["./src/ts/index.ts"]
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
            use: [
                'babel-loader',
                'ts-loader',
            ],
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            use: [
                "style-loader",
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            require('cssnano')
                        ]
                    }
                },
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
        //minimize: false,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/
            })
        ]
    },
    plugins: [
        new WebpackAutoInject({
            SHORT: 'Filery: A TinyMCE plugin',
            SILENT: true,
            components: {
                AutoIncreaseVersion: false
            },
            componentsOptions: {
                InjectAsComment: {
                    tag: '{version} - {date}', // default
                    dateFormat: 'yyyy-mm-dd' // default
                }
            }
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "../README.md"),
                to: path.join(__dirname, "../dist")
            }, {
                from: path.join(__dirname, "../LICENSE"),
                to: path.join(__dirname, "../dist")
            }, {
                from: path.join(__dirname, "../src/langs/"),
                to: path.join(__dirname, "../dist", pluginName, 'langs')
            }, {
                from: path.join(__dirname, "../api/"),
                to: path.join(__dirname, "../dist", 'api'),
                ignore: ['config.php']
            }
        ]),
        new CleanWebpackPlugin({
            //   cleanOnceBeforeBuildPatterns: [path.join(__dirname, "../dist/**")],
        }),
    ]
};
