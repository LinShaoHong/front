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

export const modal = (content, title?, showCancel?) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: title || '温馨提示',
      content: content,
      confirmColor: '#8465B5',
      showCancel: !!showCancel,
      complete(res) {
        if (res.confirm) {
          resolve(res);
        } else if (res.cancel) {
          reject()
        }
      }
    })
  })
}

export const message = (title, icon, duration?) => {
  return new Promise((resolve, reject) => {
    uni.showToast({
      icon: icon == 1 ? 'success' : icon == 2 ? 'loading' : icon == 3 ? 'none' : 'error',
      title: title,
      duration: duration || 1000,
      complete(res) {
        resolve(res);
      },
      fail() {
        reject();
      }
    });
  });
}