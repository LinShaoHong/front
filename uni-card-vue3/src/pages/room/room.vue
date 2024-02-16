<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { useWxPay } from "@/hooks/useWxPay";
import { message, setNBT } from "@/utils/unis";
import PayDialog from "@/components/PayDialog.vue";
import { forward } from "@/utils/router";
import env from "@/config/env";
import apiUser from "@/api/apiUser";
import apiRoom from "@/api/apiRoom";

const { wxPay } = useWxPay();
const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');

//---------------------------- sse --------------------
let task = null;
const mainUser = ref(user.data.value);
const isMain = computed(() => mainUser.value.id === user.data.value.id);
const players = ref([] as any[]);
const player = ref({});
const myTurn = computed(() => {
  return player.value['userId'] === user.data.value.id;
});
const showPlayers = ref(false);
const choosePlayerId = ref('');
const choosePlayerLoading = ref(false);
const onShowPlayers = () => {
  apiRoom.players(mainUser.value.id).then((data) => {
    showPlayers.value = true;
    choosePlayerId.value = player.value['userId'];
    players.value = data.values;
  }).catch(() => networkError());
};
const onChoosePlayer = () => {
  if (player.value['userId'] !== choosePlayerId) {
    apiRoom.assign(mainUser.value.id, choosePlayerId.value)
        .catch(() => showPlayers.value = false);
  }
  showPlayers.value = false;
};

onLoad(async (option) => {
  await setNBT("云顶对弈");
  shuffleCards();
  user.getUserInfo().then(() => {
    let mainUserId = user.data.value.id;
    if (option !== undefined) {
      mainUserId = option['mainUserId'];
      if (mainUserId === undefined) {
        mainUserId = user.data.value.id;
      }
    }
    apiUser.getById(mainUserId).then(data => {
      mainUser.value = data.value;
      apiRoom.players(mainUser.value.id).then((data) => {
        players.value = data.values;
        task = wx.request({
          url: env.apiBaseUrl + '/room/sub?mainUserId=' + mainUser.value.id + '&userId=' + user.data.value.id,
          enableChunked: true,
          headers: {
            'Transfer-Encoding': 'chunked'
          },
          responseType: 'text',
          method: 'GET',
        });
        const callback = data => {
          const event = decodeURIComponent(escape(String.fromCharCode(...new Uint8Array(data.data))));
          const arr = event.split("\n")
          const e = arr.length > 1 ? arr[1] : arr[0];
          listen(JSON.parse(e.substring(6)));
        };
        if (task != null) {
          task.onChunkReceived(callback);
          apiRoom.player(mainUserId).then((data) => {
            player.value = data.value;
          }).catch(() => networkError());
        }
      }).catch(() => networkError());
    }).catch(() => networkError());
  }).catch(() => networkError());
});

onUnload(async () => {
  leave();
});

const leave = () => {
  apiRoom.leave(mainUser.value.id, user.data.value.id).then(() => {
    if (task != null) {
      task.abort();
    }
  }).catch(() => {
    if (task != null) {
      task.abort();
    }
  })
};

const listen = (event) => {
  const name = event.name;
  if (name === 'AddEvent') {
    handleAddEvent(event);
  } else if (name === 'LeaveEvent') {
    handleLeaveEvent(event);
  } else if (name === 'OpenEvent') {
    handleOpenEvent(event);
  } else if (name === 'CloseEvent') {
    handleCloseEvent(event);
  } else if (name === 'ShuffleEvent') {
    handleShuffleEvent(event);
  } else if (name === 'NextEvent') {
    handleNextEvent(event);
  }
}

const handleShuffleEvent = (event) => {
  total.value = event.total;
  shuffleAnimate();
};

const handleOpenEvent = (event) => {
  item.value = event.item;
  card.value = event.index;
  open.value = true;
  if (event.music) {
    if (!openAudio.src) {
      openAudio.src = '/static/media/vod2.m4a';
    }
    openAudio.play();
  }
};

const handleCloseEvent = (event) => {
  open.value = false;
};

const handleAddEvent = (event) => {
  if (!players.value.find(v => v.userId === event.userId)) {
    if (mainUser.value.id === event.userId) {
      players.value.unshift(event);
    } else {
      players.value.push(event);
    }
  }
};

const handleNextEvent = (event) => {
  open.value = false;
  player.value = event;
};

const handleLeaveEvent = (event) => {
  players.value = players.value.filter(v => v.userId !== event.userId);
};

const onContinue = () => {
  apiRoom.close(mainUser.value.id)
      .then(() => {
        open.value = false;
      }).catch(() => networkError());
};

const onNext = () => {
  apiRoom.next(mainUser.value.id, player.value['userId']).catch(() => networkError());
  open.value = false;
};

onShareAppMessage(() => {
  return {
    title: user.data.value.nickname + '邀请您一起云顶对弈！',
    imageUrl: '',
    path: 'pages/more/more?mainUserId=' + mainUser.value.id
  };
});

onShareTimeline(() => {
  return {
    title: user.data.value.nickname + '邀请您一起云顶对弈！',
    query: 'mainUserId=' + mainUser.value.id,
    imageUrl: ''
  }
});

//----------------------- shuffle ------------------------
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
  if (!myTurn.value) {
    await message('还没轮到你哦', 3);
    return;
  }
  apiRoom.shuffle(mainUser.value.id, player.value['userId'])
      .then(() => {
        shuffleCards();
        shuffleAnimate();
      })
      .catch(() => networkError());
};

