import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

import Layout from '@/layout/index.vue'
import imageRouter from './modules/imageRoute'

Vue.use(Router)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { hidden: false, keepAlive: true },
    children: [
      {
        path: 'home',
        component: () => import('@/views/image/meizi/index.vue'),
        name: 'Home',
        meta: {
          title: 'home',
          icon: 'home',
          affix: true,
          savedPositionY: 0
        }
      }
    ]
  }
]

export const asyncRoutes: RouteConfig[] = [
  imageRouter
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.savedPositionY !== undefined) {
        from.meta.savedPositionY = document.scrollingElement.scrollTop
      }
      return { x: 0, y: from.meta.savedPositionY | 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes.concat(asyncRoutes)
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
