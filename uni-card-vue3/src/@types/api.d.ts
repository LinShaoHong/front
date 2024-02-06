declare namespace Http {
  type Response<T> = Promise<{
    code: string
    message: string,
    value: T
    values: [T]
    total: number
  }>
}

declare namespace Pay {
  interface WxPayResp {
    timeStamp: string
    nonceStr: string
    pkg: string
    paySign: string
    signType: string
  }
}