<script>
export default {
  onLaunch: function () {
    uni.getSystemInfo({
      success: function (e) {
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
      }
    });
    plus.screen.lockOrientation('landscape-primary');
  },
  onShow: function () {
    plus.navigator.setFullscreen(true);
    plus.navigator.hideSystemNavigation()
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
@import "styles/tailwind.css";
</style>
