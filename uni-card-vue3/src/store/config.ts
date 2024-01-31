import apiConfig from '@/api/apiConfig';
import { networkError } from "@/utils/request";

export default defineStore({
  id: 'config',
  state: () => {
    return {
      playLimit: 5,
      price: "1.99",
      willPrice: "11.99"
    } as Config.ConfigInfo;
  },
  actions: {
    getConfigInfo() {
      apiConfig.getConfig().then(data => {
        this.setConfigInfo(data.value)
      }).catch(err => {
        networkError();
      })
    },

    setConfigInfo(configInfo: Config.ConfigInfo) {
      this.playLimit = configInfo.playLimit;
      this.price = configInfo.price;
      this.willPrice = configInfo.willPrice;
    }
  }
});