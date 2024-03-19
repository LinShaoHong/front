const apiEnv: ApiEnv = 'prod';

const envMap = {
  dev: {
    baseUrl: 'http://192.168.157.17',
    apiBaseUrl: 'http://192.168.157.17:9939/api',
  },
  beta: {
    baseUrl: 'http://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com'
  },
  prod: {
    baseUrl: 'https://gooluky.cn',
    apiBaseUrl: 'https://gooluky.cn/card/api'
  },
  local: {
    baseUrl: 'http://192.168.157.17:9939',
    apiBaseUrl: 'http://192.168.157.17:9939/api',
  }
};

type ApiEnv = keyof typeof envMap;
type Env<T extends ApiEnv> = {
  apiEnv: T;
} & (typeof envMap)[T];

function createEnv(apiEnv: ApiEnv): Env<typeof apiEnv> {
  return Object.assign({ apiEnv }, envMap[apiEnv]);
}

const env = createEnv(apiEnv);
export default env;
