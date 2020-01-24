const sdl = require('../sdl')

class GuaObject {
    constructor() {
        this.eventEnabled = false
        this.position = {
            x: 0,
            y: 0,
        }
        // offset 是相对于父元素的绝对座标
        this.offset = {
            x: 0,
            y: 0,
        }
        this.size = {
            w: 0,
            h: 0,
        }
        this.elements = []
    }
    static new(...args) {
        return new this(...args)
    }
    add(view) {
        // TODO, 应该是 this.pos + this.offset
        view.offset = this.position
        this.elements.push(view)
        view.__added(this)
    }
    __added(view){
        let v = view
        this.parent = v
        this.game = v.game
        this.renderer = v.game.renderer
    }
    remove(view) {
        for (let e of this.elements) {
            // console.log('__ debug, remove', e, e.texture)
            if (e === view) {
                e.remove()
                // if (e.texture) {
                //     sdl.SDL_DestroyTexture(e.text)
                //     break
                // }
            }
        }
        // 原代码
        // this.elements = this.elements.filter(e => e == view)
        // 正确形式
        this.elements = this.elements.filter(e => e !== view)
    }
    draw() {
        for (let e of this.elements) {
            e.draw()
            // if (e.texture) {
            //     sdl.SDL_DestroyTexture(e)
            //     break
            // }
        }
    }
    drawRect(config, color=[0, 0, 255, 255]) {
        let renderer = this.renderer
        // let [r, g, b] = color
        let rectToDraw = new sdl.SDL_Rect(config)
        sdl.SDL_SetRenderDrawColor(renderer, ...color)
        sdl.SDL_RenderFillRect(renderer, rectToDraw.ref())
    }
    collide(x1, y1) {
        const self = this
        // x, y 是鼠标的座标        // 套路，检测是否相交
        let {x, y} = self.position
        x += self.offset.x
        y += self.offset.y
        let {w, h} = self.size
        // console.log('collide', x, y, w, h, x1, y1)
        if (x1 > x && x1 < (x + w)) {
            if (y1 > y && y1 < (y + h)) {
                return true
            }
        }
        return false
    }
}

module.exports = GuaObject
