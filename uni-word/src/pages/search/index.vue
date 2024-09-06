<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import {isEmpty} from "@/utils/is";
import apiLoader from "@/api/apiLoader";
import {networkError} from "@/utils/request";
import {message} from "@/utils/unis";

const nav = useStore('nav');
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(2);
});
const words = ref('' as string);
const add = () => {
  if (isEmpty(words.value)) {
    return;
  }
  let ws: string = words.value;
  ws = ws.replace(/，/g, ',');
  apiLoader.loadAll(ws, nav.data.value.userId)
      .then(() => {
        message('添加成功', 1);
      }).catch(() => networkError());
};
</script>

<template>
  <NavigationBar/>
  <view class="container flex flex-col gap-20 items-center justify-center">
    <view class="relative h-20vh rd-30"
          style="width: 80%; background-color: white;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
      <textarea class="w-full h-full rd-20 pl-20 pr-35 pt-35 pb-10"
                placeholder="填入单词，','号隔开"
                placeholder-style="font-size: 30rpx"
                :maxlength="500"
                cursor-spacing="10"
                v-model="words"
                style="background-color: white; font-size: 34rpx; line-height: 32rpx; resize: none;"/>
      <image v-if="!isEmpty(words)"
             @click="words=''"
             class="absolute top-5 right-10 w-30" mode="widthFix" src="/static/clear.png"></image>
    </view>
    <view class="rd-30 pt-15 pb-15 flex items-center justify-center"
          @click="add"
          style="width: 80%; background-color: #006E1C;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
      <text style="font-weight: bold; color:white">添加</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
