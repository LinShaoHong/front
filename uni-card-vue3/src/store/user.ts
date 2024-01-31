import apiUser from '@/api/apiUser';

export default defineStore({
  id: 'user',
  state: () => {
    return {
      id: "",
      code: "",
      openId: "",
      nickName: "",
      vip: false,
    } as User.UserInfo;
  },
  getters: {
    isLogin: (state) => {
      return !!state.id;
    }
  },
  actions: {
    checkLogin() {
      const that = this;
      if (!this.id) {
        uni.showModal({
          title: '温馨提示',
          content: '是否立即登录？',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              try {
                that.getUserInfo();
              } catch (e) {
                return false;
              }
            }
          }
        });
      }
      return true;
    },
    getUserInfo() {
      const that = this;
      uni.login({
        success: async function (res) {
          const code = res.code;
          const resp = await apiUser.login(code);
          that.setUserInfo(resp.data);
        }
      })
    },
    setUserInfo(user: User.UserInfo) {
      Object.assign(this.$state, user);
    }
  }
})