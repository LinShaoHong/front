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
    game: boolean
    prompt: boolean
    promptText: string
    iosLimit: number
    iosCanPay: boolean
    price: string
    payText: string
    shareTitle: string
    loverShareTitle: string
    logo: string
    roomTitle: string
    noLover: boolean
    partner: string
    partners: [{
      name: string,
      logo: string
    }],
    topTab: {
      hks: string
      lover: string
    },
    more: {
      hks: {
        defTitle: string
        defContent: string
        battleTitle: string
        battleContent: string
      },
      lover: {
        defTitle: string
        defContent: string
        battleTitle: string
        battleContent: string
        cards: [{
          name: string
          type: string
          open: boolean
        }]
      }
    },
    banners: [{
      src: string
      qr: string
      title: string
      label: string
    }]
  }
}

declare namespace App {
  interface AppInfo {
    cardType: string
  }
}