declare namespace User {
  interface UserInfo {
    id: string
    openId: string
    code: string
    avatar: number
    nickname: string
    playCount: number
    vip: number
  }
}

declare namespace Config {
  interface ConfigInfo {
    cardCount: number
    avaCount: number
    playLimit: number
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