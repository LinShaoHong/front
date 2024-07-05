<script setup lang="ts">
const hks = ref(false);
const imgUri = inject('$imgUri');
const btb = ref('write');
</script>

<template>
  <view class="fixed w-screen h-screen" style="background: linear-gradient(to bottom, #f2709c, #ff9472);"></view>
  <view v-if="btb==='write'" class="fixed w-80vw h-70vh left-0 right-0 rd-15 flex flex-col gap-10"
        style="margin: auto; top: calc(15vh - 25px); background-color: white; opacity: 0.5;">
    <input placeholder="请输入对方手机号"/>
  </view>
  <view class="fixed bottom-0 w-screen flex justify-around items-center pt-5"
        style="height: 50px; background-color: transparent;box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;">
    <view class="h-full flex flex-col items-center justify-end gap-5">
      <image :src="`${imgUri}/sms.png`" style="height: 28px;" mode="heightFix"></image>
      <text :style="{color: 'white','font-size':'24rpx'}">写信</text>
    </view>
    <view class="flex flex-col items-center justify-around gap-5">
      <image :src="`${imgUri}/sms.png`" style="height: 28px;" mode="heightFix"></image>
      <text :style="{color: 'white', 'font-size':'24rpx'}">信箱</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>