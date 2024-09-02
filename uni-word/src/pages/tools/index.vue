<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import { request } from "@/utils/request";
import env from "@/config/env";
import { isEmpty } from "@/utils/is";
import { formatDate } from "date-fns";

const nav = useStore('nav');
let interval;
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(3);
  interval = setInterval(() => {
    if (date.value === formatDate(new Date(), 'yyyy-MM-dd')) {
      search();
    }
  }, 2000);
});
onHide(() => {
  if (interval) {
    clearInterval(interval);
  }
});
onLoad(() => {
  search();
});
const imageUri = env.baseUrl + '/image/';
const users = ref([]);
const search = () => {
  request("GET", env.baseUrl + '/card/api/account/byDate', { date: date.value })
      .then(data => {
        users.value = data.values;
      }).catch(err => console.log(err));
};
const cachedAvatar = (avatar) => {
  let cache = uni.getStorageSync('avatar_' + avatar);
  if (!isEmpty(cache)) {
    return cache;
  }
  uni.getImageInfo({
    src: `${ imageUri }/avatar/${ avatar }.png`,
    success: res => {
      uni.saveFile({
        tempFilePath: res.path,
        success: (saveResult) => {
          const savedFilePath = saveResult.savedFilePath;
          console.log(savedFilePath);
          uni.setStorageSync('avatar_' + avatar, savedFilePath);
        }
      });
    }
  });
  return `${ imageUri }/avatar/${ avatar }.png`;
};
const date = ref(formatDate(new Date(), 'yyyy-MM-dd'));
const changeTime = e => {
  date.value = e.detail.value;
  search();
};
</script>

<template>
  <NavigationBar/>
  <view class="container">
    <view class="h-full">
      <view class="relative w-full p-30 flex justify-center"
            style="height: 20%;
            background-color: #EEF0E1;
            padding-top: calc(var(--status-bar-height) + 10px);
            border-radius: 0 0 30rpx 30rpx;
            box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;">
        <view class="w-full flex items-center justify-center" style="height: 65%;">
          <text style="color: #858585; font-size: 60rpx; margin: auto; display: inline-block">
            {{ users.filter(u => u.vip > 0).length + ' / ' + users.length }}
          </text>
        </view>
        <view class="absolute bottom-30 w-500 flex items-center justify-center gap-10">
          <picker mode="date" :value="date" :end="formatDate(new Date(), 'yyyy-MM-dd')" @change="changeTime"
                  class="rd-50 pt-10 pb-10 flex items-center justify-center"
                  style="background-color: #006E1C; width: 80%">
            <text class="font-bold" style="color: white;font-size: 28rpx;">{{ date }}</text>
          </picker>
        </view>
      </view>
      <scroll-view scroll-y :show-scrollbar="false" style="height: 80%">
        <view class="w-full h-20"></view>
        <view v-for="(user,i) in users" class="w-full pl-20 pr-20 pt-10 pb-10 flex items-center"
              :key="user.id"
              :style="{'background-color': ((i+1)%2===0? '#D9E7C8':'#F8FAF0')}">
          <view class="relative w-60">
            <image class="w-50" mode="widthFix" :src="cachedAvatar(user.avatar)"></image>
            <image v-if="user.vip > 0" class="absolute bottom-0 right-3" style="height: 50%;" mode="heightFix"
                   src="/static/vip.png"/>
          </view>
          <view class="ml-5 mr-5 h-20 w-20 rd-20"
                :style="{'background-color': user.vip>0? '#006E1C':(isEmpty(user.prepayId)? '#EEF0E1':'red')}"></view>
          <view class="w-120">
            <text class="pl-10">{{ user.os }}</text>
          </view>
          <view class="ml-10 mr-5 h-20 w-20 rd-20"
                :style="{'background-color': user.vip>0? '#006E1C':(isEmpty(user.prepayId)? '#EEF0E1':'red')}"></view>
          <text class="pl-10 w-250">{{
              user.location?.startsWith('中国') ? user.location.substring(3) : user.location
            }}
          </text>
          <view class="ml-10 mr-5 h-20 w-20 rd-20"
                :style="{'background-color': user.vip>0? '#006E1C':(isEmpty(user.prepayId)? '#EEF0E1':'red')}"></view>
          <view class="h-full w-80 flex items-center gap-8">
            <text class="pl-10">{{ user.playCount }}</text>
            <image v-if="!isEmpty(user.shareCode)" class="w-30"  mode="widthFix" src="/static/share.png"/>
          </view>
          <text class="pl-10 absolute right-20">{{ formatDate(user.createTime, 'HH:mm') }}</text>
        </view>
        <view class="w-full h-20"></view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
