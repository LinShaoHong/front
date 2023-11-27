import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import VueLazyLoad from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'

import VideoPlayer from 'vue-video-player/src'

import 'jssor-slider/js/jssor.slider.min'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/permission'
import '@/icons/components'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.use(VueLazyLoad)
Vue.use(VideoPlayer)
Vue.use(VueClipboard)

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
