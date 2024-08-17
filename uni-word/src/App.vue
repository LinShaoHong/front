<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';

onLaunch(async (option) => {
  console.log('onLaunch....');
  // await autoUpdate();
});
onShow(() => {
});
onHide(() => {
});
</script>

<style>
/* #ifdef H5 */
.navigation-bar {
  display: none;
}
/* #endif */
</style>