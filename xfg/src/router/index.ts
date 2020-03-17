import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

import Layout from '@/layout/index.vue'
import userRouter from './modules/userRoute'
import imageRouter from './modules/imageRoute'
import girlRouter from './modules/girlRoute'

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
        component: () => import('@/views/girl/index.vue'),
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
  imageRouter, userRouter, girlRouter
]

const createRouter = () => new Router({
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
