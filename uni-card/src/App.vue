<script setup lang="ts">
import {onHide, onLaunch, onShow} from '@dcloudio/uni-app';
import {networkError} from "@/utils/request";
import {autoUpdate} from "@/utils/unis";
import {isMp} from "@/utils/platform";

onLaunch(async (option) => {
  const user = useStore('user');
  const config = useStore('config');
  await config.getConfigInfo().then(() => {
    config.setPartner(option?.query?.partner);
    // config.setNoLover(option?.query?.noLover);
    user.getUserInfo(option).then(async () => {
      await user.getDefs().catch(() => networkError());
    }).catch(() => networkError());
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
