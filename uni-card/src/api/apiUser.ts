import http from '@/utils/request';
import LoginReq = User.LoginReq;

const apiUser = {
    login: (body: LoginReq) => http.post<any>('/account/wx/login', body),

    getPhoneNumber: (id: string, code: string) => http.get<any>('/account/wx/getPhoneNumber', {id: id, code: code}),

    getById: (id: string, os: string) => http.get<any>('/account/byId', {id: id, os: os}),

    invited: (code: string) => http.get<any>('/account/invited', {code: code}),

    inc: (id: string, hks: boolean) => http.get<any>('/account/inc', {id: id, hks: hks}),

    vip: (id: string, prepayId: string, vip: number) => http.post<any>('/account/vip', {
        id: id,
        prepayId: prepayId,
        vip: vip
    }),

    updateNickname: (id: string, nickname: string) => http.post<any>('/account/updateNickname', {
        id: id,
        nickname: nickname
    }),

    updateAvatar: (id: string, avatar: number) => http.post<any>('/account/updateAvatar', {
        id: id,
        avatar: avatar
    }),

    getDefs: (id: string) => http.get<any>('/def/byUserId', {userId: id}),

    addDef: (id: string, title: string, content: string, src: string, cardType: string) => http.post<any>('/def/add', {
        userId: id,
        title: title,
        content: content,
        src: src,
        cardType: cardType
    }),

    editDef: (id: string, itemId: string, title: string, content: string, src: string, cardType: string) => http.post<any>('/def/edit', {
        userId: id,
        itemId: itemId,
        title: title,
        content: content,
        src: src,
        cardType: cardType
    }),

    deleteDef: (id: string, itemId: string, cardType: string) => http.post<any>('/def/delete', {
        userId: id,
        itemId: itemId,
        cardType: cardType
    }),

    enableDef: (id: string, itemId: string, enable: boolean, cardType: string) => http.post<any>('/def/enable', {
        userId: id,
        itemId: itemId,
        enable: enable,
        cardType: cardType
    }),
};

export default apiUser;