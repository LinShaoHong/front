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
      path: '/user-list',
      component: () => import('@/views/user/list.vue'),
      name: 'UserList',
      meta: { title: 'userList', icon: 'list' }
    },
    {
      path: 'user-foot',
      component: () => import('@/views/user/foot.vue'),
      name: 'UserFoot',
      meta: { title: 'userFoot', icon: 'chart' }
    },
    {
      path: 'user-coll',
      component: () => import('@/views/user/coll.vue'),
      name: 'UserColl',
      meta: { title: 'userColl', icon: 'star' }
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
