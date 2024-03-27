const path = require('path')

module.exports = {
  entry: './src/main.js',
  // entry: {
  //   main: {
  //     import: path.resolve(__dirname, './src/main.js'),
  //     dependOn: ['react-dom', 'react-reconciler'],
  //   },
  //   'react-dom': 'react-dom',
  //   'react-reconciler': 'react-reconciler'
  // },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js' // 动态导入模块的分块文件名
  },
  mode: 'development',
  // devtool: 'source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 默认为‘async’，只分包异步代码
      minSize: 20000, // 20k, chunk的尺寸小于该值时则不分包
      maxSize: 400000, // 大于该值时继续拆分
      minChunks: 1, // 引入数量大于该值时才分包
      cacheGroups: { // 对拆分的包进行分组
        venders: {
          test: /\/node_modules\//,
          filename: 'venders.chunk.js',
          priority: 10, // 同一个模块出现在多个组时优先打包到优先级高的组
        },
        default: { // 默认组，引入次数大于1时也会分包到独立文件
          minChunks: 2,
          filename: 'common.chunk.js'
        }
      },
    },
    chunkIds: 'named',  // id生成算法
    runtimeChunk: 'single', // webpack的runtime打包到独立的文件, 更多选项参考文档
  }
}