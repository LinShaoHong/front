<script setup lang="ts">
import Background from "@/components/Background.vue";

//ad8cc12f7ac5a2310be15a6e2413ac2f
const imgUri = inject('$imgUri');
const config = useStore('config');
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
  if (config.data.value.toHks) {
    uni.navigateToMiniProgram({
      appId: 'wx2c2cc1c85657325a',
      path: 'pages/more/more?hks=false'
    });
  }
};
</script>

<template>
  <Background :hks="hks"/>
  <button class="fixed right-0 w-200 h-66 z-6"
          :style="{top: 'calc(20vh - 60rpx)', background: 'transparent'}"
          openType="contact">
    <image v-if="hks" class="w-full h-full absolute left-0" src="/static/mask_bg.png"></image>
    <view v-if="!hks"
          class="w-full h-full absolute left-0"
          style="background-image: linear-gradient(to right, #FF6110, transparent); border-radius: 66rpx 0 0 66rpx;"
    />
    <image class="w-76 h-66 absolute left-4" src="/static/message.png"></image>
    <text class="h-full color-white absolute left-80 flex items-center justify-center" style="font-size: 28rpx;">
      联系客服
    </text>
  </button>
  <view class="absolute flex flex-col items-center bottom-50 h-full left-0 right-0" style="height: 70%;">
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
</template>

<style scoped lang="scss">
</style>
