<script setup lang="ts">
const props = defineProps({
  src: String,
  open: {
    type: Boolean,
    default: false
  },
  hks: {
    type: Boolean,
    default: true
  },
  type: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 1,
  },
  defaulted: {
    type: Boolean,
    default: true
  },
  avatar: Number,
  nickname: String,
  showOp: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: 'calc(90vh - 300rpx)'
  }
});

const imgUri = inject('$imgUri');
const contentStyle = computed(() => {
  if (props.content?.length > 50) {
    return null;
  } else {
    return {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    }
  }
});

defineEmits(['continue', 'next']);
</script>
<template>
  <view class="fixed w-100vw h-100vh top-0"
        :style="{'z-index': open? '100': '-1', transition: '.3s linear', background: 'rgba(0, 0, 0, 0.85)'}"></view>

  <view class="fixed w-100vw h-100vh top-0 flex items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 101 : -1}">
    <view class="player flex flex-col justify-center items-center">
      <image style="border-radius: 50%;height: 120%;" :src="`${imgUri}/avatar/${avatar}.png`" mode="heightFix"></image>
      <text class="text-white" style="font-size: 28rpx;">{{ nickname }}</text>
    </view>
    <image v-if="hks"
           class="card"
           :src="src"
           :style="{height: height, 'width': (defaulted || type)? '' : '86vw', 'border-radius': (defaulted || type)? '' : '30rpx'}"
           :mode="(defaulted || type)? 'heightFix' : 'scaleToFill'"/>
    <view v-if="!hks"
          class="card"
          :style="{height: height, width : '86vw', 'border-radius': '30rpx', 'background-color':'white'}">
      <view class="w-full flex items-center justify-between pl-30"
            style="height: 12%; background-color: #FF6110; border-radius: 30rpx 30rpx 0 0">
        <view class="flex gap-10">
          <image src="/static/dot.png" class="w-20 h-20"></image>
          <image src="/static/dot.png" class="w-20 h-20"></image>
          <image src="/static/dot.png" class="w-20 h-20"></image>
        </view>
        <text style="color: white; font-size: 36rpx; font-weight: bold; margin-right: 30rpx;">{{ '# ' + count }}</text>
      </view>
    </view>
  </view>

  <view v-if="hks" class="fixed w-100vw h-100vh top-0 flex flex-col items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 102 : -1}">
    <view class="card w-full flex fle-col items-center justify-center z-200" :style="{height: height}">
      <view class="absolute w-full top-0" style="height: 65%;">
        <image v-if="!defaulted && type"
               src="/static/ct.png"
               mode="heightFix"
               class="absolute left-0 right-0" style="top: 35%; height: 50%; margin: auto"/>
        <view class="absolute bottom-25 w-full flex items-center justify-center">
          <text class="font-bold text-white" style="font-size: 36rpx;">{{ title }}</text>
        </view>
      </view>
      <view class="content" :style="contentStyle">
        <text class="text-white align-center">
          {{ content }}
        </text>
      </view>
    </view>
    <view v-if="showOp" class="absolute bottom-150 right-120 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('continue')">
      <image class="px-10 py-10 w-220 h-100"
             src="/static/foot_bg.png"
             mode="scaleToFill"></image>
      <text class="color-white absolute font-bold" style="font-size: 30rpx;">
        继续抽
      </text>
    </view>
    <view v-if="showOp" class="absolute bottom-150 left-120 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('next')">
      <image class="px-10 py-10 w-220 h-100"
             src="/static/foot_bg.png"
             mode="scaleToFill"></image>
      <text class="color-white absolute font-bold" style="font-size: 30rpx;">
        下一个
      </text>
    </view>
  </view>

  <view v-if="!hks" class="fixed w-100vw h-100vh top-0 flex flex-col items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 102 : -1}">
    <view class="card w-full flex flex-col items-center justify-center z-200" :style="{height: height}">
      <view class="absolute w-full" style="height: 10%; top: 12%">
        <view class="absolute w-full h-full flex items-center justify-center">
          <text class="font-bold text-black" style="font-size: 36rpx;">{{ title }}</text>
        </view>
      </view>
      <view class="lover_content" :style="contentStyle">
        <text class="text-black align-center">
          {{ content }}
        </text>
      </view>
      <view class="absolute w-full flex items-center justify-center" style="height: 45%; top:55%;">
        <view class="lover_divider" style="left: 7vw"></view>
        <image :src="!defaulted && type? '/static/lover_ct.png':src"
               :class="!defaulted && !type? 'rd-20':''"
               style="width: calc(54% - 14vw); max-height: 94%" mode="widthFix"/>
        <view class="lover_divider" style="right: 7vw"></view>
      </view>
    </view>
    <view v-if="showOp" class="absolute bottom-150 right-120 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('continue')">
      <view class="flex gap-10 lover_btn">
        <text>继续抽</text>
      </view>
    </view>
    <view v-if="showOp" class="absolute bottom-150 left-120 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('next')">
      <view class="flex gap-10 lover_btn">
        <text>下一个</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  position: absolute;
  bottom: 300rpx;
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.player {
  height: 160rpx;
  top: 50rpx;
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.content {
  width: 55%;
  height: 22%;
  top: 68%;
  font-size: 32rpx;
  position: absolute;
  word-break: break-all;
  overflow: scroll;
}

.lover_content {
  width: 80%;
  height: 33%;
  top: 22%;
  font-size: 32rpx;
  position: absolute;
  word-break: break-all;
  overflow: scroll;
}

.lover_divider {
  position: absolute;
  height: 8rpx;
  background-color: #FF6110;
  width: 23%;
}

.lover_btn {
  width: 28vw;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FF6110;
  border-radius: 80rpx;
  box-shadow: inset #9F2F03 0 0 60rpx -12px;

  text {
    color: white;
    font-weight: bold;
    font-size: 32rpx;
  }
}
</style>