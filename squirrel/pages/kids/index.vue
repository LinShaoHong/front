<template>
  <view>
    <view v-if="selected">
      <index></index>
    </view>
    <view v-else>
      <view class="_back">
        <view class="_back-bottom"></view>
      </view>
      <view class="squirrel" hover-class="ani_scale"></view>
      <logo :size="'large'" :top="'1rem'"></logo>
      <view class="flex flex-col items-center gap-8">
        <view class="flex flex-row justify-between pt-24 pl-8 pr-8 gap-4 overflow-x-scroll scroll-smooth">
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar1.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">肖珍</view>
          </view>
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar2.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">宇博</view>
          </view>
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar3.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">萌萌</view>
          </view>
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar4.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">嘉嘉</view>
          </view>
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar5.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">希希</view>
          </view>
          <view class="flex flex-col justify-center items-center gap-1 ml-3 mb-1">
            <view class="av" hover-class="ani_scale" style="background: url('../../static/avatar6.jpg') center;"
              @click="toHome"></view>
            <view style="font-size: small; font-weight: 700;">团团</view>
          </view>
        </view>
        <glass-button :radius="'50%'" :fontSize="'30px'" :fontWeight="'700'" :width="'3rem'" :height="'3rem'" :text="'+'"
          @click.native="toAddKids"></glass-button>
      </view>
    </view>
  </view>
</template>

<script>
import index from '../index/index.vue'

export default {
  components: {
    index
  },
  data() {
    return {
      selected: false
    }
  },
  methods: {
    toHome() {
      uni.navigateTo({
        url: '/pages/index/index',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    },
    toAddKids() {
      uni.navigateTo({
        url: '/pages/kids/addKidsName',
        animationDuration: 600,
        animationType: 'fade-in'
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

.squirrel {
  position: fixed;
  bottom: 10vh;
  right: 20vw;
  width: 15vh;
  height: 15vh;
  background: url('../../static/squirrel.png') center;
  background-size: 15vh 15vh;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.av {
  width: 60px;
  height: 60px;
  box-shadow: 0px 2px 3px #888888;
  border-radius: 50% 50% 50% 50%;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ani_scale {
  transform: scale(1.2);
}
</style>