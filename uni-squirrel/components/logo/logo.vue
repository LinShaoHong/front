<template>
  <view class="fixed w-full" :style="style">
    <view class="flex flex-row items-center justify-center">
      <view :class="size === 'large' ? 'bd_large' : 'bd_small'" hover-class="ani_scale"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "logo",
  props: {
    size: { default: 'large', type: String },
    top: { default: '10rpx', type: String }
  },
  computed: {
    style() {
      return "top: " + this.top;
    }
  }
}
</script>

<style lang="scss" scoped>
.bd_large {
  @media (min-height: 500px) and (max-height: 1366px) {
    width: 360rpx;
    height: 90rpx;
    background-size: 360rpx 90rpx;
  }

  @media (min-height: 0px) and (max-height: 500px) {
    width: 250rpx;
    height: 60rpx;
    background-size: 250rpx 60rpx;
  }

  background: url('../../static/logo.png') center;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.bd_small {
  width: 10rem;
  height: 2.5rem;
  background: url('../../static/logo.png') center;
  background-size: 10rem 2.5rem;
  background-repeat: no-repeat;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ani_scale {
  transform: scale(1.2);
}
</style>