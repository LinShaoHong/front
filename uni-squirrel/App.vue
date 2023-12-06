<script>
import Vue from 'vue'
export default {
  onLaunch: function () {
    // if (plus) {
    //   plus.screen.lockOrientation('landscape-primary');
    // }
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

        if (e.windowHeight > 500) {
          Vue.prototype.$pad = true
        } else {
          Vue.prototype.$pad = false
        }
      }
    });
  },
  onShow: function () {
    // if (plus) {
    //   plus.navigator.setFullscreen(true);
    //   plus.navigator.hideSystemNavigation()
    // }
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import "styles/common.scss";
@import "styles/tailwind.css";
@import "uview-ui/theme.scss";
@import "uview-ui/index.scss";
</style>