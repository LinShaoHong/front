import http from '@/utils/request';

const apiUser = {
  login: (code: string, os: string, shareUserId: string) => http.get<any>('/account/wx/login', {
    code: code,
    os: os,
    shareUserId: shareUserId ? shareUserId : ''
  }),

  getById: (id: string, os: string) => http.get<any>('/account/byId', { id: id, os: os }),

  invited: (code: string) => http.get<any>('/account/invited', { code: code }),

  inc: (id: string) => http.get<any>('/account/inc', { id: id }),

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

  getDefs: (id: string) => http.get<any>('/def/byUserId', { userId: id }),

  addDef: (id: string, title: string, content: string) => http.post<any>('/def/add', {
    userId: id,
    title: title,
    content: content
  }),

  editDef: (id: string, itemId: string, title: string, content: string) => http.post<any>('/def/edit', {
    userId: id,
    itemId: itemId,
    title: title,
    content: content
  }),

  deleteDef: (id: string, itemId: string) => http.post<any>('/def/delete', { userId: id, itemId: itemId }),

  enableDef: (id: string, itemId: string, enable: boolean) => http.post<any>('/def/enable', {
    userId: id,
    itemId: itemId,
    enable: enable
  }),
};

export default apiUser;