<script lang="ts" setup>
import { setNBT } from "@/utils/unis";
import { onLoad } from "@dcloudio/uni-app";
import { isMp } from "@/utils/platform";
import Avatar from "@/components/Avatar.vue";

const imgUri = inject('$imgUri');
onLoad(async () => {
  await setNBT("用户中心");
})
</script>

<template>
  <view class="mt-24 ml-24 mr-24">
    <view class="mt-30 rd-24 pl-20 pr-20" style="background-color: white">
      <van-cell-group>
        <van-cell title="头像" is-link center title-style="color: #907BE0">
          <slot>
            <Avatar class="mr-10 w-100"
                    width-fix
                    :src="`${imgUri}/avatar/1.png`"
                    :vip="true"
            />
          </slot>
        </van-cell>
        <van-cell title="昵称" is-link center title-style="color: #907BE0">
          微信用户
        </van-cell>
        <button v-if="isMp" class="p-0 text-left" open-type="share" style="background: transparent;">
          <van-cell title="推荐给朋友" is-link center title-style="color: #907BE0"/>
        </button>
        <button class="p-0 text-left" open-type="contact" style="background: transparent;">
          <van-cell title="联系客服" is-link center title-style="color: #907BE0"/>
        </button>
      </van-cell-group>
    </view>
  </view>

</template>

<style lang="scss" scoped>
button:after {
  border: 0;
}

.btn {
  font-size: 21rpx;
}

.btn[disabled] {
  color: #ffffff;
  background-color: #482380;
  overflow: scroll;
}
</style>
