import http from '@/utils/request';

const apiConfig = {
  getConfig: () => http.get<Config.ConfigInfo>('/config', null),

  log: (log: string) => http.post<any>('/config/log', {
    log: log
  }),
};

export default apiConfig;
