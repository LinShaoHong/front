declare namespace User {
    interface UserInfo {
        id: string
        openId: string
        code: string
        shareCode: string
        avatar: number
        nickname: string
        phone: string
        playCount: number
        loverPlayCount: number
        smsCount: number
        vip: number
        defs: object[]
    }
}

declare namespace Config {
    interface ConfigInfo {
        avaCount: number
        playLimit: number
        loverPlayLimit: number
        chatLimit: number
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
        loverPlayTitle: string
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
                smsTitle: string
                smsContent: string
            }
        },
        hksCards: [{
            name: string
            type: string
            cover: boolean
            noAdd: boolean
            open: boolean
            visible: boolean
        }],
        loverCards: [{
            name: string
            type: string
            cover: boolean
            noAdd: boolean
            open: boolean
            visible: boolean
        }],
        sms: boolean
        smsUnit: number
        smsPrice: number
        smsPlaceholder: string
        smsShareTitle: string
        smsTemps: [{
            type: string,
            name: string
        }]
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