import request from '@/utils/request'
import { Resp } from "../../../qm-admin/src/api/response";

export interface UserInfo {
  id: string
  name: string
  avatar: string
  amount: string
  vip: boolean
  vipEndTime: Date,
  signInTime: Date,
  signInCount: number,
  canSignIn: boolean,
  paymentTotal: number
}

export const signIn = (): any =>
  request({
    url: '/v1/qm/user/signIn',
    method: 'put'
  })

export const info = (): any =>
  request({
    url: '/v1/qm/user/info',
    method: 'get'
  })

export const deleteAvatar = (data: any): Resp | any =>
  request({
    url: '/v1/qm/user/delete/avatar',
    method: 'delete',
    data
  })

const uploadAvatarPath = process.env.VUE_APP_BASE_API + '/v1/qm/user/upload/avatar'
export { uploadAvatarPath }
