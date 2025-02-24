function scheduleHtmlParser(html) {
  //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
  let result = []
  /**@type {import('cheerio').CheerioAPI} */
  let $ = cheerio.load(html, {
    decodeEntities: false
  })
  // let a = $('tbody')
  let config = {}
  try {
    config = JSON.parse($('#ltxhhzConfig').text())
  } catch (error) {}
  try {
    $('tbody')
      .children()
      .each(function (i, el) {
        if (i) {
          //除去第一行
          const num = [] //哪一节课到哪一节课
          const children1 = $(el).children()
          for (let i1 = 0; i1 < children1.length; i1++) {
            //tr
            const el1 = children1.get(i1)
            console.log(`第${i}行 第${i1}列`)
            if (i1 === 0) {
              //th
              let inner = $(el1).text().trim()
              if (inner.includes('备注')) {
                break
              }
              num.push(...Array.from(inner.matchAll(/\d+/g)).map(e => +e))
            } else {
              //td
              let cls = {
                name: '',
                day: i1,
                sections: [2 * i - 1, 2 * i]
              }
              //td
              $('.kbcontent', el1)
                .children()
                .each(function (i2, el2) {
                  const str = $(el2).text().trim()
                  if (!cls.name) {
                    if (/^\-+$/.test(el2.prev.data.trim())) {
                      return
                    }
                    cls.name = el2.prev.data.trim()
                  } else {
                    if (el2.attribs && el2.attribs.title && el2.attribs.title.includes('教师')) {
                      if (config.delTitle) {
                        cls.teacher = str.replace(config.delTitle ? /(其他|副?教授|讲师|农艺师|\(.+?\)|（.+?）)$/g : '', '').trim()
                      } else {
                        cls.teacher = str
                      }
                    } else if (el2.attribs && el2.attribs.title && el2.attribs.title.includes('教室')) {
                      cls.position = str
                    } else if (el2.attribs && el2.attribs.title && el2.attribs.title.includes('周次')) {
                      cls.weeks = []
                      const weekStr = str.match(/([\d-,]+)\(?(.?周)\)?/)
                      weekStr[1]
                        .split(',')
                        .map(w => {
                          if (w.includes('-')) {
                            const arr = w.split('-')
                            const arr1 = Array(arr[1] - arr[0] + 1)
                              .fill()
                              .map((v, i) => +i + +arr[0].trim())
                            if (weekStr[2] === '单周') {
                              return arr1.filter(v => v & 1)
                            } else if (weekStr[2] === '双周') {
                              return arr1.filter(v => !(v & 1))
                            }
                            return arr1
                          } else {
                            return +w.trim()
                          }
                        })
                        .forEach(w => {
                          if (Array.isArray(w)) {
                            cls.weeks.push(...w)
                          } else {
                            cls.weeks.push(w)
                          }
                        })
                    } else if (el2.next && el2.next.type === 'text') {
                      const text = el2.next.data.trim()
                      if (/^\-+$/.test(text)) {
                        //下一个是分割线
                        if (!cls.weeks) {
                          throw new Error('未匹配周次')
                        }
                        result.push(cls)
                        cls = {
                          name: '',
                          day: i1,
                          sections: [2 * i - 1, 2 * i]
                        }
                      } else {
                        if (config.isTeacher) {
                          if (/\d班/.test(text)) {
                            cls.teacher = text
                          }
                        }
                      }
                    }
                  }
                })
              if (cls.name) {
                if (!cls.weeks) {
                  throw new Error('未匹配周次')
                }
                result.push(cls)
              }
              console.info(cls)
            }
          }
        }
      })
    console.info(result)
    return result
  } catch (error) {
    console.error(error)
  }
}
