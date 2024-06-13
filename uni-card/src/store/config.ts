import apiConfig from '@/api/apiConfig';
import { isEmpty } from "@/utils/is";

export default defineStore({
  id: 'config',
  state: () => {
    return {
      data: {
        avaCount: 40,
        playLimit: 5,
        game: false,
        prompt: false,
        promptText: "",
        iosLimit: 5,
        iosCanPay: false,
        price: "2.99",
        payText: "",
        shareTitle: "",
        logo: "",
        partner: "",
        partners: [{}],
        topTab: {
          hks: '海克斯喝酒',
          lover: '情侣升温',
        },
        more: {
          hks: {
            defTitle: '自定义',
            defContent: '可添加编辑卡牌，随心畅玩！',
            battleTitle: '云顶对弈',
            battleContent: '可邀请他人同时在线对弈'
          },
          lover: {
            defTitle: '自定义',
            defContent: '可添加编辑卡牌，随心畅玩！',
            battleTitle: '情侣格斗',
            battleContent: '可邀请他人同时在线对弈'
          }
        },
        banners: [{}]
      }
    } as { data: Config.ConfigInfo };
  },
  getters: {
    partnerLogo: (state) => {
      if (!isEmpty(state.data.partner)) {
        for (const partner of state.data.partners) {
          if (partner.name === state.data.partner) {
            return partner.logo;
          }
        }
      }
      return null;
    }
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
    },

    setPartner(partner: string) {
      this.data['value']['partner'] = partner;
    }
  }
});