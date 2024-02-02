<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useWxPay } from "@/hooks/useWxPay";
import { message } from "@/utils/unis";

//const { ad, adLoaded, adClosed } = useRewardedVideoAd();
const { wxPay } = useWxPay();

const user = useStore('user');
const config = useStore('config');

const imgUri = inject('$imgUri');
const showRule = ref(false);

const card = ref<number | undefined>(1);
const cards = ref([] as number[]);
const shuffleCards = () => {
  if (cards.value.length === 0) {
    config.getConfigInfo();
    for (let i = 1; i <= config.data.value.cardCount; i++) {
      cards.value.push(i);
    }
    cards.value.sort(() => 0.5 - Math.random());
    while (cards.value[config.data.value.cardCount - 1] === card.value) {
      cards.value.sort(() => 0.5 - Math.random());
    }
  }
}

onLoad(async () => {
  await delay(500).then(() => {
    showRule.value = true;
  })
  shuffleCards();
});

watch(() => cards.value.length, (n, o) => {
  if (n === 0) {
    shuffleCards();
  }
});

const banner = ref({});
const showQR = ref(false);
const hasBanner = computed(() => config.data.value.banners.length > 0);
const onBanner = (item) => {
  banner.value = item;
  showQR.value = true;
};

const backCardsCount = ref(5);
const backCardStyle = computed(() => (index) => {
  return {
    top: ((index - 1) * 18) + 'rpx',
    transform: 'scale(' + (0.9 + index * 0.03) + ')' + (open.value && index === backCardsCount.value ? 'rotateY(180deg)' : ''),
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
    return;
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
  card.value = cards.value.pop();
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

const doPay = () => {
  wxPay().catch(err => {
    message('解锁失败', 4);
  })
}

const showPayDialog = ref(false);
const openPayDialog = () => {
  if (showPayDialog.value) return;
  config.getConfigInfo();
  showPayDialog.value = true;
}
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
          :style="{top: hasBanner ? '240rpx' : '60rpx', background: 'transparent'}"
          openType="contact">
    <image class="w-full h-full absolute left-0" src="/static/mask_bg.png"></image>
    <image class="w-76 h-66 absolute left-4" src="/static/message.png"></image>
    <text class="color-white absolute left-80" style="font-size: 28rpx;">联系客服</text>
  </button>

  <view class="relative flex flex-col items-center h-100vh">
    <view v-if="hasBanner"
          class="w-full px-20 py-10" style="height: 20%">
      <swiper :indicator-dots="false"
              :autoplay="true"
              :interval="3500"
              :duration="150"
              :circular="true"
              indicator-color="rgba(255, 255, 255, 0.8)"
              indicator-active-color="#fff">
        <swiper-item v-for="(item, index) in config.data.value.banners" :key="index">
          <image :src="item.src" class="h-220 w-full block border-rd-20" mode="scaleToFill"
                 @click="onBanner(item)"></image>
        </swiper-item>
      </swiper>
    </view>

    <view class="absolute flex flex-col items-center bottom-50" style="height: 70%; background-color: red">
      <image class="absolute top-0 bottom-80 w-90vw" style="height: 80%;" src="/static/p_bg.png"></image>

      <view class="absolute top--50 flex items-center justify-center">
        <view v-for="index in backCardsCount"
              :class="['absolute', shuffle && index===backCardsCount && 'swap']"
              :key="'card-back-' + index"
              :style="backCardStyle(index)"
        >
          <image src="/static/card-back.png"
                 class="w-55vw"
                 mode="widthFix"
                 :style="{'backface-visibility': index === backCardsCount? 'hidden':''}"></image>
        </view>
      </view>

      <view class="absolute top--80 z-100 flex items-center justify-center"
            :style="{transform: open? 'rotateY(180deg)' : '', transition: '.3s linear', 'transform-style': 'preserve-3d'}">
        <image
            style="transform: rotateY(180deg); backface-visibility: hidden"
            class="absolute h-75vh top--100" :src="`${imgUri}/${card}.png`" mode="heightFix"></image>
      </view>

      <view class="absolute bottom-0 flex items-center justify-center gap-50 mt-200">
        <image class="h-90" src="/static/xp.png" mode="heightFix" @click="onShuffle"></image>
        <image class="h-90" src="/static/kp.png" mode="heightFix" @click="onOpenCard"></image>
      </view>
    </view>
  </view>

  <Popup position="center" :show="showPayDialog">
    <view class="relative w-85vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">游戏需知</text>
      <uni-icons class="absolute right-10 top-10" type="closeempty" size="20"
                 @click="showPayDialog = false"></uni-icons>
      <view class="break-all" v-html="config.data.value.payText"></view>
      <view class="h-65 w-250 mt-10 rd-40 text-white flex items-center justify-center"
            style="background: #482380; font-size: 32rpx; letter-spacing: 3rpx;" @click="doPay">立即解锁
      </view>
    </view>
  </Popup>

  <QRCode :show="showQR"
          :src="banner.qr"
          :title="banner.title"
          :label="banner.label"
          @close="showQR=false"/>
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
