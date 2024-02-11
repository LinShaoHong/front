<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { networkError } from "@/utils/request";
import { autoUpdate } from "@/utils/unis";
import { isMp } from "@/utils/platform";

onLaunch(() => {
  const user = useStore('user');
  const config = useStore('config');
  user.getUserInfo().then(() => {
    user.getDefs().catch(() => networkError());
  }).catch(() => networkError());
  config.getConfigInfo().catch(() => networkError());
  if (isMp) {
    autoUpdate();
  }
});
onShow(() => {
});
onHide(() => {
});
</script>

<style></style>
