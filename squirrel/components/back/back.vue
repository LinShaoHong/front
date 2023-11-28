<template>
    <view class="container" hover-class="ani_scale">
        <view class="back" @click="back">
            <image src="../../static/back.png"></image>
        </view>
    </view>
</template>

<script>
export default {
    name: "back",
    methods: {
        back() {
            let to = setTimeout(() => {
                uni.navigateBack({
                    delta: 1
                });
                clearTimeout(to);
            }, 200);
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    z-index: 10;
    position: fixed;
    top: .5rem;
    left: .5rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50% 55% 40% 45%;
    background-color: white;
    transition: all 0.4s ease-in-out;
    transform: scale(1);
}

.back {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2rem;
    height: 2rem;
    border-radius: 55% 50% 45% 40%;
    background-color: #F38A1E;
    box-shadow: 3px 3px 3px 2px #F7820A inset,-3px -3px 3px 2px #F7820A inset;
    image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 1.5rem;
        height: 1.5rem;
    }
}

.ani_scale {
    transform: scale(1.2);
}
</style>
