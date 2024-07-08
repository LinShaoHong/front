import apiConfig from '@/api/apiConfig';
import { isEmpty } from "@/utils/is";

export default defineStore({
  id: 'config',
  state: () => {
    return {
      data: {
        avaCount: 40,
        playLimit: 5,
        loverPlayLimit: 10,
        chatLimit: 5,
        game: false,
        prompt: false,
        promptText: "",
        iosLimit: 5,
        iosCanPay: false,
        price: '2.99',
        payText: '',
        shareTitle: '',
        loverShareTitle: '',
        logo: '',
        roomTitle: '',
        loverPlayTitle: '',
        noLover: false,
        partner: "",
        partners: [{}],
        topTab: {
          hks: '',
          lover: '',
        },
        more: {
          hks: {
            defTitle: '',
            defContent: '',
            battleTitle: '',
            battleContent: ''
          },
          lover: {
            defTitle: '',
            defContent: '',
            battleTitle: '',
            battleContent: '',
            smsTitle: '',
            smsContent: '',
          }
        },
        loverCards: [{}],
        hasSms: true,
        smsUnit: 60,
        smsPrice: 0.75,
        smsPlaceholder: '',
        smsShareTitle:'',
        smsTemps: [{}],
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
    },

    setNoLover(noLover: string) {
      this.data['value']['noLover'] = noLover === 'true';
    }
  }
});