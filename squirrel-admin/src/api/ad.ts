import request from '@/utils/request'
import { SingleResp } from './response'

export const genSentence = (): SingleResp | any =>
  request({
    url: '/v1/qm/admin/ad/gen/sentence',
    method: 'get'
  })
