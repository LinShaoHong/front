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
        partner: string,
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

declare namespace Sms {
    interface SendReq {
        userId: string
        fromPhone: string
        toPhone: string
        message: string
    }
}