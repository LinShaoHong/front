<template>
    <view class="wrapper" hover-class="ani_scale">
        <view class="book">
          <view class="inner-book">
            <view class="img" style="padding-top: calc(1.07 * 100%)">
                <image class="_img" :src="url"/>
            </view>
            <view class="page"></view>
            <view class="page page-2"></view>
            <view class="page page-3"></view>
            <view class="img final-page" style="padding-top: calc(1.07 * 100%)">
                <image  class="_img" :src="url"/>
            </view>
          </view>
        </view>
        </view>
</template>

<script>
export default {
    name: "book",
    props: {
        url: {
            default: '',
            type: String
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease-in-out;
    transform: scale(1);
}

.inner-book {
    width: 5rem;
    height: 6.5rem;
    display: flex;
    align-items: center;
    transform-style: preserve-3d;
    perspective: 250px;
}

.book {
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translateZ(0);
}

.inner-book:before {
    content: "";
    width: 100%;
    position: absolute;
    height: 0;
    bottom: 14px;
    transform: rotateY(-20deg) translateZ(-20px);
    z-index: 0;
    box-shadow: 10px 12px 20px 13px rgba(0, 0, 0, 0.3);
}

.inner-book .img {
    transform: rotateY(-20deg);
    width: 100%;
    z-index: 5;
    clear: both;
    height: 100%;
}

.inner-book ._img {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
}

.inner-book .img:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    border-left: 4px solid rgba(0, 0, 0, 0.3);
    z-index: 2;
}

.page {
    width: calc(100% - 20px);
    height: calc(100% - 2px);
    position: absolute;
    box-shadow: inset 0px -1px 2px rgba(50, 50, 50, 0.2), inset -1px 0px 1px rgba(150, 150, 150, 0.1);
    border-radius: 0px 3px 3px 0px;
    transform: rotateY(-20deg) translateZ(-5px);
    right: -2px;
    z-index: 4;
    background: white;
}

.page-2 {
    height: calc(100% - 4px);
    right: -3px;
    z-index: 3;
}

.page-3 {
    height: calc(100% - 6px);
    right: -6px;
    z-index: 2;
}

.img.final-page {
    position: absolute;
    z-index: -1;
    right: -7px;
    transform: rotateY(-19deg) translateZ(-10px) scale(1);
}

.ani_scale {
    transform: scale(1.2);
}
</style>