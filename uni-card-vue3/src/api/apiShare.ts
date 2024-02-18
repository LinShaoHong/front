import http from '@/utils/request';

const apiShare = {
  share: (shareUserId: string, shareId: string) => http.get<Config.ConfigInfo>('/share/share', {
    shareUserId: shareUserId,
    shareId: shareId
  })
};

export default apiShare;
