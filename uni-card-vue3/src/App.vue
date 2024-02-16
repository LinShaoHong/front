<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { networkError } from "@/utils/request";
import { autoUpdate } from "@/utils/unis";
import { isMp } from "@/utils/platform";

onLaunch(async () => {
  const user = useStore('user');
  const config = useStore('config');
  await user.getUserInfo().then(async () => {
    await user.getDefs().catch(() => networkError());
  }).catch(() => networkError());
  config.getConfigInfo().catch(() => networkError());
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
