export const toThousands = (num: number) => {
  let result = []
  let counter = 0
  const s = (num || 0).toString().split('')
  for (let i = s.length - 1; i >= 0; i--) {
    counter++
    result.unshift(s[i])
    if (!(counter % 3) && i !== 0) {
      result.unshift(',')
    }
  }
  return result.join('')
}
