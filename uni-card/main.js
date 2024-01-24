import App from './App'
import store from './store'
import util from '@/common/util.js';
import api from './common/api';
import {
	utilMixins
} from "@/common/util-mixins.js"
import common from './common/common'

import TImg from '@/components/common/t-img.vue'
import TCell from '@/components/common/t-cell.vue'
import uniStatusBar from '@/components/common/uni-status-bar.vue'

// #ifndef VUE3
import Vue from 'vue'
Vue.prototype.$store = store
Vue.prototype.util = util
Vue.prototype.api = api
Vue.mixin(utilMixins)
Vue.use(common)
Vue.component('t-img', TImg)
Vue.component('t-cell', TCell)
Vue.component('uni-status-bar', uniStatusBar)
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif