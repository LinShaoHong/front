import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const messageRoutes: RouteConfig = {
  path: '/message',
  component: Layout,
  redirect: '/message/list',
  name: 'Message',
  meta: {
    title: 'message',
    icon: 'message'
  },
  children: [
    {
      path: 'message-list',
      component: () => import('@/views/message/list.vue'),
      name: 'MessageList',
      meta: { title: 'messageList', icon: 'message' }
    }
  ]
}

export default messageRoutes
