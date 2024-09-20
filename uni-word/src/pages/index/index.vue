<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import {isEmpty} from "@/utils/is";
import apiDict from "@/api/apiDict";
import apiLoader from "@/api/apiLoader";
import {networkError} from "@/utils/request";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import Popup from "@/components/Popup.vue";
import {delay} from "@/utils/calls";
import {formatDate} from "date-fns";
import {useTouch} from "@/hooks/useTouch";
import {modal} from "@/utils/unis";
import {isAPP, isH5} from "@/utils/platform";

const nav = useStore('nav');
const userId = nav.data.value.userId;
let interval;
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(0);
  if (isH5) {
    document.onkeydown = onKeyDown;
  }
  root.value = '';
  useMaxModel.value = false;
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
    apiLoader.dict(date.value, '', userId)
        .then((data) => {
          dict.value = data.value;
          reloadTree();
          reloadRoots();
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
                reloadTree();
                reloadRoots();
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
const oscTop = ref(0);
const scId = ref('');
const reload = () => {
  apiDict.byId(dict.value.id).then((data) => {
    dict.value = data.value;
    apiLoader.stat(date.value, userId)
        .then((data) => {
          stat.value = data.value;
        }).catch(() => networkError());
    reloadTree();
    reloadRoots();
  }).catch(() => {
    networkError();
  });
}
const root = ref('');
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
const useMaxModel = ref(false);
const showRemove = ref(false);
const _removePart = ref('');
const _removePath = ref('');
const _removeAttr = ref({});
const onRemovePart = (part, path, prompt?, attr?) => {
  if (!isEmpty(moveWord.value)) {
    return;
  }
  _removePart.value = part;
  _removePath.value = path;
  _removeAttr.value = attr;
  if (prompt === undefined || prompt) {
    showRemove.value = true;
  } else {
    removePart();
  }
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
    }).catch(() => networkError());
  });
};
const removePart = () => {
  apiLoader.removePart(dict.value.id, _removePart.value, _removePath.value, _removeAttr.value, userId)
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

const dictLoading = ref(false);
const move = (i) => {
  const curr = dict.value.sort;
  let next = curr + i;
  if (next < 1) {
    next = stat.value.total;
  }
  if (next > stat.value.total) {
    next = 1;
  }
  dictLoading.value = true;
  apiLoader.dict(date.value, next, userId)
      .then((data) => {
        dictLoading.value = true.false;
        scTop.value = 0;
        dict.value = data.value;
        showDerivativeMean.value = false;
        removeDerivativePrompt.value = true;
        root.value = '';
        apiLoader.affix(dict.value.id).then(data => affix.value = data.value).catch((err) => networkError());
        scTop.value = oscTop.value;
        nextTick(() => scTop.value = 0);
        reloadTree();
        reloadRoots();
      })
      .catch(() => {
        dictLoading.value = true.false;
        networkError();
      });
};

//----------------- differs ----------------
const differs = ref([] as Word.Diff[]);
watch(dict, (n, o) => {
  apiLoader.differs(dict.value.id).then(data => differs.value = data.values).catch(() => networkError());
});

//----------------- derivatives ----------------
const flat = ref(true);
const flats = ref({} as Map);
const subFlats = ref({} as Map);
const onFlat = () => {
  if (flat.value) {
    flats.value = {};
    subFlats.value = {};
    flat.value = false;
  } else {
    flat.value = true;
  }
};
const onFlats = (w) => {
  let _i = 0;
  for (let i = 0; i < tree.value.derivatives.length; i++) {
    if (tree.value.derivatives[i].word === w) {
      _i = i;
      break;
    }
  }
  for (let j = _i + 1; j < tree.value.derivatives.length; j++) {
    if (tree.value.derivatives[j].index > 1) {
      subFlats.value[tree.value.derivatives[j].word] = !flats.value[w];
    } else {
      break;
    }
  }
  flats.value[w] = !flats.value[w];
};
const hasFlat = (w) => {
  let _i = 0;
  for (let i = 0; i < tree.value.derivatives.length; i++) {
    if (tree.value.derivatives[i].word === w) {
      _i = i;
      break;
    }
  }
  return _i < tree.value.derivatives.length - 1 && tree.value.derivatives[_i + 1].index > 1;
};

const roots = ref([] as any);
const reloadRoots = () => {
  const rs = dict.value.struct?.parts.filter(d => d.root).map(d => d.part).join(",");
  if (!isEmpty(rs)) {
    apiLoader.roots(rs).then(data => {
      roots.value = data.values;
    }).catch((err) => console.log(err));
  }
};

const trees = ref([] as Word.Tree[]);
const tree = ref({} as Word.Tree);
const derivative = ref('');
const moveWord = ref('');
const showDerivativeMean = ref(false);
const removeDerivativePrompt = ref(true);
const derivativesMeans = ref({} as Map<string, boolean>);

const means = ref({} as Map<String, String>)
watch(tree, (n, o) => {
  tree.value?.derivatives.forEach(d => {
    const m = means.value[d.word];
    if (isEmpty(m)) {
      apiLoader.suggest(d.word).then(r => {
        const data = JSON.parse(r.value);
        const _m = data?.['data']?.entries[0]?.explain;
        if (!isEmpty(_m)) {
          means.value[d.word] = _m;
        }
      });
    }
  });
});

const reloadTree = () => {
  const ps: Promise<any>[] = [];
  ps.push(new Promise<any>((resolve, reject) => {
    apiLoader.findTree(dict.value.id).then(d => {
      tree.value = d.values[0];
      resolve(d);
    }).catch((err) => reject(err));
  }));
  let _trees: Word.Tree[] = [];
  dict.value.struct?.parts.filter(d => d.root).forEach(_d => {
    ps.push(new Promise<any>((resolve, reject) => {
      apiLoader.trees(_d.part).then(data => {
        data.values.forEach(v => {
          if (_trees.filter(t => t.id === v.id).length === 0) {
            _trees.push(v);
          }
        });
        resolve(data);
      }).catch((err) => reject(err));
    }));
  });
  Promise.all(ps).then((rs) => {
    rs[0].values.forEach(v => {
      if (_trees.filter(t => t.id === v.id).length === 0) {
        _trees.push(v);
      }
    });
    if (isEmpty(tree.value) && !isEmpty(_trees)) {
      tree.value = _trees[0];
    }
    trees.value = _trees;
  }).catch((err) => {
    networkError();
  })
};

const createTree = () => {
  if (dict.value.loadState['createTreeLoading']) {
    return;
  }
  dict.value.loadState['createTreeLoading'] = true;
  apiLoader.createTree(dict.value.id).then(() => {
    reloadTree();
    dict.value.loadState['createTreeLoading'] = false;
  }).catch((err) => {
    networkError();
  });
};

const mergedWords = ref([] as any);
const mergeTree = (treeId) => {
  if (dict.value.loadState['mergeTreeLoading']) {
    return;
  }
  dict.value.loadState['mergeTreeLoading'] = true;
  apiLoader.mergeTree(treeId, dict.value.id).then(data => {
    tree.value = data.value;
    const i = trees.value.map(v => v.id).indexOf(tree.value.id);
    if (i >= 0) {
      trees.value[i] = tree.value;
    }
    mergedWords.value = tree.value.derivatives.filter(v => v.merged && v.version === tree.value.version).map(v => v.word);
    dict.value.loadState['mergeTreeLoading'] = false;
  }).catch(() => {
    networkError();
  });
};

const addDerivative = () => {
  if (!isEmpty(derivative.value) && tree.value) {
    apiLoader.addDerivative(tree.value.id, moveWord.value, derivative.value, tree.value.version).then((data) => {
      tree.value = data.value;
      const i = trees.value.map(v => v.id).indexOf(tree.value.id);
      if (i >= 0) {
        trees.value[i] = tree.value;
      }
    }).catch(() => networkError());
  }
};

const moveDerivative = (op) => {
  if (tree.value) {
    apiLoader.moveDerivative(tree.value.id, tree.value.version, moveWord.value, op)
        .then(data => {
          tree.value = data.value;
          const i = trees.value.map(v => v.id).indexOf(tree.value.id);
          if (i >= 0) {
            trees.value[i] = tree.value;
          }
          subFlats.value[moveWord.value] = true;
        }).catch(() => networkError());
  }
};

const merged = (d) => {
  return mergedWords.value.includes(d.word) || (d.merged && d.version === tree.value?.version);
};

const inSub = (w) => {
  if (w === dict.value.id) {
    return true;
  }
  if (tree.value) {
    const ds = tree.value.derivatives;
    let j = -1;
    for (let i = 0; i < ds.length; i++) {
      if (ds[i].word === dict.value.id) {
        j = i;
        break;
      }
    }
    if (j >= 0) {
      //prev
      if (ds[j].index > 1) {
        const arr = [];
        for (let i = j - 1; i >= 1; i--) {
          arr.push(ds[i].word);
          if (ds[i].index == 1) {
            break;
          }
        }
        if(arr.includes(w)) {
          return true;
        }
      }
      //next
      for (let i = j + 1; i < ds.length; i++) {
        if (ds[i].index <= ds[j].index) {
          break;
        } else if (ds[i].word === w) {
          return true;
        }
      }
    }
  }
  return false;
};

const subTotal = (w) => {
  let r = 0;
  if (tree.value) {
    const ds = tree.value.derivatives;
    let j = -1;
    for (let i = 0; i < ds.length; i++) {
      if (ds[i].word === w) {
        j = i;
      }
      if (j >= 0 && i > j) {
        if (ds[i].index <= ds[j].index) {
          break;
        } else {
          r += 1;
        }
      }
    }
  }
  return r;
};

const showEditTree = ref(false);
const _editTreeId = ref('');
const _editTreeVersion = ref(0);
const _editTreeRootDesc = ref('');
const onEditTree = (t) => {
  _editTreeId.value = t.id;
  _editTreeVersion.value = t.version;
  _editTreeRootDesc.value = t.rootDesc;
  showEditTree.value = true;
};
const editTreeRootDesc = () => {
  apiLoader.editTreeDesc(_editTreeId.value, _editTreeRootDesc.value, _editTreeVersion.value)
      .then(() => {
        showEditTree.value = false;
        const i = trees.value.findIndex(v => v.id === _editTreeId.value);
        if (i >= 0) {
          trees.value[i].rootDesc = _editTreeRootDesc.value;
        }
      }).catch(() => networkError());
};

//-------------- other ----------------
const showSearch = ref(false);
const searchHeight = ref(0);
const searchType = ref(1);
const searchWord = ref(dict.value.id);
const searchSrc = computed(() => {
  let src = 'https://www.xxenglish.com/wd/' + searchWord.value;
  switch (searchType.value) {
    case 1:
      src = 'https://www.xxenglish.com/wd/' + searchWord.value;
      break;
    case 2:
      src = 'https://dict.youdao.com/result?lang=en&word=' + searchWord.value;
      break;
    case 3:
      src = 'https://www.iciba.com/word?w=' + searchWord.value;
      break;
    case 4:
      src = 'https://www.dictionary.com/browse/' + searchWord.value;
      break;
    case 5:
      src = 'https://www.collinsdictionary.com/dictionary/english/' + searchWord.value;
      break;
    case 6:
      src = 'https://www.oxfordlearnersdictionaries.com/definition/english/' + searchWord.value + '_1?q=' + searchWord.value;
      break;
    case 7:
      src = 'https://www.ldoceonline.com/dictionary/' + searchWord.value;
      break;
    case 8:
      src = 'https://www.merriam-webster.com/dictionary/' + searchWord.value;
      break;
    default:
      src = 'https://www.xxenglish.com/wd/' + searchWord.value;
      break;
  }
  if (isH5) {
    window.open(src);
  }
  return src;
});
const search = (w) => {
  if (isEmpty(moveWord.value)) {
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
const {startX, startY, endX, endY, touchStart, touchEnd} = useTouch();
watch(endX, (n, o) => {
  if (Math.abs(startY.value - endY.value) < 30) {
    if (showSearch.value) {
      if (endX.value - startX.value > 20) {
        showSearch.value = false;
      }
    }
  }
});

const onKeyDown = e => {
  if (nav.data.value.index === 0) {
    let moving = !isEmpty(moveWord.value);
    switch (e.key) {
      case 'ArrowUp':
        if (moving) {
          moveDerivative('up');
        }
        break;
      case 'ArrowRight':
        if (moving) {
          moveDerivative('right');
        } else {
          move(1);
        }
        break;
      case 'ArrowLeft':
        if (moving) {
          moveDerivative('left');
        } else {
          move(-1);
        }
        break;
      case 'ArrowDown':
        if (moving) {
          moveDerivative('down');
        }
        break;
      case 'Enter':
        if (moving) {
          if (derivativesMeans.value[moveWord.value]) {
            derivativesMeans.value[moveWord.value] = false;
            moveWord.value = '';
          }
        }
        break;
      default:
        break;
    }
  }
};
</script>

<template>
  <NavigationBar/>
  <view class="page_container">
    <view class="relative w-full flex items-center pb-20 head_body"
          style="background-color: #EEF0E1;
          height: 15%;
          padding-top: calc(var(--status-bar-height) + 10px);
          box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;">
      <text class="absolute left-15 bottom-10"
            style="color: #858585; font-size: 24rpx;">
        {{ date }}
      </text>
      <view class="flex gap-60">
        <view class="flex flex-col justify-center gap-10 mr-20"
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
                    :style="{'background-color': '#FFA600', width: ((isAPP? 250:400) * stat.viewed / stat.total) + (isAPP? 'rpx':'px')}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: ((isAPP? 250:400) * (stat.total - stat.viewed) / stat.total) + (isAPP? 'rpx':'px')}"></view>
              <text class="ml-3" style="color: #858585; font-size: 22rpx;">
                {{ (Math.round((stat.viewed / stat.total) * 100)) + '%' }}
              </text>
            </view>
          </view>
          <view class="flex flex-col mt-5">
            <text style="color: #858585; font-size: 22rpx;">已通过</text>
            <view class="flex items-center">
              <view class="h-5"
                    :style="{'background-color': '#006E1C', width: ((isAPP? 250:400) * stat.passed / stat.total) + (isAPP? 'rpx':'px')}"></view>
              <view class="h-5"
                    :style="{'background-color': 'white', width: ((isAPP? 250:400) * (stat.total - stat.passed) / stat.total) + (isAPP? 'rpx':'px')}"></view>
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
    <view v-if="dictLoading" class="relative w-full flex items-center justify-center" style="height: calc(80% - 80px)">
      <image :class="[isAPP? 'w-80':'w-150']" mode="widthFix" src="/static/loading.gif"></image>
    </view>
    <scroll-view v-if="nav.data.value.show && !dictLoading" class="w-full"
                 scroll-y
                 :show-scrollbar="false"
                 :scroll-into-view="scId"
                 :scroll-top="scTop"
                 @scroll="e => oscTop = e.detail.scrollTop"
                 @touchstart="touchStart" @touchend="touchEnd"
                 style="height: 85%;">
      <view class="w-full flex flex-col items-center gap-10">
        <view class="w-full flex items-center justify-center mt-40">
          <text @click="search(dict.id)"
                @longpress="copy(dict.id)"
                class="font-bold cursor-pointer" style="font-size: 52rpx">{{ dict.id }}
          </text>
        </view>
        <view class="relative flex flex-col gap-10 mt-20 w-full h-100 items-center">
          <view class="flex flex-col h-full justify-around">
            <view v-if="!isEmpty(dict?.ukPhonetic)" class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">英</text>
              <text style="font-size: 32rpx;">{{ dict?.ukPhonetic }}</text>
              <uni-icons @click="onRemovePart('phonetic','uk')" class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict?.usPhonetic)" class="flex gap-10" style="align-items: flex-end">
              <text style="font-size: 24rpx;">美</text>
              <text style="font-size: 32rpx;">{{ dict?.usPhonetic }}</text>
              <uni-icons @click="onRemovePart('phonetic','us')"
                         class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>中文释义</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
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
                        class="mean_text"
                        style="resize: none;font-size: 32rpx;"/>
              <uni-icons @click="onRemovePart('meaning','nouns')"
                         class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.verbs)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【动】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.verbs"
                        class="mean_text"
                        style="resize: none;font-size: 32rpx;"/>
              <uni-icons @click="onRemovePart('meaning','verbs')"
                         class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adverbs)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【副】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.adverbs"
                        class="mean_text"
                        style="resize: none;font-size: 32rpx;"/>
              <uni-icons @click="onRemovePart('meaning','adverbs')"
                         class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.meaning?.adjectives)" class="flex gap-10">
              <input class="w-70" disabled style="font-size: 28rpx; color: #858585" value="【形】"/>
              <textarea auto-height
                        @blur="meaningBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.meaning.adjectives"
                        class="mean_text"
                        style="resize: none;font-size: 32rpx;"/>
              <uni-icons @click="onRemovePart('meaning','adjectives')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>单词变形</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
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
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.thirdPresent)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【第三人称单数】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.thirdPresent.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','thirdPresent')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.past)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【过去式】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.past.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','past')"
                         class="cursor-pointer"
                         type="close" size="20" color="#ba1a1a"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.perfect)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【过去分词】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.perfect.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','perfect')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.progressive)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【现在分词】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.progressive.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','progressive')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.comparative)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【比较级】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.comparative.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','comparative')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view v-if="!isEmpty(dict.inflection?.superlative)" class="flex gap-10 items-center">
              <text style="font-size: 28rpx; color: #858585">【最高级】</text>
              <text style="font-size: 32rpx;">{{ dict.inflection.superlative.join(' ') }}</text>
              <uni-icons @click="onRemovePart('inflection','superlative')" type="close" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
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
                     class="w-30 mr-20 cursor-pointer" mode="widthFix" src="/static/clear.png"></image>
              <image :src="dict.loadState?.structLoading? '/static/loading.gif':'/static/get.png'"
                     class="w-25 cursor-pointer"
                     @click="loadPart('struct',{root: root, model: useMaxModel? 'qwen-max':''})"
                     mode="widthFix"></image>
            </view>
            <uni-icons @click="onRemovePart('struct','')" type="trash" size="20"
                       color="#ba1a1a" class="cursor-pointer"></uni-icons>
          </view>
          <view class="flex gap-20 items-center mb-10">
            <view class="w-200 h-50 rd-20 font-bold flex items-center justify-center cursor-pointer"
                  @click="copyAffixAI"
                  style="color: white; background-color: #006E1C; font-size: 24rpx;">
              <text>复制AI提示词</text>
            </view>
            <text class="mr--35 ml-10">使用Max模型:</text>
            <view class="flex justify-center">
              <switch v-if="useMaxModel" checked :color="'#D9E7C8'" style="transform:scale(0.6);"
                      @change="() => {useMaxModel=false;}"/>
              <switch v-if="!useMaxModel" :color="'#D9E7C8'" style="transform:scale(0.5);"
                      @change="useMaxModel=true"/>
            </view>
          </view>
          <view v-if="!isEmpty(affix?.root)" class="w-full pt-10 pb-10 flex gap-10 mt-5">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%;">{{
                '词根: ' + affix.root + '\n' + affix.rootDesc + '\n' + affix.wordDesc
              }}
            </text>
          </view>
          <view v-if="!isEmpty(roots) && (roots.length>1 || roots[0].roots.length>1)"
                class="flex flex-col gap-20 mt-10">
            <view v-for="(r,i) in roots"
                  :key="'roots'+i"
                  class="flex flex-col">
              <view class="flex gap-10">
                <view class="w-5" style="background-color: #D5D5D5"></view>
                <text style="font-size: 32rpx; color: #858585; width:80%;">{{
                    r.roots.join("、") + '\n' + r.desc
                  }}
                </text>
              </view>
            </view>
          </view>
          <view v-if="!isEmpty(affix?.gptRoot)" :class="['pt-10 pb-10 flex gap-10 mt-5', isAPP? 'w-full':'w-1500']">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%; display: inline-block;">{{
                affix?.gptRoot
              }}
            </text>
          </view>
          <view v-if="!isEmpty(affix?.gptAffix)" :class="['pt-10 pb-10 flex gap-10', isAPP? 'w-full':'w-1500']">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <text style="font-size: 32rpx; color: #858585; width: 80%; display: inline-block;">{{
                affix?.gptAffix
              }}
            </text>
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
                          style="font-size: 32rpx; resize: none;color: #858585;flex:1"/>
              </view>
            </view>
            <view v-if="!isEmpty(dict.struct.analysis)" class="w-full pt-10 pb-10 flex gap-10">
              <view class="w-5" style="background-color: #D5D5D5;"></view>
              <textarea auto-height
                        @blur="structBlur"
                        :maxlength="500"
                        :adjust-position="false"
                        v-model="dict.struct.analysis"
                        :class="['pr-30', isAPP? '':'w-1500']"
                        style="font-size: 32rpx; resize: none;color: #858585;"/>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>词源历史</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
                  @click="loadPart('origin')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.originLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view v-if="dict.origin" class="w-full flex gap-20 mt-10">
            <view class="w-5" style="background-color: #D5D5D5;"></view>
            <textarea auto-height
                      :disabled="true"
                      :maxlength="500"
                      :adjust-position="false"
                      v-model="dict.origin"
                      :class="['pr-50', isAPP? '':'w-1500']"
                      style="font-size: 32rpx; resize: none;color: #858585;"/>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>派生串记</text>
            </view>
            <!--            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center "-->
            <!--                  @click="loadPart('derivatives')"-->
            <!--                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">-->
            <!--              <image :src="dict.loadState?.derivativesLoading? '/static/loading.gif':'/static/get.png'" class="w-25"-->
            <!--                     mode="widthFix"></image>-->
            <!--            </view>-->
          </view>
          <view class="flex flex-col gap-10 mb-15">
            <view class="w-400 h-50 pl-10 pr-10 rd-20 font-bold flex items-center justify-between "
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <input class="text-left w-230"
                     :ignore-composition-event="false"
                     style="font-size: 28rpx; font-weight: bold;"
                     v-model="derivative"/>
              <image v-if="!isEmpty(derivative)"
                     @click="derivative=''"
                     class="w-30 mr-20 cursor-pointer" mode="widthFix" src="/static/clear.png"></image>
              <view class="w-40 h-40 rd-50 flex items-center justify-center cursor-pointer"
                    @click="addDerivative"
                    style="border: 1px solid black">
                <uni-icons type="plusempty" size="16" color="black"/>
              </view>
            </view>
            <text v-if="!isEmpty(trees)" class="mt-10">词根树：</text>
            <view v-for="(t,i) in trees" :key="'tree'+i"
                  @click="tree=t"
                  class="h-50 flex items-center gap-15 cursor-pointer">
              <view class="w-400 pl-10 pr-10 h-full flex gap-10 items-center rd-20"
                    :style="{'background-color': t.id===tree?.id? '#006E1C':'#D9E7C8'}">
                <text class="font-bold" :style="{color: t.id===tree?.id? 'white':'black'}">{{ t.root }}</text>
                <text class="text_wrap flex-1"
                      :style="{color: t.id===tree?.id? 'white':'black'}">{{ t.rootDesc }}
                </text>
                <view class="w-40 h-40 rd-50 flex items-center justify-center font-bold"
                      :style="{border: t.id===tree?.id? '1px solid white':'1px solid black'}">
                  <image v-if="dict.loadState.mergeTreeLoading && t.id===tree.id" src="/static/loading.gif" class="w-25"
                         mode="widthFix"></image>
                  <uni-icons v-else @click="mergeTree(t.id)" type="plusempty" size="16" class="cursor-pointer"
                             :color="t.id===tree?.id? 'white':'black'"/>
                </view>
              </view>
              <image src="/static/edit.png" class="w-30 cursor-pointer" mode="widthFix" @click="onEditTree(t)"></image>
              <uni-icons @click="onRemovePart('tree',t.id)" type="trash" size="20"
                         color="#ba1a1a" class="cursor-pointer"></uni-icons>
            </view>
            <view class="h-50 w-400 rd-20 flex items-center justify-center mt-10 cursor-pointer"
                  @click="createTree"
                  style="background-color: #004210">
              <text v-if="!dict.loadState?.createTreeLoading" style="color:white">创建新的词根树</text>
              <image v-if="dict.loadState?.createTreeLoading" src="/static/loading.gif" class="w-25"
                     mode="widthFix"></image>
            </view>
            <view class="flex gap-10 items-center">
              <text class="mr--25">释义:</text>
              <view class="flex justify-center">
                <switch v-if="showDerivativeMean" checked :color="'#D9E7C8'" style="transform:scale(0.6);"
                        @change="() => {showDerivativeMean=false;derivativesMeans={};}"/>
                <switch v-if="!showDerivativeMean" :color="'#D9E7C8'" style="transform:scale(0.5);"
                        @change="showDerivativeMean=true"/>
              </view>
              <text class="mr--25">提示删除:</text>
              <view class="flex justify-center">
                <switch v-if="removeDerivativePrompt" checked :color="'#D9E7C8'" style="transform:scale(0.6);"
                        @change="() => {removeDerivativePrompt=false;}"/>
                <switch v-if="!removeDerivativePrompt" :color="'#D9E7C8'" style="transform:scale(0.5);"
                        @change="removeDerivativePrompt=true"/>
              </view>
            </view>
          </view>
          <view class="w-full flex flex-col mt-10 pl-10" style="width: calc(100% - 40rpx)">
            <view v-for="(derivative,i) in tree?.derivatives" :key="'derivative'+i" :id="'derivative_'+derivative.word">
              <view v-if="derivative.index===0" class="flex items-center gap-10">
                <view class="flex flex-col gap-2">
                  <text @click="search(derivative.word)"
                        @longpress="copy(derivative.word)"
                        :class="[inSub(derivative.word) || moveWord===derivative.word || merged(derivative)? 'font-bold':'','cursor-pointer']"
                        :style="{'font-size': '32rpx', color: moveWord===derivative.word? '#006E1C':(merged(derivative)? '#00658C':'')}">
                    {{ derivative.word }}
                  </text>
                  <view v-if="showDerivativeMean || derivativesMeans[derivative.word]" class="pl-5 max-w-300"
                        style="color:#858585; font-size:26rpx;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                    {{ means[derivative.word] }}
                  </view>
                </view>
                <uni-icons
                    @click="onRemovePart('derivatives',derivative.word,removeDerivativePrompt,{treeId:tree.id,version:tree.version})"
                    type="close"
                    size="20"
                    color="#ba1a1a" class="cursor-pointer"></uni-icons>
                <uni-icons
                    @click="onRemovePart('derivatives',derivative.word+':sub',removeDerivativePrompt,{treeId:tree.id,version:tree.version})"
                    type="clear" size="20"
                    color="#ba1a1a" class="cursor-pointer"></uni-icons>
                <image
                    @click="() => {derivativesMeans[derivative.word]=!derivativesMeans[derivative.word];
                      if(moveWord===derivative.word){moveWord=''} else
                      {derivativesMeans[moveWord]=false;if(isEmpty(moveWord)) {moveWord=derivative.word;}}}"
                    src="/static/move.png" class="w-40 cursor-pointer" mode="widthFix"></image>
                <view class="flex gap-5 items-center cursor-pointer" @click="onFlat">
                  <image :src="flat? '/static/flat.png':'/static/fold.png'"
                         class="w-30 ml-20 " mode="widthFix"></image>
                  <text>{{ "(" + subTotal(derivative.word) + ")" }}</text>
                </view>
              </view>
              <view v-else-if="derivative.index===1 || flat || subFlats[derivative.word]"
                    :class="['relative flex items-center left-10', showDerivativeMean? 'h-80':'h-60']">
                <view
                    :class="['absolute top-0', i===tree?.derivatives.length-1? (showDerivativeMean? 'h-40':'h-30'):(showDerivativeMean? 'h-80':'h-60')]"
                    style="border-left: 1px solid #D5D5D5"></view>
                <view v-for="i in derivative.index" :key="'di'+i" class="w-50"
                      style="border-top: 1px solid #D5D5D5"></view>
                <view class="flex items-center justify-center gap-10">
                  <view class="flex flex-col gap-2">
                    <text @click="search(derivative.word)"
                          @longpress="copy(derivative.word)"
                          :class="['ml-5', inSub(derivative.word) || moveWord===derivative.word || merged(derivative)? 'font-bold':'','cursor-pointer']"
                          :style="{'font-size': '32rpx', color: moveWord===derivative.word? '#006E1C':(merged(derivative)? '#00658C':'')}">
                      {{ derivative.word }}
                    </text>
                    <view v-if="showDerivativeMean || derivativesMeans[derivative.word]" class="pl-5 max-w-300"
                          style="color:#858585; font-size:26rpx;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      {{
                        means[derivative.word]
                      }}
                    </view>
                  </view>
                  <uni-icons
                      @click="onRemovePart('derivatives',derivative.word,removeDerivativePrompt,{treeId:tree.id,version:tree.version})"
                      type="close"
                      size="20"
                      color="#ba1a1a" class="cursor-pointer"></uni-icons>
                  <uni-icons
                      @click="onRemovePart('derivatives',derivative.word+':sub',removeDerivativePrompt,{treeId:tree.id,version:tree.version})"
                      type="clear" size="20"
                      color="#ba1a1a" class="cursor-pointer"></uni-icons>
                  <image
                      @click="() => {derivativesMeans[derivative.word]=!derivativesMeans[derivative.word];
                        if(moveWord===derivative.word){moveWord=''} else
                        {derivativesMeans[moveWord]=false;if(isEmpty(moveWord)) {moveWord=derivative.word;}}}"
                      src="/static/move.png" class="w-40 cursor-pointer" mode="widthFix"></image>
                  <view v-if="derivative.index===1 && hasFlat(derivative.word)"
                        class="flex gap-5 items-center cursor-pointer"
                        @click="onFlats(derivative.word)">
                    <image :src="flat || flats[derivative.word]? '/static/flat.png':'/static/fold.png'"
                           mode="widthFix"
                           class="w-30 ml-20 cursor-pointer"></image>
                    <text>{{ "(" + subTotal(derivative.word) + ")" }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-390 w-100 h-100 rd-100 flex items-center justify-center z-1 cursor-pointer"
                @click="moveDerivative('up')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 50rpx)">
            <uni-icons type="arrow-up" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-210 w-100 h-100 rd-100 flex items-center justify-center  z-1 cursor-pointer"
                @click="moveDerivative('down')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 50rpx)">
            <uni-icons type="arrow-down" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-300 w-100 h-100 rd-100 flex items-center justify-center  z-1 cursor-pointer"
                @click="moveDerivative('left')"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 160rpx)">
            <uni-icons type="arrow-left" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-300 w-100 h-100 rd-100 flex items-center justify-center  z-1 cursor-pointer"
                @click="moveDerivative('right')"
                style="background-color: #D9E7C8; opacity: .5; right: calc(50vw - 160rpx)">
            <uni-icons type="arrow-right" size="24" color="#433F3F"/>
          </view>
          <view v-if="!isEmpty(moveWord)"
                class="fixed bottom-320 w-60 h-60 rd-60 flex items-center justify-center z-1 cursor-pointer"
                @click="() => {if(derivativesMeans[moveWord]) derivativesMeans[moveWord]=false;moveWord='';}"
                style="background-color: #D9E7C8; opacity: .5; left: calc(50vw - 30rpx)">
            <uni-icons type="checkmarkempty" size="24" color="#433F3F"/>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>同义辨析</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
                  @click="loadPart('differs')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.differsLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="flex flex-col gap-25">
            <view v-for="item in differs" :key="item.meaning">
              <view class="flex flex-col gap-10 gap-10 pl-12 mb-10">
                <view class="flex items-center">
                  <text
                      style="font-size: 32rpx; color: black; width:80%; font-weight: bold; text-decoration:underline;">
                    {{ item.words.map(w => w.word).join("、") }}
                  </text>
                </view>
                <view class="flex gap-10">
                  <text style="font-size: 32rpx; color: #858585; width:80%;">{{ item.meaning }}</text>
                </view>
              </view>
              <view v-for="differ in item.words"
                    class="flex flex-col gap-10"
                    :key="'differ'+differ.id">
                <view class="flex gap-10 pl-12 mt-10">
                  <text @click="search(differ.word)"
                        class="font-bold"
                        style="font-size: 32rpx;">{{ differ.word }}
                  </text>
                  <uni-icons @click="onRemovePart('differs',differ.id)" type="close" size="20"
                             color="#ba1a1a" class="cursor-pointer"></uni-icons>
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
                <view v-for="(ex,i) in differ.examples" :key="'example'+i"
                      class="w-full pl-10 pb-10 mt-5 flex flex-col gap-10">
                  <text class="pl-5" style="font-size: 32rpx; width: 90%;">{{ ex.sentence }}</text>
                  <view class="flex gap-10 pl-8">
                    <view class="w-5" style="background-color: #D5D5D5"></view>
                    <text style="font-size: 32rpx; color: #858585; width:80%;">{{ ex.translation }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>短语词组</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
                  @click="loadPart('collocation')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.collocationLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view v-if="!isEmpty(dict.collocation?.formulas)"
                class="w-200 h-50 rd-20 font-bold flex items-center justify-center cursor-pointer"
                @click="onRemovePart('formula','')"
                style="color: white; background-color: #ba1a1a; font-size: 24rpx;">
            <text>删除短语公式</text>
          </view>
          <view class="w-full flex flex-col mt-10" style="width: calc(100% - 40rpx)">
            <view v-for="(formula, i) in dict.collocation?.formulas" :key="'formula'+i"
                  class="w-full pr-20 pt-10 pb-10 flex flex-col justify-center gap-15">
              <view class="flex gap-10 pl-12 items-center">
                <text class="font-bold" style="font-size: 32rpx;">{{ formula.en }}</text>
                <uni-icons @click="onRemovePart('collocation',formula.en)" type="close" size="20"
                           color="#ba1a1a" class="cursor-pointer"></uni-icons>
              </view>
              <view class="flex gap-10 pl-15 mt--10">
                <view class="w-5" style="background-color: #D5D5D5"></view>
                <text style="font-size: 32rpx; color: #858585; width:80%;">{{ formula.zh }}</text>
              </view>
              <div style="font-size: 28rpx; color: #858585" class="mt-5">【例句】</div>
              <view class="flex flex-col gap-25 pl-15">
                <view v-for="(ex,j) in formula.examples" :key="'fex'+j" class="flex flex-col gap-10">
                  <view class="flex items-center">
                    <text style="font-size: 32rpx;">{{ ex.sentence }}</text>
                  </view>
                  <view class="flex gap-10">
                    <view class="w-5" style="background-color: #D5D5D5"></view>
                    <text style="font-size: 32rpx; color: #858585; width:80%;">{{ ex.translation }}</text>
                  </view>
                </view>
              </view>
            </view>
            <div v-if="!isEmpty(dict.collocation?.formulas)"
                 style="font-size: 28rpx; color: black"
                 class="mt-15 font-bold">【其他短语】
            </div>
            <view v-for="(phrase,i) in dict.collocation?.phrases"
                  :key="'phrase'+i"
                  class="w-full pl-12 pr-20 pt-10 pb-10 flex flex-col justify-center gap-5">
              <view class="pl-5 flex items-center gap-5">
                <text style="font-size: 32rpx;">{{ phrase.en }}</text>
                <uni-icons @click="onRemovePart('collocation',phrase.en+':phrase')" type="close" size="20"
                           color="#ba1a1a" class="cursor-pointer"></uni-icons>
              </view>
              <view class="flex gap-10 pl-8">
                <view class="w-5" style="background-color: #D5D5D5"></view>
                <text style="font-size: 32rpx; color: #858585; width:80%;">{{ phrase.zh }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>近反义词</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
                  @click="loadPart('synAnts')"
                  style="color: black; background-color: #D9E7C8; font-size: 24rpx;">
              <image :src="dict.loadState?.synAntsLoading? '/static/loading.gif':'/static/get.png'" class="w-25"
                     mode="widthFix"></image>
            </view>
          </view>
          <view class="w-full flex flex-col gap-20 mt-10" style="width: calc(100% - 40rpx)">
            <view class="flex items-center pb-20 pr-20" :style="{'border-bottom': isAPP? '1px solid #D5D5D5':''}">
              <view class="font-bold w-120" style="color: #858585; display: inline-block">近义词</view>
              <view class="flex flex-wrap" style="flex:1">
                <div v-for="(synonym,i) in dict.synAnts?.synonyms"
                     :key="'synonym'+i"
                     class="flex items-center"
                     style="font-size: 32rpx; margin-left: 20rpx;">
                  <text @click="search(synonym)" @longpress="copy(synonym)">{{ synonym }}</text>
                  <uni-icons @click="onRemovePart('synonym',synonym)" type="close" size="20"
                             color="#ba1a1a" class="cursor-pointer"></uni-icons>
                </div>
              </view>
            </view>
            <view class="flex items-center pr-20">
              <view class="font-bold w-120" style="color: #858585; display: inline-block">反义词</view>
              <view class="flex flex-wrap" style="flex:1">
                <div v-for="(antonym,i) in dict.synAnts?.antonyms"
                     :key="'antonym'+i"
                     class="flex items-center"
                     style="font-size: 32rpx; margin-left: 20rpx;">
                  <text @click="search(antonym)" @longpress="copy(antonym)">{{ antonym }}</text>
                  <uni-icons @click="onRemovePart('antonym',antonym)" type="close" size="20"
                             color="#ba1a1a" class="cursor-pointer"></uni-icons>
                </div>
              </view>
            </view>
          </view>
        </view>

        <view class="w-full mt-30 item_body">
          <view class="flex gap-20">
            <view class="w-150 h-50 rd-20 font-bold mb-10 flex items-center justify-center"
                  style="color: white; background-color: black; font-size: 24rpx;">
              <text>相关例句</text>
            </view>
            <view class="h-50 w-80 rd-20 font-bold mb-10 flex items-center justify-center cursor-pointer"
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
  <view v-if="nav.data.value.show && !dictLoading"
        class="fixed bottom-1050 w-100 h-100 rd-100 flex items-center justify-center cursor-pointer op_item"
        @click="remove"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="trash" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show && isAPP && !dictLoading"
        class="fixed bottom-900 w-100 h-100 rd-100 flex items-center justify-center cursor-pointer op_item"
        @click="search(dict.id)"
        @longpress="copy(dict.id)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="search" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show && isAPP && !dictLoading"
        class="fixed bottom-750 w-100 h-100 rd-100 flex items-center justify-center cursor-pointer op_item"
        @click="move(-1)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="left" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show && isAPP && !dictLoading"
        class="fixed bottom-600 w-100 h-100 rd-100 flex items-center justify-center cursor-pointer op_item"
        @click="move(1)"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="right" size="24" color="#858585"/>
  </view>
  <view v-if="nav.data.value.show && !dict.passed && !loading && !dictLoading"
        :class="['fixed w-100 h-100 rd-100 flex items-center justify-center cursor-pointer op_item',isAPP?'bottom-450':'bottom-900']"
        @click="pass"
        style="background-color: #D9E7C8; opacity: .5">
    <uni-icons type="checkmarkempty" size="24" color="#858585"/>
  </view>
  <Popup :show="showSearch" position="right"
         @touchstart="touchStart" @touchend="touchEnd"
         @clickMask="() => {showSearch=false;searchHeight=0;searchWord=dict.id;searchType=1;searchSrc='https://www.xxenglish.com/wd/'+searchWord}">
    <view :class="['relative h-100vh pl-20 pr-20', isAPP? 'w-85vw':'w-30vw']"
          @touchstart="touchStart" @touchend="touchEnd"
          style="background-color: #F8FAF0; padding-top: 45px;">
      <view class="flex pb-15 flex-wrap gap-15" style="align-items: flex-end; height: 55px;">
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=1;"
              :style="{'background-color': searchType===1? '#006E1C':'#D9E7C8',color:searchType===1?'white':'black'}">XX
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=2;"
              :style="{'background-color': searchType===2? '#006E1C':'#D9E7C8',color:searchType===2?'white':'black'}">有道
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=3;"
              :style="{'background-color': searchType===3? '#006E1C':'#D9E7C8',color:searchType===3?'white':'black'}">金山
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=4;"
              :style="{'background-color': searchType===4? '#006E1C':'#D9E7C8',color:searchType===4?'white':'black'}">
          Dictionary
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=5;"
              :style="{'background-color': searchType===5? '#006E1C':'#D9E7C8',color:searchType===5?'white':'black'}">
          Collins
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=6;"
              :style="{'background-color': searchType===6? '#006E1C':'#D9E7C8',color:searchType===6?'white':'black'}">
          Oxford
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=7;"
              :style="{'background-color': searchType===7? '#006E1C':'#D9E7C8',color:searchType===7?'white':'black'}">
          Longman
        </view>
        <view class="pl-10 pr-10 pt-5 pb-5 rd-10 z-1000 cursor-pointer"
              @click="searchType=8;"
              :style="{'background-color': searchType===8? '#006E1C':'#D9E7C8',color:searchType===8?'white':'black'}">
          Webster
        </view>
      </view>
      <web-view v-if="showSearch"
                :webview-styles="{width: isAPP? width*0.85:1000, height: isAPP? searchHeight:2000, left: width*0.15, top:100}"
                :fullscreen="false"
                :src="searchSrc">
      </web-view>
    </view>
  </Popup>
  <Popup :show="showRemove" position="center"
         @clickMask="showRemove=false">
    <view :class="['rd-30 flex items-center justify-center', isAPP? 'w-80vw h-12vh':'w-30vw h-20vh']"
          style="background-color: #E8EBDA">
      <text class="font-bold" style="font-size: 36rpx;">删除该项？</text>
      <text @click="removePart" class="absolute bottom-30 right-60 font-bold" style="color:#3F6900; font-size: 32rpx;">
        确定
      </text>
    </view>
  </Popup>
  <Popup :show="showEditTree" position="center"
         @clickMask="showEditTree=false">
    <view :class="['pl-40 pr-40 pt-40 rd-30 flex items-center justify-center', isAPP? 'w-80vw':'w-30vw']"
          style="background-color: #E8EBDA">
      <textarea v-model="_editTreeRootDesc"/>
      <text @click="editTreeRootDesc" class="absolute bottom-30 right-60 font-bold"
            style="color:#3F6900; font-size: 32rpx;">
        确定
      </text>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
.text_wrap {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* #ifdef APP-PLUS */
.mean_text {
  width: 300rpx;
}

/* #endif */

/* #ifdef H5 */
.mean_text {
  width: 300px;
}

/* #endif */

/* #ifdef APP-PLUS */
.head_body {
  padding: 30rpx;
  justify-content: space-between;
}

/* #endif */

/* #ifdef H5 */
.head_body {
  padding-left: 300px;
  padding-right: 300px;
  justify-content: space-between;
}

/* #endif */

/* #ifdef APP-PLUS */
.item_body {
  padding-left: 30rpx;
}

/* #endif */

/* #ifdef H5 */
.item_body {
  padding-left: 100px;
}

/* #endif */

/* #ifdef APP-PLUS */
.op_item {
  right: 60rpx;
}

/* #endif */

/* #ifdef H5 */
.op_item {
  right: 300px;
}

/* #endif */
</style>
