import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const chargeRoutes: RouteConfig = {
  path: '/charge',
  component: Layout,
  redirect: '/charge/list',
  name: 'Charge',
  meta: {
    title: 'charge',
    icon: 'money'
  },
  children: [
    {
      path: 'charge-list',
      component: () => import('@/views/charge/list.vue'),
      name: 'ChargeList',
      meta: { title: 'chargeList', icon: 'list' }
    },
    {
      path: 'recharge-log',
      component: () => import('@/views/charge/recharge.vue'),
      name: 'RechargeLog',
      meta: { title: 'rechargeLog', icon: 'money' }
    },
    {
      path: 'charge-log',
      component: () => import('@/views/charge/consume.vue'),
      name: 'ChargeLog',
      meta: { title: 'chargeLog', icon: 'shopping' }
    }
  ]
}

export default chargeRoutes
