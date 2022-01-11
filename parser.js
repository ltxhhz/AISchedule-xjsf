function scheduleHtmlParser(html) {
  //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
  let result = []
  let $ = cheerio.load(html, {
    decodeEntities: false
  })
  // let a = $('tbody')
  try {
    $('tbody').children().each(function (i, el) {
      if (i) { //除去第一行
        const num = [] //那一节课到哪一节课
        let brk = false
        $(el).children().each(function (i1, el1) { //tr
          if (brk) return
          if (i1 == 0) { //th
            let inner = el1.childNodes[0]
            if (inner.data.includes('备注')) {
              brk = true
              return
            }
            brk = false
            num.push(...Array.from(inner.data.trim().matchAll(/\d+/g)).map(e => +e))
          } else { //td
            $(this).children().each((i2, el2) => { //格子
              const none = new RegExp(/display\s?:\s?none/)
              if (el2.name == 'div' && !(el2.attribs && none.test(el2.attribs.style))) { //显示的格子
                let cls = {}
                el2.childNodes.forEach((node, index) => { //格子里每一行
                  if (node.type == 'tag' && (node.attribs && none.test(node.attribs.style))) return
                  if (node.type == 'text') {
                    if (index == 0) {
                      if (!node.data.trim()) return
                      cls.name = node.data.trim()
                      cls.day = i1
                      cls.sections = num.map(sec => ({
                        section: sec
                      }))
                    }
                  } else {
                    if (node.name == 'font') {
                      if (node.attribs && node.attribs.title && node.attribs.title.includes('教师')) {
                        cls.teacher = $(node).text().replace('其他', '').trim()
                      } else if (node.attribs && node.attribs.title && node.attribs.title.includes('周次')) {
                        let str = /(\d.*\d).*周/.exec($(node).text().trim())
                        if (str[1].includes('-')) {
                          let arr = str[1].split('-'),
                            arr1 = Array(arr[1] - arr[0] + 1).fill().map((v, i) => +i + +arr[0].trim())
                          if (str[0].includes('单周')) {
                            cls.weeks = arr1.filter(v => v & 1)
                          } else if (str[0].includes('双周')) {
                            cls.weeks = arr1.filter(v => !(v & 1))
                          } else {
                            cls.weeks = arr1
                          }
                        } else {
                          cls.weeks = str[1].split(',').map(v => +v.trim())
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
    return result
  } catch (error) {
    console.info(error);
  }
}