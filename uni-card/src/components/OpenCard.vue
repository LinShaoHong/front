<script setup lang="ts">
const props = defineProps({
  src: String,
  hks: {
    type: Boolean,
    default: true
  },
  open: {
    type: Boolean,
    default: false
  },
  type: {
    type: Boolean,
    default: false,
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
  height: {
    type: String,
    default: 'calc(90vh - 300rpx)'
  }
});

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

defineEmits(['close']);
</script>
<template>
  <view class="fixed w-100vw h-100vh top-0"
        :style="{'z-index': open? '100': '-1', transition: '.3s linear', background: 'rgba(0, 0, 0, 0.85)'}"></view>
  <view class="fixed w-100vw h-100vh top-0 flex items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 101 : -1}">
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
    <view class="card w-full flex flex-col items-center justify-center z-200" :style="{height: height}">
      <view class="absolute w-full top-0" style="height: 65%;">
        <view v-if="!defaulted" class="absolute w-full flex items-center justify-center" style="top: 50%;">
          <text class="font-bold text-white" style="font-size: 34rpx;">{{ type ? '云顶之弈' : '' }}</text>
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
    <view class="absolute bottom-150 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('close')">
      <image class="px-10 py-10 w-320 h-100"
             src="/static/foot_bg.png"
             mode="scaleToFill"></image>
      <text class="color-white absolute font-bold" style="font-size: 30rpx;">
        已完成游戏处罚
      </text>
    </view>
  </view>

  <view v-if="!hks" class="fixed w-100vw h-100vh top-0 flex flex-col items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 102 : -1}">
    <view class="card w-full flex flex-col items-center justify-center z-200" :style="{height: height}">
      <view class="absolute w-full" style="height: 20%; top: 12%">
        <view class="absolute bottom-25 w-full flex items-center justify-center">
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
        <image :src="src" style="width: calc(40% - 14vw);" mode="widthFix"></image>
        <view class="lover_divider" style="right: 7vw"></view>
      </view>
    </view>
    <view class="absolute bottom-150 flex items-center justify-center"
          style="transform: rotateY(180deg); backface-visibility: hidden;"
          @click="$emit('close')">
      <view class="flex gap-10 lover_btn" @click="$emit('close')">
        <text>完成任务</text>
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
  top: 32%;
  font-size: 32rpx;
  position: absolute;
  word-break: break-all;
  overflow: scroll;
}

.lover_divider {
  position: absolute;
  height: 6rpx;
  background-color: #FF6110;
  width: 30%;
}

.lover_btn {
  width: 32vw;
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