<script setup lang="ts">
const props = defineProps({
  hks: {
    type: Boolean,
    default: true
  }
});

defineEmits(['shuffle', 'open']);
</script>

<template>
  <view class="w-full flex items-center justify-center gap-50">
    <image v-if="hks" class="h-90" src="/static/xp.png" mode="heightFix" @click="$emit('shuffle')"></image>
    <image v-if="hks" class="h-90" src="/static/kp.png" mode="heightFix" @click="$emit('open')"></image>
    <view v-if="!hks" class="flex gap-10 lover_btn" @click="$emit('shuffle')">
      <image mode="heightFix" src="/static/xp_sym.png"></image>
      <text>洗牌</text>
    </view>
    <view v-if="!hks" class="flex gap-10 lover_btn" @click="$emit('open')">
      <image mode="heightFix" src="/static/kp_sym.png"></image>
      <text>开牌</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lover_btn {
  width: 32vw;
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F17104;
  border-radius: 30rpx;
  box-shadow: inset #9F2F03 0 0 60rpx -12px;

  text {
    color: white;
    font-weight: bold;
    font-size: 36rpx;
  }

  image {
    height: 50rpx;
  }
}
</style>
