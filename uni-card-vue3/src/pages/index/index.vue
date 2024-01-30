<script setup lang="ts">
import { useRewardedVideoAd } from '@/hooks/useRewardedVideoAd';
import { delay } from '@/utils/calls'

//const { ad, adLoaded, adClosed } = useRewardedVideoAd();
const imgUri = inject('$imgUri');
const showDesc = ref(false);

onLoad(() => {
  delay(() => {
    showDesc.value = true;
  }, 500);
});

</script>

<template>
  <view class="relative">
    <image class="h-screen w-screen" src="../../../static/back.png" mode="scaleToFill"></image>
  </view>
</template>

<style scoped lang="scss">
</style>
