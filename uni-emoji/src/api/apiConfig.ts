import http from '@/utils/request';

const apiConfig = {
  getConfig: () => http.get<Config.ConfigInfo>('/config', null),
};

export default apiConfig;
