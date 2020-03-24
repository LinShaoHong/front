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

export interface ISchedulerJob {
  id: string
  publish: boolean
  startTime: number
  nextTime: string
  rate: string
  profiles: object
  createTime: string
  updateTime: string
}

export interface ISchedulerProgress {
  total: number,
  running: boolean,
  finished: number,
  remainTime: string,
  startTime: string,
  endTime: string,
  usedTime: string,
  errors: string[]
}
