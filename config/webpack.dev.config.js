const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, '../'),
    entry: { index: './src/view.js'},
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
                use: {
                    loader: 'ts-loader',
                    options: {
                        allowTsInNodeModules: true
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                "const-enum",
                                {
                                    "transform": "constObject"
                                }
                            ],
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
                            ]
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
            },
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin(),
        // new TypedocWebpackPlugin({
        //     name: 'Contoso',
        //     mode: 'file',
        //     theme: './typedoc-theme/',
        //     includeDeclarations: false,
        //     ignoreCompilerErrors: true,
        // })
    ],
    devServer: {
        port: 9001
    },
    devtool: "cheap-module-eval-source-map",
}
