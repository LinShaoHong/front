<template>
	<view class="p-r">
		<image class="bg" :src="`${onImgurl}bg.png`" mode="scaleToFill"></image>
		<view class="p-a udlr f-y-c f-col">
			<view class="banner" v-if="banner.length">
				<swiper :indicator-dots="banner.length > 1" :autoplay="true" :interval="3500" :duration="150"
					class="banner-swiper" :circular="true" indicator-color="rgba(255, 255, 255, 0.8)"
					indicator-active-color="#fff">
					<swiper-item v-for="(item, index) in banner" :key="index" @tap.stop="onBanner(item)">
						<image :src="item.imgUrl" class="slide-image"
							mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- <view
				class="r-b l0 p0 bt o-h"
				:style="{
					top: banner.length ? '300rpx' : '60rpx'
				}"
				@click="go({
					url: '/pages/index/card'
				})"
				>
				<image class="wh" src="/static/mask_left_bg.png" mode="scaleToFill"></image>
				<view class="p-a udlr f-y-c bt p0 f-x-e">
					<text class="f28 cf ml5">牌自定义</text>
					<text class="f28 cf ml5">卡牌预览</text>
					<image class="icon" src="/static/question.png" mode="heightFix"></image>
				</view>
			</view> -->
			<button 
				class="r-b r0 p0 bt o-h"
				:style="{
					top: banner.length ? '300rpx' : '60rpx'
				}"
				openType="contact">
				<image class="wh" src="/static/mask_bg.png" mode="heightFix"></image>
				<view class="p-a udlr f-y-c bt p0">
					<image class="icon" src="/static/message.png" mode="heightFix"></image>
					<text class="f28 cf ml5">联系客服</text>
				</view>
			</button>
			<view 
				class="card-box l0 r0"
				:style="{
					top: banner.length ? '264rpx' : '24rpx'
				}"
			>
				<view class="content p-r f-x-c">
					<image class="wh posi-a t0" src="/static/p_bg.png" mode="heightFix"></image>
					<view class="card">
						<block v-for="(item, index) in 4" :key="index">
							<view 
								class="wh p-a l0 f-x-c"
								:class="[isXp && 'key-frame2']"
								:style="{
									top: isXp ? -index * 5 + 'rpx' : -index * 10 + 'rpx',
									'z-index': index + 15
								}"
							>
								<image 
									class="wh p-a t0" 
									:src="`${onImgurl}back.png`"
									mode="heightFix"
								>
								</image>
							</view>
						</block>
						<view
							class="wh p-a l0 card_item f-x-c"
							:class="[isXp && 'key-frame1', isKp ? 'rotate1' : 'rotate2']"
							:style="{
								top: isXp ? 4 * 5 + 'rpx' : -4 * 10 + 'rpx',
								'z-index': 30
							}">
							<image 
								class="wh p-a t0 front"
								:src="src ? src : `${onImgurl}back.png`"
								mode="heightFix"
							>
							</image>
							<image 
								class="wh p-a t0 back" 
								:src="`${onImgurl}back.png`" 
								mode="heightFix"
							>
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="opreation f-y-c">
				<view class="btn" @click="xpAction">
					<image class="wh" src="/static/xp.png" mode="heightFix"></image>
				</view>
				<view class="btn" @click="kpAction">
					<image class="wh" src="/static/kp.png" mode="heightFix"></image>
				</view>
			</view>
		</view>
		
		<!-- <ad-rewarded-video></ad-rewarded-video> -->
		
		<popup v-model="showGz" position="center" :close="false">
			<view class="pb40">
				<image class="rule_img" :src="`${onImgurl}gz.png`" mode="heightFix"></image>
				<view class="f-c-c">
					<view class="p-10-20 p-r confirm fm-kt" @click="showGz=false">
						<image class="wh" src="/static/foot_bg.png" mode="scaleToFill"></image>
						<text class="f30 wei cf p-a udlr t-c" style="line-height: 100rpx;"> 确定 </text>
					</view>
				</view>
			</view>
		</popup>
		
		<qrcode
			v-model="showQrcode"
			:title="codeSrc.includes('oa')?'公众号二维码':codeSrc.includes('wechat')? '微信二维码': ''"
			:src="codeSrc"
			:lable="codeSrc.includes('oa')?'长按识别二维码，打开公众号':codeSrc.includes('wechat')? '长按识别二维码，添加微信': ''"
			@close=""
		/>
		
		<subscribe 
			v-model="showSubscribe" 
			@ad="showAd" 
			@subscribe="openMember"
		/>
		
		<ad-close-pop
			v-model="showAdClose"
			@subscribe="openMember"
		/>
		
		<popup v-model="show" position="middle" :close="false">
			<view class="pb40">
				<image class="rule_img" :src="src" mode="heightFix"></image>
				<view class="f-c-c">
					<view class="p-10-20 p-r confirm fm-kt" @click="show=false">
						<image class="wh" src="/static/foot_bg.png" mode="scaleToFill"></image>
						<text class="f30 wei cf p-a udlr t-c" style="line-height: 100rpx;"> 已完成游戏惩罚 </text>
					</view>
				</view>
			</view>
		</popup>
		
	</view>
