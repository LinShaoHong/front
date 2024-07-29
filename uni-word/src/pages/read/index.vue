<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import { networkError } from "@/utils/request";
import apiLoader from "@/api/apiLoader";
import { isEmpty } from "@/utils/is";

const nav = useStore('nav');
const date = ref('');
const stats = ref([] as any);
const dicts = ref([] as any);
const stat = ref({} as Loader.Stat);
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(1);
  apiLoader.stats()
      .then((data) => {
        stats.value = data.values;
        if (isEmpty(date.value)) {
          date.value = stats.value[0].id;
          stat.value = stats.value[0];
        } else {
          stat.value = stats.value.filter(s => s.id = date.value)[0];
        }
        apiLoader.dicts(date.value)
            .then(data => dicts.value = data.values)
            .catch(() => networkError());
      })
      .catch(() => networkError());
});
watch(date, (n, o) => {
  apiLoader.stat(n)
      .then((data) => {
        stat.value = data.value;
        dicts.value = [];
        apiLoader.dicts(date.value)
            .then(data => dicts.value = data.values)
            .catch(() => networkError());
      })
      .catch(() => networkError());
});
const toCheck = (sort) => {
  nav.setShow(false);
  nav.setDate(date.value);
  apiLoader.byDate(date.value, sort).then(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }).catch(() => networkError());
};
const meaning = (dict) => {
  let arr: string[] = []
  if (!isEmpty(dict.meaning.nouns)) {
    arr.push('n. ' + dict.meaning.nouns);
  }
  if (!isEmpty(dict.meaning.verbs)) {
    arr.push('v. ' + dict.meaning.verbs);
  }
  if (!isEmpty(dict.meaning.adjectives)) {
    arr.push('adj. ' + dict.meaning.adjectives);
  }
  if (!isEmpty(dict.meaning.adverbs)) {
    arr.push('adv. ' + dict.meaning.adverbs);
  }
  return arr.join(' ');
};
const icon = (dict) => {
  if (dict.passed) {
    return '/static/passed.png';
  }
  if (isLoading(dict)) {
    return '/static/loading.gif';
  }
  if (dict.viewed) {
    return '/static/checking.png';
  }
  return '/static/waiting.png';
};
const isLoading = (dict) => {
  let loading = false;
  for (const key in dict.loadState) {
    if (dict.loadState[key]) {
      loading = true;
      break;
    }
  }
  return loading;
};
const dictType = ref('all');
const _dicts = computed(() => {
  switch (dictType.value) {
    case 'viewed':
      return dicts.value.filter(d => d.viewed);
    case 'waiting':
      return dicts.value.filter(d => !d.viewed);
    case 'loading':
      return dicts.value.filter(d => isLoading(d));
    case 'passed':
      return dicts.value.filter(d => d.passed);
    default:
      return dicts.value;
  }
});
</script>

<template>
  <NavigationBar/>
  <view class="container">
    <view class="h-full">
      <view class="relative w-full p-30 flex flex-col items-center gap-40"
            style="height: 40%;
            background-color: #EEF0E1;
            padding-top: 45px;
            border-radius: 0 0 30rpx 30rpx;
            box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;">
        <scroll-view scroll-y :show-scrollbar="false"
                     style="background-color: white;"
                     class="w-610 h-250 rd-20 p-20">
          <view class="flex flex-wrap gap-15">
            <view v-for="d in stats" class="w-180 rd-10 flex justify-center items-center p-10"
                  :key="d.id"
                  @click="date=d.id"
                  :style="{'background-color': date===d.id? '#006E1C':(d.total===d.passed? '#D9E7C8':'#EEF0E1')}">
              <text :style="{'font-size': '24rpx', color: date===d.id? 'white':'black'}">{{ d.id }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="w-610 flex flex-col gap-10">
          <view class="flex flex-col">
            <text style="color: #858585; font-size: 20rpx;">已查看</text>
            <view class="flex items-center">
              <view class="h-5"
                    :style="{'background-color': '#FFA600', width: (400 * stat.viewed / stat.total) + 'rpx'}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: (400 * (stat.total - stat.viewed) / stat.total) + 'rpx'}"></view>
              <text class="ml-10" style="color: #858585; font-size: 20rpx;">
                {{ stat.viewed + ' / ' + stat.total + ' = ' + (Math.round((stat.viewed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
          <view class="flex flex-col">
            <text style="color: #858585; font-size: 20rpx;">已通过</text>
            <view class="flex items-center">
              <view class="h-5"
                    :style="{'background-color': '#006E1C', width: (400 * stat.passed / stat.total) + 'rpx'}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: (400 * (stat.total - stat.passed) / stat.total) + 'rpx'}"></view>
              <text class="ml-10" style="color: #858585; font-size: 20rpx;">
                {{ stat.passed + ' / ' + stat.total + ' = ' + (Math.round((stat.passed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
        </view>
        <view class="w-610 rd-40 pt-15 pb-15 flex items-center justify-center"
              @click="toCheck(0)"
              style="background-color: #006E1C">
          <text class="font-bold" style="color: white;font-size: 28rpx;">{{ '前往校验（' + date + '）' }}</text>
        </view>
      </view>
      <view class="w-full" style="height: 60%;">
        <view class="w-full h-30"></view>
        <view class="w-full flex pl-20 gap-10 h-50">
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center"
                @click="dictType='all'"
                :style="{'background-color': dictType==='all'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">全部
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center"
                @click="dictType='viewed'"
                :style="{'background-color': dictType==='viewed'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">已查看
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center"
                @click="dictType='waiting'"
                :style="{'background-color': dictType==='waiting'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">待查看
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center"
                @click="dictType='loading'"
                :style="{'background-color': dictType==='loading'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">加载中
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center"
                @click="dictType='passed'"
                :style="{'background-color': dictType==='passed'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">已通过
          </view>
        </view>
        <view class="w-full h-20"></view>
        <scroll-view scroll-y :show-scrollbar="false" style="height: calc(100% - 100rpx)">
          <view v-for="(dict,i) in _dicts" class="h-75 w-full pl-20 pr-20 pt-10 pb-10 flex items-center"
                :key="dict.id"
                :style="{'background-color': ((i+1)%2===0? '#D9E7C8':'#F8FAF0')}">
            <view class="w-30vw pl-5" @click="toCheck(dict.sort)">
              <text style="font-size: 30rpx;">{{ dict.id }}</text>
            </view>
            <view class="h-20 w-20 rd-20" style="background-color: #EEF0E1"></view>
            <view class="pl-20 pr-10"
                  style="flex: 1;text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 30rpx;">
              {{ meaning(dict) }}
            </view>
            <image class="h-40" mode="heightFix" :src="icon(dict)"></image>
          </view>
          <view class="w-full h-20"></view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
