<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { networkError } from "@/utils/request";
import { autoUpdate } from "@/utils/unis";
import { isMpWeixin } from "@/utils/platform";

onLaunch(() => {
  const user = useStore('user');
  user.getUserInfo().catch(() => networkError());
  if (isMpWeixin) {
    autoUpdate();
  }
});
onShow(() => {
});
onHide(() => {
});
</script>

<style></style>
