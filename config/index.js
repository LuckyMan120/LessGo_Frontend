// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var dFlag = (process.env.PLATFORM && process.env.PLATFORM == 'DESKTOP');
var isSERVED = process.env.SERVE;

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: dFlag ? '/app/' : (isSERVED ? '/' : ''),
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    assetsSubDirectory: 'static',
    assetsPublicPath: dFlag ? '/app/' : (isSERVED ? '/' : ''), // dejar vacio para compilar cordova
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
