import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const chargeRoutes: RouteConfig = {
  path: '/charge',
  component: Layout,
  redirect: '/charge/list',
  name: 'Charge',
  meta: {
    title: 'charge',
    icon: 'table'
  },
  children: [
    {
      path: 'charge-list',
      component: () => import('@/views/charge/list.vue'),
      name: 'ChargeList',
      meta: { title: 'chargeList', icon: 'list' }
    }
  ]
}

export default chargeRoutes
