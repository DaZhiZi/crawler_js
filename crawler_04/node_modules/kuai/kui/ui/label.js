const ref = require('ref')

const sdl = require('../../sdl')
const ttf = require('../../ttf')

const GuaObject = require('../gua_object')
const Color = require('../color')


class Label extends GuaObject {
    constructor(text, position, height=20, color=Color.black()) {
        super()
        this.size = {
            w: 100,
            h: 100,
        }
        this.fontSize = height
        this._text = text
        this.color = color
        this.setup(text, position)
    }
    setup(text, position) {
        let [x, y] = position
        this.position = {x, y}
        // 加载 ttf
        this.loadFont()
        // 设置 size
        this.updateSize()
        // 加载 texture
        // this.loadTexture()
        let [r, g, b, a] = this.color
        this.textColor = new sdl.SDL_Color({
            r,
            g,
            b,
            a,
        })
    }
    updateSize() {
        let w = ref.alloc('int')
        let h = ref.alloc('int')
        ttf.TTF_SizeUTF8(this.font, this._text, w, h)
        w = w.deref()
        h = h.deref()
        this.size = {w, h}
    }
    __added(view) {
        super.__added(view)
        this.loadTexture()
    }
    loadTexture() {
        const self = this
        const renderer = self.renderer
        // texture 的宽度, 太小字体会重叠
        // let wrapLength = 200
        // let surface = ttf.TTF_RenderUTF8_Blended_Wrapped(self.font, self.text, self.color, wrapLength)
        let surface = ttf.TTF_RenderUTF8_Blended(self.font, self._text, self.textColor)
        // 加载失败
        if (surface.isNull()) {
            console.log('text render error:', ttf.TTF_GetError())
            process.exit(1)
        }
        // let {w, h} = surface.deref()
        // self.size = {w, h}
        // console.log('label loadTexture', self.size)
        // 转成 texture
        this.texture = sdl.SDL_CreateTextureFromSurface(renderer, surface)
        sdl.SDL_FreeSurface(surface)
    }
    loadFont() {
        const self = this
        let path = './resource/font/font.ttf'
        self.font = ttf.TTF_OpenFont(path, this.fontSize)
        if (self.font.isNull()) {
            console.log(`OpenFont Error: (${ttf.TTF_GetError()})`)
            process.exit(1)
        }
    }
    draw() {
        const self = this
        // const renderer = this.renderer
        // console.log('__ draw', this.texture)
        var rect = new sdl.SDL_Rect({
            x: self.position.x,
            y: self.position.y,
            w: self.size.w,
            h: self.size.h,
        })
        // this._rect = rect
        sdl.SDL_RenderCopy(this.renderer, this.texture, null, rect.ref())
    }
    remove() {
        sdl.SDL_DestroyTexture(this.texture)
    }
    set text(t) {
        // console.log('触发了', t)
        this._text = t
        this.remove()
        // 重新 load
        this.updateSize()
        this.loadTexture()
    }
}

module.exports = Label
