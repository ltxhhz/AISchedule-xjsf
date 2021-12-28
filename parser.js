function scheduleHtmlParser(html) {
  //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
  let result = [],
    sectionTimes = [{
      "section": 1,
      "startTime": "10:00",
      "endTime": "10:45"
    },
    {
      "section": 2,
      "startTime": "10:55",
      "endTime": "11:40"
    },
    {
      "section": 3,
      "startTime": "12:00",
      "endTime": "12:45"
    },
    {
      "section": 4,
      "startTime": "12:45",
      "endTime": "13:30"
    },
    {
      "section": 5,
      "startTime": "15:30",
      "endTime": "16:15"
    },
    {
      "section": 6,
      "startTime": "16:25",
      "endTime": "17:10"
    },
    {
      "section": 7,
      "startTime": "17:30",
      "endTime": "18:15"
    },
    {
      "section": 8,
      "startTime": "18:25",
      "endTime": "19:10"
    },
    {
      "section": 9,
      "startTime": "20:00",
      "endTime": "20:45"
    },
    {
      "section": 10,
      "startTime": "20:55",
      "endTime": "21:40"
    }]
  let $ = cheerio.load(html, { decodeEntities: false })
  // let a = $('tbody')
  try {
    $('tbody').children().each(function (i, el) {
      if (i) {//除去第一行
        const num = []//那一节课到哪一节课
        let brk = false
        $(el).children().each(function (i1, el1) {//tr
          if (brk) return
          if (i1 == 0) {//th
            let inner = el1.childNodes[0]
            if (inner.data.includes('备注')) {
              brk = true
              return
            }
            brk = false
            num.push(...Array.from(inner.data.trim().matchAll(/\d+/g)).map(e => Number(e)))
          } else {//td
            $(this).children().each((i2, el2) => {//格子
              const none = new RegExp(/display\s?:\s?none/)
              if (el2.name == 'div' && !(el2.attribs && none.test(el2.attribs.style))) {//显示的格子
                let cls = {}
                el2.childNodes.forEach((node, index) => {//格子里每一行
                  if (node.type == 'tag' && (node.attribs && none.test(node.attribs.style))) return
                  if (node.type == 'text') {
                    if (index == 0) {
                      if (!node.data.trim()) return
                      cls.name = node.data.trim()
                      cls.day = i1
                      cls.sections = num.map(sec => ({ section: sec }))
                    }
                  } else {
                    if (node.name == 'font') {
                      if (node.attribs && node.attribs.title && node.attribs.title.includes('教师')) {
                        cls.teacher = $(node).text().trim()
                      } else if (node.attribs && node.attribs.title && node.attribs.title.includes('周次')) {
                        let str = /(\d.*\d).*周/.exec($(node).text().trim())[1]
                        if (str.includes('-')) {
                          let arr = str.split('-')
                          cls.weeks = Array.from({ length: arr[1] }).map((v, i) => Number(i) + Number(arr[0].trim()))
                        } else {
                          cls.weeks = str.split(',').map(v => Number(v.trim()))
                        }
                      } else if (node.attribs && node.attribs.title && node.attribs.title.includes('教室')) {
                        cls.position = $(node).text().trim()
                      }
                    }
                  }
                })
                if (cls.name) {
                  result.push(cls)
                }
                console.info(cls)
              }
            })
          }
        })
      }
    })
    console.info(result)
    return { courseInfos: result, sectionTimes }
  } catch (error) {
    console.info(error);
  }
}