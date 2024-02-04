import { App } from 'vue'
import env from '@/config/env'

export default {
  install(app: App) {
    app.provide('$imgUri', env.baseUrl + '/image/')
  }
}