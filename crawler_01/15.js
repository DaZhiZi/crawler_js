//  爬虫

/*
按照本次项目的要求, 可以实现一个爬虫, 基本上用的都是你自己实现的函数和功能

浏览器显示网页的原理, 实际上是把一个 .html 格式的文本文件渲染成我们看到的网页
打开 chrome 浏览器, 输入下面的地址可以进入豆瓣电影 top250 的页面
https://movie.douban.com/top250

在浏览器中点右键 - 查看网页源代码(View Page Source) 可以打开这个页面的源代码
第一个页面有 25 个电影
我们以每部电影的评分为例, 观察发现评分是包含在 property="v:average"> 和 </span> 中的
所以我们利用 findBetween 函数可以提取每部电影的评分
注意，这个函数需要你自己实现

下面我们介绍一下具体的用法
*/
const { log , find2, findBetween, } = require('./utils')
// 系统标准库放在前面
const fs = require('fs')

// 分别是  电影名 评分 引言 排名 封面图片地址
const Movie = function() {
    this.movieId = 0
    this.name = ''
    this.score = 0
    this.quote = ''
    this.people = 0 // 多少人评论
    this.ranking = 0
    this.coverUrl = ''
    this.country = ''
    this.director = ''
    this.actor = ''
    this.year = ''
    this.type = ''
}


const elseFromInfo = function(inform) {
    let obj = {}
    let s = inform
    let arr = s.split('&nbsp;/&nbsp;')
    obj.year = Number(arr[0])
    obj.country  = arr[1]
    obj.type = arr[2]
    return obj
}
const movieFromDiv = function(div) {
    // 这个函数来从一个电影 div 里面读取电影信息
    let s = div
    const m = new Movie()
    m.movieId = findBetween(s, '<em class="">', '</em>')
    m.name = findBetween(s, '<span class="title">', '</span>')
    m.score = findBetween(s, '<span class="rating_num" property="v:average">', '</span>')
    m.quote = findBetween(s, '<p class="quote">\n' +
        '                                <span class="inq">', '</span>')
    m.people = findBetween(s, '<span property="v:best" content="10.0"></span>\n' +
        '                                <span>', '人评价</span>')
    m.ranking = findBetween(s, '<span class="rating_num" property="v:average">', '</span>')
    m.coverUrl = findBetween(s, 'src="', '" class="">\n' +
        '                    </a>\n' +
        '                </div>\n' +
        '                <div class="info">')
    let infom = findBetween(s, '<br>', '\n' +
        '                        </p>')
    m.director = findBetween(s, '导演: ', '主演: ')
    m.director =  m.director.split('&nbsp;&nbsp;')[0]
    m.actor = findBetween(s, '主演: ', '<br>')
    /*
    obj.year = arr[0]
    obj.country  = arr[1]
    obj.type = arr[2]
     */
    let o =  elseFromInfo(infom)
    m.year = o.year
    m.country = o.country
    m.type = o.type
    return m
}

const saveMovies = function(movies) {
    // 这个函数用来把一个保存了所有电影对象的数组保存到文件中
    let fs = require('fs')
    let path = 'douban.json'
    // 第二个参数是 null 不用管
    // 第三个参数是 缩进层次
    let s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}
const cachedUrl = function (url) {
    // 通常爬虫会使用 syncrequest 来获取页面
    // 本次项目我们预先下载好了豆瓣电影 top250 的页面，所以通过以下方式来获取缓存好的文件
    let cachePath = 'cached_html'
    // 缓存的文件名
    let cacheFile = cachePath + '/' + url.split('?')[1] + '.html'
    // 验证文件是否存在
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data.toString()
    } else {
        // 因为我们预先下载好了豆瓣电影 top250 的页面
        // 所以这里不需要处理 else 的情况
    }
}

// 现在我们调用 cachedUrl(url) 就可以获取相应 url 中页面的内容, string 类型
//
// 项目: 实现 ratings 函数, 它返回一个数组, 包含 25 个电影的评分
// 注意, 电影评分是 string 类型

const divsFromHtml = function (html) {
    let divs = []
    let left = '<div class="item">'
    let right = '</div>\n' +
        '        </li>'

    let index = 0
    let s = html.slice(index)
    for (let i = 0; i < 25; i++) {
        let div = findBetween(s, left, right)
        divs.push(div)
        index += find2(s, left) + left.length
        s = html.slice(index)
    }
    return divs
}

const moviesFromUrl = function (url) {

    let data = cachedUrl(url)
    let movieDivs = divsFromHtml(data)
    // log('divs', movieDivs)

    let movies = []
    for (let div of movieDivs) {
        let movie = movieFromDiv(div)
        movies.push(movie)
    }
    // log('movies', movies)
    return movies
}

const main = () => {
    let movies = []
    for (let i = 0; i <= 225; i = i + 25) {
        let url = `https://movie.douban.com/top250?start=${i}`
        log('url', url)
        let ms = moviesFromUrl(url) // 获取数据
        movies = movies.concat(ms)
    }
    saveMovies(movies)  // 保存数据
}

if (require.main === module) {
   main()
}
