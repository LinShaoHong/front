import {
  mapState,
  mapMutations,
} from "vuex";
import siteInfo from '@/common/siteinfo';

const Plugin = Object.create(null);
Plugin.install = function (Vue, options) {
  Vue.mixin({
    data() {
      return {}
    },
    computed: {
      ...mapState({
        user: (state) => state.user,
        isLogin: (state) => state.isLogin,
        config: (state) => state.config
      }),
      onImgurl() {
        return getApp().globalData.onImgurl
      },
    },
    methods: {
      ...mapMutations(["setUser", "setConfig", "logout"]),
      go(option) {
        switch (option.t) {
          case undefined:
          case 1:
            uni.navigateTo({
              url: option.url
            })
            break;
          case 2:
            uni.redirectTo({
              url: option.url
            })
            break;
          case 6:
            uni.switchTab({
              url: option.url
            })
            break;
          case 3:
            uni.reLaunch({
              url: option.url
            })
            break;
          case 4:
            uni.navigateBack({
              delta: 1
            })
            break;
          case 5:
            if (getCurrentPages().length > 1) {
              uni.navigateBack({
                delta: 1
              })
            } else {
              uni.reLaunch({
                url: option.url
              })
            }
            break;
        }
      },
      async checkLogin() {
        if (!this.isLogin) {
          try {
            this.util.modal('是否立即登录？', '', true)
              .then(res => {
                this.getUserInfo()
              })
          } catch (e) {
            return false
          }
        } else {
          return true
        }
      },
      getUserInfo() {
        try {
          const res = uni.getStorageSync('user');
          if (res && res.openId) {
            this.regWxUser(res.openId)
          } else {
            this.getLoginInfo()
          }
        } catch (e) {
          this.getLoginInfo()
        }
      },
      getLoginInfo() {
        uni.login({
          success: (lres) => {
            this.util.request({
              url: this.api.getOpenIdByCode,
              ct: 1,
              data: {
                code: lres.code,
                appId: siteInfo.appId
              },
            }).then(res => {
              if (res && res.openId) {
                this.regWxUser(res.openId)
              } else {
                this.util.modal('请检查小程序秘钥等相关配置')
              }
            })
          },
          fail: (err) => {
            if (err.errMsg.indexOf('permission') > -1) {
            }
          }
        })
      },
      regWxUser(openId) {
        if (!openId) return
        this.util.request({
          url: this.api.regWxUser,
          ct: 1,
          data: {
            openId,
            nickname: '444'
          },
        }).then(res => {
          if (res && res.openId) {
            this.setUser(res)
          } else {
            this.logout()
            this.checkLogin()
          }
        })
      },
      getConfig() {
        this.util.request({
          url: this.api.getConfiguration,
          ct: 1
        }).then(res => {
          this.setConfig(res)
        })
      },
    }
  })
}
export default Plugin;