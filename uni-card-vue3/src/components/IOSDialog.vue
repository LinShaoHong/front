<script setup lang="ts">
const config = useStore('config');
const props = defineProps({
  show: Boolean
});
</script>
<template>
  <Popup position="center" :show="show" @clickMask="$emit('close')">
    <view class="relative w-80vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">温馨提示</text>
      <view class="break-all w-full p-20" v-html="config.data.value.iosText"></view>
      <button open-type="share" style="background: transparent">
        <view class="h-65 w-250 mt-10 rd-40 text-white flex items-center justify-center"
              style="background: #482380; font-size: 32rpx; letter-spacing: 3rpx;">立即邀请
        </view>
      </button>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
button:after {
  border: 0;
}
</style>