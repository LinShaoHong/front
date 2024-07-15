<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useShare } from "@/hooks/useShare";
import { ios, message } from "@/utils/unis";
import PayDialog from "@/components/PayDialog.vue";
import { useTabBar } from "@/hooks/useTabBar";
import { isEmpty } from "@/utils/is";
import Background from "@/components/Background.vue";
import TopTabBar from "@/components/TopTabBar.vue";

const { tabBar } = useTabBar();
const { onShareAppMessage, onShareTimeline, shareFunc, shareHks, shareTitle } = useShare();
shareFunc.value = () => {
  shareHks.value = hks.value;
  shareTitle.value = hks.value ? config.data.value.shareTitle : config.data.value.loverShareTitle;
};

const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');
const hks = ref(true);
const hksCardType = ref(config.data.value.hksCards.filter(s => s.open)[0]?.type);
const loverCardType = ref(config.data.value.loverCards.filter(s => s.open)[0]?.type);
const showRule = ref(false);
const showPrompt = ref(false);

// -------------- card -----------------
const cardType = computed(() => {
  return hks.value ? hksCardType.value : loverCardType.value;
});
const cardItems = computed(() => {
  const arr = user.data.value.defs.filter(s => s['name'] === cardType.value);
  if (arr.length > 0) {
    const items = arr[0]['items'];
    if (items !== undefined) {
      return items.filter(item => item['enable']);
    }
  }
  return [];
});

const card = ref<number | undefined>(0);
const cards = ref([] as number[]);
const item = computed(() => {
  if (card.value as number > 0) {
    return cardItems.value[card.value as number - 1];
  }
  return null;
});
const shuffleCards = () => {
  if (cardItems.value.length > 0 && cards.value.length === 0) {
    for (let i = 1; i <= cardItems.value.length; i++) {
      cards.value.push(i);
    }
    cards.value.sort(() => 0.5 - Math.random());
    while (cardItems.value.length > 1 &&
    cards.value[cardItems.value.length - 1] === card.value) {
      cards.value.sort(() => 0.5 - Math.random());
    }
  }
}

const reShuffleCards = () => {
  cards.value = [];
  shuffleCards();
};

// -------------- watch -----------------
watch(cardItems, (n, o) => {
  reShuffleCards();
});
watch(() => cards.value.length, (n, o) => {
  if (n === 0) {
    shuffleCards();
  }
});

// -------------- ui -----------------
onLoad(async (option) => {
  if (option !== undefined) {
    const _hks = option['hks'];
    if (_hks != undefined) {
      hks.value = _hks === 'true';
    }
  }
  await delay(500).then(() => {
    if (hks.value) {
      showRule.value = true;
    }
  })
  shuffleCards();
  config.getConfigInfo().then(() => {
    loverCardType.value = config.data.value.loverCards.filter(s => s.open)[0]?.type;
  }).catch(() => networkError());
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
    height: '65%'
  }
});


// -------------- shuffle -----------------
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
  if (cards.value.length === 0) {
    await message('没有卡牌', 3);
    return;
  }
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

// -------------- open -----------------
const open = ref(false);
const openAudio = uni.createInnerAudioContext();
openAudio.obeyMuteSwitch = false;

const doOpen = () => {
  open.value = true;
  card.value = cards.value.pop();
  openAudio.src = '/static/media/vod2.m4a';
  openAudio.play();
  if (user.data.value.vip < 1) {
    user.inc(hks.value).catch(() => {
    });
  }
}

const loverCardVisible = computed(() => {
  if (hks.value) {
    return true;
  }
  const arr = config.data.value.loverCards.filter(s => s.type === loverCardType.value);
  return (arr.length === 0 ? true : arr[0]['visible']) || user.data.value.vip > 0;
});
const canOpen = computed(() => {
  if (user.data.value.vip >= 1) {
    return true;
  }
  if (hks.value) {
    return user.data.value.playCount < config.data.value.playLimit;
  } else {
    if (loverCardVisible.value) {
      return user.data.value.loverPlayCount < config.data.value.loverPlayLimit;
    } else {
      return false;
    }
  }
});

