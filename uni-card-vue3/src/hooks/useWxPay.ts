import apiPay from "@/api/apiPay";
import { message, modal } from "@/utils/unis";

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
  })

  const pay = (vip: number) => {
    return new Promise((resolve, reject) => {
      apiPay.wxPay(config.data.value.price, user.data.value.id, vip)
        .then((res) => {
          const v = res.value;
          wxPay(v.timeStamp, v.nonceStr, v.packages, v.paySign, v.signType)
            .then(async () => {
              payLoading.value = true;
              user.vip(vip);
              payLoading.value = false;
            }).catch(err => {
            reject(err);
          })
        }).catch(err => {
        reject(err);
      })
    });
  }

  const wxPay = (timeStamp, nonceStr, pkg, paySign, signType) => {
    console.log('wxPaywxPaywxPaywxPaywxPaywxPay')
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
          await modal('', '解锁成功')
          resolve(res);
        },
        fail: async (err) => {
          if (err.errMsg === 'requestPayment:fail cancel') {
            await message('已取消支付', 3)
          } else {
            await modal(err.errMsg + err.err_desc)
          }
          reject(err)
        },
      })
    })
  };

  return {
    wxPay: pay
  }
}