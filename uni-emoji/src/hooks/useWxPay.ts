import apiPay from "@/api/apiPay";
import { message } from "@/utils/unis";
import { isH5, isMp } from "@/utils/platform";

/**
 * 微信支付
 */
const user = useStore('user');
const config = useStore('config');

export function useWxPay() {
  const payLoading = ref(false);

  watch(payLoading, async (n, o) => {
    if (n) {
      await uni.showLoading({
        title: '加载中',
        mask: true
      })
    } else {
      uni.hideLoading();
    }
  });

  const pay = (vip: number) => {
    return new Promise((resolve, reject) => {
      apiPay.wxPay(config.data.value.price, user.data.value.id, isH5)
        .then((res) => {
          const v = res.value;
          wxPay(v.appId, v.timeStamp, v.nonceStr, v.pkg, v.paySign, v.signType)
            .then(async () => {
              payLoading.value = true;
              user.vip(vip, v.pkg);
              payLoading.value = false;
            }).catch(err => {
            reject(err);
          })
        }).catch(err => {
        reject(err);
      })
    });
  };

  const wxPay = (appId, timeStamp, nonceStr, pkg, paySign, signType) => {
    if (isMp) {
      return mpPay(appId, timeStamp, nonceStr, pkg, paySign, signType);
    } else {
      return h5Pay(appId, timeStamp, nonceStr, pkg, paySign, signType);
    }
  };

  const mpPay = (appId, timeStamp, nonceStr, pkg, paySign, signType) => {
    return new Promise((resolve, reject) => {
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: pkg,
        paySign,
        signType,
        orderInfo: '',
        success: async (res) => {
          resolve(res);
        },
        fail: async (err) => {
          if (err.errMsg === 'requestPayment:fail cancel') {
            await message('已取消支付', 3)
          } else {
            reject(err)
          }
        },
      })
    })
  };

  const h5Pay = (appId, timeStamp, nonceStr, pkg, paySign, signType) => {
    return new Promise((resolve, reject) => {
      WeixinJSBridge.invoke("getBrandWCPayRequest", {
        "appId": appId,
        "timeStamp": timeStamp,
        "nonceStr": nonceStr,
        "package": pkg,
        "signType": signType,
        "paySign": paySign,
      }, function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  };

  return {
    wxPay: pay
  }
}