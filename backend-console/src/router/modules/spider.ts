import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const spiderRoutes: RouteConfig = {
  path: '/spider',
  component: Layout,
  redirect: '/spider/spider-jobs',
  name: 'Spider',
  meta: {
    title: 'spider',
    icon: 'spider'
  },
  children: [
    {
      path: 'spider-jobs',
      component: () => import('@/views/spider/index.vue'),
      name: 'SpiderJobs',
      meta: { title: 'spider', icon: 'spider' }
    }
  ]
}

export default spiderRoutes
