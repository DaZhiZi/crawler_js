const { log , find2, findBetween, arrOfStr, } = require('./utils')
// 系统标准库放在前面
const fs = require('fs')

// 读取文件 'douban.json' 的内容;
const getData = function () {
    let path = 'books.json'
    let dataJson = fs.readFileSync(path)
    let data = JSON.parse(dataJson)
    // log(data.length)
    return data
}
const dataOfValue = function (data, key) {
    let list = []
    for (let movie of data) {
        let value = movie[key]
        if (Array.isArray(value)) {
            list = list.concat(value)
        } else {
            list.push(value)
        }
    }
    return list
}
const arrOfObj = function (values) {
    let obj = {}
    for (let v of values) {
        if (!obj.hasOwnProperty(v)) {
            obj[v] = 1
        } else {
            obj[v] += 1
        }
    }
    return obj
}
const dataProcess = function (data, key) {
    let values = dataOfValue(data, key)
    // log('values', values)
    let obj = arrOfObj(values)
    return obj
}
const countryOfName = function (data, countryName) {
    let list = []
    let key = 'countrys'
    for (let movie of data) {
        let value = movie[key]
        if (value.includes(countryName)) {
            let name = movie['name']
            list.push(name)
        }
    }
    return list
}

const country = function (data) {
    let key = 'country'
    let d = dataProcess(data, key)
    return d
}
// let arr =  [
//       { '美': 25 },
//       { '法': 10 },
//       { '中国': 149 },
//   ] json格式文件 -- 文件处理 -- 数据处理 -- 数据可视化
const typeArr = function (map) {
    let list = []
    for (let k in map) {
        let o = {}
        o[k] = map[k]
        list.push(o)
    }
    return list
}

const main = function () {
    // let data = getData()
    // let d = country(data)
    // log('d', d)
    let obj = {
        '美': 32,
        '日': 21,
        '法': 7,
        '中国': 141,
        // '清': 1,
        '哥伦比亚': 2,
        '捷克': 2,
        '英': 26,
        '美国': 1,
        '以色列': 2,
        // '明': 2,
        '巴西': 1,
        '奥': 2,
        '法国': 1,
        '印': 1,
        '意': 4,
        '澳': 2,
        '德': 3,
        '意大利': 1,
        '瑞典': 1
    }
    let arr = typeArr(obj)
    log('arr', arr)
}

main()
/*
 [ { '美': 32 },
    { '日': 21 },
    { '法': 7 },
    { '中国': 141 },
    { '哥伦比亚': 2 },
    { '捷克': 2 },
    { '英': 26 },
    { '美国': 1 },
    { '以色列': 2 },
    { '巴西': 1 },
    { '奥': 2 },
    { '法国': 1 },
    { '印': 1 },
    { '意': 4 },
    { '澳': 2 },
    { '德': 3 },
    { '意大利': 1 },
    { '瑞典': 1 } , ]
*/