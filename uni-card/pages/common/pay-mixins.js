export default {
  data() {
    return {
      loading: false
    }
  },
  watch: {
    loading(nVal) {
      if (nVal) {
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
      } else {
        uni.hideLoading()
      }
    }
  },
  methods: {
    subscribe() {
      return new Promise((resolve, reject) => {
        this.util.request({
          url: this.api.wechatPayGame,
          mask: '支付中...',
          method: 'POST',
          data: {
            amount: this.config.amount,
            openId: this.user.openId
          }
        }).then(res => {
          if (res) {
            this.wxPay(res.timeStamp, res.nonceStr, res.packages, res.sign, res.signType)
              .then(() => {
                this.loading = true
                let timer = setTimeout(() => {
                  this.registerMember(res.prepayid)
                    .then(() => {
                      clearTimeout(timer)
                      timer = null
                      resolve()
                      this.loading = false
                    }).catch(() => {
                    this.loading = false
                    reject()
                  })
                }, 1500)
              })
              .catch(() => {
                reject()
              })
          } else {
            reject()
          }
        }).catch(err => {
          reject()
        })
      })
    },
    wxPay(timeStamp, nonceStr, packAge, paySign, signType) {
      return new Promise((resolve, reject) => {
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp,
          nonceStr,
          package: packAge,
          paySign,
          signType,
          success: async res => {
            await this.util.modal('', '解锁成功')
            resolve()
          },
          fail: (err) => {
            if (err.errMsg === 'requestPayment:fail cancel') {
              this.util.message('已取消支付', 3)
            } else {
              this.util.modal(err.errMsg + err.err_desc)
            }
            reject(err)
          },
        })
      })
    },
    registerMember(orderId) {
      return new Promise((resolve, reject) => {
        this.util.request({
          url: this.api.registerMember,
          mask: 1,
          method: 'POST',
          data: {
            userId: this.user.id,
            orderId
          }
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}