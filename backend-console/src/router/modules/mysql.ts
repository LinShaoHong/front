import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const mysqlRoutes: RouteConfig = {
  path: '/mysql',
  component: Layout,
  redirect: '/mysql/mysql-query',
  name: 'Mysql',
  meta: {
    title: 'mysql',
    icon: 'database'
  },
  children: [
    {
      path: 'mysql-query',
      component: () => import('@/views/sql/query.vue'),
      name: 'MysqlQuery',
      meta: { title: 'mysqlQuery' }
    },
    {
      path: 'mysql-write',
      component: () => import('@/views/sql/write.vue'),
      name: 'MysqlWrite',
      meta: { title: 'mysqlWrite' }
    }
  ]
}

export default mysqlRoutes
