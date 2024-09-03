<script setup lang="ts">
const user = useStore('user')
const config = useStore('config');

const props = defineProps({
  show: Boolean
});

const emits = defineEmits(['close']);
</script>

<template>
  <Popup position="center" :show="show" @clickMask="$emit('close')">
    <view class="relative w-80vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">推广需知</text>
      <!--      <view class="break-all w-full p-20" v-html="config.data.value.promptText"></view>-->
      <view></view>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
</style>
