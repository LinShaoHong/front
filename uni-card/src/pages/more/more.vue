<script setup lang="ts">
import { networkError } from "@/utils/request";
import { forward } from "@/utils/router";
import { ios } from "@/utils/unis";
import { useShare } from "@/hooks/useShare";
import apiRoom from "@/api/apiRoom";
import { useTabBar } from "@/hooks/useTabBar";

const { tabBar } = useTabBar();
const { onShareAppMessage, onShareTimeline } = useShare();

const hks = ref(true);
const imgUri = inject('$imgUri');
const user = useStore('user');
const config = useStore('config');
const joined = ref([] as any[]);

onLoad(async (option) => {
  if (option !== undefined) {
    const mainUserId = option['mainUserId'];
    const _hks = option['hks'];
    if (mainUserId != undefined && hks != undefined) {
      forward('room', { mainUserId: mainUserId, hks: _hks })
    }
  }
});

onShow(() => {
  config.getConfigInfo().then(() => {
    user.getUserInfo().then(() => {
      apiRoom.joined(user.data.value.id).then((data) => {
        joined.value = data.values;
      });
    });
  }).catch(() => networkError());
});

const hasDef = computed(() => {
  return !ios() || config.data.value.iosCanPay || user.data.value.vip >= 1;
});
</script>

<template>
  <Background :hks="hks"/>
  <TopTabBar :hks="hks" @on-hks="(t) => hks=t"/>

  <view v-if="config.data.value.game" :class="['w-screen relative pl-20 pr-20 flex flex-col items-center',config.data.value.noLover? 'pt-50':'pt-150']">
    <view v-if="hasDef"
          :class="['mt-10 h-10vh w-70vw rd-100 flex flex-col items-center justify-center',hks? 'define_box':'lover_define_box']"
          @click="forward('custom', { hks:hks })">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image src="/static/define_add.png" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">
          {{ hks ? config.data.value.more.hks.defTitle : config.data.value.more.lover.defTitle }}
        </text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">
        {{ hks ? config.data.value.more.hks.defContent : config.data.value.more.lover.defContent }}
      </text>
    </view>
    <view
        :class="['h-10vh w-70vw rd-100 flex flex-col items-center justify-center',hks?'battle_box':'lover_battle_box']"
        :style="{'margin-top': hasDef? '50rpx' : '10rpx'}"
        @click="forward('room', { hks:hks })">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image :src="hks? '/static/battle.png':'/static/lover_battle.png'" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">
          {{ hks ? config.data.value.more.hks.battleTitle : config.data.value.more.lover.battleTitle }}
        </text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">
        {{ hks ? config.data.value.more.hks.battleContent : config.data.value.more.lover.battleContent }}
      </text>
    </view>
  </view>
  <view v-if="config.data.value.game" class="w-screen relative pt-50 pl-20 pr-20">
    <view class="flex gap-20 pb-10 pl-20 items-center">
      <view :class="['w-5vw', hks? 'title_line':'lover_title_line']"></view>
      <text class="text-white" style="font-size: 32rpx">我参与过的</text>
      <view :class="['w-10vw', hks? 'title_line':'lover_title_line']"></view>
    </view>
    <scroll-view scroll-y class="absolute w-700 h-500 pl-10">
      <view class="joined flex flex-wrap justify-between gap-10 pb-50">
        <view v-for="join in joined" :key="join.mainUserId"
              :style="{'background-color': hks? '#4D0181':'#982F06'}"
              class="w-330 h-130 rd-30 mt-10 p-10 flex justify-center items-center"
              @click="forward('room', { mainUserId: join.mainUserId, hks:hks })">
          <image class="h-100" style="border-radius: 50%" :src="`${imgUri}/avatar/${join.avatar}.png`"
                 mode="heightFix"></image>
          <view class="relative w-230 h-130 ml-20 flex flex-col">
            <text class="text-white absolute top-30" style="font-size: 30rpx;">{{ join.nickname }}</text>
            <text class="text-white absolute bottom-20" style="font-size: 24rpx;">{{ join.time }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  <!--  <view class="fixed bottom-0">-->
  <!--    <m-tabbar fixed fill current="1" :tabbar="tabBar"></m-tabbar>-->
  <!--  </view>-->
</template>

<style scoped lang="scss">
.define_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #fc5c7d, #6a82fb);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.lover_define_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #D4145A, #FBB03B);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.battle_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #FD6C35, #3BA5F9);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.lover_battle_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #662D8C, #ED1E79);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.title_line {
  height: 1px;
  background: linear-gradient(to right, red, #eee, #5D0C95);
}

.lover_title_line {
  height: 1px;
  background: linear-gradient(to right, red, #eee, #571B03);
}

.joined:after {
  content: "";
  width: 330rpx;
}
</style>