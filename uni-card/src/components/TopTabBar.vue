<script setup lang="ts">
const config = useStore('config');

const props = defineProps({
  hks: {
    type: Boolean,
    default: true
  }
});

defineEmits(['onHks']);
</script>

<template>
  <view v-if="config.data.value.game" class="fixed w-screen h-68 flex z-10">
    <view class="h-full tab_box"
          :style="{'background-color': hks? 'white':'transparent', 'border-radius': '0 0 10rpx 0', border: hks? '1px solid #300450':''}"
          @click="$emit('onHks', true)">
      <text :style="{color: hks? '#300450':'white'}">海克斯喝酒</text>
    </view>
    <view class="h-full tab_box"
          :style="{'background-color': !hks? 'white':'transparent', 'border-radius': '0 0 0 10rpx', border: !hks? '1px solid #7B2605':''}"
          @click="$emit('onHks', false)">
      <text :style="{color: !hks? '#F17104':'white'}">情侣升温</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.tab_box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;

  text {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>
