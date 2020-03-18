import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const GirlRoutes: RouteConfig = {
  path: '/girl',
  component: Layout,
  redirect: '/girl',
  children: [
    {
      name: 'girl',
      path: '/girl',
      component: () => import('@/views/girl/index.vue'),
      meta: { savedPositionY: 0 }
    },
    {
      name: 'girl-detail',
      path: '/girl/detail',
      component: () => import('@/views/girl/detail/index.vue'),
      meta: { savedPositionY: 0 }
    }
    // {
    //   name: 'girl-sn',
    //   path: '/girl/sn',
    //   component: () => import('@/views/girl/sn/index.vue'),
    //   meta: { savedPositionY: 0 }
    // },
    // {
    //   name: 'girl-qm',
    //   path: '/girl/qm',
    //   component: () => import('@/views/girl/qm/index.vue'),
    //   meta: { savedPositionY: 0 }
    // },
    // {
    //   name: 'girl-pic',
    //   path: '/girl/pic',
    //   component: () => import('@/views/girl/pic/index.vue'),
    //   meta: { savedPositionY: 0 }
    // },
    // {
    //   name: 'girl-video',
    //   path: '/girl/video',
    //   component: () => import('@/views/girl/video/index.vue'),
    //   meta: { savedPositionY: 0 }
    // }
  ]
}

export default GirlRoutes
