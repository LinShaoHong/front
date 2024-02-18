import { networkError } from "@/utils/request";
import { ios } from "@/utils/unis";

/**
 * 分享
 */
export function useShare() {
  const user = useStore('user');
  const config = useStore('config');

  const shareTitle = ref(config.data.value.shareTitle);
  const shareImageUrl = ref(config.data.value.logo as any);
  const shareUserId = ref('');
  const shareMainUserId = ref('');
  const sharePath = ref('pages/index/index');

  const _path = computed(() => {
    if (shareUserId.value != '' || shareMainUserId.value != '') {
      let s = sharePath.value as string;
      if (shareUserId.value != '') {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'shareUserId=' + shareUserId.value;
      }
      if (shareMainUserId.value != '') {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'mainUserId=' + shareMainUserId.value;
      }
      return s;
    }
    return sharePath.value;
  });

  onShareAppMessage(async () => {
    await beforeShare();
    console.log(_path.value);
    return {
      title: shareTitle.value,
      imageUrl: shareImageUrl.value,
      path: _path.value,
    }
  });

  onShareTimeline(() => {
    return {
      title: shareTitle.value,
      imageUrl: shareImageUrl.value,
      query: '',
    }
  });

  const beforeShare = async () => {
    await config.getConfigInfo().then(async () => {
      if (shareTitle.value === '') {
        shareTitle.value = config.data.value.shareTitle;
      }
      if (shareImageUrl.value === '') {
        shareImageUrl.value = config.data.value.logo;
      }
      if (ios()) {
        shareUserId.value = user.data.value.id;
      }
    }).catch(() => networkError());
  };

  const parseShare = async (option) => {
    if (option !== undefined) {
      const shareUserId = option['shareUserId'];
      if (shareUserId != undefined) {
        const shareId = option['shareId'];
        if (shareId != undefined) {
          return {
            shareUserId: shareUserId,
            shareId: shareId
          }
        }
      }
    }
    return undefined;
  };

  return {
    onShareAppMessage,
    onShareTimeline,
    parseShare,
    sharePath,
    shareTitle,
    shareImageUrl,
    shareUserId,
    shareMainUserId
  }
}