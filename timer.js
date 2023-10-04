async function scheduleTimer({
  providerRes,
  parserRes
} = {}) {
  // 支持异步操作 推荐await写法
  // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
  return {
    // totalWeek: 20, // 总周数：[1, 30]之间的整数
    // startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
    startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    showWeekend: false, // 是否显示周末
    forenoon: 4, // 上午课程节数：[1, 10]之间的整数
    afternoon: 4, // 下午课程节数：[0, 10]之间的整数
    night: 2, // 晚间课程节数：[0, 10]之间的整数
    sections: [{
        section: 1,
        startTime: "10:00",
        endTime: "10:45"
      },
      {
        section: 2,
        startTime: "10:55",
        endTime: "11:40"
      },
      {
        section: 3,
        startTime: "12:00",
        endTime: "12:45"
      },
      {
        section: 4,
        startTime: "12:45",
        endTime: "13:30"
      },
      {
        section: 5,
        startTime: "15:30",
        endTime: "16:15"
      },
      {
        section: 6,
        startTime: "16:25",
        endTime: "17:10"
      },
      {
        section: 7,
        startTime: "17:30",
        endTime: "18:15"
      },
      {
        section: 8,
        startTime: "18:25",
        endTime: "19:10"
      },
      {
        section: 9,
        startTime: "20:00",
        endTime: "20:45"
      },
      {
        section: 10,
        startTime: "20:55",
        endTime: "21:40"
      }
    ], // 课程时间表，注意：总长度要和上边配置的节数加和对齐
  }
  // PS: 夏令时什么的还是让用户在夏令时的时候重新导入一遍吧，在这个函数里边适配吧！奥里给！————不愿意透露姓名的嘤某人
}