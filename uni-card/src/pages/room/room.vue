<script setup lang="ts">
import { delay } from '@/utils/calls'
import { networkError } from "@/utils/request";
import { ios, message } from "@/utils/unis";
import PayDialog from "@/components/PayDialog.vue";
import { forward } from "@/utils/router";
import env from "@/config/env";
import apiUser from "@/api/apiUser";
import apiRoom from "@/api/apiRoom";
import { useShare } from "@/hooks/useShare";
import { useSSE } from "@/hooks/useSSE";
import { isEmpty } from "@/utils/is";

const hks = ref(true);
const { sseConnect, sseAbort } = useSSE();
const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');
const canPopup = ref(false);

//-------------------- share -----------------------
const { onShareAppMessage, onShareTimeline, sharePath, shareTitle, shareMainUserId, shareHks, shareFunc } = useShare();
shareFunc.value = () => {
  sharePath.value = 'pages/more/more';
  shareHks.value = hks.value;
  shareTitle.value = hks.value ? config.data.value.shareTitle : config.data.value.loverShareTitle;
  shareMainUserId.value = mainUser.value.id;
};

//---------------------------- sse --------------------
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
  fetchPlayers().then(() => {
    showPlayers.value = true;
    choosePlayerId.value = player.value['userId'];
  }).catch(() => networkError());
};
const onChoosePlayer = () => {
  if (player.value['userId'] !== choosePlayerId) {
    apiRoom.assign(mainUser.value.id, choosePlayerId.value, hks.value)
        .catch(() => showPlayers.value = false);
  }
  showPlayers.value = false;
};

onLoad(async (option) => {
  delay(500).then(() => canPopup.value = true);
  shuffleCards();
  config.getConfigInfo().then(() => {
    hksCardType.value = config.data.value.hksCards.filter(s => s.open)[0]?.type;
    loverCardType.value = config.data.value.loverCards.filter(s => s.open)[0]?.type;
    user.getUserInfo().then(() => {
      let mainUserId = user.data.value.id;
      if (option !== undefined) {
        mainUserId = option['mainUserId'];
        if (mainUserId === undefined) {
          mainUserId = user.data.value.id;
        }
        hks.value = option['hks'] === 'true';
      }

      const sys = uni.getSystemInfoSync();
      apiUser.getById(mainUserId, sys.platform).then(async data => {
        mainUser.value = data.value;
        const url = env.apiBaseUrl + '/room/sub?mainUserId=' + mainUser.value.id + '&userId=' + user.data.value.id + '&hks=' + hks.value;
        await sseConnect(url, listen);
        apiRoom.player(mainUserId, hks.value).then((data) => {
          player.value = data.value;
        }).then(() => {
          apiRoom.total(mainUserId, cardType.value)
              .then(r => total.value = r.value)
              .catch(() => networkError());
        }).catch(() => networkError());
      }).catch(() => networkError());
    }).catch(() => networkError());
  }).catch(() => networkError());
  listenKeyboard();
});

onUnload(async () => {
  leave();
});

