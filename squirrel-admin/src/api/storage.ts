import request from '@/utils/request'
import { Resp } from './response'

export const deleteImage = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/store/delete',
    method: 'post',
    data
  })

const uploadPath = process.env.VUE_APP_BASE_API + '/v1/qm/admin/store'
export { uploadPath }

const imageServer = process.env.VUE_APP_IMAGE_SERVER
export { imageServer }
