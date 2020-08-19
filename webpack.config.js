const path = require('path');
const webpack = require('webpack');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    //devtool: "inline-source-map",
    devtool: 'source-map',
    entry: {
        index : "./src/index.js",
    },

    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
      ],
    
      optimization: {
        minimizer: [
          // we specify a custom UglifyJsPlugin here to get source maps in production
          /*new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
              compress: false,
              ecma: 6,
              mangle: true
            },
            sourceMap: true
          })*/
        ]
      },


    output: {
        path : path.resolve(__dirname, "./public/"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },

            {
              test: /\.js$/,
              include: [
                path.resolve(__dirname, 'src/')
              ],
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-class-properties']
                }
              }
            }
        ],
    },
}