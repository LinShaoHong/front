<script setup lang="ts">

const nav = useStore('nav');
const switchTab = p => {
  uni.switchTab({
    url: '/pages/' + p + '/index'
  });
};
</script>

<template>
  <view class="nav fixed w-screen flex items-center justify-between pl-50 pr-50"
        style="height: 80px; background-color: #EEF0E1;">
    <view class="flex flex-col gap-20 items-center cursor-pointer" style="width: calc(20vw - 20rpx);" @click="switchTab('index')">
      <view class="w-full pt-10 pb-10 rd-30 flex items-center justify-center"
            :style="{'background-color': nav.data.value.index===0? '#D9E7C8':'transparent'}">
        <uni-icons type="home-filled" size="20" color="black"/>
      </view>
      <text>单词</text>
    </view>
    <view class="flex flex-col gap-20 items-center cursor-pointer" style="width: calc(20vw - 20rpx);" @click="switchTab('read')">
      <view class="w-full pt-10 pb-10 rd-30 flex items-center justify-center"
            :style="{'background-color': nav.data.value.index===1? '#D9E7C8':'transparent'}">
        <uni-icons type="home-filled" size="20" color="black"/>
      </view>
      <text>阅读</text>
    </view>
    <view class="flex flex-col gap-20 items-center cursor-pointer" style="width: calc(20vw - 20rpx);" @click="switchTab('search')">
      <view class="w-full pt-10 pb-10 rd-30 flex items-center justify-center"
            :style="{'background-color': nav.data.value.index===2? '#D9E7C8':'transparent'}">
        <uni-icons type="home-filled" size="20" color="black"/>
      </view>
      <text>搜索</text>
    </view>
    <view class="flex flex-col gap-20 items-center cursor-pointer" style="width: calc(20vw - 20rpx);" @click="switchTab('tools')">
      <view class="w-full pt-10 pb-10 rd-30 flex items-center justify-center"
            :style="{'background-color': nav.data.value.index===3? '#D9E7C8':'transparent'}">
        <uni-icons type="home-filled" size="20" color="black"/>
      </view>
      <text>工具</text>
    </view>
    <view class="flex flex-col gap-20 items-center cursor-pointer" style="width: calc(20vw - 20rpx);" @click="switchTab('mine')">
      <view class="w-full pt-10 pb-10 rd-30 flex items-center justify-center"
            :style="{'background-color': nav.data.value.index===4? '#D9E7C8':'transparent'}">
        <uni-icons type="home-filled" size="20" color="black"/>
      </view>
      <text>我的</text>
    </view>
  </view>
  <view class="fixed w-screen safe-bt"></view>
</template>

<style scoped lang="scss">
.nav {
  bottom: env(safe-area-inset-bottom);
}

.safe-bt {
  height: env(safe-area-inset-bottom);
  background-color: #EEF0E1;
  bottom: 0;
}
</style>
