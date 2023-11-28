<template>
 <view :style="style"> </view>
</template>

<script>
export default {
 name: "background",
 props: {
  url: ''
 },
 computed: {
  style() {
   return {
    "z-index": '-10',
    "position": "fixed",
    "width": "100vw",
    "height": "100vh",
    "background-image": "url('" + this.url + "')",
    "background-size": "100% 100%"
   }
  }
 }
}
</script>
