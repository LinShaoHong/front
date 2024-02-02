<script lang="ts" setup>
import { forward } from "@/utils/router";

const user = useStore('user')
const showRule = ref(false);
</script>

<template>
  <view class="mt-24 ml-24 mr-24">
    <view class="h-220 rd-24 flex flex-col justify-center" style="background-color: #907BE0">
      <view class="flex flex-col items-center justify-center gap-10" @click="forward('account')">
        <image class="h-120 w-120" style="border-radius: 50%" src="/static/avatar.png" mode="aspectFill"></image>
        <view class="text-white" style="font-size: 24rpx;">{{ user.data.value.nickname }}</view>
      </view>
    </view>
    <view class="mt-30 rd-24 pl-20 pr-20" style="background-color: white">
      <van-cell-group>
        <van-cell title="游戏规则" icon="/static/gz.png" is-link title-style="color: #907BE0" @click="showRule=true"/>
        <button class="p-0 text-left" open-type="share" style="background: transparent;">
          <van-cell title="推荐给朋友" icon="/static/tj.png" is-link title-style="color: #907BE0"/>
        </button>
        <button class="p-0 text-left" open-type="contact" style="background: transparent;">
          <van-cell title="联系客服" icon="/static/contact.png" is-link title-style="color: #907BE0"/>
        </button>
      </van-cell-group>
    </view>
  </view>

  <Popup position="center" :show="showRule" :close="false">
    <view class="pb-40">
      <image class="max-w-screen h-75vh" src="/static/rule.png" mode="heightFix"></image>
      <view class="flex items-center justify-center">
        <image class="px-10 py-10 w-320 h-100"
               src="/static/foot_bg.png"
               mode="scaleToFill"
               @click="showRule=false"></image>
        <text class="color-white absolute font-bold" style="font-size: 30rpx;" @click="showRule=false">确定</text>
      </view>
    </view>
  </Popup>
</template>

<style lang="scss" scoped>
button:after {
  border: 0;
}
</style>
