<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useWxPay } from "@/hooks/useWxPay";
import { message, setNBT } from "@/utils/unis";
import PayDialog from "@/components/PayDialog.vue";
import { forward } from "@/utils/router";

const { wxPay } = useWxPay();
const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');

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
  await setNBT("云顶对弈");
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

const showPayDialog = ref(false);
const openPayDialog = () => {
  if (showPayDialog.value) return;
  config.getConfigInfo();
  showPayDialog.value = true;
};
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>

  <view class="relative flex flex-col items-center justify-between h-100vh pt-20 pb-30">

    <view class="relative w-full flex flex-col justify-center items-center pt-10 pb-10 gap-10" style="height: 30%;">

      <view class="relative w-full" @click="forward('profile')" style="height: 20%;">
        <view class="absolute left-20 top-0 flex justify-center items-center gap-10 h-full">
          <image style="border-radius: 50%; height: 100%;" :src="`${imgUri}/avatar/${user.data.value.avatar}.png`"
                 mode="heightFix"></image>
          <text class="text-white" style="font-size: 28rpx;">{{ user.data.value.nickname }}</text>
        </view>
      </view>

      <view class="min-w-40vw max-w-80vw rd-50 pt-10 flex items-center justify-between pl-20 pr-20"
            style="height: 35%; background-color: #6D04B5; overflow: hidden">
        <view style="max-width: calc(80vw - 200rpx); overflow: hidden" class="flex items-center">
          <view v-for="i in 2" class="flex flex-col items-center justify-center" :key="i">
            <image class="w-100" style="border-radius: 50%;"
                   :src="`${imgUri}/avatar/${user.data.value.avatar}.png`"
                   mode="widthFix"></image>
          </view>
        </view>
        <view class="mr-20 ml-10" style="height: 80%; width: 1px; background-color: #42006E"></view>
        <view class="text-white w-85 h-85 flex items-center justify-center"
              style="border: 1px solid white; border-radius: 50%">
          <image class="w-70" src="/static/add.png" mode="widthFix"></image>
        </view>

      </view>

      <view class="flex flex-col items-center justify-center pt-30" style="height: 45%;">
        <image style="border-radius: 50%; height: 100%;" :src="`${imgUri}/avatar/${user.data.value.avatar}.png`"
               mode="heightFix"></image>
        <text class="text-white" style="font-size: 24rpx;">{{ user.data.value.nickname }}</text>
      </view>
    </view>
    <view class="relative flex flex-col items-center" style="height: 70%;">
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

  <OpenCard :open="open"
            :defaulted="item?.defaulted"
            :title="item?.defaulted? '' : item?.title"
            :content="item?.defaulted? '' : item?.content"
            :src="item?.defaulted? `${imgUri}${item?.src}` : '/static/card.png'"
            :height="'calc(90vh - 400rpx)'"
            @close="open=false"/>

  <PayDialog :show="showPayDialog"
             :html="config.data.value.payText"
             :vip="1"
             @close="showPayDialog=false"/>
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
