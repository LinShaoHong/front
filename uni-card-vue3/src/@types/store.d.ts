declare namespace User {
  interface UserInfo {
    id: string
    openId: string
    code: string
    avatar: number
    nickname: string
    playCount: number
    vip: number
    defs: object[]
  }
}

declare namespace Config {
  interface ConfigInfo {
    avaCount: number
    playLimit: number
    battleLimit: number
    canBattle: boolean
    iosCanMore: boolean
    price: string
    payText: string
    shareTitle: string
    logo: string
    banners: [{
      src: string
      qr: string
      title: string
      label: string
    }]
  }
}