import { isMp } from "@/utils/platform";

/**
 * 分享
 */
export function useTabBar() {
  const tabBar = ref({
    color: "#000000",
    backgroundColor: "#ffffff",
    selectedColor: "#482380",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "static/tabbar/tab_index.png",
        selectedIconPath: "static/tabbar/tab_index_active.png",
        text: "首页",
        openType: 'switchTab'
      },
      {
        pagePath: "pages/more/more",
        iconPath: "static/tabbar/tab_more.png",
        selectedIconPath: "static/tabbar/tab_more_active.png",
        text: "云顶玩法",
        openType: 'switchTab'
      },
      {
        pagePath: "pages/profile/profile",
        iconPath: "static/tabbar/tab_profile.png",
        selectedIconPath: "static/tabbar/tab_profile_active.png",
        text: "我的",
        openType: 'switchTab'
      }
    ]
  });

  onLoad(async () => {
    await uni.hideTabBar();
    const user = useStore('user');
    const sys = uni.getSystemInfoSync();
    if (sys.platform === 'ios' && isMp) {
      user.getUserInfo().then(() => {
        if (user.data.value.vip < 1) {
          tabBar.value.list.splice(1, 1);
        }
      });
    }
  });

  const tabLen = computed(() => {
    return tabBar.value.list.length;
  });

  return {
    tabBar,
    tabLen
  }
}