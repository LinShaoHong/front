import siteInfo from '@/common/siteinfo';
var util = {};
/**
	构造地址, 
	@params action 系统中的controller, action, do，格式为 'wxapp/home/navs'
	@params querystring 格式为 {参数名1 : 值1, 参数名2 : 值2}
*/
util.url = function(action) {
	let url = siteInfo.siteroot || ''
	return url + '/' + action;
}

function getQuery(url) {
	var theRequest = [];
	if (url.indexOf("?") != -1) {
		var str = url.split('?')[1];
		var strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			if (strs[i].split("=")[0] && unescape(strs[i].split("=")[1])) {
				theRequest[i] = {
					'name': strs[i].split("=")[0],
					'value': unescape(strs[i].split("=")[1])
				}
			}
		}
	}
	return theRequest;
}
/*
 * 获取链接某个参数
 * url 链接地址
 * name 参数名称
 */
function getUrlParam(url, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
	var r = url.split('?')[1].match(reg); //匹配目标参数  
	if (r != null) return unescape(r[2]);
	return null; //返回参数值  
}
/**
 * url 链接地址
 * date 参数{参数名1 : 值1, 参数名2 : 值2} *
 */
util.request = function(option) {
	if (option.mask) {
		uni.showLoading({
			title: option.mask == 1 ? '加载中' : option.mask,
			mask: true
		});
	}
	let url = util.url(option.url)
	var option = option || {};
	if (!url) {
		return false;
	}
	if (option.nbarLoad) uni.showNavigationBarLoading();
	return new Promise((resolve, reject) => {
		let {error, res} = uni.request({
			'url': url,
			'data': option.data ? option.data : {},
			'method': option.method ? option.method : 'GET',
			'header': {
				'content-type': option.ct ? 'application/json' : 'application/x-www-form-urlencoded'
			}
		}).then(res=> {
			if (option.mask) uni.hideLoading();
			if (option.nbarLoad) uni.hideNavigationBarLoading()
			if (res.data.status == 100) {
				resolve(res.data.data)
			} else {
				if (!option.noToast && res.data && res.data.msg) {
					util.message(res.data.msg, 3, 2000)
				}
				reject(res.data)
			}
		}).catch(error => {
			util.message(error ? JSON.stringify(error) : '访问异常', 3, 2000)
			if (option.mask) uni.hideLoading();
			if (option.nbarLoad) uni.hideNavigationBarLoading()
			reject()
		})
	})
}
/*
 * 提示信息
 */
util.message = function(c, t, d) {
	uni.showToast({
		// #ifdef MP-ALIPAY
		icon: t == 1 ? 'success' : t == 2 || t == 3 ? 'none' : '',
		// #endif
		// #ifndef MP-ALIPAY
		icon: t == 1 ? 'success' : t == 2 ? 'loading' : t == 3 ? 'none' : '',
		// #endif
		title: c,
		duration: d || 1000,
	});
}

util.modal = (c, t, sc) => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: t || '温馨提示',
			content: c,
			confirmColor: '#8465B5',
			showCancel: sc ? true : false,
			complete(res) {
				if (res.confirm) {
					resolve()
				} else if (res.cancel) {
					reject()
				}
			}
		})
	})
}
//封装微信等待提示，防止ajax过多时，show多次
util.showLoading = (c, m = 1) => {
	var isShowLoading = uni.getStorageSync('isShowLoading');
	if (isShowLoading) {
		uni.hideLoading();
		uni.setStorageSync('isShowLoading', false);
	}

	uni.showLoading({
		title: c || '加载中',
		mask: m ? true : false,
		complete: function() {
			uni.setStorageSync('isShowLoading', true);
		},
		fail: function() {
			uni.setStorageSync('isShowLoading', false);
		}
	});
}
util.preImg = (option) => {
	uni.previewImage({
		current: option.idx,
		urls: option.urls
	})
}
util.setNT = (n) => {
	uni.setNavigationBarTitle({
		title: n
	})
}
util.setNB = (n = '#fff', nofc = false) => {
	uni.setNavigationBarColor({
		frontColor: n.indexOf('#fff') > -1 || nofc ? '#000000' : '#ffffff',
		backgroundColor: n,
	})
}
util.fz = (n) => {
	uni.setClipboardData({
		data: n + '',
		success(res) {
			util.message('复制成功', 1)
		},fail(err) {
			util.message(JSON.stringify(err), 3)
			
		}
	});
}
util.mpShare = (obj) => {
	return {
		title: obj.t || '进来看看吧！',
		imageUrl: obj.i,
		// #ifndef MP-ALIPAY
		path: obj.p ? '/' + obj.p : '',
		// #endif
		// #ifdef MP-ALIPAY
		path: obj.p || '',
		// #endif
	}
}
export default util;