</template>

<script>
	
	import utils from '@/common/utils.js'
	import popup from "@/components/popup.vue"
	import qrcode from "@/components/qrcode.vue"
	import subscribe from "@/components/subscribe.vue"
	import adClosePop from "@/components/adClosePop.vue"
	import cardMixins from "../common/card-mixins"
	import payMixins from "../common/pay-mixins"
	let app = getApp().globalData
	const innerAudioContext = uni.createInnerAudioContext()
	let rewardedVideoAd = null
	
	export default {
		components: {
			popup,
			qrcode,
			subscribe,
			adClosePop
		},
		mixins: [ cardMixins, payMixins ],
		data() {
			return {
				banner: [],
				showQrcode: false,
				codeSrc: '',
				showAdClose: false,
				isXp: false,
				isKp: false,
				isable: true,
				showGz: false,
				show: false,
				preSrc: '',
				src: '',
				isLoaded: false,
				showSubscribe: false
			}
		},
		onReady() {
			// #ifdef MP-WEIXIN
				this.isLoaded = false
				rewardedVideoAd = wx.createRewardedVideoAd({
					adUnitId: app.siteInfo.adUnitId
				})
				rewardedVideoAd.onLoad(() => {
				  this.isLoaded = true
				  console.log('onLoad event')
				})
				rewardedVideoAd.onError((err) => {
				  console.log('onError event', err)
				})
				rewardedVideoAd.onClose((res) => {
				  if (res.isEnded) {
					this.util.request({
						url: this.api.addUserCardnumber,
						data: {
							userId: this.user.id
						}
					})
				  } else {
					  this.showAdClose = true
				  }
				})
			// #endif
		},
		onLoad(options) {
			this.util.setNT(app.siteInfo.name);
			this.getCarouselInfo()
			let timer = setTimeout(() => {
				clearTimeout(timer);
				timer = null;
				this.showGz = true;
			}, 500)
		},
		onShow() {
			if (this.isLogin && !this.preSrc) {
				this.initCard(this.config.cardNum)
				this.userLead().then(res => {
					this.preSrc = res
					if (this.isable) this.src = res
				})
			}
		},
		watch: {
			show(nVal, oVal) {
				if (!nVal) {
					let timer = setTimeout(() => {
						clearTimeout(timer);
						timer = null;
						this.isKp = false;
						let timer1 = setTimeout(() => {
							clearTimeout(timer1);
							timer1 = null;
							this.src = this.preSrc;
							this.isable = true;
						}, 1000);
					}, 400);
				}
			},
			isLogin(nVal, oVal) {
				if (!nVal) {
					this.preSrc = this.src = ''
				} else {
					this.getConfig()
				}
			},
			'config.cardNum': function(nVal, oVal) {
			    if (nVal != oVal && this.isLogin) {
			    	this.initCard(nVal)
					this.userLead().then(res => {
						this.preSrc = res
						if (this.isable) this.src = res
					})
			    }
			}
		},
		methods: {
			getCarouselInfo() {
				this.util.request({
					url: this.api.getCarouselInfo,
					noToast: true
				}).then(res => {
					this.banner = res.carouselInfoList || []
				})
			},
			onBanner(item) {
				if (!item.skipUrl) return
				if (item.skipUrl.includes('image:')) {
					let url = item.skipUrl.slice(item.skipUrl.indexOf('image:') + 'image:'.length);
					this.codeSrc = url;
					this.showQrcode = true;
				} else if (item.skipUrl.includes('link:')) {
					let url = item.skipUrl.slice(item.skipUrl.indexOf('link:') + 'link:'.length);
					this.go({url:`/pages/other/web-view?src=${encodeURIComponent(JSON.stringify(url))}`})
				}
			},
			async xpAction() {
				// #ifdef MP-WEIXIN
					if (!await this.checkLogin()) return
					if (!this.isable) return
					this.shuffle()
					this.userLead().then(res => {this.src = this.preSrc = res})
					innerAudioContext.src = "/static/media/vod1.m4a";
					innerAudioContext.play()
					this.isXp = true
					this.isable = false;
					let timer = setTimeout(() => {
						clearTimeout(timer);
						timer = null;
						this.isXp = false;
						this.isable = true;
					}, 1350);
				// #endif
				// #ifndef MP-WEIXIN
					this.util.modal('请前往微信小程序', true)
				// #endif
			},
			async kpAction() {
				// #ifdef MP-WEIXIN
					if (!await this.checkLogin()) return
					if (!this.isable) return
					this.isable = false
					if (this.preSrc) {
						this.userLead().then(res => this.preSrc = res)
						this.kaAnimate()
					} else {
						this.userLead().then(res => {
							this.src = res
							this.userLead().then(url => this.preSrc = url)
							this.kaAnimate()
						}).catch(err => {
							this.showSubscribe = true
							this.isable = true
						})
					}
				// #endif
				// #ifndef MP-WEIXIN
					this.util.modal('请前往微信小程序', true)
				// #endif
			},
			kaAnimate(src) {
				this.isKp = true;
				let timer = setTimeout(() => {
					clearTimeout(timer);
					timer = null;
					innerAudioContext.src = "/static/media/vod2.m4a";
					innerAudioContext.obeyMuteSwitch = false;
					innerAudioContext.play()
					this.show = true;
				}, 1000);
			},
			userLead() {
				return new Promise((resolve, reject) => {
					this.util.request({
						url: this.api.userLead,
						data: {
							userId: this.user.id
						},
						noToast: true
					}).then(res => {
						if (res) {
							let val = this.drawCard()
							console.log('srcsrcsrcsrcsrc', val);
							resolve(`${this.onImgurl + val}.png`);
						} else {
							this.preSrc = ''
							reject(res)
						}
					}).catch(err => {
						this.preSrc = ''
						reject(err)
					})
				})
			},
			openMember() {
				this.subscribe()
			},
			showAd() {
				if (rewardedVideoAd && this.isLoaded) {
					rewardedVideoAd.show()
				}
			}
		},
	}
