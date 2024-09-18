export default defineStore({
    id: 'nav',
    state: () => {
        return {
            data: {
                index: 0,
                date: '',
                show: true,
                userId: 1
            }
        } as { data: Nav.NavInfo };
    },
    actions: {
        setIndex(index: number) {
            this.data['value']['index'] = index;
        },
        setDate(date: string) {
            this.data['value']['date'] = date;
        },
        setShow(show: boolean) {
            this.data['value']['show'] = show;
        }
    }
});