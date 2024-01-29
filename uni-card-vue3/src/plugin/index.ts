import { App } from 'vue'
import env from '@/config/env'

export default {
  install(app: App) {
    app.config.globalProperties.$imageUrl = (name) => env.baseUrl + '/image/' + name;
  }
}