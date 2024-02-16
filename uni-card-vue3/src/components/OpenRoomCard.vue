<script setup lang="ts">
const props = defineProps({
  src: String,
  open: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: '云顶之弈'
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
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
    <image class="card" :style="{height: height}" :src="src" mode="heightFix"/>
  </view>

  <view class="fixed w-100vw h-100vh top-0 flex flex-col items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 102 : -1}">
    <view class="card w-full flex fle-col items-center justify-center z-200" :style="{height: height}">
      <view class="absolute w-full top-0" style="height: 65%;">
        <view v-if="!defaulted" class="absolute w-full flex items-center justify-center" style="top: 50%;">
          <text class="font-bold text-white" style="font-size: 34rpx;">{{ type }}</text>
        </view>
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
  top:50rpx;
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
</style>