import 'uno.css';
import './style/index.css'
import { createSSRApp } from 'vue';
import App from './App.vue';
// #ifdef H5
import vant from 'vant';
import 'vant/lib/index.css';
// #endif
import store from '@/store';
import plugin from '@/plugin';
import { isH5 } from "@/utils/platform";

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  if (isH5) {
    app.use(vant);
  }
  app.use(plugin);
  return {
    app
  };
}