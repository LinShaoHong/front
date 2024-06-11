export default defineStore({
  id: 'app',
  state: () => {
    return {
      data: {
        cardType: 'hks'
      }
    } as { data: App.AppInfo };
  },
  getters: {
    hks: (state) => {
      return state.data.cardType === 'hks';
    },

    lover: (state) => {
      return state.data.cardType === 'lover';
    },
  },
  actions: {
    setHks() {
      this.data['value']['cardType'] = 'hks';
    },

    setLover() {
      this.data['value']['cardType'] = 'lover';
    }
  }
});