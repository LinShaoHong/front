import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const schedulerRoutes: RouteConfig = {
  path: '/scheduler',
  component: Layout,
  redirect: '/scheduler/list',
  name: 'Scheduler',
  meta: {
    title: 'scheduler',
    icon: 'table'
  },
  children: [
    {
      path: 'scheduler-jobs',
      component: () => import('@/views/scheduler/index.vue'),
      name: 'SSchedulerJobs',
      meta: { title: 'scheduler', icon: 'database' }
    }
  ]
}

export default schedulerRoutes
