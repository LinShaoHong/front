<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";

const nav = useStore('nav');
onShow(() => {
  uni.hideTabBar();
  nav.setIndex(4);
});
</script>

<template>
  <NavigationBar/>
  <view class="page_container">
    mine
  </view>
</template>

<style scoped lang="scss">
</style>
