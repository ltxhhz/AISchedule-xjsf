async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  // 内嵌loadTool工具，传入工具名即可引用公共工具函数(暂未确定公共函数，后续会开放)
  await loadTool('AIScheduleTools')
  // const {
  //   AIScheduleAlert,
  //   AISchedulePrompt
  // } = AIScheduleTools()
  if (typeof AIScheduleAlert == 'undefined') {
    var AIScheduleAlert = alert
  }
  if (!window.ltxhhz) window.ltxhhz = {}
  const content = dom.getElementById('edu-cm')
  let center, frame, frameDom
  if (!content) {
    await AIScheduleAlert('请在登录完成后并跳转后点击一键导入，如网页打不开请检查vpn是否已连接\n有问题请联系qq:1270897967')
    return
  } else {
    for (const node of content.children) {
      !center && (center = node)
      if (node.style.display != 'none') {
        ltxhhz.frame = frame = node
        ltxhhz.frameDom = frameDom = node.contentDocument
        break
      }
    }
    if (!frame || frameDom.title != '学期理论课表') {
      await AIScheduleAlert('在"学期理论课表"页面出现后，选择当前学期的课表，然后点击一键导入\n有问题请联系qq:1270897967')
      return 'do not continue'
      /* //支持异步时使用
      center.contentDocument.querySelector("body > div.personal-center.student-personal-center > div.personal-right-item > div.personal-function.personal-common.personal-height > ul > div:nth-child(1)").click()
      // center.contentWindow.kjcdShow('NEW_XSD_PYGL', 'NEW_XSD_PYGL_WDKB', 'NEW_XSD_PYGL_WDKB_XQLLKB', '/xskb/xskb_list.do', '学期理论课表')
      alert('在"学期理论课表"页面出现后，选择当前学期的课表，然后点击一键导入')
      setTimeout(() => {
        for (const node of content.children) {
          !center && (center = node)
          if (node.style.display != 'none') {
            frame = node
            frameDom = node.contentDocument
            break
          }
        }
      }, 1500);
      return new Promise((resolve, reject) => {
        let btn = dom.createElement('div')
        btn.className = 'button el-button'
        btn.innerText = '一键导入'
        btn.style.position = 'fixed'
        btn.style.top = 0
        btn.style.left = 0
        btn.style.width = innerWidth+'px'
        btn.style.height = innerHeight * 0.1+'px'
        btn.onclick = function (e) {
          try {
            resolve(frameDom.getElementById('timetable').outerHTML)
          } catch (error) {
            alert('获取失败，请检查课表页面是否打开')
          }
        }
        debugger
        dom.body.appendChild(btn)
      }).then(e => {
        alert("如果生成的课表中“午休”和“晚休”的位置不对，请到设置中的“课程表节数和时间设置”里的“一天课节数”修改早中晚的课数。\np.s.如果记不住请截图")
        return e
      }) */
    }
    // await AIScheduleAlert("如果生成的课表中“午休”和“晚休”的位置不对，请到设置中的“课程表节数和时间设置”里的“一天课节数”修改早中晚的课数。\np.s.如果记不住请截图\n有问题请联系qq:1270897967")
    return frameDom.getElementById('timetable').outerHTML
  }
}