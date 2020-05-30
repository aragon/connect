const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  target: 'web',
  mode: process.env.NODE_ENV,
  stats: {
    preset: process.env.NODE_ENV === 'production' ? 'errors-only' : 'normal',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            // options: { projectReferences: true }, // TODO: investigate why circular dependencies are not allowed (for types)
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['module', 'browser', 'main'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 1234,
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ title: 'Org Viewer' }),
  ],
}
