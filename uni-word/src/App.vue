<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { networkError } from "@/utils/request";
import { autoUpdate } from "@/utils/unis";
import { isMp } from "@/utils/platform";

onLaunch(async (option) => {
  const config = useStore('config');
  await config.getConfigInfo().then(() => {
  }).catch(() => networkError());
  if (isMp) {
    await autoUpdate();
  }
});
onShow(() => {
});
onHide(() => {
});
</script>

<style></style>
