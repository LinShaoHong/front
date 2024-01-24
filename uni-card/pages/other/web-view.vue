<template>
	<view v-if="src">
		<web-view :src="src" @message="getMessage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				src: ''
			}
		},
		onLoad(options) {
			this.title = options.title || ''
			this.src = JSON.parse(decodeURIComponent(options.src));
		},
		onReady() {
			this.util.setNT(this.title)
		},
		methods: {
			getMessage(event) {
				uni.showModal({
					content: JSON.stringify(event.detail),
					showCancel: false
				});
			}
		}
	}
</script>

<style>

</style>
