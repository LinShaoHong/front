declare namespace User {
  interface UserInfo {
    id: String
    code: String
    openId: String
    nickName: String
    vip: Boolean
  }
}

declare namespace Config {
  interface ConfigInfo {
    playLimit: Number
    price: String
    willPrice: String
  }
}