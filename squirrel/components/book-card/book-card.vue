<template>
  <view class="wrapper">
    <view class="middle">
      <view class="front">
        <view class="poster" :style="style"></view>
        <view class="title"><span>{{ title }}</span></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "book-card",
  props: {
    url: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    }
  },
  computed: {
    style() {
      return {
        "background-image": "url('" + this.url + "')"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 9rem;
  z-index: 1;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 12px 10px -8px #F7820A;

  .middle {
    position: relative;
    top: 0;
    width: 100%;
    height: 98.5%;
    z-index: 2;
    border-radius: 20px;
    box-shadow: 0 1px 1px 0 #F5E3D2;

    .front {
      position: relative;
      top: 0;
      width: 100%;
      height: 98.5%;
      z-index: 2;
      border-radius: 20px;
      box-shadow: 0 1px 1px 0 #F5E3D2;

      .poster {
        position: relative;
        top: 2%;
        height: 76%;
        width: 92%;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        border-radius: 20px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-shadow: 0 2px 1px 0 #F5E3D2, 0 2px 0 0 #E2E2E2 inset;
      }

      .title {
        position: relative;
        width: 100%;
        height: 23%;
        display: grid;
        place-content: center;

        span {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 10px;
          color: #926124;
          padding-left: 11px;
          padding-right: 11px;
          padding-top: 3px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>