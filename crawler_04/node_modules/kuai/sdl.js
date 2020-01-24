var extend = require('extend-shallow')
var fs = require('fs')
var os = require('os')
// var path = require('path')

// set image ttf mixer dll search path
if (os.platform() === 'win32') {
	const process = require('process')
	process.env.path += `;${__dirname}\\dll`
}

// Retrieve the list of available modules.
var modules = fs.readdirSync(__dirname + '/sdl/');

// Merge all the modules together.
var sdl = {};
for (var m of modules) {
    if (m.startsWith('SDL')) {
        extend(sdl, require('./sdl/' + m))
    }
}

module.exports = sdl;
