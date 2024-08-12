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
import { modal } from "@/utils/unis";

const nav = useStore('nav');
const mean = useStore('mean');
const userId = nav.data.value.userId;
let interval;
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(0);
  root.value = '';
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
  }, 1000);
  uni.getSystemInfo().then(rs => {
    width.value = rs.windowWidth;
    height.value = rs.windowHeight;
  });
  date.value = nav.data.value.date;
  if (isEmpty(date.value)) {
    apiLoader.dict(date.value, null, userId)
        .then((data) => {
          dict.value = data.value;
          loadMean();
          date.value = formatDate(dict.value.loadTime, 'yyyy-MM-dd');
          nav.setDate(date.value);
          apiLoader.stat(date.value, userId)
              .then((data) => {
                stat.value = data.value;
                nav.setShow(true);
              }).catch(() => networkError());
          apiLoader.affix(dict.value.id).then(data => affix.value = data.value).catch((err) => networkError());
        }).catch(() => networkError());
  } else {
    apiLoader.stat(date.value, userId)
        .then((data) => {
          stat.value = data.value;
          date.value = stat.value.date;
          nav.setDate(date.value);
          apiLoader.dict(date.value, stat.value.sort, userId)
              .then((data) => {
                dict.value = data.value;
                loadMean();
                nav.setShow(true);
                apiLoader.affix(dict.value.id).then(data => affix.value = data.value).catch((err) => networkError());
              })
              .catch(() => networkError());
        }).catch(() => networkError());
  }
});
onHide(() => {
  if (interval) {
    clearInterval(interval);
  }
});

