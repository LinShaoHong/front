<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";

const nav = useStore('nav');
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(3);
});
</script>

<template>
  <NavigationBar/>
  <view class="container">
    tools
  </view>
</template>

<style scoped lang="scss">
</style>
