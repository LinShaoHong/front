import http from '@/utils/request';

const apiUser = {
  login: (code: string) => http.get<any>('/account/wx/login', { code: code }),
  getById: (id: string) => http.get<any>('/account/byId', { id: id }),
  inc: (id: string) => http.get<any>('/account/inc', { id: id }),
  vip: (id: string, vip: number) => http.post<any>('/account/vip', { id: id, vip: vip }),
  updateNickname: (id: string, nickname: string) => http.post<any>('/account/updateNickname', {
    id: id,
    nickname: nickname
  }),
  updateAvatar: (id: string, avatar: number) => http.post<any>('/account/updateAvatar', {
    id: id,
    avatar: avatar
  })
};

export default apiUser;