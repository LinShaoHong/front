<script setup lang="ts">
import { networkError } from "@/utils/request";
import { forward } from "@/utils/router";
import { setNBT } from "@/utils/unis";

const user = useStore('user');
const config = useStore('config');

onLoad(async () => {
  await setNBT("更多玩法");
});

const showPayDialog = ref(false);
const onAddDefine = () => {
  user.getUserInfo().then(() => {
    if (user.data.value.vip < 1) {
      showPayDialog.value = true;
    } else {
      forward('custom');
    }
  }).catch(() => networkError());
};
</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>
  <view class="h-screen w-screen relative pt-50 pl-20 pr-20 flex flex-col items-center">
    <view class="flex gap-20 p-b-30 items-center">
      <view class="title_line w-20vw"></view>
      <text class="text-white" style="font-size: 34rpx">海克斯卡牌</text>
      <view class="title_line w-20vw"></view>
    </view>
    <view class="define_box h-10vh w-70vw rd-100 flex items-center justify-center gap-20" @click="onAddDefine">
      <image src="/static/define_add.png" class="h-5vh" mode="heightFix">+</image>
      <text class="text-white" style="font-size: 40rpx">自定义</text>
    </view>
  </view>

  <PayDialog :show="showPayDialog"
             :html="config.data.value.payText"
             :vip="1"
             @close="showPayDialog=false"/>
</template>

<style scoped lang="scss">
.define_box {
  box-sizing: border-box;
  background-image: linear-gradient(to right, #fc5c7d, #6a82fb);
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.title_line {
  height: 1px;
  background: linear-gradient(to right, red, #eee, #5D0C95);
}
</style>