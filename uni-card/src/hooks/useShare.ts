import { networkError } from "@/utils/request";
import { ios } from "@/utils/unis";
import { isEmpty } from "@/utils/is";

/**
 * 分享
 */
export function useShare() {
  const user = useStore('user');
  const config = useStore('config');

  const shareFunc = ref(() => {
  });
  const shareTitle = ref('');
  const shareUserId = ref('');
  const shareMainUserId = ref('');
  const sharePath = ref('pages/index/index');

  onShareAppMessage(async () => {
    await beforeShare();
    shareFunc.value.apply(null);
    return {
      title: shareTitle.value,
      imageUrl: '',
      path: _path.value,
    }
  });

  onShareTimeline(() => {
    shareFunc.value.apply(null);
    return {
      title: shareTitle.value,
      imageUrl: '',
      query: '',
    }
  });

  const _path = computed(() => {
    if (shareUserId.value != '' || shareMainUserId.value != '') {
      let s = sharePath.value as string;
      if (!isEmpty(shareUserId.value)) {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'shareUserId=' + shareUserId.value;
      }
      if (!isEmpty(shareMainUserId.value)) {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'mainUserId=' + shareMainUserId.value;
      }
      if (!isEmpty(config.data.value.partner)) {
        let m = s.includes('?') ? '&' : '?';
        s += m + 'partner=' + config.data.value.partner;
      }
      return s;
    }
    return sharePath.value;
  });

  const beforeShare = async () => {
    shareUserId.value = user.data.value.id;
    if (shareTitle.value === '') {
      await config.getConfigInfo().then(async () => {
        shareTitle.value = config.data.value.shareTitle;
      }).catch(() => networkError());
    }
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
    shareFunc,
    sharePath,
    shareTitle,
    shareUserId,
    shareMainUserId
  }
}