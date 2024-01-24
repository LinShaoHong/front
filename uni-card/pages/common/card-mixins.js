export default {
  data() {
    return {
      curIdx: 0,
      array: []
    }
  },
  methods: {
    initCard(cardNum) {
      if (cardNum < 1 || (this.array.length && this.array.length === cardNum)) return
      this.array = []
      for (let i = 1; i <= cardNum; i++) {
        this.array.push(i)
      }
      this.shuffle()
    },
    drawCard() {
      if (!this.array.length) return
      if (this.curIdx > this.array.length - 1) {
        this.shuffle()
        return this.drawCard()
      } else {
        let val = this.array[this.curIdx]
        this.curIdx++
        return val
      }
    },
    shuffle() {
      this.curIdx = 0
      let array = [...this.array]
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 生成[0, i]之间的随机索引
        [array[i], array[j]] = [array[j], array[i]]; // 交换当前元素与随机选取的元素位置
      }
      this.array = array
      console.log('shuffle', this.array);
    }
  }
}