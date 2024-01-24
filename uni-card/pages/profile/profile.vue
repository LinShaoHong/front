<template>
	<view class="pt30">
		<view class="p-r info f-c">
			<template v-if="isLogin">
				<view class="f-c-c" @tap.stop="go({url:'/pages/profile/account'})">
					<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
					<view class="p03 cf f30 t-c fm-kt mt24 wbba">{{ user.nickname || '-' }}</view>
				</view>
			</template>
			<template v-else>
				<view class="f-c-c" @tap.stop="checkLogin">
					<image class="avatar" src="/static/mrtx.png" mode="aspectFill"></image>
					<text class="cf f30 t-c fm-kt mt24"> 点击登录 </text>
				</view>
			</template>
		</view>
		<view class="p024 mt40">
			<view class="bs20">
				<t-cell
					cname="cell"
					:isbd="false"
					img="/static/gz.png" 
					w="42"
					h="42"
					imgr="20"
					ht="游戏规则" 
					acolor="#4C31B5"
					htc="lh40 ls2 f30 wei6 fm-kt"
					arrow="arrow" 
					@click="showGz=true">
				</t-cell>
				<button class="p0" openType="share">
					<t-cell
						cname="cell"
						:isbd="false"
						img="/static/tj.png" 
						w="42"
						h="42"
						imgr="20"
						ht="推荐给朋友" 
						acolor="#4C31B5"
						htc="lh40 ls2 f30 wei6 fm-kt"
						arrow="arrow" 
						@click="share">
					</t-cell>
				</button>
				<button class="p0" openType="contact">
					<t-cell
						:isbd="false"
						img="/static/contact.png"
						w="42"
						h="42"
						imgr="20"
						ht="联系客服" 
						acolor="#4C31B5"
						htc="lh40 ls2 f30 wei6 fm-kt"
						arrow="arrow"
						>
					</t-cell>
				</button>
			</view>
		</view>
		
		<!-- <official-account>  1111 </official-account> -->
		
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
		
	</view>
</template>

<script>
	
	import siteInfo from '@/common/siteinfo';
	import popup from "@/components/popup.vue"
	
	export default {
		components: {
			popup
		},
		data() {
			return {
				showGz: false
			}
		},
		methods: {
			update() {
				
			}
		},
	}
</script>

<style scoped lang="scss">
	
	.info {
		margin-left: 24rpx;
		margin-right: 24rpx;
		height: 334rpx;
		border-radius: 32rpx;
		background-color: #907BE0;
	}
	
	.avatar {
		width: 180rpx;
		height: 180rpx;
		border-radius: 180rpx;
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