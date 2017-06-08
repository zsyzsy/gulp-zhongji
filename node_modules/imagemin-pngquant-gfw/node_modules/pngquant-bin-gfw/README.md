# pngquant-bin-gfw

> pngquant is a command-line utility for converting 24/32-bit PNG images to paletted (8-bit) PNGs. The conversion reduces file sizes significantly (often as much as 70%) and preserves full alpha transparency.


## Install

```
$ npm install --save pngquant-bin-gfw
```


## Usage

```js
var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin-gfw');

execFile(pngquant, ['-o', 'output.png', 'input.png'], function (err) {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global pngquant-bin-gfw
```

```
$ pngquant --help
```
