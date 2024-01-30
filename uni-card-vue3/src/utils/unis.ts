// 设置页面标题
export const setNBT = (name) => {
  uni.setNavigationBarTitle(name);
}

//设置页面导航条颜色
export const setNBC = (back = '#fff', front = false) => {
  uni.setNavigationBarColor({
    frontColor: back.indexOf('#fff') > -1 || front ? '#000000' : '#ffffff',
    backgroundColor: back,
  });
}