const env = 'dev';

import Vue from 'vue'
import App from './App'

import uview from 'uview-ui';
Vue.use(uview);

import dev from './env/dev.js'
import prod from './env/prod.js'
Vue.prototype.$media = env === 'dev' ? dev.MEDIA : prod.MEDIA;
Vue.prototype.$apiPath = env === 'dev' ? dev.API_BASE_PATH : prod.API_BASE_PATH;
Vue.prototype.$mediaPath = env === 'dev' ? dev.MEDIA_BASE_PATH : prod.MEDIA_BASE_PATH;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()