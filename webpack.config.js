const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');
const webpack = require('webpack')
module.exports = {
    entry: {
        index: "./test/index.ts" //入口文件，若不配置webpack4将自动查找src目录下的index.js文件
    },
    output: {
        filename: "[name].js", //输出文件名，[name]表示入口文件js名
        path: path.join(__dirname, "dist") //输出文件路径
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: path.resolve(__dirname, "src", "tsconfig.json")
                }
            }
        ]

    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebPackPlugin({
            template: "./test/index.html",
            filename: "./index.html"
        }),
        new webpack.NamedModulesPlugin(), // 新增
        new webpack.HotModuleReplacementPlugin() //新增
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8033,
        host: "127.0.0.1",
        hot: true // 新增
    }
};