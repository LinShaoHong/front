declare namespace User {
  interface UserInfo {
    id: string
    openId: string
    code: string
    shareCode: string
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
    iosLimit: number
    iosCanMore: boolean
    iosCanPay: boolean
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