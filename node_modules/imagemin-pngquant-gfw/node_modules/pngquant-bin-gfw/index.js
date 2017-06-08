var osFilterObj = require('os-filter-obj');
var path = require('path');

var binPath = osFilterObj([
  {
    path: 'osx/pngquant',
    os: 'darwin'
  },
  {
    path: 'linux/x86/pngquant',
    os: 'linux',
    arch: 'x86'
  },
  {
    path: 'linux/x64/pngquant',
    os: 'linux',
    arch: 'x64'
  },
  {
    path: 'win/pngquant.exe',
    os: 'win32'
  }
]);

module.exports = path.join(__dirname, 'vendor', binPath[0].path);
