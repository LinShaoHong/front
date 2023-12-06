<template>
  <view>
    <back></back>
    <next @click.native="toIndex"></next>
    <logo :size="'small'"></logo>
    <view class="_back">
      <view class="_back-bottom"></view>
    </view>
    <view class="flex flex-col w-full h-full pt-16 items-center gap-y-4">
      <view class="in">
        <view style="font-weight: 700; font-size: 20px; text-shadow: 1px -1px 0 #fff, 0 1px 0 #ccc;">{{
            kidsName
          }}的年龄是？
        </view>
        <view class="flex flex-row gap-1">
          <view v-for="item in 8" :key="item">
            <view class="age-selector" :style="age==item+2? 'background-color: #F38A1E;':''" @click="chooseAge(item+2)">
              <span :style="age==item+2? 'color: white;' : 'color: #F38A1E;'">{{ item === 8 ? '10+' : item + 2 }}</span>
            </view>
          </view>
        </view>
        <view style="margin-top: 5px; font-weight: 700; font-size: 20px; text-shadow: 1px -1px 0 #fff, 0 1px 0 #ccc;">
          选择头像
        </view>
        <view class="flex flex-row items-center gap-4">
          <view>></view>
          <view class="flex flex-row gap-2">
            <view class="flex flex-row justify-between flex-wrap gap-y-2">
              <view v-for="item in 8" :key="item">
                <view class="av"
                      :style="(item==avatar? 'border-style: solid; border-width: 2px; box-shadow: 0 0 3px 1px #888888;':'') + ';background: url(\'../../static/avatar'+(item%6 + 1)+'.jpg\') center;'"
                      @click="chooseAvatar(item)"></view>
              </view>
            </view>
          </view>
          <view>></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      kidsName: '',
      age: '',
      avatar: ''
    }
  },
  methods: {
    chooseAge(item) {
      this.age = item
    },
    chooseAvatar(item) {
      this.avatar = item
    },
    toIndex() {
      uni.reLaunch({
        url: '/pages/index/index',
        animationDuration: 600,
        animationType: 'fade-in'
      })
    }
  },
  onLoad(args) {
    this.kidsName = args.kidsName
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

.in {
  gap: 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  height: 75vh;
  width: 22rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 2px 5px -2px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset;
}

.age-selector {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  border-color: #F38A1E;

  span {
    font-size: 17px;
    font-weight: 700;
  }
}

.av {
  width: 60px;
  height: 60px;
  border-radius: 50% 50% 50% 50%;
  border-color: #F38A1E;
}

</style>