<template>
    <view class="book-container">
        <view class="cover-page-left"> </view>
        <view class="cover-page-right"></view>
        
        <view class="inside-page page-left"><slot name="page-left"></slot></view>
        <view class="inside-page page-right page-right-4"></view>
        <view class="inside-page page-right page-right-5"><slot name="page-right"></slot></view>
        
        <view class="cover-page-right cover-page-right-6"></view>
    </view>
</template>

<script>
export default {
    name: "book-flip"
}
</script>

<style lang="scss" scoped>
.book-container {
    width: 34vw;
    height: 92vh;
    transform-style: preserve-3D;
    perspective: 3000px;
    view {
        position: absolute
    }

    animation: container 1.2s linear forwards;
}

.cover-page-left {
    width: 100%;
    height: 100%;
    left: -100%;

    background-image: url('../../static/oxford.jpg');
    background-size: 30vw 90vh;

    transform: rotateY(180deg);
    transform-origin: right;
    animation: p1 1s linear forwards;
    animation-delay: .2s;
}

.cover-page-right {
    width: 100%;
    height: 100%;
    transform-origin: left;

    background-image: url('../../static/oxford.jpg');
    background-size: 30vw 90vh;

    animation: p2 1s linear forwards;
    animation-delay: .2s;
}

.inside-page {
    width: 96%;
    height: 98%;
    left: 0;
    top: 2%;
    border: 1px lightgray solid;
    background-color: white;
}

.page-left {
    width: 96%;
    left: -96%;
    border-radius: 8rpx 0 0 8rpx;
    box-shadow: 0 1rpx 20rpx 5rpx rgba(0, 0, 0, 0.08);

    backface-visibility: hidden;
    transform: rotateY(180deg);
    transform-origin: right;
    animation: p3 .7s linear forwards;
    animation-delay: .5s;
}

.page-right {
    border-radius: 0 8rpx 8rpx 0;
    box-shadow: 0 1rpx 20rpx 5rpx rgba(0, 0, 0, 0.08);
    transform-origin: left;
}

.page-right-4 {
    animation: p4 .7s linear forwards;
    animation-delay: .5s;
}

.page-right-5 {
    animation: p5 .9s linear forwards;
    animation-delay: .6s;
}

.cover-page-right-6 {
    animation: p6 .9s linear forwards;
    animation-delay: .6s;
}

@keyframes container {
    2% {
        transform: translateX(0vw) scale(.5);
    }
    20% {
        transform: translateX(2vw) scale(.6);
    }
    30% {
        transform: translateX(6vw) scale(.7);
    }
    40% {
        transform: translateX(10vw) scale(.8);
    }
    50% {
        transform: translateX(14vw) scale(.9);
    }
    60% {
        transform: translateX(18vw) scale(1);
    }
    70% {
        transform: translateX(20.4vw) scaleX(1.1);
    }
    80% {
        transform: translateX(20.4vw) scaleX(1.2);  
    }
    90% {
        transform: translateX(20.4vw) scaleX(1.2);
    }
    to {
        transform: translateX(20.4vw) scaleX(1.2);
    }
}

@keyframes p1 {
    from {
        backface-visibility: hidden;
    }
    to {
        transform: rotateY(0deg);
    }
}

@keyframes p2 {
    to {
        backface-visibility: hidden;
        transform: rotateY(-180deg);
    }
}

@keyframes p3 {
    to {
        transform: rotateY(5deg);
    }
}

@keyframes p4 {
    to {
        backface-visibility: hidden;
        transform: rotateY(-180deg);
    }
}

@keyframes p5 {
    to {
        transform: rotateY(-1deg);
    }
}

@keyframes p6 {
    to {
        transform: rotateY(0deg);
    }
}
</style>