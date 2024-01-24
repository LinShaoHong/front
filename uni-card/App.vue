<script>
	import siteInfo from './common/siteinfo';
	export default {
		globalData: {
			siteInfo,
			onImgurl: siteInfo.siteroot + '/app/'
		},
		onLaunch: function() {
			this.getUserInfo();
			// #ifdef MP
			this.autoUpdate()
			// #endif
		},
		methods: {
			// #ifdef MP
			autoUpdate() {
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
									this.downLoadAndUpdate(updateManager)
								} else {
									uni.showModal({
										title: '温馨提示~',
										content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
										showCancel: false,
										confirmText: "确定更新",
										success: res => {
											if (res.confirm) {
												this.downLoadAndUpdate(updateManager)
											}
										}
									})
								}
							}
						})
					}
				});
			},
			downLoadAndUpdate: function(updateManager) {
				uni.showLoading();
				//静默下载更新小程序新版本
				updateManager.onUpdateReady(function() {
					uni.hideLoading()
					updateManager.applyUpdate()
				})
				updateManager.onUpdateFailed(function() {
					uni.hideLoading()
					// 新的版本下载失败
					uni.showModal({
						title: '已经有新版本了哟~',
						content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					})
				})
			},
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import '@/common/styles/index.css';
</style>