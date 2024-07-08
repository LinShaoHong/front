import http from '@/utils/request';
import SendReq = Sms.SendReq;

const apiSms = {
  send: (body: SendReq) => http.post<any>('/sms/send', body),

  getSpecsByType: (type: string) => http.get<any>('/sms/getSpecsByType', { type: type }),

  records: (userId: string) => http.get<any>('/sms/records', { userId: userId }),

  chats: (userId: string, phone: string) => http.get<any>('/sms/chats', { userId: userId, phone: phone }),

  recPhones: (userId: string) => http.get<any>('/sms/recPhones', { userId: userId }),
};

export default apiSms;