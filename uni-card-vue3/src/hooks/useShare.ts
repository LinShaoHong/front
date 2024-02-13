/**
 * 分享
 */
const config = useStore('config');

export function useShare() {
  const onShareAppMessage = () => {
    return {
      title: config.data.value.shareTitle,
      imageUrl: config.data.value.logo,
      path: 'pages/index/index',

    };
  };
  const onShareTimeline = () => {
    return {
      title: config.data.value.shareTitle,
      query: '',
      imageUrl: config.data.value.logo,
    }
  }

  return {
    onShareAppMessage,
    onShareTimeline
  }
}