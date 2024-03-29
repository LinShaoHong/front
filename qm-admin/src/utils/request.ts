import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import Cookies from 'js-cookie'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    const c = Cookies.get('ADMIN-QM-TOKEN')
    if (c !== undefined && c !== null && c !== '') {
      config.headers['ADMIN-QM-TOKEN'] = c
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code < 200 || res.code >= 300) {
      Message({
        message: res.message || 'Error',
        type: 'info',
        duration: 500
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    const res = error.response
    if (res.status === 500) {
      Message({
        message: '内部错误',
        type: 'error',
        duration: 1000
      })
    } else {
      Message({
        message: res.data,
        type: 'info',
        duration: 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
