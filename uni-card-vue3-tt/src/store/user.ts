import apiUser from '@/api/apiUser';

export default defineStore({
  id: 'user',
  state: () => {
    return {
      data: {
        id: "",
        openId: "",
        code: "",
        avatar: 1,
        nickname: "微信用户-12345",
        playCount: 0,
        vip: 0
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
    vip(vip: number) {
      this.data['value'].vip = vip;
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
    },
    updateAvatar(avatar: number) {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.updateAvatar(userId, avatar).then((res) => {
          resolve(res);
          that.data['value'].avatar = avatar;
        }).catch(() => {
          reject();
        })
      });
    }
  }
})