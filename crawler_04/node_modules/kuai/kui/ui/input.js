const ref = require('ref')

const sdl = require('../../sdl')
const GuaObject = require('../gua_object')
// 暂时先引入 Event
const Event = require('../event')
const Label = require('./label')

const Color = require('../color')

const log = require('../utils').log


class Input extends GuaObject {
    constructor(position) {
        super()
        this.eventEnabled = true
        // 是否可以输入
        this.isActive = false
        // 颜色
        this.color = Color.white()
        this.borderColor = Color.black()
        this.cursorColor = Color.black()
        this.setup(position)
    }
    setup(position) {
        let [x, y] = position
        this.position = {x, y}
        this.size = {
            w: 200,
            h: 50,
        }
        // 初始 text 是空字符串
        this.text = ''
    }
    parent(view) {
        this.parent = view
        this.game = view.game
        this.renderer = view.game.renderer
    }
    draw() {
        // log('input draw')
        this.drawTextField()
        this.drawText()
        this.drawCursor()
    }
    drawTextField() {
        // draw border
        let borderFrame = {
            x: this.position.x,
            y: this.position.y,
            w: this.size.w,
            h: this.size.h,
        }
        this.drawRect(borderFrame, this.borderColor)
        // draw content
        let offset = 2
        let frame = {
            x: this.position.x + offset,
            y: this.position.y + offset,
            w: this.size.w - offset * 2,
            h: this.size.h - offset * 2,
        }
        this.drawRect(frame, this.color)
    }
    drawCursor() {
        if (!this.isActive) {
            return
        }
        let offset = 3
        if (this.label) {
            offset += this.label.size.w
        }
        let inset = 3
        let config = {
            x: this.position.x + offset,
            y: this.position.y + inset,
            w: 2,
            h: this.size.h - inset * 2,
        }
        // let color = [255, 125, 0, 255]
        let c = sdl.SDL_GetTicks() / 500
        let currentTime = Math.floor(c)
        if (currentTime % 2 === 0) {
            this.drawRect(config, this.cursorColor)
        }
    }
    __updateTexture() {
        let color = [0, 125, 0, 255]
        this.remove(this.label)
        this.label = null
        if (this.text.length > 0) {
            let h = this.size.h - 10
            let p = [this.position.x, this.position.y]
            this.label = new Label(this.text, p, h)
            // this.remove()
            this.add(this.label)
        }
    }
    drawText() {
        // 用 label 在相应位置 draw
        let text = this.text
        let position = {
            x: this.x,
            y: this.y,
        }
        // let color = [0, 125, 255, 255]
        // if (text.length !== 0) {
        //     let label = Label.new(text, position, color)
        //     label.draw(this.renderer)
        // }
        // log('draw text', this.label)
        this.label && this.label.draw()
    }
    mouseEvent(event) {
        const self = this
        let e = event
        if (e.type === Event.MOUSEBUTTONDOWN) {
            // log('')
            // 检验是否在 input 框内
            var {x, y} = e.button
            let inside = self.collide(x, y)
            if (inside) {
                if (!self.isActive) {
                    self.isActive = inside
                    sdl.SDL_StartTextInput()
                    // 设置输入法候选框
                    var {x, y} = this.position
                    let {w, h} = this.size
                    let rectToDraw = new sdl.SDL_Rect({ x, y, w, h })
                    sdl.SDL_SetTextInputRect(rectToDraw.ref())
                    log('this isActive', this.isActive, x, y)
                }
            } else {
                if (this.isActive) {
                    this.isActive = inside
                    sdl.SDL_StopTextInput()
                }
            }
        }
    }
    keyboardEvent(event) {
        // log('input keyboardEvent', event)
        const self = this
        if (!self.isActive) {
        }
        // 点击按钮则触发
        // 获取鼠标座标
        let e = event
        if(e.type === Event.TEXTINPUT) {
            let text = e.text.text
            let t = ref.readCString(text.buffer, 0)
            //log('----- TEXTINPUT -----', t)
            this.text += t
            self.__updateTexture()
        } else if (e.type === Event.TEXTEDITING) {
            // log('TEXTEDITING', e.type)
            let text = e.text.text
            let t = ref.readCString(text.buffer, 0)
            //log('----- TEXTEDITING -----', t)
        } else if (e.type === Event.KEYDOWN) {
                // 可以输入了
            let keyCode = e.key.keysym.SDL_Keycode
            let key = sdl.SDL_GetKeyName(keyCode)
            //log('按下了按键', key)
            // 转小写
            key = key.toLowerCase()
            if (key.length === 1) {
                // 单个字符
                // this.text += key
                // 在相应的位置绘制 ttf
                // self.__updateTexture()
            } else {
                // 多个字符
                if (key === 'backspace') {
                    if (this.text.length > 0) {
                        this.text = this.text.slice(0, -1)
                    }
                    self.__updateTexture()
                }
            }
        }
    }
    get x() {
        return this.position.x
    }
    get y() {
        return this.position.y
    }
}

module.exports = Input
