import apiConfig from '@/api/apiConfig';

export default defineStore({
  id: 'config',
  state: () => {
    return {
      playLimit: 5,
      price: "1.99",
      willPrice: "11.99"
    } as Config.ConfigInfo;
  },
  getters: {
    playLimit: (state) => {
      return state.playLimit;
    },
    price: (state) => {
      return state.price;
    },
    willPrice: (state) => {
      return state.willPrice;
    }
  },
  actions: {
    async getConfigInfo() {
      const resp = await apiConfig.getConfig()
      this.setConfigInfo(resp.data)
    },

    setConfigInfo(configInfo: Config.ConfigInfo) {
      this.playLimit = configInfo.playLimit;
      this.price = configInfo.price;
      this.willPrice = configInfo.willPrice;
    }
  }
});