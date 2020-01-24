const { log , find2, findBetween, arrOfStr, } = require('./utils')
// 系统标准库放在前面
// 系统标准库
const fs = require('fs')

// 引入我们需要用的网络下载库, 它是用来下载一个网页的
// 本项目已经装好了这个库所以你不用安装即可直接运行
const request = require('syncrequest')

// 读取文件 'douban.json' 的内容;
const getData = function () {
    let path = 'douban.json'
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
/*
    电影名： url
 */
const imgFromData = function (data) {
    let map = {}
    let key = 'coverUrl'
    for (let movie of data) {
        let value = movie[key]
        let name = movie['name']
        map[name] = value
    }
    return map
}
const downloadImage = function (map) {
     for (let name in map) {
        let filename = `${name}.jpg`
        let url = map[name]
         // log('url', url)
        const fs = require('fs')
        request(url).pipe(fs.createWriteStream(filename))
    }
}
const main = function () {
    let data = getData()
    // 下载 前十的电影图片
    let ten_movies = []
    for (let i = 0; i < 10; i++) {
        ten_movies.push(data[i])
    }
    let map = imgFromData(ten_movies)
    log('map', map)
    downloadImage(map)
}

main()
