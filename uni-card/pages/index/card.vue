<template>
	<view class="wrapper bf">
		<view class="flex f-w">
			<block v-for="(item, index) in config.cardNum" :key="index">
				<view class="card">
					<image class="wh" :src="`${onImgurl + (index + 1)}.png`" mode="widthFix"></image>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
	}
</script>

<style scoped lang="scss">

	.wrapper {
		
		.card {
			width: 50%;
			min-height: 200rpx;
		}
		
	}

</style>