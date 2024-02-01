<script setup lang="ts">
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";

defineProps({
  show: Boolean,
  src: String,
  title: String,
  label: String
});

defineEmits(['close']);
</script>

<template>
  <Popup position="center" :show="show">
    <view class="flex flex-col items-center justify-center p-20 w-540 h-580 rd-20" style="background: white">
      <uni-icons class="absolute top-20 right-20" type="closeempty" @click="$emit('close')"></uni-icons>
      <view class="" style="font-size: 32rpx;">{{ title }}</view>
      <image class="w-480 h-480" :src="src" mode="aspectFill" show-menu-by-longpress></image>
      <view class="" style="font-size: 26rpx; color: #999999;">{{ label }}</view>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
</style>
