<script setup lang="ts">
import { useWxPay } from "@/hooks/useWxPay";
import { message, modal } from "@/utils/unis";

const { wxPay } = useWxPay();

const props = defineProps({
  show: Boolean,
  html: String,
  vip: Number,
  hks: {
    type: Boolean,
    default: true
  },
  hasPay: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['close']);

const doPay = () => {
  wxPay(props.vip as number).then(async () => {
    await modal('', '解锁成功');
  }).catch(() => {
    message('解锁失败', 4);
  })
  emits('close');
}
</script>
<template>
  <Popup position="center" :show="show" @clickMask="$emit('close')">
    <view class="relative w-80vw flex flex-col items-center justify-center bg-white rd-10 gap-20 p-20">
      <text class="font-bold" style="font-size: 36rpx">游戏需知</text>
      <view class="break-all w-full p-20" v-html="html"></view>
      <view v-if="hasPay" class="h-65 w-250 mt-10 rd-40 text-white flex items-center justify-center"
            :style="{background: hks?'#482380':'#FF6110', 'font-size': '32rpx', 'letter-spacing': '3rpx'}" @click="doPay">立即解锁
      </view>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
</style>