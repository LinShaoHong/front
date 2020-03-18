import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const UserRoutes: RouteConfig = {
  path: '/user',
  component: Layout,
  redirect: '/user',
  children: [
    {
      name: 'user-login',
      path: '/user/login',
      component: () => import('@/views/user/login.vue'),
      meta: { savedPositionY: 0 }
    },
    {
      name: 'user-register',
      path: '/user/register',
      component: () => import('@/views/user/register.vue'),
    },
    {
      name: 'user-forgetPwd',
      path: '/user/forgetPwd',
      component: () => import('@/views/user/forgetPwd.vue'),
    },
    {
      name: 'user-changePwd',
      path: '/user/changePwd',
      component: () => import('@/views/user/changePwd.vue'),
    },
    {
      name: 'user-detail',
      path: '/user/detail',
      component: () => import('@/views/user/detail.vue'),
    },
    {
      name: 'user-recharge',
      path: '/user/recharge',
      component: () => import('@/views/user/recharge.vue'),
    }
  ]
}

export default UserRoutes
