<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import { isEmpty } from "@/utils/is";
import apiDict from "@/api/apiDict";
import apiLoader from "@/api/apiLoader";
import { networkError } from "@/utils/request";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import Popup from "@/components/Popup.vue";
import { delay } from "@/utils/calls";
import { formatDate } from "date-fns";
import { useTouch } from "@/hooks/useTouch";
import { message } from "@/utils/unis";

const nav = useStore('nav');
let interval;
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(0);
  interval = setInterval(() => {
    let loading = false;
    for (const key in dict.value.loadState) {
      if (dict.value.loadState[key]) {
        loading = true;
        break;
      }
    }
    if (loading) {
      reload();
    }
    if (date.value === formatDate(new Date(), 'yyyy-MM-dd')) {
      apiLoader.stat(date.value)
          .then((data) => {
            stat.value = data.value;
          }).catch(() => networkError());
    }
  }, 1000);
  uni.getSystemInfo().then(rs => {
    width.value = rs.windowWidth;
    height.value = rs.windowHeight;
  });
  date.value = nav.data.value.date;
  if (isEmpty(date.value)) {
    date.value = formatDate(new Date(), 'yyyy-MM-dd');
  }
  apiLoader.stat(date.value)
      .then((data) => {
        stat.value = data.value;
        date.value = stat.value.id;
        apiLoader.byDate(date.value, stat.value.sort)
            .then((data) => {
              dict.value = data.value;
              nav.setShow(true);
            })
            .catch(() => networkError());
      }).catch(() => networkError());
});
onHide(() => {
  if (interval) {
    clearInterval(interval);
  }
});
const dict = ref({} as Word.Dict);
const stat = ref({} as Loader.Stat);
const date = ref('');
const width = ref(0);
const height = ref(0);
const scTop = ref(0);
const reload = () => {
  apiDict.byId(dict.value.id).then((data) => {
    dict.value = data.value;
  }).catch(() => {
    networkError();
  });
}
const loadPart = (part) => {
  if (!dict.value.loadState) {
    dict.value.loadState = {} as any;
  }
  dict.value.loadState[part + 'Loading'] = true;
  apiLoader.loadPart(dict.value.id, part).then(() => {
    reload();
  }).catch(() => networkError());
}
const showRemove = ref(false);
const _removePart = ref('');
const _removePath = ref('');
const onRemovePart = (part, path) => {
  _removePart.value = part;
  _removePath.value = path;
  showRemove.value = true;
};
const removePart = () => {
  apiLoader.removePart(dict.value.id, _removePart.value, _removePath.value)
      .then(() => {
        showRemove.value = false;
        reload();
      }).catch(() => networkError());
};
const pass = () => {
  apiLoader.pass(dict.value.id)
      .then(() => {
        reload();
      }).catch(() => networkError());
};
const loading = computed(() => {
  let ret = false;
  for (const key in dict.value.loadState) {
    if (dict.value.loadState[key]) {
      ret = true;
      break;
    }
  }
  return ret;
});
const move = (i) => {
  const curr = dict.value.sort;
  let next = curr + i;
  if (next < 1) {
    next = stat.value.total;
  }
  if (next > stat.value.total) {
    next = 1;
  }
  apiLoader.byDate(date.value, next)
      .then((data) => {
        scTop.value = 0;
        dict.value = data.value;
        nextTick(() => scTop.value = 0);
      })
      .catch(() => networkError());
};
//-------------- popup ----------------
const showSearch = ref(false);
const searchHeight = ref(0);
const searchWord = ref(dict.value.id);
const search = (w) => {
  searchWord.value = w;
  showSearch.value = true;
  delay(350).then(() => searchHeight.value = height.value - 45);
};
const copy = (txt) => {
  uni.setClipboardData({
    data: txt,
    success: () => {
      message('复制成功', 3);
    }
  })
};

//----------- touch --------------
const { startX, startY, endX, endY, touchStart, touchEnd } = useTouch();
watch(endX, (n, o) => {
  if (Math.abs(startY.value - endY.value) < 30) {
    if (showSearch.value) {
      if (endX.value - startX.value > 20) {
        showSearch.value = false;
      }
    } else if (!showRemove.value) {
      if (endX.value - startX.value > 25) {
        move(-1);
      }
      if (endX.value - startX.value < -25) {
        move(1);
      }
    }
  }
});
</script>

