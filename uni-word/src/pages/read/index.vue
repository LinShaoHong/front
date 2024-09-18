<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import {networkError} from "@/utils/request";
import apiLoader from "@/api/apiLoader";
import {isEmpty} from "@/utils/is";
import {delay} from "@/utils/calls";
import {formatDate} from "date-fns";
import {isAPP, isH5} from "@/utils/platform";

const nav = useStore('nav');
const userId = nav.data.value.userId;
const date = ref('');
const stats = ref([] as any);
const dicts = ref([] as any);
const dateId = ref('');
const stat = ref({} as Loader.Stat);
const globalQ = ref(false);
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(1);
  apiLoader.stats(userId)
      .then((data) => {
        stats.value = data.values;
        dateId.value = 'date_none';
        nextTick(() => {
          dateId.value = 'date_' + date.value;
        });
      })
      .catch(() => networkError());
  date.value = nav.data.value.date;
  if (!isEmpty(date.value)) {
    apiLoader.stat(date.value, userId)
        .then((data) => {
          stat.value = data.value;
          if (globalQ.value) {
            const n = searchQ.value;
            if (!isEmpty(n)) {
              apiLoader.search(n).then(data => dicts.value = data.values).catch(() => networkError());
            } else {
              dicts.value = [];
            }
          } else {
            apiLoader.dicts(date.value)
                .then(data => dicts.value = data.values)
                .catch(() => networkError());
          }
        })
        .catch(() => networkError());
  }
});
onLoad(() => {
  apiLoader.stats(userId)
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
  apiLoader.stat(n, userId)
      .then((data) => {
        stat.value = data.value;
        apiLoader.dicts(date.value)
            .then(data => dicts.value = data.values)
            .catch(() => networkError());
      })
      .catch(() => networkError());
});
const toCheck = (d, sort) => {
  nav.setShow(false);
  if (isEmpty(d)) {
    nav.setDate(date.value);
  } else {
    date.value = d;
    nav.setDate(d);
  }
  delay(200).then(() => {
    apiLoader.dict(date.value, sort, userId).then(() => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }).catch(() => networkError());
  });
};
const meaning = (dict) => {
  let arr: string[] = []
  if (!isEmpty(dict.meaning?.nouns)) {
    arr.push('n. ' + dict.meaning.nouns);
  }
  if (!isEmpty(dict.meaning?.verbs)) {
    arr.push('v. ' + dict.meaning.verbs);
  }
  if (!isEmpty(dict.meaning?.adjectives)) {
    arr.push('adj. ' + dict.meaning.adjectives);
  }
  if (!isEmpty(dict.meaning?.adverbs)) {
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
const searchQ = ref('');
const dictType = ref('all');
const _dicts = computed(() => {
  switch (dictType.value) {
    case 'waiting':
      return dicts.value.filter(d => !d.viewed && (isEmpty(searchQ.value) || d.id.includes(searchQ.value)));
    case 'loading':
      return dicts.value.filter(d => isLoading(d) && (isEmpty(searchQ.value) || d.id.includes(searchQ.value)));
    case 'noPass':
      return dicts.value.filter(d => !d.passed && (isEmpty(searchQ.value) || d.id.includes(searchQ.value)));
    case 'passed':
      return dicts.value.filter(d => d.passed && (isEmpty(searchQ.value) || d.id.includes(searchQ.value)));
    default:
      return dicts.value.filter(d => isEmpty(searchQ.value) || d.id.includes(searchQ.value));
  }
});
watch(searchQ, (n, o) => {
  if (globalQ.value) {
    if (!isEmpty(n)) {
      apiLoader.search(n).then(data => dicts.value = data.values).catch(() => networkError());
    } else {
      dicts.value = [];
    }
  }
});
watch(globalQ, (n, o) => {
  if (!n) {
    apiLoader.dicts(date.value)
        .then(data => dicts.value = data.values)
        .catch(() => networkError());
  } else {
    const n = searchQ.value;
    if (!isEmpty(n)) {
      apiLoader.search(n).then(data => dicts.value = data.values).catch(() => networkError());
    } else {
      dicts.value = [];
    }
  }
});

onShareAppMessage(async () => {
  return {
    title: '',
    imageUrl: '',
    path: 'pages/read/index'
  }
});
</script>

<template>
  <NavigationBar/>
  <view class="page_container">
    <view class="h-full">
      <view class="relative w-full p-30 flex flex-col items-center justify-between"
            :style="{height: isAPP? '35%':'45%',
            'background-color': '#EEF0E1',
            'padding-top': 'calc(var(--status-bar-height) + 10px)',
            'border-radius': '0 0 30rpx 30rpx',
            'box-shadow': 'rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0'}">
        <scroll-view scroll-y :show-scrollbar="false"
                     :scroll-into-view="dateId"
                     style="background-color: white;"
                     :class="['h-200 rd-10 p-20', isAPP? 'w-610':'w-1195']">
          <view class="flex flex-wrap gap-15">
            <view v-for="sta in stats"
                  class="relative w-180 h-50 rd-5 flex justify-center items-center p-10 cursor-pointer"
                  :id="'date_'+sta.date"
                  :key="sta.id"
                  @click="date=sta.date"
                  :style="{'background-color': date===sta.date? '#006E1C':(sta.total===sta.passed && sta.total > 0? '#D9E7C8':'#EEF0E1')}">
              <text class="z-100" :style="{'font-size': '24rpx', color: date===sta.date? 'white':'black'}">{{
                  sta.date
                }}
              </text>
              <view v-if="date!==sta.date && sta.passed!==sta.total" class="absolute h-50 left-0 rd-5"
                    :style="{width:(180 * sta.passed / sta.total) + 'rpx','background-color': '#D9E7C8'}">
              </view>
            </view>
          </view>
        </scroll-view>
        <view :class="['mt-20 flex flex-col gap-10', isAPP? 'w-610':'w-1195']">
          <view class="flex flex-col">
            <text style="color: #858585; font-size: 22rpx;">已查看</text>
            <view class="flex items-center">
              <view class="h-7"
                    :style="{'background-color': '#FFA600', width: (400 * stat.viewed / stat.total) + 'rpx'}"></view>
              <view class="h-7"
                    :style="{'background-color': 'white', width: (400 * (stat.total - stat.viewed) / stat.total) + 'rpx'}"></view>
              <text class="ml-10" style="color: #858585; font-size: 22rpx;">
                {{ stat.viewed + ' / ' + stat.total + ' = ' + (Math.round((stat.viewed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
          <view class="flex flex-col">
            <text style="color: #858585; font-size: 22rpx;">已通过</text>
            <view class="flex items-center">
              <view class="h-7"
                    :style="{'background-color': '#006E1C', width: (400 * stat.passed / stat.total) + 'rpx'}"></view>
              <view class="h-7"
                    :style="{'background-color': 'white', width: (400 * (stat.total - stat.passed) / stat.total) + 'rpx'}"></view>
              <text class="ml-10" style="color: #858585; font-size: 22rpx;">
                {{ stat.passed + ' / ' + stat.total + ' = ' + (Math.round((stat.passed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
        </view>
        <view :class="['rd-40 mt-20 pt-15 pb-15 flex items-center justify-center cursor-pointer', isAPP? 'w-610':'w-1195']"
              @click="toCheck(null,0)"
              style="background-color: #006E1C">
          <text class="font-bold" style="color: white;font-size: 28rpx;">{{ '前往校验（' + date + '）' }}</text>
        </view>
      </view>
      <view class="w-full" :style="{height: isAPP? '65%':'55%'}">
        <view class="w-full h-30"></view>
        <view class="w-full flex pl-20 gap-10 h-50">
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center cursor-pointer"
                @click="dictType='all'"
                :style="{'background-color': dictType==='all'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">全部
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center cursor-pointer"
                @click="dictType='waiting'"
                :style="{'background-color': dictType==='waiting'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">未查看
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center cursor-pointer"
                @click="dictType='noPass'"
                :style="{'background-color': dictType==='noPass'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">未通过
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center cursor-pointer"
                @click="dictType='loading'"
                :style="{'background-color': dictType==='loading'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">加载中
          </view>
          <view class="pl-20 pr-20 pt-5 pb-5 rd-10 flex items-center justify-center cursor-pointer"
                @click="dictType='passed'"
                :style="{'background-color': dictType==='passed'? '#D9E7C8':'#EEF0E1', 'font-size': '24rpx'}">已通过
          </view>
        </view>
        <view class="w-full h-20"></view>
        <view :class="['h-75 rd-60 p-20 pr-0 ml-20 flex items-center justify-between', isAPP?'w-78vw':'w-50vw']"
              style="background-color: white">
          <input class="text-left"
                 :ignore-composition-event="false"
                 placeholder="search"
                 placeholder-style="font-size: 28rpx; color:#858585"
                 type="textarea"
                 style="font-size: 30rpx; flex:1"
                 v-model="searchQ"
                 confirm-type="search"/>
          <image v-if="!isEmpty(searchQ)"
                 @click="searchQ=''"
                 class="w-30 mr-10 cursor-pointer" mode="widthFix" src="/static/clear.png"></image>
          <view class="flex justify-center">
            <switch v-if="globalQ" checked :color="'#006E1C'" style="transform:scale(0.6);" @change="globalQ=!globalQ"/>
            <switch v-if="!globalQ" :color="'#006E1C'" style="transform:scale(0.6);" @change="globalQ=!globalQ"/>
          </view>
        </view>
        <view class="w-full h-20"></view>
        <scroll-view scroll-y :show-scrollbar="false" style="height: calc(100% - 180rpx)">
          <view v-for="(dict,i) in _dicts" class="h-80 w-full pl-20 pr-20 pt-10 pb-10 flex items-center"
                :key="dict.id"
                :style="{'background-color': ((i+1)%2===0? '#D9E7C8':'#F8FAF0')}">
            <view :class="['pl-5 pr-10 cursor-pointer', isAPP? 'min-w-30vw':'min-w-10vw']"
                  @click="toCheck(formatDate(dict.loadTime,'yyyy-MM-dd'), dict.sort)">
              <text style="font-size: 32rpx;">{{ dict.id }}</text>
            </view>
            <view class="h-20 w-20 rd-20"
                  :style="{'background-color': dict.sort===stat.sort? '#FFA600':'#EEF0E1'}"></view>
            <view class="pl-20 pr-10"
                  style="flex: 1;text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 32rpx;">
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
