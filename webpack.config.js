var HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path');

var isProd = process.env.NODE_ENV === 'production'; // true or false
var cssDev = ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader?sourceMap=inline', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [            
      'css-loader?importLoaders=1',
      'postcss-loader?sourceMap=inline',
      'sass-loader'
    ],
    publicPath: '/dist/'
});
var cssConfig = isProd ? cssProd : cssDev;


module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/, 
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: '[name].[ext]',
              outputPath: 'images/',
              //publicPath: 'images/'
            }             
          },
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                quality: 80
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              svgo: {
                removeViewBox: false,
                removeEmptyAttrs: false
              }
            }
          }  
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    stats: 'errors-only',
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home Page',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}