<script lang="ts" setup>
import { networkError } from "@/utils/request";
import { isEmpty } from "@/utils/is";
import { message } from "@/utils/unis";
import { back } from "@/utils/router";

const user = useStore('user')
const loading = ref(false);
const nickname = ref(user.data.value.nickname);

const onUpdateUser = () => {
  if (isEmpty(nickname.value)) {
    return message('请输入昵称', 3);
  }
  loading.value = true;
  user.updateNickname(nickname.value)
      .then(() => {
        loading.value = false;
        back(1);
      })
      .catch(() => {
        loading.value = false;
        networkError();
      });
}
</script>

<template>
  <view class="mt-24 ml-24 mr-24 p-20 rd-24" style="background-color: white">
    <view class="flex justify-between w-full align-center">
      <text class="flex items-center justify-center">头像</text>
      <image class="h-100 w-100" style="border-radius: 50%" src="/static/avatar.png" mode="aspectFill"></image>
    </view>
    <van-divider></van-divider>
    <view class="flex justify-between w-full align-center">
      <text class="flex items-center justify-center">昵称</text>
      <input class="text-right" v-model="nickname"/>
    </view>
  </view>
  <button
      class="btn ma m-0 w-80vw h-70 rd-50 mt-60 text-white flex items-center justify-center"
      :disabled="loading"
      :loading="loading"
      @tap.stop="onUpdateUser"
      style="background-color: #482380;"
  >
    {{ loading ? '保存中...' : '保存' }}
  </button>
</template>

<style lang="scss" scoped>
.btn[disabled] {
  color: #ffffff;
  background-color: #482380;
}
</style>
