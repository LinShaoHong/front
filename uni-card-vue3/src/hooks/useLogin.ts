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
        console.log(code, 'code');
        const sys = uni.getSystemInfoSync();
        resolve({
          id: "111aaabbb",
          openId: "aaabbbccc",
          code: "1233123",
          shareCode: "",
          avatar: 1,
          nickname: "Lins",
          playCount: 0,
          vip: 0,
          defs: [{"name": "金杯之奕", "items": [{"id": "211a216377aa605b19d52efd7a79f8de8fbfc891", "src": "/cards/default/1.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "76114aaaf77e2f54f86b45cf07c475ed5fd98cf3", "src": "/cards/default/2.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a64f3f1a08a0cbf0ca32f159e86ebd72882a4ab8", "src": "/cards/default/3.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "686339309047530f92256085ad09c4d8ea6f8df2", "src": "/cards/default/4.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "9f8fb0887e6f85d3c7243d61ef43d5ebc2f32886", "src": "/cards/default/5.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "d1ebf43747d6a2b0f7e53b8afc5437d316ca49c5", "src": "/cards/default/6.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "1f91925a99f030b847eaeaf35fb5c806a0eed3cd", "src": "/cards/default/7.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "9a1b62b400f4cbddef3d2baa3be4759110b6bb11", "src": "/cards/default/8.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "696f95aef231d8c6017276af6beb759cca792a15", "src": "/cards/default/9.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "ab2634bb68d4bd948d3d2765ff0fdca44f444f5e", "src": "/cards/default/10.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a54812f36b57e6d9c169dbdbb406be102355bdf5", "src": "/cards/default/11.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "b73ff508a078c482c7b7935de8bd10496d554a81", "src": "/cards/default/12.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "540970a15f027bf3d47b29a270c3f0509425d992", "src": "/cards/default/13.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "e79a2a12ed0c9c9acc3233674e304ea5e7ba0ef8", "src": "/cards/default/14.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a9db70de4c311cdb632dc4c0f96f65c7637f3d50", "src": "/cards/default/15.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a27e543a63f3dcae7b87feec70edb4edaf46cd54", "src": "/cards/default/16.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "286d6dc51e374c366b8508d9fe53be7fc9f323d0", "src": "/cards/default/17.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "4bf063ad507316fefdfc99bda19487007fc4bf3d", "src": "/cards/default/18.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "82b3bbe31bbc20edcfc72d7e7260a16106cb60fc", "src": "/cards/default/19.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "0bb9cec1041f34d9038b08bba90a3322716c856e", "src": "/cards/default/20.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "97d7d31d080cbe707ffdd73f539ce9b38ea591f9", "src": "/cards/default/21.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "8a1a42052727e270ed8f24d32ee30910b8a73412", "src": "/cards/default/22.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a0fb004a0a29ad94304fe3341a9e371de0556a3f", "src": "/cards/default/23.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "7837dc145dfd1db8fbb5894c001c560ee92e40c0", "src": "/cards/default/24.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "778265b18b9746728ed66d8a7b977ddf85dba8e7", "src": "/cards/default/25.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "306a9d735e42a1ddd9058a07172b8d307aa1cff2", "src": "/cards/default/26.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "ab680f378cf8573e4352affcb948318bddc653fb", "src": "/cards/default/27.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "feb2c17385003ef3de2c77fbc37ed99dcd4ecaa3", "src": "/cards/default/28.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a6f46a7043045fbf28f67432af5703a39a51bcce", "src": "/cards/default/29.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "f0f5c2f0a4661e34126428899fcca8a7a3599023", "src": "/cards/default/30.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "2a1eee02c62efa9817f27591d41f3c0f54a02255", "src": "/cards/default/31.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "ff8829db5421896d5c35e17ee4da61fc199193bf", "src": "/cards/default/32.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "0f0dd25e2361a2059fb0b1f069ad357261abc4de", "src": "/cards/default/33.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "e4fbcd926f3e2393905d2c998db713078c3c7007", "src": "/cards/default/34.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a4dd624b9cf0093c4c12b8c4961be41a8eeb16d0", "src": "/cards/default/35.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "2194ca8aacbc137168612effa49b577a9635131a", "src": "/cards/default/36.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "94a98f4acfe937be4215fcca5ec1a0d38ccbf332", "src": "/cards/default/37.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "7937ff8667cd2ea66ddd8f20a9e167e714279fc9", "src": "/cards/default/38.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "497f4750311262b38b9dc49001bec2e71db1ea7d", "src": "/cards/default/39.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "e5511e79dacc7596fa014323b3aad244b4a60baa", "src": "/cards/default/40.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "949aeedf1fcca151580ead44234ee1057fca88f0", "src": "/cards/default/41.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "7d746509edd84521754dbff6eafbd895367c3434", "src": "/cards/default/42.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "ab32059290459e1b9bfd809a678f4a12e7891a0a", "src": "/cards/default/43.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "1d922d3575edb199f2dea0c45bed30c1abcfb4dc", "src": "/cards/default/44.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "874a2a723db63cfb31a8fad9070c5c4705f3f087", "src": "/cards/default/45.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "d93e24bbbb8894484ffad69380a7ab08cbe7e02f", "src": "/cards/default/46.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "5397c3e248384b4178881c429956201f519b4122", "src": "/cards/default/47.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "1b4ade1e9efadeea523547aee6d8ef012ec551ae", "src": "/cards/default/48.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "cdcd8938a80b462a5f304f359c7dfd2732b64c99", "src": "/cards/default/49.png", "title": null, "enable": true, "content": null, "defaulted": true}, {"id": "a4bc60a200c1abec692c59f1d932ddcef9b0021c", "src": "/cards/default/50.png", "title": null, "enable": true, "content": null, "defaulted": true}]}]
        });
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