<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useWxPay } from "@/hooks/useWxPay";

//const { ad, adLoaded, adClosed } = useRewardedVideoAd();
const { wxPay } = useWxPay();

const user = useStore('user');
const config = useStore('config');

const imgUri = inject('$imgUri');
const showRule = ref(false);
const banners = ref([] as string[]);

onLoad(async () => {
  await delay(500).then(() => {
    showRule.value = false;
  })
});

banners.value = []

const backCardStyle = computed(() => (index) => {
  return {
    top: (index * 18) + 'rpx',
    transform: 'scale(' + (0.9 + index * 0.03) + ')' + (open.value && index === 5 ? 'rotateY(180deg)' : ''),
    'z-index': index + 10,
    transition: 'transform .4s ease'
  }
});

const shuffle = ref(false);
const inShuffle = ref(false);
const shuffleAudio = uni.createInnerAudioContext();
shuffleAudio.obeyMuteSwitch = false;

const doShuffle = async () => {
  shuffle.value = true;
  await delay(300).then(() => shuffle.value = false);
};

const onShuffle = async () => {
  if (inShuffle.value) return;
  if (open.value) {
    await delay(100).then(() => open.value = false);
  }
  inShuffle.value = true;
  shuffleAudio.src = '/static/media/vod1.m4a';
  shuffleAudio.play();
  shuffleAudio.onPlay(async () => {
    await doShuffle();
    await delay(20).then(async () => {
      await doShuffle();
      await delay(20).then(async () => {
        await doShuffle();
        await delay(20).then(async () => {
          await doShuffle();
          inShuffle.value = false;
          shuffleAudio.stop();
        })
      })
    })
  })
};

const open = ref(false);
const openAudio = uni.createInnerAudioContext();
openAudio.obeyMuteSwitch = false;

const doOpen = () => {
  open.value = true;
  openAudio.src = '/static/media/vod2.m4a';
  openAudio.play();
  if (!user.data.value.vip) {
    user.inc().catch(() => {
    });
  }
}

const onOpenCard = () => {
  if (inShuffle.value) return;
  if (open.value) {
    open.value = false;
  } else {
    config.getConfigInfo().then(() => {
      user.getUserInfo().then(() => {
        if (user.data.value.vip ||
            user.data.value.playCount < config.data.value.playLimit) {
          doOpen();
        } else {
          openPayDialog();
        }
      }).catch(() => networkError());
    }).catch(() => networkError())
  }
}

const showPayDialog = ref(false);
const openPayDialog = () => {
  if (showPayDialog.value) return;
  config.getConfigInfo();
  showPayDialog.value = true;
}

const showQR = ref(true);
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>

  <Popup position="center" :show="showRule" :close="false">
    <view class="pb-40">
      <image class="max-w-screen h-75vh" src="/static/rule.png" mode="heightFix"></image>
      <view class="flex items-center justify-center">
        <image class="px-10 py-10 w-320 h-100"
               src="/static/foot_bg.png"
               mode="scaleToFill"
               @click="showRule=false"></image>
        <text class="color-white absolute font-bold" style="font-size: 30rpx;" @click="showRule=false">确定</text>
      </view>
    </view>
  </Popup>

  <button class="fixed right-0 w-200 h-66 z-6"
          :style="{top: banners.length > 0 ? '300rpx' : '60rpx', background: 'transparent'}"
          openType="contact">
    <image class="w-full h-full absolute left-0" src="/static/mask_bg.png"></image>
    <image class="w-76 h-66 absolute left-4" src="/static/message.png"></image>
    <text class="color-white absolute left-80" style="font-size: 28rpx;">联系客服</text>
  </button>

  <view class="relative flex flex-col items-center justify-center">
    <view v-if="banners.length > 0"
          class="w-full px-20 py-10 h-400">
      <swiper :indicator-dots="false"
              :autoplay="true"
              :interval="3500"
              :duration="150"
              :circular="true"
              indicator-color="rgba(255, 255, 255, 0.8)"
              indicator-active-color="#fff">
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item" class="h-240 block w-full border-rd-20" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <view class="relative flex items-center justify-center bottom-35 w-full"
          :style="{'margin-top': banners.length > 0? '-30rpx':'300rpx' }"
    >
      <image class="w-80vw" src="/static/p_bg.png"></image>
      <view class="absolute top--100 flex items-center justify-center">
        <view v-for="index in 5"
              :class="['absolute', shuffle && index===5 && 'swap']"
              :key="'card-back-' + index"
              :style="backCardStyle(index)"
        >
          <image src="/static/card-back.png"
                 :style="{'backface-visibility': index === 5? 'hidden':''}"
                 mode="heightFix"></image>
        </view>
      </view>
      <view class="absolute top--100 z-100 flex items-center justify-center"
            :style="{transform: open? 'rotateY(180deg)' : '', transition: '.3s linear', 'transform-style': 'preserve-3d'}">
        <image
            style="transform: rotateY(180deg); backface-visibility: hidden"
            class="absolute h-75vh top--100" src="/static/front.png" mode="heightFix"></image>
      </view>
    </view>

    <view class="w-full relative flex items-center justify-center gap-50">
      <image class="h-90" src="/static/xp.png" mode="heightFix" @click="onShuffle"></image>
      <image class="h-90" src="/static/kp.png" mode="heightFix" @click="onOpenCard"></image>
    </view>
  </view>

  <Popup position="center" :show="showPayDialog">
    <view class="relative w-85vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">游戏需知</text>
      <uni-icons class="absolute right-10 top-10" type="closeempty" size="20"
                 @click="showPayDialog.value = false"></uni-icons>
      <view class="break-all" v-html="config.data.value.payText"></view>
      <view class="h-65 w-250 mt-10 rd-40 text-white flex items-center justify-center"
            style="background: #482380; font-size: 32rpx; letter-spacing: 3rpx;" @click="wxPay">立即解锁
      </view>
    </view>
  </Popup>

  <QRCode :show="showQR"
          @close="showQR=false"
          :src="'/static/qr.jpg'"
          :title="'公众号二维码'"
          :label="'长按识别二维码，打开公众号'"></QRCode>
</template>

<style scoped lang="scss">
.swap {
  animation: ani-swap .3s linear forwards;
}

@keyframes ani-swap {
  50% {
    transform: translateY(-250rpx) rotate(-15deg);
    animation-timing-function: ease-in;
  }
  100% {
    transform: scale(0.85);
    z-index: 10;
  }
}
</style>
