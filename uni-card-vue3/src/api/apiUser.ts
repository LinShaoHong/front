import http from '@/utils/request';

const apiUser = {
  login: (code) => http.get<any>('/account/wx/login', { code: code }),
};

export default apiUser;