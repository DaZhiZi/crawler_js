const { log , find2, findBetween, arrOfStr, } = require('./utils')
// 系统标准库放在前面
// node.js -- json格式文件 -- 文件处理 -- 数据处理 -- 数据可视化 -- 百度EChart
const fs = require('fs')
const request = require('syncrequest')
/*
   title 01
   title 02

   author
 */
const Book = function() {
    this.bookId = 0
    this.name = ''
    this.enName = ''
    this.score = 0
    this.quote = ''
    this.numOfComment = 0 // 多少人评论
    this.coverUrl = ''

    this.country = ''
    this.published = ''
    this.price = ''
    this.writer = ''
    this.translator = ''
    this.time = ''
}

const elseFromInfo = function(inform) {
    let obj = {}
    let s = inform
    let arr = s.split(' / ')
    obj.country = arr[0].split('] ')[0]
    obj.writer = arr[0].split('] ')[1]
    obj.translator = arr[1]
    obj.published = arr[2]
    obj.time = arr[3]
    obj.price = arr[4]
    return obj
}

const bookFromDiv = function(div, pageNum) {
    // 这个函数来从一个电影 div 里面读取电影信息
    let s = div
    const m = new Book()
    let id = findBetween(s, 'moreurl(this,{i:\'', '\'})"')
    m.bookId = Number(id) + 1 + pageNum * 25
    m.name =   findBetween(s, '"\n' +
        '                \n' +
        '              >\n' +
        '              ', '\n' +
        '                \n' +
        '              </a>')
    m.enName =  findBetween(s, '<span style="font-size:12px;">', '</span>')
    m.score =  findBetween(s, '<span class="rating_nums">', '</span>')
    m.quote =  findBetween(s, '<span class="inq">', '</span>')
    m.numOfComment =  Number(findBetween(s, '<span class="pl">(', '人评价'))
    m.coverUrl = findBetween(s, '<img src="', '" width="90" />')
    let inform = findBetween(s, '<p class="pl">[', '</p>')

    let o =  elseFromInfo(inform)
    let country = o.country
    if (country == '') {
        m.country = '中国'
    } else  {
        m.country = country
    }
    m.writer = o.writer
    m.translator = o.translator
    m.published = o.published
    m.time = o.time
    m.price = o.price
    return m
}

const saveBooks = function(books) {
    // 这个函数用来把一个保存了所有电影对象的数组保存到文件中
    let fs = require('fs')
    let path = 'books.json'
    // 第二个参数是 null 不用管
    // 第三个参数是 缩进层次
    let s = JSON.stringify(books, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}
const saveUrl = function (url, filename) {
    // 下载页面, 并得到页面的字符串内容赋值给变量 content
    let s = request.get.sync(url)
    let content = s.body
    // 把 content 的内容保存为文件 filename
    fs.writeFileSync(filename, content)
}
const cachedUrl = function (url) {
    // 通常爬虫会使用 syncrequest 来获取页面
    // 本次项目我们预先下载好了豆瓣电影 top250 的页面，所以通过以下方式来获取缓存好的文件
    let cachePath = '.'
    // 缓存的文件名
    let cacheFile = cachePath + '/' + url.split('?')[1].split('=')[1] + '.html'
    // 验证文件是否存在
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data.toString()
    } else {
        // 因为我们预先下载好了豆瓣电影 top250 的页面
        // 所以这里不需要处理 else 的情况
        let filename = url.split('?')[1].split('=')[1] + '.html'
        saveUrl(url, filename)
        cachedUrl(url)
    }
}

const divsFromHtml = function (html) {
    let divs = []
    let left = '<table width="100%">'
    let right = '</table>'
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

const booksFromUrl = function (url, pageNum) {
    let data = cachedUrl(url)
    let bookDivs = divsFromHtml(data)
    // log('divs', bookDivs)

    let books = []
    for (let div of bookDivs) {
        let book = bookFromDiv(div, pageNum)
        books.push(book)
    }
    // log('books', books)
    return books
}

const main = () => {
    let books = []
    for (let i = 0; i <= 225; i = i + 25) {
        let url = `https://book.douban.com/top250?start=${i}`
        log('url', url)
        let pageNum = Math.floor(i / 25)
        let ms = booksFromUrl(url, pageNum) // 获取数据
        books = books.concat(ms)
    }
    saveBooks(books)  // 保存数据
}

if (require.main === module) {
    main()
}
