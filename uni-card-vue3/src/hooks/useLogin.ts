import apiUser from "@/api/apiUser";
import { isMp } from "@/utils/platform";

/**
 * 登录相关
 */
export function useLogin() {
  const login = (option?) => {
    if (isMp) {
      return mpLogin(option);
    } else {
      return h5Login(option);
    }
  };

  const mpLogin = (option?) => {
    return new Promise((resolve, reject) => {
      uni.login({
        success: function (res) {
          const code = res.code;
          const sys = uni.getSystemInfoSync();
          apiUser.login(code, sys.platform, option?.query?.shareUserId).then(data => {
            resolve(data.value);
          }).catch(err => {
            reject(err);
          });
        }
      })
    });
  }

  const h5Login = (option?) => {
    return new Promise((resolve, reject) => {
      let code = uni.getStorageSync('code');
      if (code === undefined || code === null || code === '') {
        const params = new URLSearchParams(window.location.search);
        code = params.get('code');
        if (code === undefined || code === null || code === '') {
          const appId = 'wxa1e6d899be0cc93b';
          const secret = '6f7e83f1be4c343254e6c2602394e7e5';
          const redictUrl = encodeURIComponent(window.location.href);
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
            'appid=' + appId + '&redirect_uri=' + redictUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        } else {
          uni.setStorageSync('code', code);
        }
      }
      if (!(code === undefined || code === null || code === '')) {
        console.log(code,'code');
        const sys = uni.getSystemInfoSync();
        // apiUser.login(code, sys.platform, option?.query?.shareUserId).then(data => {
        //   resolve(data.value);
        // }).catch(err => {
        //   reject(err);
        // });
      }
    });
  };

  return {
    login
  }
}