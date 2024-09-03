import request from '@/utils/request'
import {Resp} from "../../../qm-admin/src/api/response";

export const deleteFile = (data: any): Resp | any =>
  request({
    url: '/v1/qm/storage',
    method: 'delete',
    data
  })

const uploadPath = process.env.VUE_APP_BASE_API + '/v1/qm/storage/upload'
export {uploadPath}
