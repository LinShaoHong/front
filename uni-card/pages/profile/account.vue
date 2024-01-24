<template>
	<view class="p024">
		<view class="bs20 mt24">
			<t-cell ht="头像">
				<view slot="ft" class="avatar">
					<t-img cname="bsf" src="/static/avatar.png"></t-img>
				</view>
			</t-cell>
			<t-cell
				cname="cell"
				:isbd="false"
				w="32"
				h="32"
				imgr="20"
				ht="昵称" 
				htc="wei4 lh50 ls2"
				@click="">
				<template #bd>
					<view class="ml30">
						<input 
							class="f30 t-r" 
							v-model="userInfo.nickname" 
							placeholder-class="input-placeholder" 
							type="text" 
							placeholder="请输入昵称">
					</view>
				</template>
			</t-cell>
		</view>
		
		<button 
			class="cf btn f32" 
			:disabled="loading" 
			:loading="loading"
			@tap.stop="uploadUserInfo"
			> {{ loading ? '保存中...' : '保存'}} </button>
		
	</view>
</template>

<script>
	
	import utils from '@/common/utils.js'
	
	export default {
		data() {
			return {
				loading: false,
				userInfo: {
					nickname: ''
				}
			}
		},
		onLoad() {
			this.userInfo = {...this.user}
		},
		methods: {
			uploadUserInfo() {
				if (utils.empty(this.userInfo.nickname)) return this.util.message('请输入昵称', 3)
				this.loading = true
				this.util.request({
					url: this.api.saveUser,
					data: {
						userId: this.user.id,
						nickname: encodeURI(this.userInfo.nickname)
					}
				}).then(res => {
					this.loading = false
					this.setUser(res)
					this.go({t: 4})
				}).catch(err => {
					this.loading = false
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	
	.avatar {
		width: 100rpx;
		height: 100rpx;
	}
	
	.btn {
		margin: 100rpx 60rpx 0;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 88rpx;
		background-color: #482380;
	}
	
	.btn[disabled] {
		color: #ffffff;
		background-color: #482380;
	}

</style>