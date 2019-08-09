import {RouteConfig} from 'vue-router'
import Layout from '@/layout/index.vue'

const ImageRoutes: RouteConfig = {
  path: '/image',
  component: Layout,
  redirect: '/image',
  children: [
    {
      path: '/image/:category',
      component: () => import('@/views/image/index.vue')
    }
  ]
}

export default ImageRoutes
