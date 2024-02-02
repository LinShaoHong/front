const apiEnv: ApiEnv = 'dev';

const envMap = {
  dev: {
    baseUrl: 'http://127.0.0.1',
    apiBaseUrl: 'http://127.0.0.1:9939/api',
  },
  beta: {
    baseUrl: 'http://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com'
  },
  prod: {
    baseUrl: 'https://m.xxx.com',
    apiBaseUrl: 'https://m.api.xxx.com'
  },
  local: {
    baseUrl: 'http://127.0.0.1:9939',
    apiBaseUrl: 'http://127.0.0.1:9939/api',
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
