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
        nickname: "",
        playCount: 0,
        vip: 0,
        defs: []
      }
    } as { data: User.UserInfo };
  },
  getters: {
    items: (state) => {
      if (state.data.defs.length > 0) {
        return state.data.defs[0]['items'].filter(v => v['enable']);
      }
      return [];
    }
  },
  actions: {
    getUserInfoFromShare(query: object) {
      return new Promise((resolve, reject) => {

      });
    },
    getUserInfo(option?) {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        if (!userId) {
          uni.login({
            success: function (res) {
              const code = res.code;
              const sys = uni.getSystemInfoSync();
              apiUser.login(code, sys.platform, option?.query?.shareUserId, option?.query?.shareId).then(data => {
                resolve(data.value);
                that.setUserInfo(data.value);
              }).catch(err => {
                reject(err);
              });
            }
          })
        } else {
          const sys = uni.getSystemInfoSync();
          apiUser.getById(userId, sys.platform).then(data => {
            resolve(data.value);
            that.setUserInfo(data.value);
          }).catch(err => reject(err));
        }
      });
    },
    getDefs() {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.getDefs(userId).then(data => {
          that.data['value'].defs = data.value.defs;
        }).catch(err => reject(err));
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
    vip(vip: number, prepayId: string) {
      const that = this;
      const userId = this.data['value'].id;
      return new Promise((resolve, reject) => {
        apiUser.vip(userId, prepayId, vip).then((res) => {
          resolve(res);
          that.data['value'].vip = vip;
        }).catch(() => {
          reject();
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