<script lang="ts" setup>
import { isEmpty } from "@/utils/is";
import { ios, message, setNBT } from "@/utils/unis";
import { networkError } from "@/utils/request";
import { onLoad } from "@dcloudio/uni-app";
import { useShare } from "@/hooks/useShare";
import { useTabBar } from "@/hooks/useTabBar";
import apiUser from "@/api/apiUser";
import { isMp } from "@/utils/platform";

const { tabBar, tabLen } = useTabBar();
const { onShareAppMessage, onShareTimeline } = useShare();

const user = useStore('user')
const config = useStore('config')
const imgUri = inject('$imgUri');
const showRule = ref(false);

onLoad(async () => {
  await setNBT("用户中心");
})

const nickname = ref(user.data.value.nickname);
const showNicDialog = ref(false);
const nicLoading = ref(false);
const nickChanged = ref(false);
watch(nickname, (n, o) => {
  if (n != o) {
    nickChanged.value = true;
  }
});

const closeNicDialog = () => {
  showNicDialog.value = false;
  nickChanged.value = false;
  nickname.value = user.data.value.nickname;
};

const onUpdateNic = () => {
  if (isEmpty(nickname.value)) {
    return message('请输入昵称', 3);
  }
  nicLoading.value = true;
  user.updateNickname(nickname.value)
      .then(() => {
        showNicDialog.value = false;
        nicLoading.value = false;
      })
      .catch(() => {
        nicLoading.value = false;
        networkError();
      });
}

const avatar = ref(user.data.value.avatar);
const chooseAva = ref(user.data.value.avatar);
const showAvaDialog = ref(false);
const avaLoading = ref(false);
const avaChanged = ref(false);
const closeAvaDialog = () => {
  showAvaDialog.value = false;
  avaChanged.value = false;
  avatar.value = user.data.value.avatar;
  chooseAva.value = user.data.value.avatar;
};
watch(chooseAva, (n, o) => {
  avaChanged.value = n !== user.data.value.avatar;
});
const onUpdateAva = () => {
  avaLoading.value = true;
  user.updateAvatar(chooseAva.value)
      .then(() => {
        showAvaDialog.value = false;
        avaLoading.value = false;
        avatar.value = chooseAva.value;
      })
      .catch(() => {
        avaLoading.value = false;
        networkError();
      });
}

