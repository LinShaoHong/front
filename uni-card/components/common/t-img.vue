<template>
	<image @click="$emit('click')" :mode="m" :class="['wh',cname]" :style='[sname]' :src="getUrl(src)"></image>
</template>
<!-- 这里加class wh让父级调用页面的scoped class能应用 -->
<script>
	export default {
		name: 'mg-img',
		props: {
			cname: '',
			sname: '',
			src: '',
			local: '', //本地图片
			m: {
				type: String,
				default: 'aspectFill'
			}
		},
		data() {
			return {

			}
		},
		methods: {
			getUrl(src) {
				if (src) {
					return src.indexOf('http') > -1 || src.indexOf('/static/') > -1 || src.indexOf('base64') > -1 || this.local == 1 ?
						src : this.url + src
				} else {
					return '/static/no.png'
				}
			},
		},
		computed: {},
	}
</script>

<style scoped lang='scss'>
	.wh {
		display: block;
	}
</style>
