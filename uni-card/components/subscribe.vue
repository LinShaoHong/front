<template>
	<popup v-model="show" position="center">
		<view class="container bf" @tap.stop="">
			<view class="f34 wei t-c c3"> 游戏须知 </view>
			<view class="close p-a t0 r0" @click="close">
				<uni-icons type="closeempty" size="20"></uni-icons>
			</view>
			<view class="mt24">
				<view class="c6b f32 wbba" v-html="text"></view>
			</view>
			<!-- v-if="!text.length" v-else -->
			<view class="f-x-ad mt40">
				<!-- <button class="ad btn ls3 f32 c48" @click="ad">观看广告</button> -->
				<button class="subscribe btn ls3 f32 cf" @click="subscribe">立即解锁</button>
			</view>
		</view>
	</popup>
</template>

<script>
	
	import siteInfo from '@/common/siteinfo';
	import popup from "@/components/popup.vue"

	export default {
		components: {
			popup
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {}
		},
		computed: {
			show: {
				get() {
					return this.value
				},
				set(newVal) {
					this.$emit('input', newVal)
				}
			},
			text() {
				return this.config.indexpresent || siteInfo.adText
				// return siteInfo.adText
			}
		},
		methods: {
			close() {
				this.show = false
			},
			ad() {
				this.show = false
				this.$emit('ad')
			},
			subscribe() {
				this.show = false
				this.$emit('subscribe')
			}
		},
	}
</script>

<style scoped lang="scss">
	
	.container {
		padding: 40rpx 32rpx;
		border-radius: 20rpx;
		width: calc(100vw * 0.85);
		
		.btn {
			flex: 0.42;
			height: 80rpx;
			line-height: 80rpx;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.3);
			border-radius: 40rpx;
			background: transparent;
		}
		
		.ad {
			border: 1px solid #482380;
		}
		
		.subscribe {
			background: #482380;
		}
		
		.close {
			padding: 26rpx;
		}
	}
	
</style>