import http from '@/utils/request';
import WxPayResp = Pay.WxPayResp;

const apiPay = {
  wxPay: (amount: string, userId: string, vip: number) => http.post<WxPayResp>('/pay/wx', {
    userId: userId,
    amount: amount,
    vip: vip
  })
};

export default apiPay;