const onOpenCard = () => {
  if (inShuffle.value) return;
  if (cards.value.length === 0) {
    message('没有卡牌', 3);
    return;
  }
  if (open.value) {
    open.value = false;
  } else {
    config.getConfigInfo().then(() => {
      user.getUserInfo().then(() => {
        if (canOpen.value) {
          doOpen();
        } else {
          if (!ios() || config.data.value.iosCanPay) {
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
    <Logo/>
    <Background :hks="hks"/>
    <TopTabBar :hks="hks" @on-hks="(t) => hks = t"/>
    <view v-if="hks" class="fixed left-30 w-screen top-150 flex w-full gap-20 z-11">
      <view
          class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
          v-for="_cardType in config.data.value.hksCards.filter(s => s.open)"
          :style="{'border-radius': '20rpx', 'background-color': hksCardType===_cardType.type? '#8606DD':'#5C0498'}"
          @click="hksCardType=_cardType.type"
          :key="_cardType.name">
        <text class="text-white">{{ _cardType.name }}</text>
      </view>
    </view>
    <view v-if="!hks" class="fixed left-30 w-screen top-150 flex w-full gap-20 z-11">
      <view
          class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
          v-for="_cardType in config.data.value.loverCards.filter(s => s.open)"
          :style="{'border-radius': '20rpx', 'background-color': loverCardType===_cardType.type? '#FF6110':'#982F06'}"
          @click="loverCardType=_cardType.type"
          :key="_cardType.name">
        <text class="text-white">{{ _cardType.name }}</text>
      </view>
    </view>

    <Popup v-if="config.data.value.game" position="center" :show="showRule">
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
            :style="{top: hasBanner ? 'calc(20vh - 60rpx)' : 'calc(20vh - 60rpx)', background: 'transparent'}"
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

    <button v-if="config.data.value.game && config.data.value.prompt" class="fixed right-0 w-200 h-66 z-6"
            :style="{top: hasBanner ? 'calc(30vh - 136rpx)' : 'calc(30vh - 136rpx)', background: 'transparent'}"
            @click="showPrompt=true"
    >
      <image class="w-full h-full absolute left-0" src="/static/mask_bg.png"></image>
      <image class="h-60 absolute left-10" src="/static/prompt.png" mode="heightFix"></image>
      <text class="h-full color-white absolute left-80 flex items-center justify-center" style="font-size: 28rpx;">
        推广计划
      </text>
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

      <view class="absolute flex flex-col items-center bottom-50 h-full" style="height: 70%;">
        <image v-if="hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
               src="/static/p_bg.png"></image>
        <image v-if="!hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
               src="/static/p_bg_lover.png"></image>

        <view :class="['absolute h-full flex items-center justify-center']">
          <view v-for="index in backCardsCount"
                :class="['absolute', shuffle && index===backCardsCount && 'swap']"
                :key="'card-back-' + index"
                :style="backCardStyle(index)"
          >
            <image :src="hks? '/static/card-back.png':'/static/lover-card-back.jpg'"
                   class="h-full rd-30"
                   mode="heightFix"
                   :style="{'backface-visibility': index === backCardsCount? 'hidden':'', height: hks? '':'88%'}"></image>
          </view>
        </view>

        <view v-if="config.data.value.game" class="absolute bottom-30 z-10">
          <PlayButton :hks="hks" @shuffle="onShuffle" @open="onOpenCard"></PlayButton>
        </view>
      </view>
    </view>

    <OpenCard :open="open"
              :hks="hks"
              :count="card"
              :defaulted="item?.defaulted"
              :lover-card-type="loverCardType"
              :title="item?.title"
              :content="item?.content"
              :src="isEmpty(item?.src) ? '/static/card.png' : imgUri + item.src"
              :type="isEmpty(item?.src)"
              @close="open=false"/>

    <PayDialog :show="showPayDialog"
               :hks="hks"
               :html="config.data.value.payText"
               :vip="1"
               @close="showPayDialog=false"/>

    <IOSDialog :show="showIOSDialog" @close="showIOSDialog=false"/>

    <Prompt :show="showPrompt" @close="showPrompt=false"/>

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
