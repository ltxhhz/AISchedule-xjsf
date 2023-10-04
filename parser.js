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
    $('tbody').children().each(function (i, el) {
      if (i) { //除去第一行
        const num = [] //那一节课到哪一节课
        let brk = false
        $(el).children().each(function (i1, el1) { //tr
          console.log(`第${i}行 第${i1}列`);
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
              if (el2.name == 'div' && !(el2.attribs && (el2.attribs.type == 'hidden' || none.test(el2.attribs.style)))) { //显示的格子
                let cls = {
                  name: ''
                }
                el2.childNodes.forEach((node, index) => { //格子里每一行
                  if (node.type == 'text') {
                    /**@type {string} */
                    const str = node.data.trim()
                    if (!str) return
                    if (/^\-+$/.test(str)) { //分割线
                      result.push(cls)
                      cls = {
                        name: ''
                      }
                      return
                    }
                    if (config.isTeacher) {
                      if (/\-.+班/.test(str)) {
                        cls.teacher = str
                      } else if (/学时.\d/.test(str)) {
                        cls.name += `|${str.match(/学时.(\d+)/)[1]}学时`
                      } else if (/\[[\d\-]+\]/.test(str)) {
                        //匹配第几节课 不管
                      } else {
                        cls.name += cls.name ? `|${str}` : str
                      }
                    } else {
                      cls.name += cls.name ? `|${str}` : str
                    }

                    cls.day = i1
                    cls.sections = num.map(sec => ({
                      section: sec
                    }))
                  } else {
                    if (node.attribs && none.test(node.attribs.style)) return
                    if (node.name == 'font') {
                      if (node.attribs && node.attribs.title && node.attribs.title.includes('教师')) {
                        cls.teacher = $(node).text().replace(config.delTitle ? /其他|副?教授|讲师|\(.+?\)|（.+?）/g : '', '').trim()
                      } else if (node.attribs && node.attribs.title && node.attribs.title.includes('周次')) {
                        const str = /(\d+[\s\-]*\d+|[\d\s,]+).*周/.exec($(node).text().trim()),
                          str1 = /([\d\s,\-]+).*周/.exec($(node).text().trim())
                        if (str1[1].includes('-') && str1[1].includes(',')) {
                          cls.weeks = []
                          str1[1].split(',').map(v => {
                            if (v.includes('-')) {
                              const arr = v.split('-'),
                                arr1 = Array(arr[1] - arr[0] + 1).fill().map((v, i) => +i + +arr[0].trim())
                              if (str[0].includes('单周')) {
                                return arr1.filter(v => v & 1)
                              } else if (str[0].includes('双周')) {
                                return arr1.filter(v => !(v & 1))
                              } else {
                                return arr1
                              }
                            } else {
                              return +v.trim()
                            }
                          }).forEach(e => {
                            if (typeof e == 'string' || typeof e == 'number') {
                              cls.weeks.push(e)
                            } else {
                              cls.weeks.push(...e)
                            }
                          })
                        } else if (str[1].includes('-')) {
                          const arr = str[1].split('-'),
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
    console.error(error);
  }
}