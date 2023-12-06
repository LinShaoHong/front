<template>
  <view>
    <back></back>
    <view class="squirrel" hover-class="ani_scale"></view>
    <next @click.native="addKids"></next>
    <view class="_back">
      <view class="_back-bottom"></view>
    </view>
    <logo :size="'small'"></logo>
    <view class="flex flex-col w-full h-full pt-20 items-center gap-y-4">
      <view style="font-size: 20px; font-weight: 700; text-shadow: 1px -1px 0 #fff, 0 1px 0 #ccc;">您孩子的名字是？
      </view>
      <input class="in" v-model="kidsName" type="text"/>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      kidsName: ''
    }
  },
  methods: {
    addKids() {
      uni.navigateTo({
        url: '/pages/kids/addKids?kidsName=' + this.kidsName,
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
  width: 4rem;
  height: 4rem;
  background: url('../../static/squirrel.png') center;
  background-size: 4rem 4rem;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.in {
  padding: 5px;
  height: 2.8rem;
  width: 20rem;
  background-color: white;
  display: inline-block;
  border-radius: 20px;
  box-shadow: 5px 0px 5px 0px rgba(0, 0, 0, 0.5);
}
</style>