import request from '@/utils/request'

export interface UserInfo {
  id: string
  name: string
  amount: string
  vip: boolean
  vipEndTime: Date,
  signInTime: Date,
  signInCount: number,
  canSignIn: boolean,
  paymentTotal: number
}

export const register = (data: any): any =>
  request({
    url: '/v1/xfg/session/register',
    method: 'post',
    data
  })

export const login = (data: any): any =>
  request({
    url: '/v1/xfg/session/login',
    method: 'post',
    data
  })

export const checkName = (params: any): any =>
  request({
    url: '/v1/xfg/session/checkName',
    method: 'get',
    params
  })

export const logout = (): any =>
  request({
    url: '/v1/xfg/session/logout',
    method: 'post'
  })