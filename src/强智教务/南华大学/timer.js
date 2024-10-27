async function scheduleTimer({ providerRes, parserRes } = {}) {
  // 支持异步操作 推荐await写法
  // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
  let maxWeek = 0
  if (window.ltxhhz) {
    ltxhhz.frameDom.querySelectorAll('font').forEach(e => {
      try {
        if (e.title.includes('周次')) {
          let n = /\d+/.exec(e.innerText)[0]
          maxWeek = Math.max(+n, maxWeek)
        }
      } catch (error) {
        console.error('获取最大周出错,当前值为 ' + maxWeek, error)
      }
    })
  }
  return {
    totalWeek: maxWeek, // 总周数：[1, 30]之间的整数
    // startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
    startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    // showWeekend: false, // 是否显示周末
    forenoon: 4, // 上午课程节数：[1, 10]之间的整数
    afternoon: 4, // 下午课程节数：[0, 10]之间的整数
    night: 2, // 晚间课程节数：[0, 10]之间的整数
    sections: [
      {
        section: 1,
        startTime: '8:20',
        endTime: '9:05'
      },
      {
        section: 2,
        startTime: '9:15',
        endTime: '10:00'
      },
      {
        section: 3,
        startTime: '10:20',
        endTime: '11:05'
      },
      {
        section: 4,
        startTime: '11:15',
        endTime: '12:00'
      },
      {
        section: 5,
        startTime: '14:30',
        endTime: '15:15'
      },
      {
        section: 6,
        startTime: '15:25',
        endTime: '16:10'
      },
      {
        section: 7,
        startTime: '16:30',
        endTime: '17:15'
      },
      {
        section: 8,
        startTime: '17:25',
        endTime: '18:10'
      },
      {
        section: 9,
        startTime: '19:30',
        endTime: '20:15'
      },
      {
        section: 10,
        startTime: '20:25',
        endTime: '21:10'
      }
    ] // 课程时间表，注意：总长度要和上边配置的节数加和对齐
  }
  // PS: 夏令时什么的还是让用户在夏令时的时候重新导入一遍吧，在这个函数里边适配吧！奥里给！————不愿意透露姓名的嘤某人
}
