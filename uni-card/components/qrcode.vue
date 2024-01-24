<template>
	<popup v-model="show" position="center">
		<view class="content bs20 t-c bf p-r">
			<view class="p-r f-c">
				<text class="c3 f34 wei6"> {{ title }} </text>
			</view>
			<view class="close p-a t0 r0" @click="close">
				<uni-icons type="closeempty" size="20"></uni-icons>
			</view>
			<view class="qr-code mt20 mb12">
				<image class="wh" :src="src" mode="aspectFill" show-menu-by-longpress></image>
			</view>
			<view class="c9 f28"> {{ lable }} </view>
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
			title: {
				type: String,
				default: '二维码'
			},
			lable: {
				type: String,
				default: '长按识别二维码'
			},
			src: {
				type: String,
				default: ''
			},
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
			close() {
				this.show = false
			}
		},
	}
</script>

<style scoped lang="scss">
	
	.content {
		padding: 25rpx 50rpx;
		
		.qr-code {
			width: 480rpx;
			height: 480rpx;
		}
		
		.close {
			padding: 26rpx;
		}
	}
	
</style>