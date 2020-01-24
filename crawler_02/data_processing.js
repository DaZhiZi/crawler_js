const { log , find2, findBetween, arrOfStr, } = require('./utils')
// 系统标准库放在前面
const fs = require('fs')

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
const typeOfName = function (data, typeName) {
    let list = []
    let key = 'types'
    for (let movie of data) {
        let value = movie[key]
        if (value.includes(typeName)) {
            let name = movie['name']
            list.push(name)
        }
    }
    return list
}
const countrys = function (data) {
    let key = 'countrys'
    let d = dataProcess(data, key)
    return d
}
const types = function (data) {
    let key = 'types'
    let d = dataProcess(data, key)
    return d
}
/*
typs 和 countrys 没有继续优化是有其他原因
 */
const main = function () {
    let data = getData()
    // let r = countrys(data)
    // let name = '台湾'
    // let r = countryOfName(data, name)
    // log('r', r)

    // types
    // let r = types(data)
    let typeName = '动作'
    let r = typeOfName(data, typeName)
    log('r', r)
}

main()
/*
中国大陆
[ '霸王别姬',
  '大话西游之大圣娶亲',
  '鬼子来了',
  '活着',
  '大话西游之月光宝盒',
  '让子弹飞',
  '大闹天宫',
  '末代皇帝',
  '阳光灿烂的日子',
  '岁月神偷',
  '心迷宫',
  '二十二',
  '可可西里',
  '哪吒闹海',
  '新龙门客栈',
  '疯狂的石头' ]
 */
/* 香港
[ '霸王别姬',
  '大话西游之大圣娶亲',
  '无间道',
  '活着',
  '大话西游之月光宝盒',
  '让子弹飞',
  '春光乍泄',
  '阳光灿烂的日子',
  '重庆森林',
  '甜蜜蜜',
  '射雕英雄传之东成西就',
  '倩女幽魂',
  '喜剧之王',
  '岁月神偷',
  '东邪西毒',
  '英雄本色',
  '唐伯虎点秋香',
  '纵横四海',
  '花样年华',
  '阿飞正传',
  '可可西里',
  '青蛇',
  '新龙门客栈',
  '疯狂的石头',
  '枪火' ]
 */
/* 台湾
[ '少年派的奇幻漂流',
'饮食男女',
'一一',
'喜宴',
'东邪西毒',
'牯岭街少年杀人事件',
 '蓝色大门' ]
 */
/*

 */

/*
{
  '美国': 144,
  '中国大陆': 16,
  '香港': 25,
  '法国': 24,
  '意大利': 12,
  '日本': 33,
  '英国': 34,
  '印度': 4,
  '瑞士': 4,
  '德国': 20,
  '加拿大': 7,
  '冰岛': 1,
  '韩国': 9,
  '台湾': 7,
  '新西兰': 3,
  '波兰': 1,
  '伊朗': 2,
  '澳大利亚': 6,
  '西班牙': 6,
  '丹麦': 1,
  '瑞典': 2,
  '巴西': 2,
  '奥地利': 1,
  '阿联酋': 1,
  '南非': 2,
  '阿根廷': 1,
  '爱尔兰': 1,
  '捷克': 1,
  '泰国': 1,
  '西德': 1,
  '博茨瓦纳': 1 ,
  }
 */

/* types
{ '犯罪': 45,
  '剧情': 194,
  '爱情': 58,
  '同性': 8,
  '动作': 30,
  '喜剧': 46,
  '战争': 19,
  '灾难': 1,
  '动画': 32,
  '奇幻': 32,
  '历史': 12,
  '科幻': 24,
  '悬疑': 33,
  '冒险': 45,
  '歌舞': 5,
  '音乐': 6,
  '传记': 15,
  '家庭': 23,
  '惊悚': 36,
  '运动': 2,
  '纪录片': 4,
  '儿童': 3,
  '情色': 1,
  '西部': 4,
  '古装': 6,
  '武侠': 3,
  '恐怖': 2 }
 */
const copy_obj = function (obj) {
     let map = {}
     for (let v in obj) {
         map[v] = obj[v]
     }
     return map
}

let ten_type = {
    '犯罪': 45,
    '剧情': 194,
    '爱情': 58,
    '动作': 30,
    '喜剧': 46,
    '动画': 32,
    '奇幻': 32,
    '悬疑': 33,
    '冒险': 45,
    '惊悚': 36,
}
let l = Object.keys(ten_type).length
log('l', l)
/* 动作
[ '这个杀手不太冷',
  '蝙蝠侠：黑暗骑士',
  '搏击俱乐部',
  '指环王3：王者无敌',
  'V字仇杀队',
  '指环王2：双塔奇兵',
  '指环王1：魔戒再现',
  '勇敢的心',
  '让子弹飞',
  '黑客帝国',
  '加勒比海盗',
  '阿凡达',
  '七武士',
  '谍影重重3',
  '东邪西毒',
  '英雄本色',
  '超能陆战队',
  '纵横四海',
  '蝙蝠侠：黑暗骑士崛起',
  '被解救的姜戈',
  '谍影重重',
  '谍影重重2',
  '小萝莉的猴神大叔',
  '黑客帝国3：矩阵革命',
  '新龙门客栈',
  '终结者2：审判日',
  '勇闯夺命岛',
  '变脸',
  '黑鹰坠落',
  '枪火' ]
 */