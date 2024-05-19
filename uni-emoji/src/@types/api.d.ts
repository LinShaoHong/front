declare namespace Http {
  type Response<T> = Promise<{
    code: string
    message: string,
    value: T
    values: [T]
    total: number
  }>
}

declare namespace User {
  interface LoginReq {
    code: string,
    os: string,
    shareUserId: string
  }
}

declare namespace Pay {
  interface WxPayResp {
    appId: string
    timeStamp: string
    nonceStr: string
    pkg: string
    paySign: string
    signType: string
  }
}