const shuffleAnimate = async () => {
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

//--------------------- open ----------------------
const total = ref(1);
const card = ref<number | undefined>(0);
const cards = ref([] as number[]);
const item = ref({});

const shuffleCards = () => {
  for (let i = 1; i <= total.value; i++) {
    cards.value.push(i);
  }
  cards.value.sort(() => 0.5 - Math.random());
  while (total.value > 1 && cards.value[total.value - 1] === card.value) {
    cards.value.sort(() => 0.5 - Math.random());
  }
}

const open = ref(false);
const openAudio = uni.createInnerAudioContext();
openAudio.obeyMuteSwitch = false;

const doOpen = () => {
  if (hasShuffled.value) {
    card.value = cards.value.pop();
    apiRoom.open(mainUser.value.id, player.value['userId'], card.value as number, true)
        .then(() => {
          open.value = true;
          hasShuffled.value = false;
          if (!openAudio.src) {
            openAudio.src = '/static/media/vod2.m4a';
          }
          openAudio.play();
          if (user.data.value.vip < 1) {
            user.inc().catch(() => {
            });
          }
        })
        .catch(() => networkError());
  } else {
    if (!card.value || card.value < 1) {
      message('先洗牌', 3);
    } else {
      apiRoom.open(mainUser.value.id, player.value['userId'], card.value as number, false)
          .then(() => {
            open.value = true;
          }).catch(() => networkError());
    }
  }
}

const onOpenCard = () => {
  if (!myTurn.value) {
    message('还没轮到你哦', 3);
    return;
  }
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

      <view class="max-w-80vw rd-50 pt-10 flex items-center justify-around pl-20 pr-20"
            style="height: 35%; background-color: #6D04B5; overflow: hidden">
        <scroll-view scroll-x @click="onShowPlayers">
          <view style="max-width: calc(80vw - 200rpx);" class="flex items-center">
            <view v-for="player in players" class="flex items-center justify-center" :key="player.userId">
              <image class="w-100" style="border-radius: 50%;"
                     :src="`${imgUri}/avatar/${player.avatar}.png`"
                     mode="widthFix"></image>
            </view>
          </view>
        </scroll-view>
        <view class="ml-10 mr-20" style="height: 80%; width: 1px; background-color: #42006E"></view>
        <view class="w-100">
          <button class="pl-0 pr-0 m-0 text-left" open-type="share" style="background: transparent;">
            <view class="text-white w-85 h-85 flex items-center justify-center"
                  style="border: 1px solid white; border-radius: 50%">
              <image class="w-70" src="/static/add.png" mode="widthFix"></image>
            </view>
          </button>
        </view>
      </view>

      <view class="flex flex-col items-center justify-center pt-30" style="height: 45%;">
        <image style="border-radius: 50%; height: 100%;" :src="`${imgUri}/avatar/${player.avatar}.png`"
               mode="heightFix"></image>
        <text class="text-white" style="font-size: 24rpx;">{{ player.nickname }}</text>
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

  <Popup :show="showPlayers" position="bottom" @clickMask="showPlayers=false">
    <view v-if="showPlayers" class="p-20 relative h-50vh flex items-center justify-center" style="background: white">
      <view class="absolute top-20 w-full text-center" style="font-size: 34rpx; color: #907BE0">指定抽牌玩家<br/>（仅房主允许指定）
      </view>
      <button
          v-if="isMain"
          class="btn absolute top-10 right-20 w-120 h-70 flex items-center justify-center"
          :disabled="choosePlayerLoading"
          :loading="choosePlayerLoading"
          @tap.stop="onChoosePlayer"
          :style="{'background-color':'#482380', color: 'white', 'font-size': '26rpx;'}"
      >
        {{ choosePlayerLoading ? '' : '确定' }}
      </button>
      <scroll-view scroll-y class="avatar absolute top-150 w-600">
        <view class="flex flex-wrap gap-15 pb-50">
          <view v-for="player in players"
                :class="['ava-item h-120 w-200',player.userId===choosePlayerId? 'active':'inactive']"
                @click="choosePlayerId=player.userId" :key="player.userId">
            <view class="flex flex-col items-center justify-center h-full w-full pl-10 pr-10">
              <image style="border-radius: 50%; height: 100rpx;" :src="`${imgUri}/avatar/${player.avatar}.png`"
                     mode="heightFix"></image>
              <text style="font-size: 22rpx; color: #482380;">{{ player.nickname }}</text>
              <text v-if="mainUser.id===player.userId" style="font-size: 20rpx; color: #482380;"><br/>（房主）</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </Popup>

  <OpenRoomCard :open="open"
                :defaulted="item?.defaulted"
                :title="item?.defaulted? '' : item?.title"
                :content="item?.defaulted? '' : item?.content"
                :src="item?.defaulted? `${imgUri}${item?.src}` : '/static/card.png'"
                :avatar="player.avatar"
                :nickname="player.nickname"
                :height="'calc(90vh - 400rpx)'"
                :show-op="myTurn"
                @continue="onContinue"
                @next="onNext"/>

  <PayDialog :show="showPayDialog"
             :html="config.data.value.payText"
             :vip="1"
             @close="showPayDialog=false"/>
</template>

<style scoped lang="scss">
.swap {
  animation: ani-swap .3s linear forwards;
}

button:after {
  border: 0;
}

.btn {
  font-size: 21rpx;
}

.btn[disabled] {
  color: #ffffff;
  background-color: #482380;
  overflow: scroll;
}

.avatar {
  max-height: calc(50vh - 80rpx);

  .ava-item {
    border-radius: 20rpx;
  }

  .ava-item.active {
    border: 1rpx solid #482380;
  }

  .ava-item.inactive {
    border: 1rpx solid #c8c7cc;
  }
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
