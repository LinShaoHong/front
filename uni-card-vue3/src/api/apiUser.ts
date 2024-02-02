import http from '@/utils/request';

const apiUser = {
  login: (code: string) => http.get<any>('/account/wx/login', { code: code }),
  getById: (id: string) => http.get<any>('/account/byId', { id: id }),
  inc: (id: string) => http.get<any>('/account/inc', { id: id }),
  vip: (id: string) => http.get<any>('/account/vip', { id: id }),
  updateNickname: (id: string, nickname: string) => http.post<any>('/account/updateNickname', {
    id: id,
    nickname: nickname
  })
};

export default apiUser;