</script>

<style lang="scss">
	
	.bg {
		width: 100vw;
		height: 100vh;
	}
	
	.banner {
		width: 100%;
		padding: 24rpx 24rpx 0;
		box-sizing: border-box;
	}
	
	.banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateY(0);
	}
	
	.slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}
	
	/* #ifdef MP-WEIXIN */
	.banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}
	
	.banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.banner-swiper .wx-swiper-dot-active::before {
		background-color: #fff;
	}
	
	.banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}
	
	/* #endif */
	
	// .l-b {
	// 	position: fixed;
	// 	max-width: 200rpx;
	// 	height: 66rpx;
	// 	z-index: 6;
		
	// 	.icon {
	// 		width: 72rpx;
	// 		height: 66rpx;
	// 	}
	// }
	
	.r-b {
		position: fixed;
		width: 200rpx;
		height: 66rpx;
		z-index: 6;
		
		.icon {
			width: 72rpx;
			height: 66rpx;
		}
	}
	
	.card-box {
		position: absolute;
		bottom: 65px;
		display: flex;
		align-items: center;
		
		.content {
			transform: translateY(8%);
			width: 100%;
			height: 70%;
			
			.card {
				position: relative;
				width: 66%;
				height: 88%;
				margin-top: -25rpx;
				
				&_item {
					transition: transform 1s;
					transform-style: preserve-3d;
					.back, .front {
						-webkit-backface-visibility: hidden;
						backface-visibility: hidden;
					}
					
					.front {
						transform: rotateY(180deg);
					}
				}
				
				.rotate1 {
					transform: rotateY(180deg);
				}
				
				.rotate2 {
					transform: rotateY(0);
				}
				
				.key-frame1 {
				  animation: run1 .45s linear 3;
				}
				
				@keyframes run1 {
				  0% {
					z-index: 30;
				  }
				  
				  16% {
					z-index: 30;
					transform: translateY(-20rpx) scale(1.05);
				  }
				  
				  32% {
					z-index: 30;
				  	transform: translateY(-35rpx) scale(1.05);
				  }
				
				  48% {
					z-index: 30;
				    transform: translateY(-50rpx) scale(1.05);
				  }
				  
				  61% {
					z-index: 10;
				    transform: translateY(-50rpx) scale(1.05);
				  }
				  
				  72% {
				    z-index: 10;
				    transform: translateY(-35rpx) scale(1.05);
				  }
				  
				  82% {
				    z-index: 10;
				    transform: translateY(-20rpx) scale(1.05);
				  }
				  
				  100% {
				    z-index: 10;
				    transform: translateY(0) scale(1);
				  }
				}
				
				.key-frame2 {
				  animation: run2 .45s linear 3;
				}
				
				@keyframes run2 {
				  16% {
					transform: translateY(20rpx) scale(1.05);
				  }
				
				  32% {
				  	transform: translateY(35rpx) scale(1.05);
				  }
				  			
				  48% {
					transform: translateY(50rpx) scale(1.05);
				  }
				  
				  61% {
				    transform: translateY(50rpx) scale(1.05);
				  }
				  
				  72% {
				    transform: translateY(35rpx) scale(1.05);
				  }
				  
				  82% {
				    transform: translateY(20rpx) scale(1.05);
				  }
				  
				  100% {
				    transform: translateY(0) scale(1);
				  }
				}
			}
		}
	}
	
	.opreation {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: 30px;
		justify-content: space-evenly;
		.btn {
			max-width: 150px;
			height: 40px;
		}
	}
	
	.rule_img {
		max-width: 100vw;
		height: calc(100vh * 0.75);
	}
	
	.confirm {
		width: 320rpx;
		height: 100rpx;
	}

</style>