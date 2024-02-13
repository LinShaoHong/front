<script setup lang="ts">
import { networkError } from "@/utils/request";
import { forward } from "@/utils/router";
import { setNBT } from "@/utils/unis";
import { useShare } from "@/hooks/useShare";

const { onShareAppMessage, onShareTimeline } = useShare();

const user = useStore('user');
const config = useStore('config');

onLoad(async () => {
  await setNBT("云顶玩法");
});

const showDefDialog = ref(false);
const onAddDefine = () => {
  user.getUserInfo().then(() => {
    if (user.data.value.vip < 1) {
      showDefDialog.value = true;
    } else {
      forward('custom');
    }
  }).catch(() => networkError());
};

const showBattleDialog = ref(false);
const battlePayHtml = computed(() => {
  if (user.data.value.vip < 1) {
    return "<div style='font-size:15px'>对弈功能紧急开发中，<span style='color:red;font-size:18px'>" + config.data.value.price + "</span>元立即解锁<span style='color:red;font-size:18px'>永久</span>使用，届时恢复原价12.99元，敬请期待！</div>";
  } else {
    return "紧急开发中，敬请期待...";
  }
});
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>
  <view class="h-screen w-screen relative pt-50 pl-20 pr-20 flex flex-col items-center">
    <view class="flex gap-20 p-b-30 items-center">
      <view class="title_line w-20vw"></view>
      <text class="text-white" style="font-size: 34rpx">海克斯卡牌</text>
      <view class="title_line w-20vw"></view>
    </view>
    <view class="define_box mt-10 h-10vh w-70vw rd-100 flex flex-col items-center justify-center" @click="onAddDefine">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image src="/static/define_add.png" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">自定义</text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">可添加编辑卡牌，随心畅玩！</text>
    </view>
    <view class="battle_box mt-50 h-10vh w-70vw rd-100 flex flex-col items-center justify-center"
          @click="forward('room')">
      <view class="w-full h-full flex items-center justify-center gap-10">
        <image src="/static/battle.png" class="h-5vh" mode="heightFix">+</image>
        <text class="text-white" style="font-size: 40rpx">云顶对弈</text>
      </view>
      <text class="text-white mb-10" style="font-size: 26rpx;">可邀请他人同时在线对弈</text>
    </view>
  </view>

  <PayDialog :show="showDefDialog"
             :html="config.data.value.payText"
             :vip="1"
             @close="showDefDialog=false"/>

  <PayDialog :show="showBattleDialog"
             :html="battlePayHtml"
             :vip="1"
             :has-pay="user.data.value.vip < 1"
             @close="showBattleDialog=false"/>

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
</style>