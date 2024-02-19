import apiConfig from '@/api/apiConfig';

export default defineStore({
  id: 'config',
  state: () => {
    return {
      data: {
        avaCount: 40,
        playLimit: 5,
        iosLimit: 5,
        canBattle: false,
        iosCanMore: false,
        iosCanPay: false,
        price: "2.99",
        payText: "",
        shareTitle: "",
        logo: "",
        banners: [{}]
      }
    } as { data: Config.ConfigInfo };
  },
  actions: {
    getConfigInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        apiConfig.getConfig().then(data => {
          that.setConfigInfo(data.value)
          resolve(data.value);
        }).catch(err => {
          reject(err);
        })
      });
    },

    setConfigInfo(config: Config.ConfigInfo) {
      Object.assign(this.data['value'], config)
    }
  }
});