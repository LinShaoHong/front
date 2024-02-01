import http from '@/utils/request';
import WxPayResp = Pay.WxPayResp;

const apiPay = {
  wxPay: (amount: string, userId: string) => http.post<WxPayResp>('/pay/wx', { userId: userId, amount: amount })
};

export default apiPay;