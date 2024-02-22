import http from '@/utils/request';
import WxPayResp = Pay.WxPayResp;

const apiPay = {
  wxPay: (amount: string, userId: string, h5: boolean) => http.post<WxPayResp>('/pay/wx', {
    userId: userId,
    amount: amount,
    h5: h5
  })
};

export default apiPay;