class Color {
    constructor(r, g, b, a=255) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    static white() {
        return [255, 255, 255, 255]
    }
    static black() {
        return [0, 0, 0, 255]
    }
    static lightblue() {
        return [144, 218, 245, 255]
    }
    static buttonNormal() {
        let c = [52, 152, 219, 255]
        return c
    }
    static buttonPressed() {
        let c = [41, 128, 185, 255]
        return c
    }
}

module.exports = Color
