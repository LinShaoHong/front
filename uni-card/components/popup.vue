<template>
	<view :class="['am-popup',className,{'am-popup-show':value},{'animation':animation}]">
		<view @touchmove.stop="" class="am-popup-mask" v-if="mask" @click="maskTap" :style="[{zIndex: zIndex,transitionDuration:dhsj},msname]"></view>
		<view @touchmove.stop="" class="am-popup-content" :class="position" :style="{zIndex: zIndex,transitionDuration:dhsj}">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'popup',
		props: {
			className: {
				type: String,
				default: ''
			},
			value: {
				type: Boolean,
				default: false
			},
			position: {
				type: String,
				default: 'bottom'
			},
			mask: {
				type: Boolean,
				default: true
			},
			animation: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: [Number, String],
				default: '999'
			},
			close: {
				type: [Boolean, String],
				default: true
			},
			msname: Object,
			dhsj: {
				type: String,
				default: ''
			},
		},
		data() {
			return {

			}
		},
		computed: {},
		methods: {
			maskTap() {
				if (!this.close) return
				this.$emit('input', false)
			}
		},
	}
</script>

<style scoped lang="scss">
	.am-popup-content {
		position: fixed;
	}

	.am-popup-mask {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.6);
		opacity: 0;
		pointer-events: none;
	}

	.left {
		transform: translateX(-100%);
		left: 0;
		top: 0;
		bottom: 0;
	}

	.right {
		transform: translateX(100%);
		right: 0;
		top: 0;
		bottom: 0;
	}

	.top {
		top: 0;
		left: 0;
		width: 100vw;
		transform: translateY(-100%);
	}

	.bottom {
		bottom: 0;
		left: 0;
		width: 100vw;
		transform: translateY(100%);
	}

	.am-popup-show .am-popup-content {
		transform: none;
	}

	.am-popup-show .am-popup-mask {
		opacity: 1;
		pointer-events: auto;
	}

	.am-popup.animation .am-popup-content {
		transition: all .35s linear;
	}

	.am-popup.animation .am-popup-mask {
		transition: all .15s linear;
	}

	.middle {
		top: 50%;
		left: 50%;
		// opacity: 0.5;
		visibility: hidden;
		transform: translate3d(-50%, -50%, 0) scale(0.62);
	}

	.am-popup-show .middle {
		// opacity: 1;
		transform: translate3d(-50%, -50%, 0) scale(1);
		visibility: visible;
	}
	
	.center {
		top: 50%;
		left: 50%;
		opacity: 0;
		transform: translate3d(-50%, -50%, 0);
		visibility: hidden;
	}
	
	.am-popup-show .center {
		opacity: 1;
		transform: translate3d(-50%, -50%, 0);
		visibility: visible;
	}
	
</style>
