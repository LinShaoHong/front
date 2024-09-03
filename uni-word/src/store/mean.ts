import {request} from "@/utils/request";
import {isEmpty} from "@/utils/is";

export default defineStore({
    id: 'mean',
    state: () => {
        return {
            data: {
                ws: {}
            }
        } as { data: { ws: Map<string, string> } };
    },
    actions: {
        fetch(w) {
            const that = this;
            const m = this.data['value'].ws[w];
            if (isEmpty(m)) {
                request('GET', 'http://dict.youdao.com/suggest', {
                    num: 1,
                    doctype: 'json',
                    q: w
                }).catch((data) => {
                    const _m = data?.['data']?.entries[0]?.explain;
                    if (!isEmpty(_m)) {
                        that.data['value'].ws[w] = _m;
                    }
                });
            }
        }
    }
});