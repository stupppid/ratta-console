const path = require('path')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, '../'),
    entry: { index: './src/index.ts'},
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "[name].js",
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.scss'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.js$/,
                enforce: "pre",
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                "@babel/plugin-proposal-decorators",
                                {
                                    "legacy": true
                                }
                            ],
                            [
                                "@babel/plugin-proposal-class-properties"
                            ],
                            ["@babel/plugin-transform-runtime",
                                {
                                    "regenerator": true
                                }
                            ],
                            ["transform-typescript", {"preserveConstEnums": true}]
                        ],
                    }
                }
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            }
        ]
    },
}
