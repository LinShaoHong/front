import apiConfig from '@/api/apiConfig';

export default defineStore({
  id: 'config',
  state: () => {
    return {
      data: {
        cardCount: 5,
        avaCount: 10,
        playLimit: 5,
        price: "1.99",
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