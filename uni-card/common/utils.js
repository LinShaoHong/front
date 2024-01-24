let util = {}

/*函数节流*/
util.throttle = (fn, interval) => {
	let enterTime = 0; //触发的时间
	let gapTime = interval || 300; //间隔时间
	return function() {
		let context = this,
			backTime = new Date(); //第一次函数return即触发的时间
		// console.log(this)
		if (backTime - enterTime > gapTime) {
			fn.call(context, arguments);
			enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
		}
	};
}
/*函数防抖*/
util.debounce = (fn, interval) => {
	var timer;
	var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
	return function() {
		clearTimeout(timer);
		// var context = this;
		// var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
		timer = setTimeout(() => {
			fn.call(this, arguments);
		}, gapTime);
	};
}

 /* 判断是否为空 */
util.empty = (value) => {
    switch (typeof value) {
    case 'undefined':
        return true
    case 'string':
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
        break
    case 'boolean':
        if (!value) return true
        break
    case 'number':
        if (value === 0 || isNaN(value)) return true
        break
    case 'object':
        if (value === null || value.length === 0) return true
        for (const i in value) {
            return false
        }
        return true
    }
    return false
}

/**
 * 是否数组
 */
util.array = value => {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
    }
    return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 是否对象
 */
util.object = value => {
    return Object.prototype.toString.call(value) === '[object Object]'
}

export default util;
