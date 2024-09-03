<script setup lang="ts">
const user = useStore('user');
const config = useStore('config');
const props = defineProps({
  hks: {
    type: Boolean,
    default: true
  },
  defaulted: {
    type: Boolean,
    default: true
  },
  count: {
    type: Number,
    default: 1
  },
  width: {
    type: String,
    default: false
  },
  height: {
    type: String,
    default: ''
  },
  custom: {
    type: Boolean,
    default: false
  },
  src: {
    type: String,
    default: '/static/card.png'
  },
  hksCardType: {
    type: String,
    default: ''
  },
  loverCardType: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
});
const imgUri = inject('$imgUri');

const hksCover = computed(() => {
  if (!props.hks) {
    return false;
  }
  const arr = config.data.value.hksCards.filter(s => s.type === props.hksCardType);
  return arr.length === 0 ? false : arr[0]['cover'];
});

const loverCardTypeName = computed(() => {
  const arr = config.data.value.loverCards.filter(s => s.type === props.loverCardType);
  const name = arr.length === 0 ? '' : arr[0]['name'];
  const i = name.indexOf("(");
  return i > 0 ? name.substring(0, i) : name;
});
const loverCardVisible = computed(() => {
  const arr = config.data.value.loverCards.filter(s => s.type === props.loverCardType);
  return (arr.length === 0 ? true : arr[0]['visible']) || user.data.value.vip > 0;
});

const contentStyle = computed(() => {
  if (props.content?.length > 20) {
    return null;
  } else {
    return {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    }
  }
});

defineEmits(['close']);
</script>
<template>
  <view v-if="hks" class="relative" :style="{width: width, height: height}">
    <image class="absolute top-0 rd-20 h-full w-full" :src="hksCover? '/static/card.png':src"/>
    <view class="w-full h-full flex flex-col items-center justify-center z-200">
      <view class="absolute w-full top-0" style="height: 65%;">
        <image v-if="hksCover || custom"
               :src="hksCover? src:`${imgUri}/ct.png`"
               mode="heightFix"
               class="absolute left-0 right-0" style="top: 26%; height: 50%; margin: auto"/>
        <view class="absolute bottom-25 w-full flex items-center justify-center">
          <text class="font-bold text-white" style="font-size: 26rpx;">{{ title }}</text>
        </view>
      </view>
      <view class="content" :style="contentStyle">
        <text class="text-white align-center font-bold">
          {{ content }}
        </text>
      </view>
    </view>
  </view>

  <view v-if="!hks" class="relative flex flex-col items-center justify-center"
        :style="{width: width, height: height,'background-color':'white','border-radius':'30rpx 30rpx 0 0'}">
    <view class="absolute w-full flex items-center justify-between pl-30 top-0"
          style="height: 12%; background-color: #FF6110; border-radius: 20rpx 20rpx 0 0">
      <view class="flex gap-10">
        <image src="/static/dot.png" class="w-10 h-10"></image>
        <image src="/static/dot.png" class="w-10 h-10"></image>
        <image src="/static/dot.png" class="w-10 h-10"></image>
      </view>
      <text style="color: white; font-size: 26rpx; font-weight: bold; letter-spacing: 2rpx;">{{
          loverCardTypeName
        }}
      </text>
      <text style="color: white; font-size: 30rpx; font-weight: bold; margin-right: 20rpx;">{{ '# ' + count }}</text>
    </view>
    <view class="absolute w-full" style="height: 10%; top: 12%;">
      <view class="absolute w-full h-full flex items-center justify-center">
        <text class="font-bold text-black" style="font-size: 26rpx;">{{ title }}</text>
      </view>
    </view>
    <view class="w-full flex items-center justify-center">
      <view class="absolute flex flex-col items-center justify-center gap-6" style="width: 80%; height: 30%; top:22%;">
        <view class="w-full pl-8">
          <image class="w-20 h-20" mode="aspectFit" :src="`${imgUri}/quo.png`"></image>
        </view>
        <scroll-view class="lover_content" :style="contentStyle" scroll-y :show-scrollbar="false">
          <text class="text-black align-center font-bold" :style="{filter: loverCardVisible?'':'blur(7rpx)'}">
            {{ content }}
          </text>
        </scroll-view>
      </view>
    </view>
    <view class="absolute w-full flex items-center justify-center" style="height: 43%; top:57%;">
      <view class="lover_divider" style="left: 0"></view>
      <image :src="custom? '/static/lover_ct.png':src"
             :class="!defaulted && !custom? 'rd-20':''"
             :style="{width: '54%', 'max-height': '94%', filter: loverCardVisible? '':'blur(14rpx)'}" mode="widthFix"/>
      <view class="lover_divider" style="right: 0"></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.content {
  width: 70%;
  max-height: 22%;
  top: 68%;
  position: absolute;
  word-break: break-all;
  overflow: scroll;
  font-size: 24rpx;
}

.lover_content {
  width: 80%;
  font-size: 24rpx;
  word-break: break-all;
  overflow: scroll;
}

.lover_divider {
  position: absolute;
  height: 6rpx;
  background-color: #FF6110;
  width: 23%;
}
</style>