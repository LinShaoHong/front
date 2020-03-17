import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const girlRoutes: RouteConfig = {
  path: '/girl',
  component: Layout,
  redirect: '/girl/list',
  name: 'Girl',
  meta: {
    title: 'girl',
    icon: 'table'
  },
  children: [
    {
      path: 'girl-list',
      component: () => import('@/views/girl/list.vue'),
      name: 'GirlList',
      meta: { title: 'girlList', icon: 'list' }
    },
    {
      path: 'girl-create',
      component: () => import('@/views/girl/create.vue'),
      name: 'GirlCreate',
      meta: { title: 'girlCreate', icon: 'form' }
    },
    {
      path: 'girl-edit',
      component: () => import('@/views/girl/edit.vue'),
      name: 'GirlEdit',
      meta: { title: 'girlEdit', icon: 'form', hidden: true }
    },
    {
      path: 'girl-comment',
      component: () => import('@/views/girl/comment.vue'),
      name: 'GirlComment',
      meta: { title: 'girlComment', icon: 'message' }
    }
  ]
}

export default girlRoutes