const leave = () => {
  apiRoom.leave(mainUser.value.id, user.data.value.id, hks.value).then(() => {
    sseAbort();
  }).catch(() => {
    sseAbort();
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
  } else if (name === 'ChangeCardTypeEvent') {
    handleChangeCardTypeEvent(event);
  } else if (name === 'ReceiveReplyEvent') {
    handleReceiveReplyEvent(event);
  }
}

const handleShuffleEvent = (event) => {
  total.value = event.total;
  if (!myTurn.value && total.value > 0) {
    shuffleAnimate();
  }
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
  if (hks.value) {
    hksCardType.value = event.cardType;
  } else {
    loverCardType.value = event.cardType;
  }
  fetchPlayers().catch(() => networkError());
};

const handleLeaveEvent = (event) => {
  fetchPlayers().catch(() => networkError());
};

const fetchPlayers = () => {
  return new Promise((resolve, reject) => {
    apiRoom.players(mainUser.value.id, hks.value).then((data) => {
      players.value = data.values;
      apiRoom.player(mainUser.value.id, hks.value).then((data2) => {
        player.value = data2.value;
        resolve(data.values);
      }).catch((err) => reject(err));
    }).catch((err) => reject(err));
  });
}

const handleNextEvent = (event) => {
  open.value = false;
  player.value = event;
};

const handleChangeCardTypeEvent = (event) => {
  if (!isMain.value) {
    if(hks.value) {
      hksCardType.value = event.cardType;
    } else {
      loverCardType.value = event.cardType;
    }
  }
};

const onContinue = () => {
  apiRoom.close(mainUser.value.id, hks.value)
      .then(() => {
        open.value = false;
      }).catch(() => networkError());
};

const onNext = () => {
  apiRoom.next(mainUser.value.id, hks.value, player.value['userId']).catch(() => networkError());
  open.value = false;
};

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
const shuffleAudio = uni.createInnerAudioContext();
shuffleAudio.obeyMuteSwitch = false;

const doShuffle = async () => {
  shuffle.value = true;
  await delay(300).then(() => shuffle.value = false);
};

const onShuffle = () => {
  if (!myTurn.value) {
    message('还没轮到你哦', 3);
    return;
  }
  apiRoom.shuffle(mainUser.value.id, player.value['userId'], hks.value, cardType.value)
      .then(() => {
        shuffleCards();
        if (cards.value.length === 0) {
          message('没有卡牌', 3);
        } else {
          shuffleAnimate();
        }
      }).catch(() => networkError());
};

const shuffleAnimate = async () => {
  if (inShuffle.value) return;
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

//--------------------- open ----------------------
const total = ref(1);
const card = ref<number | undefined>(0);
const cards = ref([] as number[]);
const item = ref({});
const hksCardType = ref(config.data.value.hksCards.filter(s => s?.open)[0]?.type);
const loverCardType = ref(config.data.value.loverCards.filter(s => s?.open)[0]?.type);
const cardType = computed(() => {
  return hks.value ? hksCardType.value : loverCardType.value;
});
const onCardType = (t) => {
  if (hks.value) {
    if (hksCardType.value !== t) {
      hksCardType.value = t;
      if (isMain) {
        apiRoom.changeCardType(mainUser.value.id, t, hks.value)
            .catch(() => networkError());
      }
    }
  } else {
    if (loverCardType.value !== t) {
      loverCardType.value = t;
      if (isMain) {
        apiRoom.changeCardType(mainUser.value.id, t, hks.value)
            .catch(() => networkError());
      }
    }
  }
};

watch(cardType, () => {
  cards.value = [];
  apiRoom.total(mainUser.value.id, cardType.value)
      .then((r) => {
        total.value = r.value;
        shuffleCards();
      }).catch(() => networkError());
});

const shuffleCards = () => {
  if (cards.value.length !== 0) {
    return;
  }
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
  if (cards.value.length === 0) {
    shuffleCards();
  }
  if (cards.value.length > 0) {
    card.value = cards.value.pop();
    apiRoom.open(mainUser.value.id, player.value['userId'], hks.value, cardType.value, card.value as number, true)
        .then(() => {
          open.value = true;
          if (!openAudio.src) {
            openAudio.src = '/static/media/vod2.m4a';
          }
          openAudio.play();
          if (user.data.value.vip < 1) {
            user.inc(hks.value).catch(() => {
            });
          }
        })
        .catch(() => networkError());
  } else {
    message('没有卡牌', 3);
  }
}

const loverCardVisible = computed(() => {
  if (hks.value) {
    return true;
  }
  const arr = config.data.value.loverCards.filter(s => s?.type === loverCardType.value);
  return (arr.length === 0 ? true : arr[0]['visible']) || user.data.value.vip > 0;
});
const canOpen = computed(() => {
  if (user.data.value.vip >= 1) {
    return true;
  }
  if (players.value.some(p => p.vip >= 1)) {
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

const onOpenCard = async () => {
  if (!myTurn.value) {
    await message('还没轮到你哦', 3);
    return;
  }
  if (inShuffle.value) return;
  if (open.value) {
    open.value = false;
  } else {
    config.getConfigInfo().then(() => {
      user.getUserInfo().then(() => {
        fetchPlayers().then(() => {
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
      }).catch(() => networkError());
    }).catch(() => networkError());
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

//--------------------- reply ----------------------
const chats = ref([] as any);
const replyMsg = ref('');
watch(replyMsg, (n, o) => {
  if (n.length > 500) {
    replyMsg.value = n.substring(0, 500);
  }
});
const showReply = ref(false);
const replyBottomId = ref('');
const replyAudio = uni.createInnerAudioContext();
replyAudio.obeyMuteSwitch = false;

const toReplyBottom = () => {
  if (chats.value.length > 0) {
    replyBottomId.value = 'replyId:none';
    delay(50).then(() => {
      if (chats.value.length > 0) {
        replyBottomId.value = 'replyId:' + chats.value[chats.value.length - 1].id;
      }
    });
  }
}

const onReply = () => {
  if (!showReply.value) {
    showReply.value = true;
    if (chats.value.length === 0) {
      apiRoom.replies(mainUser.value.id, hks.value)
          .then(r => {
            chats.value = r.values;
            toReplyBottom();
          }).catch(() => networkError());
    } else {
      toReplyBottom();
    }
  }
};
const replyFocus = () => {
  toReplyBottom();
};
const canReply = computed(() => {
  if (user.data.value.vip >= 1) {
    return true;
  }
  if (players.value.some(p => p.vip >= 1)) {
    return true;
  }
  return chats.value.filter(c => c.userId === user.data.value.id).length <= config.data.value.chatLimit;
});
const sendReply = () => {
  if (!isEmpty(replyMsg.value)) {
    fetchPlayers().then(() => {
      if (canReply.value) {
        apiRoom.reply(mainUser.value.id, user.data.value.id, encodeURIComponent(replyMsg.value), hks.value)
            .then(r => {
              if (r.value !== null) {
                chats.value.push({
                  id: r.value,
                  userId: user.data.value.id,
                  nickname: user.data.value.nickname,
                  avatar: user.data.value.avatar,
                  vip: user.data.value.vip,
                  message: encodeURIComponent(replyMsg.value)
                });
                toReplyBottom();
              }
              replyMsg.value = '';
            }).catch(() => networkError());
      } else {
        openPayDialog();
      }
    }).catch(() => networkError());
  }
};
const withdrawReply = (id) => {
  apiRoom.withdrawReply(mainUser.value.id, user.data.value.id, id, hks.value)
      .then(() => {
        chats.value = chats.value.filter(c => c.id !== id);
      }).catch(() => networkError());
};

const handleReceiveReplyEvent = (event) => {
  if (event.userId !== user.data.value.id) {
    if (event.withdraw) {
      chats.value = chats.value.filter(c => c.id !== event.chatId);
    } else {
      apiRoom.byReplyId(mainUser.value.id, event.chatId, hks.value)
          .then(r => {
            if (!replyAudio.src) {
              replyAudio.src = '/static/media/chat.wav';
            }
            replyAudio.play();
            const tob = !showReply.value || replyMessageInBottom.value;
            delay(300).then(() => {
              chats.value.push(r.value);
              if (!showReply.value) {
                showReply.value = true;
              }
              if (tob) {
                toReplyBottom();
              }
            });
          }).catch(() => networkError());
    }
  }
};

const replyInputHeight = ref(0)
const inputQuery = wx.createSelectorQuery();
inputQuery.select('#replyInputId').boundingClientRect();
inputQuery.exec((res) => {
  replyInputHeight.value = res[0].height;
});
const replyInput = (e) => {
  inputQuery.exec((res) => {
    replyInputHeight.value = res[0].height;
  });
  msgQuery.exec((res) => {
    replyMessageHeight.value = res[0].height;
  });
};
watch(replyInputHeight, () => {
  toReplyBottom();
});

const replyKeyboardHeight = ref(0);
const listenKeyboard = () => {
  uni.onKeyboardHeightChange((res) => {
    replyKeyboardHeight.value = res.height;
    inputQuery.exec((res) => {
      replyInputHeight.value = res[0].height;
    });
    msgQuery.exec((res) => {
      replyMessageHeight.value = res[0].height;
    });
  })
};

const msgQuery = wx.createSelectorQuery();
msgQuery.select('#replyMessageId').boundingClientRect();
const replyMessageHeight = ref(0);
msgQuery.exec((res) => {
  replyMessageHeight.value = res[0].height;
});
const replyScrollTop = ref(0);
const replyScrollHeight = ref(0);
const replyScroll = (event) => {
  replyScrollTop.value = event.detail.scrollTop;
  replyScrollHeight.value = event.detail.scrollHeight;
};
const replyMessageInBottom = computed(() => {
  return replyScrollTop.value + replyMessageHeight.value + 300 >= replyMessageHeight.value;
})
</script>

<template>
  <Background :hks="hks"/>

  <view class="fixed top-0 w-screen flex flex-col gap-3" style="align-items: flex-end">
    <view class="flex justify-center items-center pl-10 pr-10 pt-2 pb-2"
          :style="{'background-image': 'linear-gradient(to right, '+(hks? '#6D04B5':'#FF6110')+', transparent)', 'border-radius': '30rpx 0 0 30rpx'}">
      <text class="text-white">{{ config.data.value.roomTitle }}</text>
    </view>
    <view v-if="!isEmpty(config.data.value.loverPlayTitle) && !hks"
          class="flex justify-center items-center pl-10 pr-10 pt-2 pb-2"
          :style="{'background-image': 'linear-gradient(to right, '+(hks? '#6D04B5':'#FF6110')+', transparent)', 'border-radius': '30rpx 0 0 30rpx'}">
      <text class="text-white">{{ config.data.value.loverPlayTitle }}</text>
    </view>
  </view>

  <view v-if="hks" class="fixed left-30 flex flex-col gap-20 z-11" style="top: 18%">
    <view
        class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
        v-for="_cardType in config.data.value.hksCards.filter(s => s?.open && (isMain || hksCardType===s?.type))"
        :style="{'border-radius': '20rpx', 'background-color': hksCardType===_cardType.type? '#8606DD':'#5C0498'}"
        @click="onCardType(_cardType.type)"
        :key="_cardType.name">
      <text class="text-white">{{ _cardType.name }}</text>
    </view>
  </view>

  <view v-if="!hks" class="fixed left-30 flex flex-col gap-20 z-11" style="top: 18%">
    <view
        class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
        v-for="_cardType in config.data.value.loverCards.filter(s => s?.open && (isMain || loverCardType===s?.type))"
        :style="{'border-radius': '20rpx', 'background-color': loverCardType===_cardType.type? '#FF6110':'#982F06'}"
        @click="onCardType(_cardType.type)"
        :key="_cardType.name">
      <text class="text-white">{{ _cardType.name }}</text>
    </view>
  </view>

  <view class="fixed right-0 w-180 h-66 z-6 flex items-center"
        style="top: 18%; background-color: transparent" @click="onReply">
    <view class="w-full h-full absolute left-0"
          :style="{'background-image': 'linear-gradient(to right, '+(hks? '#8606DD':'#FF6110')+', transparent)', 'border-radius': '66rpx 0 0 66rpx'}"
    />
    <image class="ml-15 h-45 z-10" src="/static/reply.png" mode="heightFix"></image>
    <text class="color-white z-10 ml-10" style="font-size: 24rpx;">
      {{ hks ? '聊一聊' : '回复TA' }}
    </text>
  </view>

  <view class="relative flex flex-col items-center justify-between h-100vh pt-20 pb-30">

    <view class="relative w-full flex flex-col justify-center items-center pt-10 pb-10 gap-10" style="height: 30%;">

      <view class="relative w-full" @click="forward('profile')" style="height: 20%;">
        <view class="absolute left-20 top-0 flex justify-center items-center gap-10 h-full">
          <Avatar class="h-full"
                  height-fix
                  :src="`${imgUri}/avatar/${user.data.value.avatar}.png`"
                  :vip="user.data.value.vip"
          />
          <text class="text-white" style="font-size: 28rpx;">{{ user.data.value.nickname }}</text>
        </view>
      </view>

      <view class="max-w-80vw rd-50 pt-10 flex items-center justify-around pl-20 pr-20"
            :style="{height: '35%', 'background-color': hks?'#6D04B5':'#982F06', overflow: 'hidden'}">
        <scroll-view scroll-x @click="onShowPlayers">
          <view style="max-width: calc(80vw - 200rpx);" class="flex items-center">
            <view v-for="_player in players" class="flex items-center justify-center" :key="_player.userId">
              <Avatar class="w-100"
                      width-fix
                      :src="`${imgUri}/avatar/${_player.avatar}.png`"
                      :vip="_player.vip"
              />
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
        <Avatar class="h-full"
                height-fix
                :src="`${imgUri}/avatar/${player.avatar}.png`"
                :vip="player.vip"
        />
        <text class="text-white" style="font-size: 24rpx;">{{ player.nickname }}</text>
      </view>
    </view>
    <view class="relative flex flex-col items-center" style="height: 70%;">
      <image v-if="hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
             src="/static/p_bg.png"></image>
      <image v-if="!hks" class="absolute top-0 bottom-80" mode="heightFix" style="height: 80%;"
             src="/static/p_bg_lover.png"></image>

      <view :class="['absolute flex justify-center top-0']" style="background-color: red">
        <view v-for="index in backCardsCount"
              :class="['absolute', shuffle && index===backCardsCount && 'swap']"
              :key="'card-back-' + index"
              :style="backCardStyle(index)"
        >
          <image :src="hks? '/static/card-back.png':'/static/lover-card-back.jpg'"
                 class="rd-30"
                 mode="heightFix"
                 :style="{'backface-visibility': index === backCardsCount? 'hidden':'', height: hks? '45vh':'42vh'}"></image>
        </view>
      </view>

      <view class="absolute bottom-30 z-10">
        <PlayButton :hks="hks" @shuffle="onShuffle" @open="onOpenCard"></PlayButton>
      </view>
    </view>
  </view>

  <Popup :show="showPlayers" position="bottom" @clickMask="showPlayers=false">
    <view :class="[canPopup? '':'h-0']">
      <view v-if="showPlayers" class="p-20 relative h-50vh flex items-center justify-center" style="background: white">
        <view class="absolute top-20 w-full text-center" style="font-size: 34rpx; color: black">指定抽牌玩家<br/>（仅房主允许指定）
        </view>
        <button
            v-if="isMain"
            class="btn absolute top-10 right-20 w-120 h-70 flex items-center justify-center"
            :disabled="choosePlayerLoading"
            :loading="choosePlayerLoading"
            @tap.stop="onChoosePlayer"
            :style="{'background-color': hks? '#482380':'#FF6110', color: 'white', 'font-size': '26rpx;'}"
        >
          {{ choosePlayerLoading ? '' : '确定' }}
        </button>
        <scroll-view scroll-y class="avatar absolute top-150 w-700">
          <view class="flex flex-wrap gap-15 pb-50">
            <view v-for="_player in players"
                  :class="['ava-item h-120 w-200',_player.userId===choosePlayerId? (hks? 'active':'lover_active'):'inactive']"
                  @click="choosePlayerId=_player.userId" :key="_player.userId">
              <view class="flex flex-col items-center justify-center h-full w-full pl-10 pr-10">
                <Avatar class="h-100"
                        height-fix
                        :src="`${imgUri}/avatar/${_player.avatar}.png`"
                        :vip="_player.vip"
                />
                <text style="font-size: 22rpx; color: black;">{{ _player.nickname }}</text>
                <text v-if="mainUser.id===_player.userId" style="font-size: 20rpx; color: black;"><br/>（房主）</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </Popup>

  <Popup :show="showReply" position="bottom" @clickMask="showReply=false">
    <view :class="[canPopup? '':'h-0']">
      <view class="w-screen h-100 flex justify-center items-center"
            @click="showReply=false">
        <uni-icons type="down" size="24" color="#EDEDED"/>
      </view>
      <scroll-view id="replyMessageId"
                   :scroll-into-view="replyBottomId"
                   :style="{height: replyInputHeight===0? '60vh':('min(60vh, calc(99vh - '+replyKeyboardHeight+'px - '+replyInputHeight+'px))'),'background-color': '#EDEDED', 'border-radius': '20rpx 20rpx 0 0'}"
                   @scroll="replyScroll"
                   scroll-y>
        <view class="relative flex gap-10 pt-20 pb-20 ml-20 mr-20"
              :style="{'flex-direction': chat.userId===user.data.value.id? 'row-reverse':'row'}"
              v-for="chat in chats"
              :id="'replyId:'+chat.id"
              :key="chat.id">
          <Avatar class="h-10vw"
                  height-fix
                  :src="`${imgUri}/avatar/${chat.avatar}.png`"
                  :vip="chat.vip"
          />
          <view class="flex flex-col gap-5">
            <text v-if="chat.userId!==user.data.value.id" style="color: #858585;font-size: 22rpx;">{{
                chat.nickname
              }}
            </text>
            <view class="relative max-w-70vw rd-10 min-h-10vw flex items-center p-20"
                  :style="{'background-color': chat.userId!==user.data.value.id? 'white':hks? '#E7D0F6':'#FFCBB0','font-size':'32rpx'}">
              <text>
                {{ decodeURIComponent(chat.message) }}
              </text>
              <view v-if="chat.userId===user.data.value.id"
                    class="absolute left--60 bottom-0">
                <text style="font-size: 24rpx; color:#858585" @click="withdrawReply(chat.id)">撤回</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="w-screen pb-20 pt-20 pl-50 pr-50 flex justify-center" id="replyInputId"
            style="background-color: #F7F7F7; border-top: 1rpx #D5D5D5 solid; align-items: flex-end">
        <view class="p-20 flex items-center"
              style="background-color: white; border-radius: 10rpx; flex: 1;">
          <scroll-view scroll-y class="max-h-280"
                       style="background-color: white; display: inline-block;overflow: hidden">
            <textarea class="w-full"
                      auto-height
                      :maxlength="500"
                      :adjust-position="false"
                      v-model="replyMsg"
                      @focus="replyFocus"
                      @input="replyInput"
                      style="background-color: white; font-size: 32rpx; line-height: 32rpx; resize: none;"/>
          </scroll-view>
        </view>
        <view v-if="!isEmpty(replyMsg)"
              class="text-white h-60 mb-10 flex items-center justify-center w-15vw"
              :style="{'background-color': hks? '#482380':'#FF6110', 'font-size': '28rpx', 'border-radius': '10rpx', 'margin-left': '3vw'}"
              @click="sendReply">
          <text>发送</text>
        </view>
      </view>
      <view class="w-screen" :style="{height: replyKeyboardHeight+'px', 'background-color':'#F7F7F7'}"></view>
    </view>
  </Popup>

  <OpenRoomCard :open="open"
                :hks="hks"
                :count="card"
                :defaulted="item?.defaulted"
                :hks-card-type="hksCardType"
                :lover-card-type="loverCardType"
                :title="item?.title"
                :content="item?.content"
                :src="isEmpty(item?.src) ? '/static/card.png' : imgUri + item.src"
                :type="isEmpty(item?.src)"
                :avatar="player.avatar"
                :vip="player.vip"
                :nickname="player.nickname"
                :height="'calc(90vh - 400rpx)'"
                :show-op="myTurn"
                @continue="onContinue"
                @reply="onReply"
                @next="onNext"/>

  <PayDialog :show="showPayDialog"
             :hks="hks"
             :html="config.data.value.payText"
             :vip="1"
             @close="showPayDialog=false"/>

  <IOSDialog :show="showIOSDialog" @close="showIOSDialog=false"/>
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

  .ava-item.lover_active {
    border: 1rpx solid #FF6110;
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
