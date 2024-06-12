<script setup lang="ts">
const props = defineProps({
  hks: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <image v-if="hks" class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>
  <view v-if="!hks" class="h-screen w-screen fixed lover_box"></view>
</template>

<style scoped lang="scss">

.lover_box {
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, #7B2605, #270C01);
}
</style>
