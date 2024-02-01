declare namespace User {
  interface UserInfo {
    id: string
    code: string
    openId: string
    nickname: string
    playCount: number
    vip: boolean
  }
}

declare namespace Config {
  interface ConfigInfo {
    playLimit: number
    price: string
    payText: string
  }
}