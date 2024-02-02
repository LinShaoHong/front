import apiUser from '@/api/apiUser';

export default defineStore({
  id: 'user',
  state: () => {
    return {
      data: {
        id: "",
        code: "",
        openId: "",
        nickname: "微信用户-12345",
        playCount: 0,
        vip: false
      }
    } as { data: User.UserInfo };
  },
  getters: {},
  actions: {
    getUserInfo() {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        if (!userId) {
          uni.login({
            success: function (res) {
              const code = res.code;
              apiUser.login(code).then(data => {
                resolve(data.value);
                that.setUserInfo(data.value);
              }).catch(err => {
                reject(err);
              });
            }
          })
        } else {
          apiUser.getById(userId).then(data => {
            resolve(data.value);
            that.setUserInfo(data.value);
          }).catch(err => reject(err));
        }
      });
    },
    setUserInfo(user: User.UserInfo) {
      Object.assign(this.data['value'], user);
    },
    inc() {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.inc(userId).then(() => {
          that.data['value'].playCount += 1;
        }).catch(err => {
          reject(err);
        })
      })
    },
    vip() {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.vip(userId).then((res) => {
          resolve(res);
          that.data['value'].vip = true;
        }).catch(() => {
          that.data['value'].vip = true;
        })
      });
    },
    updateNickname(nickname: string) {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.updateNickname(userId, nickname).then((res) => {
          resolve(res);
          that.data['value'].nickname = nickname;
        }).catch(() => {
          reject();
        })
      });
    }
  }
})