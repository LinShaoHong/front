<script setup lang="ts">
const props = defineProps({
  src: String,
  vip: Number,
  heightFix:{
    type: Boolean,
    default: false
  },
  widthFix:{
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <view :class="['relative', heightFix? 'h-full':'', widthFix? 'w-full':'']">
    <image :class="[heightFix? 'h-full':'', widthFix? 'w-full':'']" style="border-radius: 50%" :src="src" :mode="heightFix? 'heightFix':(widthFix? 'widthFix':'')"></image>
    <image v-if="vip >=1" class="absolute bottom-0 right-0" style="height: 30%;" mode="heightFix" src="/static/vip.png"/>
  </view>
</template>

<style scoped lang="scss">
</style>
