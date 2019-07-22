import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const tableRoutes: RouteConfig = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'spider',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    {
      path: 'complex-table',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'pictureSpider' }
    }
  ]
}

export default tableRoutes
