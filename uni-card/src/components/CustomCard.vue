<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    default: false
  },
  height: {
    type: String,
    default: ''
  },
  type: {
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
  <view class="relative" :style="{width: width, height: height}">
    <image class="w-full h-full absolute top-0" src="/static/card.png"></image>
    <view class="w-full h-full flex fle-col items-center justify-center z-200">
      <view class="absolute w-full top-0" style="height: 65%;">
        <view class="absolute w-full flex items-center justify-center" style="top: 50%;">
          <text class="font-bold text-white" style="font-size: 24rpx;">{{ type }}</text>
        </view>
        <view class="absolute bottom-25 w-full flex items-center justify-center">
          <text class="font-bold text-white" style="font-size: 26rpx;">{{ title }}</text>
        </view>
      </view>
      <view class="content" :style="contentStyle">
        <text class="text-white align-center">
          {{ content }}
        </text>
      </view>
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
</style>