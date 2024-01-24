import siteInfo from '@/common/siteinfo';

export const utilMixins = {
	onShareAppMessage() {
		return this.util.mpShare({
			t: siteInfo.shareTitle,
			i: siteInfo.logo,
			p: 'pages/index/index',

		})
	},
	onShareTimeline(e) {
		return {
			title: siteInfo.shareTitle,
			imageUrl: siteInfo.logo
		}
	},
	computed: {},
	methods: {}
};