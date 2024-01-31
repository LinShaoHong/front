import 'uno.css';
import './style/index.css'
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from '@/store';
import plugin from '@/plugin';

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(plugin)
  return {
    app
  };
}