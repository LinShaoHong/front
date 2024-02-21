<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useWxPay } from "@/hooks/useWxPay";
import { useShare } from "@/hooks/useShare";
import { ios, message, setNBT } from "@/utils/unis";
import PayDialog from "@/components/PayDialog.vue";
import { useTabBar } from "@/hooks/useTabBar";
import { isMp } from "@/utils/platform";

const { tabBar } = useTabBar();
const { onShareAppMessage, onShareTimeline, shareTitle, shareImageUrl } = useShare();
const { wxPay } = useWxPay();

const user = useStore('user');
const config = useStore('config');

const imgUri = inject('$imgUri');
const showRule = ref(false);

const card = ref<number | undefined>(0);
const cards = ref([] as number[]);
const item = computed(() => {
  if (card.value as number > 0) {
    return user.items.value[card.value as number - 1];
  }
  return null;
});
const shuffleCards = () => {
  if (user.items.value && cards.value.length === 0) {
    for (let i = 1; i <= user.items.value.length; i++) {
      cards.value.push(i);
    }
    cards.value.sort(() => 0.5 - Math.random());
    while (user.items.value.length > 1 &&
    cards.value[user.items.value.length - 1] === card.value) {
      cards.value.sort(() => 0.5 - Math.random());
    }
  }
}

const reShuffleCards = () => {
  cards.value = [];
  shuffleCards();
};

watch(user.items, (n, o) => {
  reShuffleCards();
});

onLoad(async () => {
  shareTitle.value = config.data.value.shareTitle;
  shareImageUrl.value = config.data.value.logo;

  await setNBT("云顶喝酒卡牌");
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
    transition: 'transform .4s ease',
    height: isMp ? '50vh' : 'calc(50vh - var(--window-bottom) + 25px)'
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
            (!ios() && user.data.value.playCount < config.data.value.playLimit) ||
            (ios() && user.data.value.playCount < config.data.value.iosLimit)) {
          doOpen();
        } else {
          if (!ios()) {
            openPayDialog();
          } else {
            showIOSDialog.value = true;
          }
        }
      }).catch(() => networkError());
    }).catch(() => networkError())
  }
}
const showIOSDialog = ref(false);
const showPayDialog = ref(false);
const openPayDialog = () => {
  if (showPayDialog.value) return;
  config.getConfigInfo().then(() => {
    showPayDialog.value = true;
  }).catch(() => networkError());
};
</script>

<template>
  <view class="content">
    <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>

    <Popup position="center" :show="showRule">
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
            :style="{top: hasBanner ? 'calc(20vh - 80rpx)' : 'calc(20vh - 80rpx)', background: 'transparent'}"
            openType="contact">
      <image class="w-full h-full absolute left-0" src="/static/mask_bg.png"></image>
      <image class="w-76 h-66 absolute left-4" src="/static/message.png"></image>
      <text class="color-white absolute left-80" style="font-size: 28rpx;">联系客服</text>
    </button>

    <view class="relative flex flex-col items-center h-full">
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
                   class="h-full"
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

    <OpenCard :open="open"
              :defaulted="item?.defaulted"
              :title="item?.defaulted? '' : item?.title"
              :content="item?.defaulted? '' : item?.content"
              :src="item?.defaulted? `${imgUri}${item?.src}` : '/static/card.png'"
              @close="open=false"/>

    <PayDialog :show="showPayDialog"
               :html="config.data.value.payText"
               :vip="1"
               @close="showPayDialog=false"/>

    <IOSDialog :show="showIOSDialog" @close="showIOSDialog=false"/>

    <QRCode :show="showQR"
            :src="banner.qr"
            :title="banner.title"
            :label="banner.label"
            @close="showQR=false"/>
  </view>
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
