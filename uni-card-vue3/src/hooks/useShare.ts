import apiShare from "@/api/apiShare";
import { networkError } from "@/utils/request";

/**
 * 分享
 */
export function useShare() {
  const user = useStore('user');
  const config = useStore('config');

  const shareTitle = ref(config.data.value.shareTitle);
  const shareImageUrl = ref(config.data.value.logo);
  const shareUserId = ref('');
  const shareId = ref('');
  const shareMainUserId = ref('');
  const sharePath = ref('pages/index/index');

  const _path = computed(() => {
    if (shareUserId.value != '' || shareId.value != '' || shareMainUserId.value != '') {
      let s = sharePath.value as string;
      if (shareUserId.value != '' && shareId.value != '') {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'shareUserId=' + shareUserId.value;
      }
      if (shareId.value != '') {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'shareId=' + shareId.value;
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
      // if (ios()) {
      shareUserId.value = user.data.value.id;
      let id = Date.now().toString(36)
      id += Math.random().toString(36).substring(2)
      shareId.value = id;
      await apiShare.share(shareUserId.value, shareId.value)
        .catch(() => networkError());
      // }
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
    shareId,
    shareMainUserId
  }
}