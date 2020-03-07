import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers['MALL-ADMIN-TOKEN'] = store.getters.token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const status = response.status
    if (status < 200 || status >= 300) {
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
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  }, error => {
    const res = error.response
    if (res.status === 500) {
      Message({
        message: '内部错误',
        type: 'error',
        duration: 1000
      })
    } else {
      Message({
        message: res.data.message,
        type: 'info',
        duration: 1000
      })
    }
    return Promise.reject(error)
  })

export default service
