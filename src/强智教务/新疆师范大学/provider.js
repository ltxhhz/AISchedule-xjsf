async function scheduleHtmlProvider(iframeContent = '', frameContent = '', dom = document) {
  // 内嵌loadTool工具，传入工具名即可引用公共工具函数(暂未确定公共函数，后续会开放)
  await loadTool('AIScheduleTools')
  if (typeof AIScheduleAlert == 'undefined') {
    var AIScheduleAlert = alert
  }
  if (!window.ltxhhz) window.ltxhhz = {}
  const content = dom.getElementById('edu-cm')
  /** @type {HTMLIFrameElement} frame */
  let frame,
    /** @type {Document} frameDom */
    frameDom
  if (!content) {
    await AIScheduleAlert('请在登录完成后并跳转后点击一键导入，如网页打不开请检查vpn是否已连接\n有问题请联系qq/wx:1270897967')
    return 'do not continue'
  } else {
    for (const node of content.children) {
      if (node.style.display != 'none') {
        ltxhhz.frame = frame = node
        ltxhhz.frameDom = frameDom = node.contentDocument
        break
      }
    }
    if (!frame || (frameDom.title !== '学期理论课表' && frameDom.title !== '个人课表信息')) {
      await AIScheduleAlert('在"学期理论课表(学生端)/个人课表信息(教师端)"页面出现后，选择当前学期的课表，然后点击一键导入\n有问题请联系qq/wx:1270897967')
      return 'do not continue'
    }
    let configDiv = frameDom.getElementById('ltxhhzConfig')
    if (!configDiv) {
      configDiv = frameDom.getElementById('timetable').appendChild(
        (() => {
          const div = document.createElement('div')
          div.id = 'ltxhhzConfig'
          div.style.display = 'none'
          return div
        })()
      )
    }
    const configObj = {}
    configObj.isTeacher = document.querySelector('.userInfo span').innerText === '教师'
    if (!configObj.isTeacher) {
      /** @type {boolean} */
      const userConfirm = await AIScheduleConfirm({
        titleText: '提示',
        contentText: '是否隐藏老师的职称信息(“教授”、“导师”等)？\n点击后请等待一会',
        cancelText: '保留',
        confirmText: '隐藏'
      })
      if (userConfirm) {
        configObj.delTitle = true
      }
    }

    configDiv.innerText = JSON.stringify(configObj)
    // await AIScheduleAlert("如果生成的课表中“午休”和“晚休”的位置不对，请到设置中的“课程表节数和时间设置”里的“一天课节数”修改早中晚的课数。\np.s.如果记不住请截图\n有问题请联系qq:1270897967")
    const timetable = frameDom.getElementById('timetable').cloneNode(true)
    checkHidden(timetable.querySelector('tbody'))
    timetable.querySelectorAll('.kbcontent').forEach(flattenFont)
    return timetable.outerHTML
  }
}

function checkHidden(element) {
  if (element.type === 'hidden' || element.style.display === 'none') {
    element.remove()
  } else {
    Array.from(element.children).forEach(checkHidden)
  }
}

function flattenFont(element) {
  // 递归处理所有子节点
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i]
    if (child.nodeType === Node.ELEMENT_NODE) {
      flattenFont(child)
    }
  }

  if (element.tagName === 'FONT') {
    const parent = element.parentNode
    if (!parent) return

    // 处理第一个br及其后的内容
    let brFound = false
    const nodesToMove = []
    const keepNodes = []
    const childNodes = Array.from(element.childNodes)

    for (const node of childNodes) {
      if (!brFound && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        brFound = true
        nodesToMove.push(node)
      } else if (brFound) {
        nodesToMove.push(node)
      } else {
        keepNodes.push(node)
      }
    }

    // 更新当前font的内容，仅保留br之前的部分
    element.replaceChildren(...keepNodes)

    // 将nodesToMove插入到父级，当前font之后
    const nextSibling = element.nextSibling
    if (nodesToMove.length > 0) {
      nodesToMove.forEach(node => {
        parent.insertBefore(node, nextSibling)
      })
    }

    // 处理子font元素，提升到父级
    const childFonts = []
    for (const child of element.children) {
      if (child.tagName === 'FONT') {
        childFonts.push(child)
      }
    }

    childFonts.forEach(childFont => {
      parent.insertBefore(childFont, nextSibling)
    })
  }
}
