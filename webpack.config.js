const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');

// ppkファイルを検索する関数
function findPpkFile() {
  try {
    const files = fs.readdirSync(__dirname);
    const ppkFile = files.find(file => file.endsWith('.ppk'));
    return ppkFile ? path.resolve(__dirname, ppkFile) : null;
  } catch (error) {
    return null;
  }
}

module.exports = (env = {}) => {
  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: '' }, 
        { from: 'src/config/config.html', to: 'html/config.html' },
        { from: 'src/config/index.css', to: 'css/config.css' },
        { from: 'src/record/record.css', to: 'css/desktop.css' },
        { from: 'src/image/icon.png', to: 'image/icon.png' },
      ],
    }),
  ];

  if (!env.skipPlugin && findPpkFile()) {
    plugins.push(
      new KintonePlugin({
        manifestJSONPath: path.resolve(__dirname, 'manifest.json'),
        pluginZipPath: path.resolve(__dirname, 'dist', 'tab-plugin.zip'),
        privateKeyPath: findPpkFile(),
        domain: process.env.KINTONE_DOMAIN,
        basicAuth: {
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
      })
    );
  }

  return {
    mode: 'production',
    entry: {
      'js/config': path.resolve(__dirname, 'src/config/index.tsx'),
      'js/desktop': path.resolve(__dirname, 'src/record/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                modules: {
                  auto: true,
                  mode: 'local',
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: { filename: 'image/[name][ext]' },
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
      ],
    },
    plugins,
    devServer: {
      devMiddleware: { writeToDisk: true },
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
      hot: true,
      liveReload: true,
      compress: true,
      port: 3002,
      open: true,
    },
  };
};