const dict = ref({} as Word.Dict);
const affix = ref({} as any);
const stat = ref({} as Loader.Stat);
const date = ref('');
const width = ref(0);
const height = ref(0);
const scTop = ref(0);
const scId = ref('');
const reload = () => {
  apiDict.byId(dict.value.id).then((data) => {
    dict.value = data.value;
    loadMean();
    apiLoader.stat(date.value, userId)
        .then((data) => {
          stat.value = data.value;
        }).catch(() => networkError());
  }).catch(() => {
    networkError();
  });
}
const loadMean = () => {
  dict.value.derivatives.forEach(d => {
    mean.fetch(d.word);
  });
};
const root = ref('');
const derivative = ref('');
const moveWord = ref('');
const showDerivativeMean = ref(false);
const derivativesMeans = ref({} as Map<string, boolean>);
const loadPart = (part, attr?) => {
  if (!dict.value.loadState) {
    dict.value.loadState = {} as any;
  }
  if (dict.value.loadState[part + 'Loading']) {
    return;
  }
  dict.value.loadState[part + 'Loading'] = true;
  apiLoader.loadPart(dict.value.id, part, attr, userId).then(() => {
    reload();
  }).catch(() => networkError());
}
const addDerivative = () => {
  if (!isEmpty(derivative.value)) {
    apiLoader.addDerivative(dict.value.id, moveWord.value, derivative.value).then(() => {
      reload();
    }).catch(() => networkError());
  }
};
const showRemove = ref(false);
const _removePart = ref('');
const _removePath = ref('');
const onRemovePart = (part, path) => {
  if (!isEmpty(moveWord.value)) {
    return;
  }
  _removePart.value = part;
  _removePath.value = path;
  showRemove.value = true;
};
const remove = () => {
  modal('删除该单词？', '', true).then(() => {
    apiLoader.remove(dict.value.id).then((d) => {
      apiLoader.dict(date.value, d.value, userId)
          .then((data) => {
            dict.value = data.value;
            date.value = formatDate(dict.value.loadTime, 'yyyy-MM-dd');
            nav.setDate(date.value);
            apiLoader.stat(date.value, userId)
                .then((data) => {
                  stat.value = data.value;
                  nav.setShow(true);
                }).catch(() => networkError());
            apiLoader.affix(dict.value.id).then(data => affix.value = data.value).catch((err) => networkError());
          }).catch(() => networkError());
    }).catch((err) => console.log(err));
  });
};
const removePart = () => {
  apiLoader.removePart(dict.value.id, _removePart.value, _removePath.value, userId)
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
const structBlur = () => {
  apiLoader.editStruct(dict.value.id, dict.value.struct)
      .then(() => reload())
      .catch(() => networkError());
};
const meaningBlur = () => {
  apiLoader.editMeaning(dict.value.id, dict.value.meaning)
      .then(() => reload())
      .catch(() => networkError());
};
const moveDerivative = (op) => {
  apiLoader.moveDerivative(dict.value.id, moveWord.value, op)
      .then(() => {
        apiDict.byId(dict.value.id).then((data) => {
          dict.value = data.value;
          scId.value = 'derivative_none';
          nextTick(() => {
            const query = uni.createSelectorQuery();
            query.selectViewport().boundingClientRect();
            query.select(`#derivative_${ moveWord.value }`).boundingClientRect();
            query.exec(res => {
              const viewPort = res[0];
              const itemRect = res[1];
              console.log(res);
              if (itemRect.bottom < 150 || itemRect.bottom > viewPort.height - 150) {
                scId.value = 'derivative_' + moveWord.value;
                nextTick(() => {
                  delay(200).then(() => scTop.value = scTop.value - 250);
                });
              }
            });
          });
          loadMean();
        }).catch(() => {
          networkError();
        });
      }).catch(() => networkError());
}
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
  apiLoader.dict(date.value, next, userId)
      .then((data) => {
        scTop.value = 0;
        dict.value = data.value;
        showDerivativeMean.value = false;
        loadMean();
        root.value = '';
        apiLoader.affix(dict.value.id).then(data => affix.value = data.value).catch((err) => networkError());
        nextTick(() => scTop.value = 0);
      })
      .catch(() => networkError());
};
//-------------- popup ----------------
const showSearch = ref(false);
const searchHeight = ref(0);
const searchType = ref(1);
const searchWord = ref(dict.value.id);
const searchSrc = computed(() => {
  switch (searchType.value) {
    case 1:
      return 'https://www.xxenglish.com/wd/' + searchWord.value;
    case 2:
      return 'https://dict.youdao.com/result?lang=en&word=' + searchWord.value;
    case 3:
      return 'https://www.iciba.com/word?w=' + searchWord.value;
    case 4:
      return 'https://www.dictionary.com/browse/' + searchWord.value;
    case 5:
      return 'https://www.collinsdictionary.com/dictionary/english/' + searchWord.value;
    case 6:
      return 'https://www.oxfordlearnersdictionaries.com/definition/english/' + searchWord.value + '_1?q=' + searchWord.value;
    case 7:
      return 'https://www.ldoceonline.com/dictionary/' + searchWord.value;
    default:
      return 'https://www.xxenglish.com/wd/' + searchWord.value;
  }
});
const search = (w) => {
  if(isEmpty(moveWord)) {
    searchWord.value = w;
    showSearch.value = true;
    delay(350).then(() => searchHeight.value = height.value - 100);
  }
};
const copy = (txt) => {
  uni.setClipboardData({
    data: txt,
    showToast: false
  })
};