<template>
  <NavigationBar/>
  <view class="container">
    <view class="relative w-full flex items-center justify-between pl-30 p-30 pb-20"
          style="background-color: #EEF0E1;
          height: 15%;
          padding-top: calc(var(--status-bar-height) + 10px);
          box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;">
      <text class="absolute left-15 bottom-10"
            style="color: #858585; font-size: 24rpx;">
        {{ date }}
      </text>
      <view class="flex gap-60">
        <view class="flex flex-col justify-center gap-10"
              style="background-color: #EEF0E1">
          <view class="w-full flex justify-center" style="align-items: flex-end;">
            <view>
              <text style="color: #858585; font-size: 40rpx; margin: auto; display: inline-block">
                {{ dict.sort + ' / ' + stat.total }}
              </text>
            </view>
          </view>
        </view>
        <view class="flex flex-col">
          <view class="flex flex-col mt-10">
            <text style="color: #858585; font-size: 22rpx;">已查看</text>
            <view class="flex items-center">
              <view class="h-5"
                    :style="{'background-color': '#FFA600', width: (250 * stat.viewed / stat.total) + 'rpx'}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: (250 * (stat.total - stat.viewed) / stat.total) + 'rpx'}"></view>
              <text class="ml-3" style="color: #858585; font-size: 22rpx;">
                {{ (Math.round((stat.viewed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
          <view class="flex flex-col mt-5">
            <text style="color: #858585; font-size: 22rpx;">已通过</text>
            <view class="flex items-center">
              <view class="h-5"
                    :style="{'background-color': '#006E1C', width: (250 * stat.passed / stat.total) + 'rpx'}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: (250 * (stat.total - stat.passed) / stat.total) + 'rpx'}"></view>
              <text class="ml-3" style="color: #858585; font-size: 22rpx;">
                {{ (Math.round((stat.passed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view>
        <view v-if="dict.passed" class="flex flex-col justify-center items-center gap-10">
          <image class="w-100" mode="widthFix" src="/static/passed.png"></image>
          <text style="font-size: 20rpx; color: #858585">{{ formatDate(dict.passTime, 'yyyy-MM-dd') }}</text>
        </view>
        <view v-else-if="loading" class="flex flex-col justify-center items-center gap-10">
          <image class="w-80" mode="widthFix" src="/static/loading.gif"></image>
        </view>
        <view v-else class="flex flex-col justify-center items-center gap-10">
          <image class="w-100" mode="widthFix" src="/static/checking.png"></image>
        </view>
      </view>
    </view>
    <scroll-view v-if="nav.data.value.show" class="w-full"
                 scroll-y :show-scrollbar="false"
                 :scroll-top="scTop"
                 @scroll="e => scTop = e.detail.scrollTop"
                 @touchstart="touchStart" @touchend="touchEnd"
                 style="height: 85%;">
      <view class="w-full flex flex-col items-center gap-10">
        <view class="w-full flex items-center justify-center mt-40">
          <text @click="search(dict.id)"
                @longpress="copy(dict.id)"
                class="font-bold" style="font-size: 52rpx">{{ dict.id }}</text>
        </view>
        <view class="relative flex flex-col gap-10 mt-20 w-full h-100 items-center">
          <view class="flex flex-col h-full justify-around">
            <view class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">英</text>
              <text style="font-size: 32rpx;">{{ dict?.usTranscription }}</text>
            </view>
            <view class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">美</text>
              <text style="font-size: 32rpx;">{{ dict?.ukTranscription }}</text>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>中文释义</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('examples')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.meaningLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full pr-30 flex flex-col gap-10">
            <view v-if="!isEmpty(dict.meaning?.nouns)" class="flex gap-10">
              <text style="font-size: 28rpx; color: #858585">【名】</text>
              <text style="font-size: 32rpx;">{{ dict.meaning.nouns }}</text>
              <uni-icons @click="onRemovePart('meaning','nouns')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.verbs)" class="flex gap-10">
              <text style="font-size: 28rpx; color: #858585">【动】</text>
              <text style="font-size: 32rpx;">{{ dict.meaning.verbs }}</text>
              <uni-icons @click="onRemovePart('meaning','verbs')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adverbs)" class="flex gap-10">
              <text style="font-size: 28rpx; color: #858585">【副】</text>
              <text style="font-size: 32rpx;">{{ dict.meaning.adverbs }}</text>
              <uni-icons @click="onRemovePart('meaning','adverbs')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adjectives)" class="flex gap-10">
              <text style="font-size: 28rpx; color: #858585">【形】</text>
              <text style="font-size: 32rpx;">{{ dict.meaning.adjectives }}</text>
              <uni-icons @click="onRemovePart('meaning','adjectives')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>单词变形</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('inflection')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.inflectionLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="flex flex-col gap-10">
            <view v-if="!isEmpty(dict.inflection?.plural)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【复数】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.plural.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','plural')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.thirdPresent)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【第三人称单数】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.thirdPresent.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','thirdPresent')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.past)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【过去式】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.past.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','past')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.perfect)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【过去分词】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.perfect.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','perfect')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.progressive)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【现在分词】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.progressive.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','progressive')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.comparative)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【比较级】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.comparative.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','comparative')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.superlative)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【最高级】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.superlative.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','superlative')" type="close" size="20"
                         color="#ba1a1a"></uni-icons>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>词根词缀</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('struct')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.structLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full pt-10 pb-10 font-bold flex mb-20">
            <text style="font-size: 32rpx; color:#858585">{{ dict.struct?.parts.map(v => v.part).join('') }}</text>
          </view>
          <view class="w-full flex flex-col gap-20">
            <view v-for="(part,i) in dict.struct?.parts" :key="'struct'+i">
              <view class="w-full flex items-center" style="width: calc(100% - 40rpx)">
                <view class="font-bold w-120" style="color: #858585;">
                  {{
                    part.root ? '词根' : (part.prefix ? '前缀' : part.infix ? '中缀' : part.suffix ? '后缀' : '')
                  }}
                </view>
                <view class="font-bold w-180" style="font-size: 32rpx;">{{ part.part }}</view>
                <view class="font-bold"
                      style="color: #858585;font-size: 32rpx; margin-left: 20rpx; flex:1">
                  {{ part.meaningTrans }}
                </view>
              </view>
            </view>
          </view>
          <view class="w-full pt-10 pb-10 font-bold flex mt-20">
            <text style="font-size: 32rpx; color:#858585">{{ dict.struct?.analysisTrans }}</text>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>派生串记</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('derivatives')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.derivativesLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full flex flex-col" style="width: calc(100% - 40rpx)">
            <view v-for="(derivative,i) in dict.derivatives" :key="'derivative'+i">
              <view v-if="derivative.index===0" class="flex items-center">
                <text @click="search(derivative.word)"
                      @longpress="copy(derivative.word)"
                      :class="[derivative.word.includes(dict.id)? 'font-bold':'']"
                      style="font-size: 32rpx;">{{ derivative.word }}
                </text>
                <uni-icons @click="onRemovePart('derivatives',derivative.word)" type="close" size="20"
                           color="#ba1a1a"></uni-icons>
              </view>
              <view v-if="derivative.index>0" class="relative h-60 flex items-center left-10">
                <view :class="['absolute top-0', i===dict.derivatives.length-1? 'h-30':'h-60']"
                      style="border-left: 1px solid black"></view>
                <view v-for="i in derivative.index" :key="'di'+i" class="w-50"
                      style="border-top: 1px solid black"></view>
                <view class="flex items-center justify-center gap-10">
                  <text @click="search(derivative.word)"
                        @longpress="copy(derivative.word)"
                        :class="[derivative.word.includes(dict.id)? 'font-bold':'']"
                        style="font-size: 32rpx; margin-left: 5rpx;">{{ derivative.word }}
                  </text>
                  <uni-icons @click="onRemovePart('derivatives',derivative.word)" type="close" size="20"
                             color="#ba1a1a"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>近反义词</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('synAnts')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.synAntsLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full flex flex-col gap-20 mt-10" style="width: calc(100% - 40rpx)">
            <view class="flex items-center pb-20 pr-20" style="border-bottom: 1px solid #858585;">
              <view class="font-bold w-120" style="color: #858585;">近义词</view>
              <view class="flex flex-wrap">
                <text v-for="synonym in dict.synAnts?.synonyms"
                      @click="search(synonym)"
                      @longpress="copy(synonym)"
                      style="font-size: 32rpx; margin-left: 20rpx; margin-bottom: 10rpx;">
                  {{ synonym }}
                </text>
              </view>
            </view>
            <view class="flex items-center pr-20">
              <view class="font-bold w-120" style="color: #858585;">反义词</view>
              <view class="flex flex-wrap">
                <text v-for="antonym in dict.synAnts?.antonyms"
                      @click="search(antonym)"
                      @longpress="copy(antonym)"
                      style="font-size: 32rpx; margin-left: 20rpx;">
                  {{ antonym }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>相关例句</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('examples')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.examplesLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="flex flex-col gap-30 pl-10 pr-10">
            <view v-for="(ex,i) in dict.examples" :key="'ex'+i"
                  class="w-full pb-10"
                  style="border-bottom: 1px solid #858585;"
            >
              <view class="flex flex-col gap-10">
                <text style="font-size: 32rpx;">{{ ex.sentence }}</text>
                <text style="font-size: 32rpx;">{{ ex.translation }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="w-full h-30"></view>
    </scroll-view>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-750 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="search(dict.id)"
        @longpress="copy(dict.id)"
        style="background-color: #D9E7C8; opacity: .8">
    <uni-icons type="search" size="24" color="black"/>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-600 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="pass"
        style="background-color: #D9E7C8; opacity: .8">
    <uni-icons type="checkmarkempty" size="24" color="black"/>
  </view>
  <Popup :show="showSearch" position="right"
         @touchstart="touchStart" @touchend="touchEnd"
         @clickMask="() => {showSearch=false;searchHeight=0;searchWord=dict.id;}">
    <view class="relative w-85vw h-100vh pl-20 pr-20"
          @touchstart="touchStart" @touchend="touchEnd"
          style="background-color: #F8FAF0; padding-top: 45px;">
      <web-view v-if="showSearch"
                :webview-styles="{width: width*0.85, height: searchHeight, left: width*0.15, top:45}"
                :fullscreen="false"
                :src="'https://www.xxenglish.com/wd/'+searchWord">
      </web-view>
    </view>
  </Popup>
  <Popup :show="showRemove" position="center"
         @clickMask="showRemove=false">
    <view class="w-80vw h-12vh rd-30 flex items-center justify-center" style="background-color: #E8EBDA">
      <text class="font-bold" style="font-size: 36rpx;">删除该项？</text>
      <text @click="removePart" class="absolute bottom-30 right-60 font-bold" style="color:#3F6900; font-size: 32rpx;">
        确定
      </text>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
</style>
