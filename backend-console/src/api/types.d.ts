export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface ISpiderJob {
  id: string
  group: string
  publish: boolean
  startTime: number
  rate: string
  setting: {
    parallelism: number,
    poolSize: number,
    monitorInterval: number,
    taskInterval: number,
    executeTime: number,
    retryCount: number,
    retryDelays: number,
    batchSize: number,
    fetchSize: number,
    batchInterval: number
  }
  schema: object
  createTime: string
  updateTime: string
}

export interface ISpiderProgress {
  parallelism: number,
  total: number,
  running: boolean,
  finished: number,
  remainTime: string,
  startTime: string,
  endTime: string,
  usedTime: string,
  checkpoint: {
    categoryUrl: string,
    pageNum: number | string
  },
  checkPointing: {
    categoryUrl: string,
    pageNum: number | string
  }
  errors: string[]
}
