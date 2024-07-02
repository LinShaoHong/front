<script lang="ts" setup>
import { setNBT } from "@/utils/unis";
import { onLoad } from "@dcloudio/uni-app";
import { isMp } from "@/utils/platform";

const imgUri = inject('$imgUri');
onLoad(async () => {
  await setNBT("用户中心");
})

const nickname = ref('');
const nickChanged = ref(false);
watch(nickname, (n, o) => {
  if (n != o) {
    nickChanged.value = true;
  }
});
</script>

<template>
  <view class="mt-24 ml-24 mr-24">
    <view class="mt-30 rd-24 pl-20 pr-20" style="background-color: white">
      <van-cell-group>
        <van-cell title="头像" is-link center title-style="color: #907BE0"
                  @click="() => {showAvaDialog=true;avaChanged=false;}">
          <slot>
            <Avatar class="mr-10"
                    width-fix
                    :src="`${imgUri}/avatar/1.png`"
                    :vip="true"
            />
          </slot>
        </van-cell>
        <van-cell title="昵称" is-link center title-style="color: #907BE0">
          'aa'
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

.avatar {
  max-height: calc(50vh - 80rpx);

  .ava-item {
    border-radius: 50%;
  }

  .ava-item.active {
    border: 1rpx solid #482380;
  }

}
</style>
