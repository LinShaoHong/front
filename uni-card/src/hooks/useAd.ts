/**
 * 加载广告
 */
import app from '@/config/app'

export function useRewardedVideoAd() {
  const ad = {} as UniNamespace.RewardedVideoAdContext;
  const adLoaded = ref(false);
  const adClosed = ref(false);

  onReady(() => {
    adLoaded.value = false;

    Object.assign(ad, uni.createRewardedVideoAd({
      adUnitId: app.adUnitId
    }));

    ad.onLoad(() => {
      adLoaded.value = true;

    });

    ad.onError((err) => {
      console.log('ad onError event', err)
    });

    ad.onClose((res) => {
      if (!res.isEnded) {
        adClosed.value = true;
      }
    });
  });

  return {
    ad,
    adLoaded,
    adClosed
  }
}