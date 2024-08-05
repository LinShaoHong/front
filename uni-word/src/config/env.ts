const apiEnv: ApiEnv = 'prod';

const envMap = {
  dev: {
    baseUrl: 'http://192.168.10.105',
    apiBaseUrl: 'http://192.168.10.105:9949/api',
  },
  beta: {
    baseUrl: 'http://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com'
  },
  prod: {
    baseUrl: 'https://gooluky.cn',
    apiBaseUrl: 'https://gooluky.cn/word/api'
  },
  local: {
    baseUrl: 'http://192.168.10.105:9949',
    apiBaseUrl: 'http://192.168.10.105:9949/api',
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
