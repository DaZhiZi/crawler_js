var os = require('os')
var path = require('path')


if (os.platform() == 'darwin') {
    var p = __dirname + '/../dll/SDL2.framework/Versions/A/SDL2'
} else {
	var p = path.join(
		'SDL2',
	)
}


module.exports = p
