import { App } from 'vue'
import env from '@/config/env'

const config = useStore('config');

export default {
  install(app: App) {
    app.provide('$imgUri', env.baseUrl + '/image/')

    app.mixin({
      onShareAppMessage() {
        return {
          title: config.data.value.shareTitle,
          imageUrl: '/static/logo.png',
          path: 'pages/index/index',

        };
      },
      onShareTimeline() {
        return {
          title: config.data.value.shareTitle,
          query: '',
          imageUrl: '/static/logo.png',
        }
      }
    })
  }
}