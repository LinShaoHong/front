// Just a mock data

export const constantRoutes = [
  {
    path: '/redirect',
    component: 'Layout',
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: 'views/login/auth-redirect',
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    meta: { hidden: true }
  },
  {
    path: '',
    component: 'Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/spider',
    component: 'Layout',
    redirect: '/spider/spider-jobs',
    name: 'Spider',
    meta: {
      title: 'spider',
      icon: 'spider',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        path: 'spider-jobs',
        component: 'views/spider/index.vue',
        name: 'SpiderJobs',
        meta: {
          title: 'spider',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/mysql',
    component: 'Layout',
    redirect: '/mysql/mysql-query',
    name: 'Mysql',
    meta: {
      title: 'mysql',
      icon: 'database',
      roles: ['admin']
    },
    children: [
      {
        path: 'mysql-query',
        component: 'views/sql/query.vue',
        name: 'MysqlQuery',
        meta: {
          title: 'mysqlQuery',
          roles: ['admin']
        }
      },
      {
        path: 'mysql-write',
        component: 'views/sql/write.vue',
        name: 'MysqlWrite',
        meta: {
          title: 'mysqlWrite',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]
