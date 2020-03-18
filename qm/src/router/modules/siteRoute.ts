import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SiteRoutes: RouteConfig = {
  path: '/site',
  component: Layout,
  redirect: '/site',
  children: [
    {
      name: 'site',
      path: '/site/copyright',
      component: () => import('@/views/site/copyright.vue'),
      meta: { savedPositionY: 0 }
    }
  ]
}

export default SiteRoutes
