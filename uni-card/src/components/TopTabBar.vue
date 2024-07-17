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
  <view v-if="config.data.value.game && !config.data.value.noLover" class="fixed w-screen h-100 flex z-400">
    <view class="h-full tab_box"
          :style="{'background': hks? 'linear-gradient(to top, transparent, white)':'transparent', 'border-radius': '0 0 10rpx 0'}"
          @click="$emit('onHks', true)">
      <text :style="{color: hks? '#300450':'white'}">{{ config.data.value.topTab.hks }}</text>
    </view>
    <view class="h-full tab_box"
          :style="{'background': !hks? 'linear-gradient(to top, transparent, white)':'transparent', 'border-radius': '0 0 0 10rpx'}"
          @click="$emit('onHks', false)">
      <text :style="{color: !hks? '#A83000':'white'}">{{ config.data.value.topTab.lover }}</text>
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
