<template>
    <view>
        
        <video id="myVideo" :src="url"
                        show-center-play-btn="false"
                        autoplay="true"
                        object-fit="fit"
                        page-gesture="true"
                        loop="false"
                        play-strategy="2"
                        style="width: 100vw; height: 100vh;"
                        @error="videoErrorCallback" controls="false">
                    </video>
        <cover-image class="back" src="../../static/back.png" @click="prev"></cover-image>
    </view>
</template>

<script>
export default {
    name: "full-video",
    props: {
        url: { default: '', type: String }
    },
    methods: {
        videoErrorCallback(e) {
            uni.showModal({
                content: e.target.errMsg,
                showCancel: false
            })
        },
        prev() {
            setTimeout(() => {
                uni.navigateBack({
                    delta: 1
                })
            }, 200);
        }
    }
}
</script>

<style lang="scss" scoped>

.back {
    position: absolute; 
    top: 0.5rem; 
    left: 0.5rem;
    width: 2rem; 
    height: 2rem; 
}
</style>