module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js'
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }]
  }
}