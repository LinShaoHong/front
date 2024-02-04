<script setup lang="ts">
const props = defineProps({
  src: String,
  open: {
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
        :style="{'z-index': open? '100': '-1', transition: '.3s linear', background: 'rgba(0, 0, 0, 0.6)'}"></view>
  <view class="fixed w-100vw h-100vh top-0 flex items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 101 : -1}">
    <image class="card" :src="src" mode="heightFix"/>
  </view>

  <view class="fixed w-100vw h-100vh top-0 flex flex-col items-center justify-center"
        :style="{transform: open? 'rotateY(180deg)' : '',
                 transition: '.3s linear',
                 'transform-style': 'preserve-3d',
                 'z-index': open? 102 : -1}">
    <view class="card w-full flex fle-col items-center justify-center z-200">
      <view class="absolute w-full top-0" style="height: 65%;">
        <view class="absolute bottom-25 w-full flex items-center justify-center">
          <text class="font-bold text-white" style="font-size: 32rpx;">{{ title }}</text>
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
</template>

<style scoped lang="scss">
.card {
  position: absolute;
  bottom: 300rpx;
  height: calc(85vh - 300rpx);
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.content {
  width: 55%;
  height: 22%;
  top: 68%;
  position: absolute;
  word-break: break-all;
  overflow: scroll;
}
</style>