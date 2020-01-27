/*
 主要介绍 6 个点
- 爬虫的原理(等上课讲解)
- 普通的爬虫(以豆瓣电影为例)
- 需要登录的爬虫(以知乎为例)
- 爬虫的奥秘(等上课讲解)
- 动态内容的爬取(以知乎的动态内容为例)
- 自定义模块的方法和使用方式

*/

// 这一行是套路, 给 node.js 用的
// 如果没有这一行, 就没办法使用一些 let const 这样的特性
"use strict"


const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const { log , find2, findBetween, arrOfStr, } = require('./utils')

/*
本文件需要安装两个基本的库
request 用于下载网页
cheerio 用于解析网页数据

*/

// 定义一个类来保存电影的信息
// 这里只定义 保存的数据
// 分别是  电影名 评分 引言 排名 封面图片地址
const Movie = function() {
    this.name = ''
    this.score = 0
    this.quote = ''
    this.ranking = 0
    this.coverUrl = ''

    this.countrys = ''
    this.director = ''
    this.actor = ''
    this.year = ''
    this.types = ''
 }

const elseInform = function (inform) {
    let obj = {}
    let s = inform
    let director = findBetween(s, '导演: ', '主演: ')
    obj.director =  director.split('  ')[0]
    obj.actor = findBetween(s, '主演: ', '\n')
    // log('obj.actor', obj.actor)
    let else_thing = s.split('\n')[2]

    let arr = else_thing.split(' / ')
    obj.year = Number(arr[0])
    obj.countrys  = arrOfStr(arr[1])
    obj.types = arrOfStr(arr[2])
    return obj
}
const movieFromDiv = function(div) {
    // 这个函数来从一个电影 div 里面读取电影信息
    const m = new Movie()
    // 使用 cheerio.load 函数来返回一个可以查询的特殊对象
    const e = cheerio.load(div)

    // 然后就可以使用 querySelector 语法来获取信息了
    // .text() 获取文本信息
    m.name = e('.title').text()
    m.score = e('.rating_num').text()
    m.quote = e('.inq').text()

    const pic = e('.pic')
    m.ranking = pic.find('em').text()
    // 元素的属性用 .attr('属性名') 确定
    m.coverUrl = pic.find('img').attr('src')

    let inform = e('.bd').find('p').text()
    log('inform', inform)
    let o =  elseInform(inform)
    m.director = o.director
    m.actor = o.actor
    m.year = o.year
    m.countrys = o.countrys
    m.types = o.types
    return m
}

const saveMovies = function(movies) {
    // 这个函数用来把一个保存了所有电影对象的数组保存到文件中
    const fs = require('fs')
    const path = 'douban.json'
    // 第二个参数是 null 不用管
    // 第三个参数是 缩进层次
    const s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}

/*
<div class="item">
    <div class="pic">
        <em class="">1</em>
        <a href="https://movie.douban.com/subject/1292052/">
            <img alt="肖申克的救赎" src="https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p480747492.jpg" class="">
        </a>
    </div>
    <div class="info">
        <div class="hd">
            <a href="https://movie.douban.com/subject/1292052/" class="">
                <span class="title">肖申克的救赎</span>
                <span class="title"> / The Shawshank Redemption</span>
                <span class="other"> / 月黑高飞(港)  /  刺激1995(台)</span>
            </a>
            <span class="playable">[可播放]</span>
        </div>
        <div class="bd">
            <p class="">
                导演: 弗兰克·德拉邦特 Frank Darabont&nbsp;&nbsp;&nbsp;主演: 蒂姆·罗宾斯 Tim Robbins /...<br>
                1994&nbsp;/&nbsp;美国&nbsp;/&nbsp;犯罪 剧情
            </p>
            <div class="star">
                <span class="rating5-t"></span>
                <span class="rating_num" property="v:average">9.6</span>
                <span property="v:best" content="10.0"></span>
                <span>762422人评价</span>
            </div>
                <p class="quote">
                    <span class="inq">希望让人自由。</span>
                </p>
        </div>
    </div>
</div>
*/

const downloadCovers = function(movies) {
    for (let i = 0; i < movies.length; i++) {
        const m = movies[i]
        const url = m.coverUrl
        // request('http://abc.com/abc.png').pipe(fs.createWriteStream('abc.png'));
        const path = m.name.split('/')[0] + '.jpg'
        request(url).pipe(fs.createWriteStream(path))
    }
}

const moviesFromUrl = function(url) {
    // request 从一个 url 下载数据并调用回调函数
    request(url, function(error, response, body) {
        // 回调函数的三个参数分别是  错误, 响应, 响应数据
        // 检查请求是否成功, statusCode 200 是成功的代码
        if (error === null && response.statusCode == 200) {
            // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
            // body 就是 html 内容
            const e = cheerio.load(body)
            const movies = []
            // 查询对象的查询语法和 DOM API 中的 querySelector 一样
            const movieDivs = e('.item')
            for(let i = 0; i < movieDivs.length; i++) {
                let element = movieDivs[i]
                // 获取 div 的元素并且用 movieFromDiv 解析
                // 然后加入 movies 数组中
                const div = e(element).html()
                const m = movieFromDiv(div)
                movies.push(m)
            }
            // 保存 movies 数组到文件中
            saveMovies(movies)
            // downloadCovers(movies)
        } else {
            log('*** ERROR 请求失败 ', error)
        }
    })
}

const __main = function() {
    const url = 'https://movie.douban.com/top250'
    moviesFromUrl(url)
}


// 程序开始的主函数
__main()
