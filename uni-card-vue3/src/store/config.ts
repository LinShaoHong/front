import apiConfig from '@/api/apiConfig';

export default defineStore({
  id: 'config',
  state: () => {
    return {
      data: {
        playLimit: 5,
        price: "1.99",
        payText: "11.99"
      }
    } as { data: Config.ConfigInfo };
  },
  actions: {
    getConfigInfo() {
      return new Promise((resolve, reject) => {
        apiConfig.getConfig().then(data => {
          this.setConfigInfo(data.value)
          resolve(data.value);
        }).catch(err => {
          reject(err);
        })
      });
    },

    setConfigInfo(config: Config.ConfigInfo) {
      Object.assign(this.data, config)
    }
  }
});