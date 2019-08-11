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
      children: [
        {
          name: 'image-meizi-category',
          path: '/image/meizi/:category',
          component: () => import('@/views/image/meizi/index.vue')
        }
      ]
    }
  ]
}

export default ImageRoutes
