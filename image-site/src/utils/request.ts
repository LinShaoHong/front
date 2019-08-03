import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
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
