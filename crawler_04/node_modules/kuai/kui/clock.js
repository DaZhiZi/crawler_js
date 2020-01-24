const sdl = require('../sdl')
const GuaObject = require('./gua_object')


class Clock extends GuaObject {
    constructor(callback, interval) {
        super()
        this.setup(callback, interval)
    }
    setup(callback, interval) {
        const self = this
        self.callback = callback
        self.interval = interval
    }
    run() {
        const self = this
        let parent = this.parent
        self.callback = self.callback.bind(parent)
        let start = sdl.SDL_GetTicks()
        parent.update = function() {
            if ((sdl.SDL_GetTicks() - start) > self.interval) {
                // 修改值
                start = sdl.SDL_GetTicks()
                self.callback()
            }
        }
    }
}

module.exports = Clock
