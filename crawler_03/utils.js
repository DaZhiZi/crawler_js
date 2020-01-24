const nowTime = () => {
    let d = new Date()
    let nm = d.getFullYear()
    let yt = d.getMonth() + 1
    let ri = d.getDate()
    let week = d.getDay()
    let ui = d.getHours()
    let ff = d.getMinutes()
    let mc = d.getSeconds()
    let array = ['日', '一', '二', '三', '四', '五', '六']
    let weeks = array[week]
    let time = `${nm}-${yt}-${ri} 星期${weeks}  ${ui}:${ff}:${mc}`
    // log('time', time)
    return time
}
const log = console.log.bind(console, `${nowTime()} >>>>>`)
/*
const log = function() {
    console.log.apply(console, arguments)
}
*/
const ensureEqual = (a, b, message) => {
    if (JSON.stringify(a) != JSON.stringify(b)) {
        log(`*** 测试失败, 结果(${a})  预期 (${b}), ${message}`)
    } else {
        log(`    ***  ${message} 测试成功, 大侄子牛逼呀`)
    }
}
const ensure = (condition, message) => {
    // 在条件不成立的时候, 输出 message
    if (!condition) {
        log('*** 测试失败:', message)
    } else {
        log('*** 测试成功   大侄子牛逼啊', message)
    }
}

const find2 = function (s1, s2) {
    // s1 s2 都是 string
    // 两个 str 的长度不限
    //
    // 返回 s2 在 s1 中的下标, 从 0 开始, 如果不存在则返回 -1
    let space = s2.length
    for (let i = 0; i < s1.length; i++) {
        let str = s1.slice(i, i + space)
        if (str === s2) {
            return i
        }
    }
    return -1
}

const findBetween = function (s, left, right) {
    // s, left, right 都是 str
    // 具体用法参考下方 testFindBetween 的代码
    //https://movie.douban.com/top250?start=0
    let center = ''
    let l = find2(s, left)
    let data = s.slice(l)
    let r = find2(data, right) + l
    if (l > 0 && r > 0) {
        center = s.slice(l + left.length, r)
    }
    // log('center', center)
    return center
}

const testFindBetween = function () {
    let s1 = 'meet #<gua># halfway'
    let s2 = 'meet #<gua># #<high>#way'
    let left = '#<'
    let right = '>#'

    let content1 = findBetween(s1, left, right)
    let content2 = findBetween(s2, left, right)

    // 输出如下, 可以知道本函数只匹配第一个符合的字符串
    // 结果1 gua
    // 结果2 gua
    log('结果1 ', content1)
    log('结果2 ', content2)
}
// testFindBetween()
const is_space = function (str) { // 是否含有 空格
    let bo = false
    for (let s of str) {
        if (s == ' ') {
            return true
        }
    }
    return bo
}
const arrOfStr = function (str) {
    let arr = []
    if (!is_space(str)) {
        arr.push(str)
    } else {
        arr = str.split(' ')
    }
    return arr
}
module.exports = {
    log,
    find2,
    findBetween,
    arrOfStr,
}