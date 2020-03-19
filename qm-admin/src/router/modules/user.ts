import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRoutes: RouteConfig = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: {
    title: 'user',
    icon: 'user'
  },
  children: [
    {
      path: 'user-list',
      component: () => import('@/views/user/list.vue'),
      name: 'UserList',
      meta: { title: 'userList', icon: 'list' }
    },
    {
      path: 'user-stat',
      component: () => import('@/views/user/stat.vue'),
      name: 'UserStat',
      meta: { title: 'userStat', icon: 'chart' }
    }
  ]
}

export default userRoutes
