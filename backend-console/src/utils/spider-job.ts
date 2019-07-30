export const reformatRate = (rate: string): string => {
  if (rate != null) {
    let len = rate.length
    let num = rate.substr(0, len - 1)
    let unit = rate.substr(len - 1, len)
    let zhUnit = ''
    switch (unit) {
      case 's':
        zhUnit = '秒'
        break
      case 'm':
        zhUnit = '分钟'
        break
      case 'h':
      case 'H':
        zhUnit = '小时'
        break
      case 'd':
      case 'D':
        zhUnit = '天'
        break
      case 'M':
        zhUnit = '个月'
        break
      case 'y':
      case 'Y':
        zhUnit = '年'
        break
      default:
    }
    return num + ' ' + zhUnit
  }
  return rate
}
