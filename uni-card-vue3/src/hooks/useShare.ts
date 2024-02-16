/**
 * 分享
 */
const config = useStore('config');

export function useShare() {
  onShareAppMessage(() => {
    return {
      title: config.data.value.shareTitle,
      imageUrl: config.data.value.logo,
      path: 'pages/index/index',
    }
  });

  onShareTimeline(() => {
    return {
      title: config.data.value.shareTitle,
      query: '',
      imageUrl: config.data.value.logo,
    }
  });

  return {
    onShareAppMessage,
    onShareTimeline
  }
}