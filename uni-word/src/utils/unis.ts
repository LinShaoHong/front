// 设置页面标题
export const setNBT = async (name) => {
    await uni.setNavigationBarTitle({
        title: name
    });
}

//设置页面导航条颜色
export const setNBC = async (back = '#fff', front = false) => {
    await uni.setNavigationBarColor({
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

export const autoUpdate = async () => {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
            uni.showModal({
                title: '更新提示',
                confirmText: "确定更新",
                showCancel: false,
                content: '新版本已经准备好，是否重启应用？',
                success: res => {
                    if (res.confirm) {
                        //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                        downLoadAndUpdate(updateManager)
                    } else {
                        uni.showModal({
                            title: '温馨提示~',
                            content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                            showCancel: false,
                            confirmText: "确定更新",
                            success: res => {
                                if (res.confirm) {
                                    downLoadAndUpdate(updateManager)
                                }
                            }
                        })
                    }
                }
            })
        }
    });
}

const downLoadAndUpdate = async (mgr) => {
    await uni.showLoading();
    //静默下载更新小程序新版本
    mgr.onUpdateReady(function () {
        uni.hideLoading()
        mgr.applyUpdate()
    })
    mgr.onUpdateFailed(function () {
        uni.hideLoading()
        // 新的版本下载失败
        uni.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
    })
}

export const ios = () => {
    const sys = uni.getSystemInfoSync();
    return sys.platform === 'ios';
}