<script setup lang="ts">
import { networkError } from "@/utils/request";
import { forward } from "@/utils/router";
import { ios, setNBT } from "@/utils/unis";
import { useShare } from "@/hooks/useShare";
import apiRoom from "@/api/apiRoom";
import { useTabBar } from "@/hooks/useTabBar";

const { tabBar } = useTabBar();
const { onShareAppMessage, onShareTimeline } = useShare();

const imgUri = inject('$imgUri');
const user = useStore('user');
const config = useStore('config');
const joined = ref([] as any[]);

onLoad(async (option) => {
  await setNBT("云顶玩法");
  if (option !== undefined) {
    const mainUserId = option['mainUserId'];
    if (mainUserId != undefined) {
      forward('room', { mainUserId: mainUserId })
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

const showDefDialog = ref(false);
const onAddDefine = () => {
  user.getUserInfo().then(() => {
    if (user.data.value.vip < 1) {
      config.getConfigInfo().then(() => {
        showDefDialog.value = true;
      }).catch(() => networkError());
    } else {
      forward('custom');
    }
  }).catch(() => networkError());
};
const hasDef = computed(() => {
  return !ios() || config.data.value.iosCanPay || user.data.value.vip >= 1;

});
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>
  <view v-if="config.data.value.game" class="w-screen relative pt-50 pl-20 pr-20 flex flex-col items-center">
    <view class="flex gap-20 p-b-30 items-center">
      <view class="title_line w-20vw"></view>
      <text class="text-white" style="font-size: 34rpx">海克斯卡牌</text>
      <view class="title_line w-20vw"></view>
    </view>
    <view v-if="hasDef" class="define_box mt-10 h-10vh w-70vw rd-100 flex flex-col items-center justify-center"
          @click="onAddDefine">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image src="/static/define_add.png" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">自定义</text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">可添加编辑卡牌，随心畅玩！</text>
    </view>
    <view class="battle_box h-10vh w-70vw rd-100 flex flex-col items-center justify-center"
          :style="{'margin-top': hasDef? '50rpx' : '10rpx'}"
          @click="forward('room')">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image src="/static/battle.png" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">云顶对弈</text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">可邀请他人同时在线对弈</text>
    </view>
  </view>
  <view v-if="config.data.value.game" class="w-screen relative pt-50 pl-20 pr-20">
    <view class="flex gap-20 pb-10 pl-20 items-center">
      <view class="title_line w-5vw"></view>
      <text class="text-white" style="font-size: 32rpx">我参与过的</text>
      <view class="title_line w-10vw"></view>
    </view>
    <scroll-view scroll-y class="absolute w-700 h-500 pl-10">
      <view class="joined flex flex-wrap justify-between gap-10 pb-50">
        <view v-for="join in joined" :key="join.mainUserId"
              style="background-color: #4D0181"
              class="w-330 h-130 rd-30 mt-10 p-10 flex justify-center items-center"
              @click="forward('room', { mainUserId: join.mainUserId })">
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

  <PayDialog :show="showDefDialog"
             :html="config.data.value.payText"
             :vip="1"
             @close="showDefDialog=false"/>

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

.battle_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #FD6C35, #3BA5F9);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.title_line {
  height: 1px;
  background: linear-gradient(to right, red, #eee, #5D0C95);
}

.joined:after {
  content: "";
  width: 330rpx;
}
</style>