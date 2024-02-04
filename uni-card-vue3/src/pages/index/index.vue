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

const card = ref<number | undefined>(0);
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
  // const d = wx.request({
  //   url: 'http://localhost:9939/api/room?id=1',
  //   enableChunked: true,
  //   headers: {
  //     'Transfer-Encoding': 'chunked'
  //   },
  //   responseType: 'text',
  //   method: 'GET',
  // });
  //
  // const l = data => {
  //   const event = new TextDecoder().decode(data.data);
  //   console.log(event.split("\n")[1].substring(6))
  // };
  // d.onChunkReceived(l);
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
const hasShuffled = ref(false);
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
          hasShuffled.value = true;
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
  if (hasShuffled.value) {
    open.value = true;
    card.value = cards.value.pop();
    hasShuffled.value = false;
    openAudio.src = '/static/media/vod2.m4a';
    openAudio.play();
    if (user.data.value.vip < 1) {
      user.inc().catch(() => {
      });
    }
  } else {
    if (!card.value || card.value < 1) {
      message('先洗牌', 3);
    } else {
      open.value = true;
    }
  }
}

const onOpenCard = () => {
  if (inShuffle.value) return;
  if (open.value) {
    open.value = false;
  } else {
    config.getConfigInfo().then(() => {
      user.getUserInfo().then(() => {
        if (user.data.value.vip >= 1 ||
            user.data.value.playCount < config.data.value.playLimit) {
          doOpen();
        } else {
          openPayDialog();
        }
      }).catch(() => networkError());
    }).catch(() => networkError())
  }
}

const doPay = (vip: number) => {
  wxPay(vip).catch(() => {
    message('解锁失败', 4);
  })
}

const showPayDialog = ref(false);
const openPayDialog = () => {
  if (showPayDialog.value) return;
  config.getConfigInfo();
  showPayDialog.value = true;
};
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>

  <van-popup position="center" v-model:show="showRule" custom-style="background: transparent;">
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
  </van-popup>

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

    <view class="absolute flex flex-col items-center bottom-50" style="height: 70%;">
      <image class="absolute top-0 bottom-80 h-60vh" mode="heightFix" style="height: 80%;"
             src="/static/p_bg.png"></image>

      <view class="absolute top--50 flex items-center justify-center">
        <view v-for="index in backCardsCount"
              :class="['absolute', shuffle && index===backCardsCount && 'swap']"
              :key="'card-back-' + index"
              :style="backCardStyle(index)"
        >
          <image src="/static/card-back.png"
                 class="h-50vh"
                 mode="heightFix"
                 :style="{'backface-visibility': index === backCardsCount? 'hidden':''}"></image>
        </view>
      </view>

      <view class="absolute bottom-30 flex items-center justify-center gap-50 z-10">
        <image class="h-90" src="/static/xp.png" mode="heightFix" @click="onShuffle"></image>
        <image class="h-90" src="/static/kp.png" mode="heightFix" @click="onOpenCard"></image>
      </view>
    </view>
  </view>

  <OpenCard :open="open" :title="''" :content="''" :src="`${imgUri}/cards/default/${card}.png`" @close="open=false"/>

  <van-popup position="center" v-model:show="showPayDialog" custom-style="background: transparent;"
             @click-overlay="showPayDialog = false">
    <view class="relative w-80vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">游戏需知</text>
      <view class="break-all w-full" v-html="config.data.value.payText"></view>
      <view class="h-65 w-250 mt-10 rd-40 text-white flex items-center justify-center"
            style="background: #482380; font-size: 32rpx; letter-spacing: 3rpx;" @click="doPay(1)">立即解锁
      </view>
    </view>
  </van-popup>

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
