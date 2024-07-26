export default defineStore({
  id: 'nav',
  state: () => {
    return {
      data: {
        index: 0
      }
    } as { data: Nav.NavInfo };
  },
  actions: {
    setIndex(index: number) {
      this.data['value']['index'] = index;
    }
  }
});