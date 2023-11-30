<template>
  <view>
    <logo :top="'3vh'"></logo>
    <view class="_back">
      <view class="_back-bottom"></view>
    </view>
    <view class="bird">
      <image src="../../static/bird.gif"></image>
    </view>
    <view class="house" hover-class="ani_scale"></view>
    <view class="squirrel" hover-class="ani_scale"></view>
    <view class="road"></view>
    <view class="fixed top-1 left-1">
      <view class="flex flex-col gap-2">
        <view class="lb" hover-class="ani_scale" @click="toLibrary"></view>
        <view class="cs" hover-class="ani_scale"></view>
      </view>
    </view>
    <view class="fixed top-4 right-4">
      <avatar :url="'../../static/avatar1.jpg'" :name="'肖珍'" @click.native="toKids"></avatar>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    toLibrary() {
      uni.navigateTo({
        url: '/pages/library/index',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toKids() {
      uni.reLaunch({
        url: '/pages/kids/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
._back {
  z-index: -10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #FAEFD5;
  opacity: .8;

  ._back-bottom {
    position: absolute;
    bottom: 0;
    background-color: #FCB146;
    height: 13vh;
    width: 100vw;
    box-shadow: .1rem .1rem .5rem 0 #F7820A inset, -.1rem 0 .5rem 0 #F7820A inset, 0 -.5rem #FFD99B;
  }
}

.house {
  position: absolute;
  width: 80vh;
  height: 70vh;
  left: 0;
  right: 0;
  bottom: 6vh;
  margin-left: auto;
  margin-right: auto;
  background: url('../../static/hose.png') center;
  background-size: 80vh 70vh;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.squirrel {
  position: fixed;
  bottom: 10vh;
  right: 20vw;
  width: 4rem;
  height: 4rem;
  background: url('../../static/squirrel.png') center;
  background-size: 4rem 4rem;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.road {
  z-index: -9;
  position: fixed;
  bottom: 10vh;
  width: 50vw;
  height: 40vh;
  background: url('../../static/road.png') center;
  background-size: 50vw 30vh;
  background-repeat: no-repeat;
}

.bird {
  z-index: 10;
  position: absolute;
  left: -10vw;
  bottom: 55vh;
  width: 2rem;
  height: 2rem;

  image {
    width: 2rem;
    height: 2rem;
  }

  animation: flying 12s linear infinite;
}

@keyframes flying {
  from {
    left: -10vw;
  }

  20% {
    transform: translate(25vw, -3vh);
  }

  40% {
    transform: translate(50vw, 5vh);
  }

  60% {
    transform: translate(75vw, 10vh);
  }

  80% {
    transform: translate(100vw, 5vh);
  }

  to {
    transform: translate(125vw, -5vh);
  }
}

.lb {
  width: 4rem;
  height: 4rem;
  background: url('../../static/book.png') center;
  background-size: 4rem 4rem;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.cs {
  width: 4.5rem;
  height: 3.5rem;
  background: url('../../static/course.png') center;
  background-size: 4.5rem 3.5rem;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ani_scale {
  transform: scale(1.2);
}
</style>