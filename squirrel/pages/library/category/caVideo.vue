<template>
  <view>
    <full-video :url="url"></full-video>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(args) {
    this.url = args.url
  }
}
</script>

<style lang="scss" scoped>
</style>