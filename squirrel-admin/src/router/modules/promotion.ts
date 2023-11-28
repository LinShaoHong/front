import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const promotionRoutes: RouteConfig = {
  path: '/promotion',
  component: Layout,
  redirect: '/promotion/list',
  name: 'Promotion',
  meta: {
    title: 'promotion',
  },
  children: [
    {
      path: 'promotion-list',
      component: () => import('@/views/promotion/list.vue'),
      name: 'PromotionList',
      meta: { title: 'promotionList', icon: 'link' }
    }
  ]
}

export default promotionRoutes
