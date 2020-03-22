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
    },
    {
      path: 'view-stat',
      component: () => import('@/views/girl/stat.vue'),
      name: 'ViewStat',
      meta: { title: 'viewStat', icon: 'chart' }
    },
    {
      path: 'spider-jobs',
      component: () => import('@/views/spider/index.vue'),
      name: 'SpiderJobs',
      meta: { title: 'spider', icon: 'spider' }
    }
  ]
}

export default girlRoutes
