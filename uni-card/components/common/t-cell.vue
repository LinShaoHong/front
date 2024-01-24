<template>
	<view @click="$emit('click')":class="[{'w-cell':!isbd},{'weui-cell':isbd},{'pd0':isp},{'last':last},{'left0':isl},{'right30':isr},{'aligns':noc},cname]"
	 :style="[{background:bgc},sname]" :hover-class="hc?'weui-cell_active':''">
		<view class="f-g-0 f-c" :class="hdc">
			<view v-if='img' class="img o-h" :style="{width:w+'rpx',height:h+'rpx',borderRadius:brs,marginRight:imgr+'rpx'}">
				<t-img :m='m' :src="img" />
			</view>
			<text v-if="iconn" class="f28 mr30" :class="iconn"></text>
			<view v-if='ht' class="weui-label" :class="htc" :style="{width:hw+'rpx',color:acolor}">{{ht}}</view>
			<slot name="hd"></slot>
		</view>
		<view class="f-1" :style="{minWidth:bdmw}">
			<view v-if='btt' :class="bttc" :style="{color:acolor}">{{btt}}</view>
			<view v-if='bbt' class="mt10 c9 f24">{{bbt}}</view>
			<slot name='bd'></slot>
		</view>
		<view v-if="ft" class="c9" :class="ftc" :style="{color:color}">{{ft}}</view>
		<slot name='ft'></slot>
		<view class="arrow" v-if="arrow">
			<t-img cname="bsf" src="/static/common/icon_arrow.png" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'mg-cell',
		props: {
			bgc: {
				type: String,
				default: ''
			},
			isbd: {
				type: Boolean,
				default: true
			},
			htc: '',
			last: '',
			cname: '',
			noc: '',
			sname: '',
			isp:false,
			isl: '',
			isr: '',
			iconn: '',
			ht: '',
			hdc: '',
			hw: '',
			img: '',
			m: {
				type: String,
				default: 'aspectFill',
			},
			acolor: {
				type: String,
				defalut: '#333333'
			},
			w: '',
			h: '',
			brs: '',
			imgr: '',
			bdmw: {
				type: String,
				default: '0',
			},
			btt: '',
			bttc: '',
			bbt: '',
			ft: '',
			ftc: '',
			color: '',
			arrow: '',
			ac: '',
			asize: '',
			hc: {
				type: String,
				value: '',
			},
			// last: {
			// 	type: String,
			// 	default: ''
			// },
			// cname: {
			// 	type: String,
			// 	default: ''
			// },
			// noc: {
			// 	type: String,
			// 	default: ''
			// },
			// sname: {
			// 	type: String,
			// 	default: ''
			// },
			// isl: {
			// 	type: String,
			// 	default: ''
			// },
			// isr: {
			// 	type: String,
			// 	default: ''
			// },
			// ht: {
			// 	type: String,
			// 	default: ''
			// },
			// hw: {
			// 	type: String,
			// 	default: ''
			// },
			// img: {
			// 	type: String,
			// 	default: ''
			// },
			// m: {
			// 	type: String,
			// 	default: 'aspectFill',
			// },
			// w: {
			// 	type: String,
			// 	default: ''
			// },
			// h: {
			// 	type: String,
			// 	default: ''
			// },
			// brs: {
			// 	type: String,
			// 	default: ''
			// },
			// btt: {
			// 	type: String,
			// 	default: ''
			// },
			// bttc: {
			// 	type: String,
			// 	default: ''
			// },
			// bbt: {
			// 	type: String,
			// 	default: ''
			// },
			// ft: {
			// 	type: String,
			// 	default: ''
			// },
			// ftc: {
			// 	type: String,
			// 	default: ''
			// },
			// color: {
			// 	type: String,
			// 	default: ''
			// },
			// arrow: {
			// 	type: String,
			// 	default: ''
			// },
		},
		data() {
			return {}
		},
		computed: {},
		methods: {
			maskTap() {
				this.$emit('input', false)
			}
		},
	}
</script>

<style scoped lang="scss">
	
	.w-cell {
		background: #FFF;
		padding: 30rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
	
	.w-cell:after {
		display: block;
	}
	
	
	.pd0 {
		padding: 0;
	}
	
	.weui-cell:after {
		display: block;
	}

	.img {
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
	}

	.last:after {
		display: none;
	}

	.left0:after {
		left: 0rpx;
	}

	.right30:after {
		right: 30rpx;
	}

	.arrow {
		width: 15rpx;
		height: 20rpx;
	}

	.aligns {
		align-items: flex-start
	}
</style>
