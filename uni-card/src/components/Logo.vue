<script setup lang="ts">
const config = useStore('config');
</script>

<template>
  <image class="fixed left-10 top-10 w-200 h-200 z-10" :src="config.partnerLogo" mode="aspectFill"></image>
</template>

<style scoped lang="scss">
</style>
