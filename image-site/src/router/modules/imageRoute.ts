import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const ImageRoutes: RouteConfig = {
  path: '/image',
  component: Layout,
  redirect: '/image',
  children: [
    {
      name: 'image-meizi',
      path: '/image/meizi',
      component: () => import('@/views/image/meizi/index.vue'),
      meta: { savedPositionY: 0 }
    },
    {
      name: 'image-meizi-category',
      path: '/image/meizi/$:category',
      component: () => import('@/views/image/meizi/categorized/index.vue')
    },
    {
      name: 'image-meizi-search',
      path: '/image/meizi/search',
      component: () => import('@/views/image/meizi/search/index.vue')
    }
  ]
}

export default ImageRoutes
