<script setup lang="ts">
import Background from "@/components/Background.vue";

const imgUri = inject('$imgUri');
const hks = ref(false);
const open = ref(false);
const backCardStyle = computed(() => (index) => {
  return {
    top: ((index - 1) * 18) + 'rpx',
    transform: 'scale(' + (0.9 + index * 0.03) + ')' + (open.value && index === 5 ? 'rotateY(180deg)' : ''),
    'z-index': index + 10,
    transition: 'transform .4s ease',
    height: '65%'
  }
});

const onShuffle = () => {
};
</script>

<template>
  <view class="content">
    <Background :hks="hks"/>
    <view class="absolute flex flex-col items-center bottom-50 h-full" style="height: 70%;">
      <image v-if="hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
             src="/static/p_bg.png"></image>
      <image v-if="!hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
             src="/static/p_bg_lover.png"></image>

      <view :class="['absolute h-full flex items-center justify-center']">
        <view v-for="index in 5"
              class="absolute"
              :key="'card-back-' + index"
              :style="backCardStyle(index)"
        >
          <image :src="hks? '/static/card-back.png':'/static/lover-card-back.jpg'"
                 class="h-full rd-30"
                 mode="heightFix"
                 :style="{'backface-visibility': index === 5? 'hidden':'', height: hks? '':'88%'}"></image>
        </view>
      </view>

      <view class="absolute bottom-30 z-10">
        <PlayButton :hks="hks" @shuffle="onShuffle" @open="onShuffle"></PlayButton>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
