//延迟执行
export const tabBar = () => {
  const tabBar = {
    color: "#000000",
    backgroundColor: "#ffffff",
    selectedColor: "#482380",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "static/tabbar/tab_index.png",
        selectedIconPath: "static/tabbar/tab_index_active.png",
        text: "首页"
      },
      {
        pagePath: "pages/more/more",
        iconPath: "static/tabbar/tab_more.png",
        selectedIconPath: "static/tabbar/tab_more_active.png",
        text: "云顶玩法"
      },
      {
        pagePath: "pages/profile/profile",
        iconPath: "static/tabbar/tab_profile.png",
        selectedIconPath: "static/tabbar/tab_profile_active.png",
        text: "我的"
      }
    ]
  };
  const sys = uni.getSystemInfoSync();
  if (sys.platform === 'ios') {
    tabBar['list'].splice(1, 1);
  }
  return tabBar;
};