const showInvited = ref(false);
const invited = ref([] as any[]);
onShow(() => {
  if (ios()) {
    apiUser.invited(user.data.value.code).then((data) => {
      invited.value = data.values;
    }).catch(() => networkError());
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
            <image class="h-120 w-120 mr-10" style="border-radius: 50%" :src="`${imgUri}/avatar/${avatar}.png`"
                   mode="aspectFill"></image>
          </slot>
        </van-cell>
        <van-cell title="玩家号" center title-style="color: #907BE0">
          {{ user.data.value.code }}
        </van-cell>
        <van-cell title="昵称" is-link center title-style="color: #907BE0"
                  @click="() => {showNicDialog=true;nickChanged=false;}">
          {{ user.data.value.nickname }}
        </van-cell>
        <van-cell v-if="invited.length > 0" title="我邀请的" is-link center title-style="color: #907BE0"
                  @click="showInvited=true">
        </van-cell>
        <van-cell title="游戏规则" is-link center title-style="color: #907BE0" @click="showRule=true"/>
        <button v-if="isMp" class="p-0 text-left" open-type="share" style="background: transparent;">
          <van-cell title="推荐给朋友" is-link center title-style="color: #907BE0"/>
        </button>
        <button class="p-0 text-left" open-type="contact" style="background: transparent;">
          <van-cell title="联系客服" is-link center title-style="color: #907BE0"/>
        </button>
      </van-cell-group>
    </view>
  </view>

  <Popup :show="showNicDialog" position="bottom" @clickMask="closeNicDialog">
    <view class="p-20 relative" style="background-color: white">
      <view class="w-full text-center" style="font-size: 34rpx; color: #907BE0">更改昵称</view>
      <view class="w-full p-l-10 mt-30" style="border-bottom: 1px solid rgb(235, 237, 240);">
        <input class="text-left" style="color: #907BE0; font-size: 30rpx;" v-model="nickname"/>
      </view>
      <view class="w-full pl-10 mt-15" style="font-size: 24rpx; color:#999;">好名字可以让你的朋友更容易记住你。</view>
      <view class="w-full h-40vh"></view>
      <button
          class="btn absolute top-10 right-10 w-120 h-55 flex items-center justify-center"
          :disabled="nicLoading || !nickChanged"
          :loading="nicLoading"
          @tap.stop="onUpdateNic"
          :style="{'background-color': nickChanged? '#482380' : 'rgb(235, 237, 240)', color: nickChanged? 'white' : '#c8c7cc'}"
      >
        {{ nicLoading ? '' : '保存' }}
      </button>
    </view>
  </Popup>

  <Popup :show="showAvaDialog" position="bottom" @clickMask="closeAvaDialog">
    <view v-if="showAvaDialog" class="p-20 relative h-50vh flex items-center justify-center" style="background: white">
      <view class="absolute top-20 w-full text-center" style="font-size: 34rpx; color: #907BE0">更改头像</view>
      <button
          class="btn absolute top-10 right-20 w-120 h-55 flex items-center justify-center"
          :disabled="avaLoading || !avaChanged"
          :loading="avaLoading"
          @tap.stop="onUpdateAva"
          :style="{'background-color': avaChanged? '#482380' : 'rgb(235, 237, 240)', color: avaChanged? 'white' : '#c8c7cc'}"
      >
        {{ avaLoading ? '' : '保存' }}
      </button>
      <scroll-view scroll-y class="avatar absolute top-100 w-600">
        <view class="flex flex-wrap justify-between gap-10 pb-50">
          <view v-for="i in config.data.value.avaCount"
                :class="['ava-item h-110 w-110',i===chooseAva? 'active':'']" @click="chooseAva=i" :key="i">
            <image class="w-full h-full" style="border-radius: 50%" :src="`${imgUri}/avatar/${i}.png`"
                   mode="aspectFill"></image>
          </view>
        </view>
      </scroll-view>
    </view>
  </Popup>

  <Popup position="center" :show="showRule">
    <view class="pb-40">
      <image class="max-w-screen h-75vh" src="/static/rule.png" mode="heightFix"></image>
      <view class="flex items-center justify-center">
        <image class="px-10 py-10 w-320 h-100"
               src="/static/foot_bg.png"
               mode="scaleToFill"
               @click="showRule=false"></image>
        <text class="color-white absolute font-bold" style="font-size: 30rpx;" @click="showRule=false">确定</text>
      </view>
    </view>
  </Popup>

  <Popup :show="showInvited" position="bottom" @clickMask="showInvited=false">
    <view v-if="showInvited" class="p-20 relative h-50vh flex items-center justify-center" style="background: white">
      <view class="absolute top-20 w-full text-center" style="font-size: 34rpx; color: #907BE0">我邀请的</view>
      <scroll-view scroll-y class="avatar absolute top-100 w-700">
        <view class="flex flex-wrap gap-15 pb-50">
          <view v-for="invite in invited" class="h-120 w-200 rd-30" style="border: 1rpx solid #c8c7cc;">
            <view class="flex flex-col items-center justify-center h-full w-full pl-10 pr-10">
              <image style="border-radius: 50%; height: 100rpx;" :src="`${imgUri}/avatar/${invite.avatar}.png`"
                     mode="heightFix"></image>
              <text style="font-size: 22rpx; color: #482380;">{{ invite.nickname }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </Popup>

<!--  <view class="fixed bottom-0">-->
<!--    <m-tabbar fixed fill :current="tabLen - 1" :tabbar="tabBar"></m-tabbar>-->
<!--  </view>-->
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