const copyAffixAI = (txt) => {
  uni.setClipboardData({
    data: '分析下单词' + dict.value.id + "的词根词缀",
    showToast: false
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
                 :scroll-into-view="scId"
                 :scroll-top="scTop"
                 @scroll="e => scTop = e.detail.scrollTop"
                 @touchstart="touchStart" @touchend="touchEnd"
                 style="height: 85%;">
      <view class="w-full flex flex-col items-center gap-10">
        <view class="w-full flex items-center justify-center mt-40">
          <text @click="search(dict.id)"
                @longpress="copy(dict.id)"
                class="font-bold" style="font-size: 52rpx">{{ dict.id }}
          </text>
        </view>
        <view class="relative flex flex-col gap-10 mt-20 w-full h-100 items-center">
          <view class="flex flex-col h-full justify-around">
            <view class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">英</text>
              <text style="font-size: 32rpx;">{{ dict?.ukPhonetic }}</text>
            </view>
            <view class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">美</text>
              <text style="font-size: 32rpx;">{{ dict?.usPhonetic }}</text>
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
                  @click="loadPart('meaning')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.meaningLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full pr-30 flex flex-col gap-10">
            <view v-if="!isEmpty(dict.meaning?.nouns)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【名】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.nouns"
                        class="pr-30"
                        style="resize: none;font-size: 32rpx;width: 60%;"/>
              <uni-icons @click="onRemovePart('meaning','nouns')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.verbs)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【动】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.verbs"
                        class="pr-30"
                        style="resize: none;font-size: 32rpx;width: 60%;"/>
              <uni-icons @click="onRemovePart('meaning','verbs')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adverbs)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【副】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.adverbs"
                        class="pr-30"
                        style="resize: none;font-size: 32rpx;width: 60%;"/>
              <uni-icons @click="onRemovePart('meaning','adverbs')" type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adjectives)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【形】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.adjectives"
                        class="pr-30"
                        style="resize: none;font-size: 32rpx;width: 60%;"/>
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
            <view class="h-50 pl-10 pr-20 rd-20 font-bold mb-10 flex items-center justify-center "
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <input class="text-left w-230"
                     :ignore-composition-event="false"
                     style="font-size: 28rpx; font-weight: bold;"
                     v-model="root"/>
              <image v-if="!isEmpty(root)"
                     @click="root=''"
                     class="w-30 mr-20" mode="widthFix" src="/static/clear.png"></image>
              <image :src="dict.loadState?.structLoading? '/static/loading.gif':'/static/get.png'"
                     class="w-25"
                     @click="loadPart('struct',{root: root})"
                     mode="widthFix"></image>
            </view>
            <uni-icons @click="onRemovePart('struct','')" type="close" size="20"
                       color="#ba1a1a"></uni-icons>
          </view>
          <view class="w-200 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                @click="copyAffixAI"
                style="color: white; background-color: #006E1C; font-size: 24rpx;">
            <text>复制AI提示词</text>
          </view>
          <view v-if="!isEmpty(affix?.root)" class="w-full pt-10 pb-10 flex gap-10 mt-5">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%;">{{
                '词根: ' + affix.root + '\n' + affix.rootDesc + '\n' + affix.wordDesc
              }}
            </text>
          </view>
          <view v-if="!isEmpty(affix?.gptRoot)" class="w-full pt-10 pb-10 flex gap-10 mt-5">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%;">{{ affix?.gptRoot }}</text>
          </view>
          <view v-if="!isEmpty(affix?.gptAffix)" class="w-full pt-10 pb-10 flex gap-10">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%;">{{ affix?.gptAffix }}</text>
          </view>
          <view v-if="dict.struct" class="w-full flex flex-col gap-20 mt-10">
            <view v-for="(part,i) in dict.struct?.parts" :key="'struct'+i">
              <view class="w-full flex" style="width: calc(100% - 40rpx); align-items: flex-start">
                <input class="text-left w-120"
                       disabled
                       :ignore-composition-event="false"
                       style="font-size: 32rpx; font-weight: bold;color:#D5D5D5"
                       :value="part.root ? 'root' : (part.prefix ? 'prefix' : part.infix ? 'infix' : part.suffix ? 'suffix' : '')"/>
                <input class="text-left w-180"
                       @blur="structBlur"
                       :ignore-composition-event="false"
                       style="font-size: 32rpx; font-weight: bold;"
                       v-model="dict.struct.parts[i].part"/>
                <textarea auto-height
                          @blur="structBlur"
                          :maxlength="500"
                          :adjust-position="false"
                          v-model="part.meaningTrans"
                          class="pr-30"
                          style="font-size: 32rpx; resize: none;color: #858585;font-size: 32rpx;flex:1"/>
              </view>
            </view>
            <view v-if="!isEmpty(dict.struct.analysis)" class="w-full pt-10 pb-10 flex gap-10">
              <view class="w-5" style="background-color: #D5D5D5;"></view>
              <textarea auto-height
                        @blur="structBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.struct.analysis"
                        class="pr-30"
                        style="font-size: 32rpx; resize: none;color: #858585;font-size: 32rpx;"/>
            </view>
            <view v-if="!isEmpty(dict.struct.history)" class="w-full pt-10 pb-10 flex gap-10">
              <view class="w-5" style="background-color: #D5D5D5;"></view>
              <textarea auto-height
                        @blur="structBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.struct.history"
                        class="pr-30"
                        style="font-size: 32rpx; resize: none;color: #858585;font-size: 32rpx;"/>
            </view>
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
          <view class="flex items-center">
            <view class="w-330 h-50 pl-10 pr-20 rd-20 font-bold mb-10 flex items-center justify-between "
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <input class="text-left w-230"
                     :ignore-composition-event="false"
                     style="font-size: 28rpx; font-weight: bold;"
                     v-model="derivative"/>
              <image v-if="!isEmpty(derivative)"
                     @click="derivative=''"
                     class="w-30 mr-20" mode="widthFix" src="/static/clear.png"></image>
              <uni-icons @click="addDerivative" type="plusempty" size="16" color="black"/>
            </view>
            <view class="flex justify-center">
              <switch v-if="showDerivativeMean" checked :color="'#D9E7C8'" style="transform:scale(0.6);"
                      @change="() => {showDerivativeMean=false;derivativesMeans={};}"/>
              <switch v-if="!showDerivativeMean" :color="'#D9E7C8'" style="transform:scale(0.6);"
                      @change="showDerivativeMean=true"/>
            </view>
          </view>
          <view class="w-full flex flex-col" style="width: calc(100% - 40rpx)">
            <view v-for="(derivative,i) in dict.derivatives" :key="'derivative'+i" :id="'derivative_'+derivative.word">
              <view v-if="derivative.index===0" class="flex items-center gap-10">
                <view class="flex flex-col gap-2">
                  <text @click="search(derivative.word)"
                        @longpress="copy(derivative.word)"
                        :class="[derivative.word.includes(dict.id) || moveWord===derivative.word? 'font-bold':'']"
                        :style="{'font-size': '32rpx', color: moveWord===derivative.word? '#006E1C':''}">
                    {{ derivative.word }}
                  </text>
                  <view v-if="showDerivativeMean || derivativesMeans[derivative.word]" class="pl-5 max-w-300"
                        style="color:#858585; font-size:26rpx;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                    {{ mean.data.value.ws[derivative.word] }}
                  </view>
                </view>
                <uni-icons @click="onRemovePart('derivatives',derivative.word)" type="close" size="20"
                           color="#ba1a1a"></uni-icons>
                <uni-icons @click="onRemovePart('derivatives',derivative.word+':sub')" type="clear" size="20"
                           color="#ba1a1a"></uni-icons>
                <image
                    @click="() => {derivativesMeans[derivative.word]=!derivativesMeans[derivative.word];
                      if(moveWord===derivative.word){moveWord=''} else
                      {derivativesMeans[moveWord]=false;if(isEmpty(moveWord)) {moveWord=derivative.word;}}}"
                    src="/static/move.png" class="w-40" mode="widthFix"></image>
              </view>
              <view v-if="derivative.index>0"
                    :class="['relative flex items-center left-10', showDerivativeMean? 'h-80':'h-60']">
                <view
                    :class="['absolute top-0', i===dict.derivatives.length-1? (showDerivativeMean? 'h-40':'h-30'):(showDerivativeMean? 'h-80':'h-60')]"
                    style="border-left: 1px solid #D5D5D5"></view>
                <view v-for="i in derivative.index" :key="'di'+i" class="w-50"
                      style="border-top: 1px solid #D5D5D5"></view>
                <view class="flex items-center justify-center gap-10">
                  <view class="flex flex-col gap-2">
                    <text @click="search(derivative.word)"
                          @longpress="copy(derivative.word)"
                          :class="['ml-5', derivative.word.includes(dict.id) || moveWord===derivative.word? 'font-bold':'']"
                          :style="{'font-size': '32rpx', color: moveWord===derivative.word? '#006E1C':''}">
                      {{ derivative.word }}
                    </text>
                    <view v-if="showDerivativeMean || derivativesMeans[derivative.word]" class="pl-5 max-w-300"
                          style="color:#858585; font-size:26rpx;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      {{
                        mean.data.value.ws[derivative.word]
                      }}
                    </view>
                  </view>
                  <uni-icons @click="onRemovePart('derivatives',derivative.word)" type="close" size="20"
                             color="#ba1a1a"></uni-icons>
                  <uni-icons @click="onRemovePart('derivatives',derivative.word+':sub')" type="clear" size="20"
                             color="#ba1a1a"></uni-icons>
                  <image
                      @click="() => {derivativesMeans[derivative.word]=!derivativesMeans[derivative.word];
                        if(moveWord===derivative.word){moveWord=''} else
                        {derivativesMeans[moveWord]=false;if(isEmpty(moveWord)) {moveWord=derivative.word;}}}"
                      src="/static/move.png" class="w-40" mode="widthFix"></image>
                </view>
              </view>
            </view>
          </view>

          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-390 w-100 h-100 rd-100 flex items-center justify-center z-1"
                @click="moveDerivative('up')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 50rpx)">
            <uni-icons type="arrow-up" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-210 w-100 h-100 rd-100 flex items-center justify-center  z-1"
                @click="moveDerivative('down')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 50rpx)">
            <uni-icons type="arrow-down" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-300 w-100 h-100 rd-100 flex items-center justify-center  z-1"
                @click="moveDerivative('left')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 160rpx)">
            <uni-icons type="arrow-left" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-300 w-100 h-100 rd-100 flex items-center justify-center  z-1"
                @click="moveDerivative('right')"
                style="background-color: #D9E7C8; opacity: .5; right: calc(50vw - 160rpx)">
            <uni-icons type="arrow-right" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)" class="fixed bottom-320 w-60 h-60 rd-60 flex items-center justify-center  z-1"
                @click="() => {if(derivativesMeans[moveWord]) derivativesMeans[moveWord]=false;moveWord='';}"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 30rpx)">
            <uni-icons type="checkmarkempty" size="24" color="#433F3F"/>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>同义辨析</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('differs')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.differsLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="flex flex-col gap-25">
            <view v-for="differ in dict.differs"
                  class="flex flex-col gap-10"
                  :key="'differ'+differ.word">
              <view class="flex gap-10 pl-12">
                <text @click="search(differ.word)" class="font-bold" style="font-size: 32rpx;">{{ differ.word }}</text>
                <uni-icons @click="onRemovePart('differs',differ.word)" type="close" size="20"
                           color="#ba1a1a"></uni-icons>
              </view>
              <view class="flex gap-10">
                <div style="font-size: 28rpx; color: #858585">【定义】</div>
                <text style="font-size: 32rpx;width: 70%">{{ differ.definition }}</text>
              </view>
              <view class="w-full flex gap-10">
                <div style="font-size: 28rpx; color: #858585; display: inline-block">【场景】</div>
                <text style="font-size: 32rpx; width: 70%">{{ differ.scenario }}</text>
              </view>
              <div style="font-size: 28rpx; color: #858585; display: inline-block">【例句】</div>
              <view v-for="ex in differ.examples" class="w-full pl-10 pb-10 mt-10 flex flex-col gap-10">
                <text class="pl-5" style="font-size: 32rpx; width: 90%;">{{ ex.sentence }}</text>
                <view class="flex gap-10 pl-8">
                  <view class="w-5" style="background-color: #D5D5D5"></view>
                  <text style="font-size: 32rpx; color: #858585; width:80%;">{{ ex.translation }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full pl-30 mt-30">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>短语词组</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "
                  @click="loadPart('phrases')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.phrasesLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full flex flex-col mt-10" style="width: calc(100% - 40rpx)">
            <view v-for="(phrase,i) in dict.phrases"
                  :key="'phrase'+i"
                  class="w-full pl-20 pr-20 pt-10 pb-10 flex flex-col justify-center gap-5">
              <view class="pl-5 flex items-center gap-5">
                <text style="font-size: 32rpx;">{{ phrase.en }}</text>
                <uni-icons @click="onRemovePart('phrases',phrase.en)" type="close" size="20"
                           color="#ba1a1a"></uni-icons>
              </view>
              <view class="flex gap-10 pl-8">
                <view class="w-5" style="background-color: #D5D5D5"></view>
                <text style="font-size: 32rpx; color: #858585; width:80%;">{{ phrase.zh }}</text>
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
            <view class="flex items-center pb-20 pr-20" style="border-bottom: 1px solid #D5D5D5;">
              <view class="font-bold w-120" style="color: #858585; display: inline-block">近义词</view>
              <view class="flex flex-wrap" style="flex:1">
                <div v-for="synonym in dict.synAnts?.synonyms"
                     class="flex items-center"
                     style="font-size: 32rpx; margin-left: 20rpx;">
                  <text @click="search(synonym)" @longpress="copy(synonym)">{{ synonym }}</text>
                  <uni-icons @click="onRemovePart('synonym',synonym)" type="close" size="20"
                             color="#ba1a1a"></uni-icons>
                </div>
              </view>
            </view>
            <view class="flex items-center pr-20">
              <view class="font-bold w-120" style="color: #858585; display: inline-block">反义词</view>
              <view class="flex flex-wrap" style="flex:1">
                <div v-for="antonym in dict.synAnts?.antonyms"
                     class="flex items-center"
                     style="font-size: 32rpx; margin-left: 20rpx;">
                  <text @click="search(antonym)" @longpress="copy(antonym)">{{ antonym }}</text>
                  <uni-icons @click="onRemovePart('antonym',antonym)" type="close" size="20"
                             color="#ba1a1a"></uni-icons>
                </div>
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
                  class="w-full pb-10">
              <view class="flex flex-col gap-10">
                <text style="font-size: 32rpx; width: 90%">{{ ex.sentence }}</text>
                <view class="flex gap-10">
                  <view class="w-5" style="background-color: #D5D5D5;"></view>
                  <text style="font-size: 32rpx; color: #858585; width: 80%;">{{ ex.translation }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="w-full h-30"></view>
    </scroll-view>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-1050 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="remove"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="trash" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-900 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="search(dict.id)"
        @longpress="copy(dict.id)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="search" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-750 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="move(1)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="right" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show"
        class="fixed bottom-600 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="move(-1)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="left" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show && !dict.passed && !loading"
        class="fixed bottom-450 right-60 w-100 h-100 rd-100 flex items-center justify-center"
        @click="pass"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="checkmarkempty" size="24" color="#858585"/>
  </view>
  <Popup :show="showSearch" position="right"
         @touchstart="touchStart" @touchend="touchEnd"
         @clickMask="() => {showSearch=false;searchHeight=0;searchWord=dict.id;searchType=1;searchSrc='https://www.xxenglish.com/wd/'+searchWord}">
    <view class="relative w-85vw h-100vh pl-20 pr-20"
          @touchstart="touchStart" @touchend="touchEnd"
          style="background-color: #F8FAF0; padding-top: 45px;">
      <view class="flex pb-15 flex-wrap gap-15" style="align-items: flex-end; height: 55px;">
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=1;"
              :style="{'background-color': searchType===1? '#006E1C':'#D9E7C8',color:searchType===1?'white':'black'}">XX
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=2;"
              :style="{'background-color': searchType===2? '#006E1C':'#D9E7C8',color:searchType===2?'white':'black'}">有道
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=3;"
              :style="{'background-color': searchType===3? '#006E1C':'#D9E7C8',color:searchType===3?'white':'black'}">金山
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=4;"
              :style="{'background-color': searchType===4? '#006E1C':'#D9E7C8',color:searchType===4?'white':'black'}">
          Dictionary
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=5;"
              :style="{'background-color': searchType===5? '#006E1C':'#D9E7C8',color:searchType===5?'white':'black'}">
          Collins
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=6;"
              :style="{'background-color': searchType===6? '#006E1C':'#D9E7C8',color:searchType===6?'white':'black'}">
          Oxford
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000"
              @click="searchType=7;"
              :style="{'background-color': searchType===7? '#006E1C':'#D9E7C8',color:searchType===7?'white':'black'}">
          Longman
        </view>
      </view>
      <web-view v-if="showSearch"
                :webview-styles="{width: width*0.85, height: searchHeight, left: width*0.15, top:100}"
                :fullscreen="false"
                :src="searchSrc">
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
