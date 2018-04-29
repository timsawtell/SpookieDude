module.exports = {
  entry: './build/engine/engine.js',
  output: {
    filename: './bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images/'
            }  
          }
        ]
      }
    ]
  }
};