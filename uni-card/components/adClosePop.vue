<template>
	<popup v-model="show" position="center">
		<view class="container bf" @tap.stop="">
			<view class="f34 wei t-c c3"> 温馨提示 </view>
			<!-- <view class="close p-a t0 r0" @click="close">
				<uni-icons type="closeempty" size="20"></uni-icons>
			</view> -->
			<view class="mt24">
				<text class="c6b f32 wbba ls2"> {{ text }} </text>
			</view>
			<view class="f-x-ad mt40">
				<button class="confirm btn ls3 f32 c48" @click="confirm">确定</button>
				<button class="subscribe btn ls3 f32 cf" @click="subscribe">立即解锁</button>
			</view>
		</view>
	</popup>
</template>

<script>
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
			return {
				text: '1、未播放完广告，无法享受开牌次数哦\n2、开通会员可享受永久免广告权益'
			}
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
		},
		methods: {
			confirm() {
				this.show = false
				this.$emit('confirm')
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
		
		.close {
			padding: 26rpx;
		}
		
		.btn {
			flex: 0.42;
			height: 80rpx;
			line-height: 80rpx;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.3);
			border-radius: 40rpx;
			background: transparent;
		}
		
		.confirm {
			border: 1px solid #482380;
		}
		
		.subscribe {
			background: #482380;
		}
	}
	
</style>