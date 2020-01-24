const { log , find2, findBetween, arrOfStr, } = require('./utils')
// 系统标准库放在前面
const fs = require('fs')

const Movie = function() {
    this.movieId = 0
    this.name = ''
    this.score = 0
    this.quote = ''
    this.numOfComment = 0 // 多少人评论
    this.coverUrl = ''
    this.countrys = ''
    this.director = ''
    this.actor = ''
    this.year = ''
    this.types = ''
}

const elseFromInfo = function(inform) {
    let obj = {}
    let s = inform
    let arr = s.split('&nbsp;/&nbsp;')
    obj.year = Number(arr[0])
    obj.countrys  = arrOfStr(arr[1])
    obj.types = arrOfStr(arr[2])
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
    m.numOfComment = findBetween(s, '<span property="v:best" content="10.0"></span>\n' +
        '                                <span>', '人评价</span>')
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
    m.countrys = o.countrys
    m.types = o.types
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
