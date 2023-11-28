<template>
  <view class="flex flex-col justify-center items-center gap-1">
    <view class="av" hover-class="ani_scale" :style="'background: url(' + url + ') center;'">
    </view>
    <view v-if="name" style="font-size: small; font-weight: 700;">{{ name }}</view>
  </view>
</template>

<script>
export default {
  name: "avatar",
  props: {
    url: { default: '', type: String },
    name: { default: '', type: String }
  }
}
</script>

<style lang="scss" scoped>
.av {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 2px 2px #888888;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ani_scale {
  transform: scale(1.2);
}
</style>